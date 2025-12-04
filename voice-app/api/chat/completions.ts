import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';

/**
 * OpenAI-compatible Chat Completions API for Hume EVI Custom LLM
 *
 * This endpoint bridges Hume EVI to Anthropic Claude:
 * 1. Receives requests in OpenAI format (from Hume)
 * 2. Converts to Anthropic format
 * 3. Calls Claude
 * 4. Converts response back to OpenAI format
 * 5. Returns as SSE stream
 *
 * Hume EVI expects: https://your-domain/api/chat/completions
 */

// Tool definition for color box
const tools: Anthropic.Tool[] = [
  {
    name: 'change_box_color',
    description: 'Changes the color of the box displayed on screen. Use this when the user asks to change, set, or make the box a different color.',
    input_schema: {
      type: 'object' as const,
      properties: {
        color: {
          type: 'string',
          description: 'The color to change the box to (e.g., red, blue, green, yellow, purple, orange, pink)'
        }
      },
      required: ['color']
    }
  }
];

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

// Convert OpenAI messages to Anthropic format
function convertMessages(messages: OpenAIMessage[]): {
  system: string;
  messages: Anthropic.MessageParam[];
} {
  let system = '';
  const anthropicMessages: Anthropic.MessageParam[] = [];

  for (const msg of messages) {
    if (msg.role === 'system') {
      system += msg.content + '\n';
    } else if (msg.role === 'user' || msg.role === 'assistant') {
      anthropicMessages.push({
        role: msg.role,
        content: msg.content
      });
    }
  }

  // Add our voice assistant context to system prompt
  const voiceSystemPrompt = `You are a helpful voice assistant integrated with a visual interface.
You can change the color of a box on screen using the change_box_color tool.
Keep responses concise and conversational since they will be spoken aloud.
When the user asks to change the box color, use the tool and confirm briefly.

${system}`.trim();

  return { system: voiceSystemPrompt, messages: anthropicMessages };
}

// Format SSE data
function formatSSE(data: object): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('[Claude LLM] ANTHROPIC_API_KEY not configured');
    return res.status(500).json({ error: 'Anthropic API key not configured' });
  }

  try {
    const body = req.body as OpenAIRequest;
    console.log('[Claude LLM] Received request:', JSON.stringify(body, null, 2));

    const { system, messages } = convertMessages(body.messages || []);

    // Ensure we have at least one message
    if (messages.length === 0) {
      messages.push({ role: 'user', content: 'Hello' });
    }

    const anthropic = new Anthropic({ apiKey });

    // Check if streaming is requested
    if (body.stream) {
      // SSE streaming response
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const stream = await anthropic.messages.stream({
        model: 'claude-sonnet-4-20250514',
        max_tokens: body.max_tokens || 1024,
        system,
        messages,
        tools
      });

      const responseId = `chatcmpl-${Date.now()}`;
      let toolUseId: string | null = null;
      let toolName: string | null = null;
      let toolInput = '';

      for await (const event of stream) {
        if (event.type === 'content_block_start') {
          if (event.content_block.type === 'tool_use') {
            toolUseId = event.content_block.id;
            toolName = event.content_block.name;
            toolInput = '';
          }
        } else if (event.type === 'content_block_delta') {
          if (event.delta.type === 'text_delta') {
            // Stream text content
            const chunk = {
              id: responseId,
              object: 'chat.completion.chunk',
              created: Math.floor(Date.now() / 1000),
              model: 'claude-sonnet-4-20250514',
              choices: [{
                index: 0,
                delta: { content: event.delta.text },
                finish_reason: null
              }]
            };
            res.write(formatSSE(chunk));
          } else if (event.delta.type === 'input_json_delta') {
            toolInput += event.delta.partial_json;
          }
        } else if (event.type === 'content_block_stop') {
          // If we have a tool call, include it
          if (toolUseId && toolName) {
            try {
              const parsedInput = JSON.parse(toolInput || '{}');
              const toolChunk = {
                id: responseId,
                object: 'chat.completion.chunk',
                created: Math.floor(Date.now() / 1000),
                model: 'claude-sonnet-4-20250514',
                choices: [{
                  index: 0,
                  delta: {
                    tool_calls: [{
                      index: 0,
                      id: toolUseId,
                      type: 'function',
                      function: {
                        name: toolName,
                        arguments: JSON.stringify(parsedInput)
                      }
                    }]
                  },
                  finish_reason: null
                }]
              };
              res.write(formatSSE(toolChunk));
            } catch (e) {
              console.error('[Claude LLM] Failed to parse tool input:', e);
            }
            toolUseId = null;
            toolName = null;
            toolInput = '';
          }
        } else if (event.type === 'message_stop') {
          // Final chunk
          const finalChunk = {
            id: responseId,
            object: 'chat.completion.chunk',
            created: Math.floor(Date.now() / 1000),
            model: 'claude-sonnet-4-20250514',
            choices: [{
              index: 0,
              delta: {},
              finish_reason: 'stop'
            }]
          };
          res.write(formatSSE(finalChunk));
          res.write('data: [DONE]\n\n');
        }
      }

      res.end();
    } else {
      // Non-streaming response
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: body.max_tokens || 1024,
        system,
        messages,
        tools
      });

      console.log('[Claude LLM] Claude response:', JSON.stringify(response, null, 2));

      // Convert to OpenAI format
      const textContent = response.content
        .filter((block): block is Anthropic.TextBlock => block.type === 'text')
        .map(block => block.text)
        .join('');

      const toolCalls = response.content
        .filter((block): block is Anthropic.ToolUseBlock => block.type === 'tool_use')
        .map((block, index) => ({
          index,
          id: block.id,
          type: 'function' as const,
          function: {
            name: block.name,
            arguments: JSON.stringify(block.input)
          }
        }));

      const openAIResponse = {
        id: `chatcmpl-${Date.now()}`,
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: 'claude-sonnet-4-20250514',
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: textContent,
            ...(toolCalls.length > 0 && { tool_calls: toolCalls })
          },
          finish_reason: response.stop_reason === 'tool_use' ? 'tool_calls' : 'stop'
        }],
        usage: {
          prompt_tokens: response.usage.input_tokens,
          completion_tokens: response.usage.output_tokens,
          total_tokens: response.usage.input_tokens + response.usage.output_tokens
        }
      };

      console.log('[Claude LLM] Sending OpenAI response:', JSON.stringify(openAIResponse, null, 2));
      res.status(200).json(openAIResponse);
    }
  } catch (error) {
    console.error('[Claude LLM] Error:', error);
    res.status(500).json({
      error: {
        message: error instanceof Error ? error.message : 'Internal server error',
        type: 'api_error'
      }
    });
  }
}
