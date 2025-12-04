/**
 * Anthropic Claude API Service
 *
 * Handles communication with Claude for the voice loop.
 * Takes transcribed text, gets Claude's response with tool support.
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

// Tool definition for Claude
export const tools = [
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

export interface ToolUse {
  type: 'tool_use';
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface TextContent {
  type: 'text';
  text: string;
}

export interface ClaudeResponse {
  id: string;
  content: (TextContent | ToolUse)[];
  stop_reason: string;
  model: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

interface Message {
  role: 'user' | 'assistant';
  content: string | (TextContent | ToolUse | { type: 'tool_result'; tool_use_id: string; content: string })[];
}

export class AnthropicService {
  private apiKey: string;
  private conversationHistory: Message[] = [];

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendMessage(userMessage: string): Promise<ClaudeResponse> {
    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage
    });

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: `You are a helpful voice assistant integrated with a visual interface.
You can change the color of a box on screen using the change_box_color tool.
Keep responses concise and conversational since they will be spoken aloud.
When the user asks to change the box color, use the tool and confirm the action briefly.`,
        tools,
        messages: this.conversationHistory
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Anthropic] API error:', error);
      throw new Error(`Anthropic API error: ${response.status} - ${error}`);
    }

    const data: ClaudeResponse = await response.json();
    console.log('[Anthropic] Response:', data);

    // Add assistant response to history
    this.conversationHistory.push({
      role: 'assistant',
      content: data.content
    });

    return data;
  }

  async sendToolResult(toolUseId: string, result: string): Promise<ClaudeResponse> {
    // Add tool result to history
    this.conversationHistory.push({
      role: 'user',
      content: [{
        type: 'tool_result',
        tool_use_id: toolUseId,
        content: result
      }]
    });

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: `You are a helpful voice assistant integrated with a visual interface.
You can change the color of a box on screen using the change_box_color tool.
Keep responses concise and conversational since they will be spoken aloud.
When the user asks to change the box color, use the tool and confirm the action briefly.`,
        tools,
        messages: this.conversationHistory
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error: ${response.status} - ${error}`);
    }

    const data: ClaudeResponse = await response.json();
    console.log('[Anthropic] Tool result response:', data);

    // Add assistant response to history
    this.conversationHistory.push({
      role: 'assistant',
      content: data.content
    });

    return data;
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }

  getHistory(): Message[] {
    return [...this.conversationHistory];
  }
}

// Extract text from Claude response
export function extractText(response: ClaudeResponse): string {
  return response.content
    .filter((block): block is TextContent => block.type === 'text')
    .map(block => block.text)
    .join(' ');
}

// Extract tool uses from Claude response
export function extractToolUses(response: ClaudeResponse): ToolUse[] {
  return response.content.filter((block): block is ToolUse => block.type === 'tool_use');
}
