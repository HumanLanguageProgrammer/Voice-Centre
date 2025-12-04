import { useEffect, useRef } from 'react';
import { useVoice } from '@humeai/voice-react';

interface ToolHandlerProps {
  onToolExecuted?: (toolName: string, args: unknown, result: unknown) => void;
}

/**
 * ToolHandler - Listens for tool calls and executes them
 *
 * This component bridges Hume's tool calls to our React app.
 * When Hume's LLM decides to call a tool, we:
 * 1. Receive the tool_call message
 * 2. Execute the appropriate handler
 * 3. Send the result back via sendToolMessage
 */
export function ToolHandler({ onToolExecuted }: ToolHandlerProps) {
  const { messages, sendToolMessage } = useVoice();
  const processedToolCalls = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Find unprocessed tool_call messages
    const toolCallMessages = messages.filter(
      (msg) => msg.type === 'tool_call'
    );

    for (const msg of toolCallMessages) {
      // Skip if already processed (using tool_call_id or message index)
      const toolCallId = (msg as any).tool_call_id || JSON.stringify(msg);
      if (processedToolCalls.current.has(toolCallId)) {
        continue;
      }

      // Mark as processed
      processedToolCalls.current.add(toolCallId);

      // Extract tool info
      const toolCall = msg as any;
      const toolName = toolCall.name || toolCall.tool_name;
      const toolArgs = toolCall.parameters || toolCall.arguments || {};

      console.log('[ToolHandler] Received tool call:', toolName, toolArgs);

      // Execute the tool
      let result: unknown;
      let success = true;

      try {
        if (toolName === 'change_box_color') {
          const color = toolArgs.color || toolArgs;
          // Call the global handler set by ColorBox
          const handler = (window as any).__colorBoxHandler;
          if (handler) {
            result = handler(color);
            console.log('[ToolHandler] Color changed to:', result);
          } else {
            result = `Changed box color to ${color}`;
            console.warn('[ToolHandler] ColorBox handler not found');
          }
        } else {
          result = `Unknown tool: ${toolName}`;
          success = false;
        }
      } catch (error) {
        result = `Error executing tool: ${error}`;
        success = false;
      }

      // Send result back to Hume
      try {
        if (success) {
          sendToolMessage({
            type: 'tool_response',
            tool_call_id: toolCallId,
            content: String(result),
          } as any);
        } else {
          sendToolMessage({
            type: 'tool_error',
            tool_call_id: toolCallId,
            error: String(result),
            content: String(result),
          } as any);
        }
        console.log('[ToolHandler] Sent tool response:', result);
      } catch (err) {
        console.error('[ToolHandler] Failed to send tool response:', err);
      }

      // Notify parent
      onToolExecuted?.(toolName, toolArgs, result);
    }
  }, [messages, sendToolMessage, onToolExecuted]);

  // This component doesn't render anything
  return null;
}
