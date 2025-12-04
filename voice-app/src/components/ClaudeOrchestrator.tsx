import { useEffect, useRef, useState, useCallback } from 'react';
import { useVoice } from '@humeai/voice-react';
import {
  AnthropicService,
  extractText,
  extractToolUses,
} from '../services/anthropic';
import type { ClaudeResponse, ToolUse } from '../services/anthropic';

interface ClaudeOrchestratorProps {
  enabled: boolean;
  onToolExecuted?: (toolName: string, args: unknown, result: unknown) => void;
  onClaudeResponse?: (text: string) => void;
  onError?: (error: Error) => void;
}

/**
 * ClaudeOrchestrator - Bridges Hume voice with Claude reasoning
 *
 * Flow:
 * 1. User speaks → Hume STT transcribes
 * 2. We detect new transcription
 * 3. Send to Anthropic Claude
 * 4. Execute any tool calls
 * 5. Send Claude's response to Hume TTS
 */
export function ClaudeOrchestrator({
  enabled,
  onToolExecuted,
  onClaudeResponse,
  onError
}: ClaudeOrchestratorProps) {
  const {
    lastUserMessage,
    sendAssistantInput,
    pauseAssistant,
    resumeAssistant,
    status
  } = useVoice();

  const [isProcessing, setIsProcessing] = useState(false);
  const [lastProcessedMessage, setLastProcessedMessage] = useState<string | null>(null);
  const [claudeStatus, setClaudeStatus] = useState<'idle' | 'thinking' | 'speaking'>('idle');

  const anthropicRef = useRef<AnthropicService | null>(null);
  const isConnected = status.value === 'connected';

  // Initialize Anthropic service
  useEffect(() => {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (apiKey) {
      anthropicRef.current = new AnthropicService(apiKey);
      console.log('[ClaudeOrchestrator] Anthropic service initialized');
    } else {
      console.warn('[ClaudeOrchestrator] VITE_ANTHROPIC_API_KEY not found');
    }
  }, []);

  // Execute tool and return result
  const executeTool = useCallback((toolUse: ToolUse): string => {
    console.log('[ClaudeOrchestrator] Executing tool:', toolUse.name, toolUse.input);

    if (toolUse.name === 'change_box_color') {
      const color = (toolUse.input as { color: string }).color;

      // Call the global handler set by ColorBox
      const handler = (window as any).__colorBoxHandler;
      if (handler) {
        const result = handler(color);
        onToolExecuted?.(toolUse.name, toolUse.input, result);
        return `Box color changed to ${color}`;
      } else {
        return `Color change requested: ${color} (handler not found)`;
      }
    }

    return `Unknown tool: ${toolUse.name}`;
  }, [onToolExecuted]);

  // Process Claude response (may include tool calls)
  const processClaudeResponse = useCallback(async (
    response: ClaudeResponse
  ): Promise<string> => {
    const toolUses = extractToolUses(response);
    let finalText = extractText(response);

    // If there are tool calls, execute them and continue
    if (toolUses.length > 0 && response.stop_reason === 'tool_use') {
      for (const toolUse of toolUses) {
        const result = executeTool(toolUse);

        // Send tool result back to Claude
        if (anthropicRef.current) {
          const followUp = await anthropicRef.current.sendToolResult(
            toolUse.id,
            result
          );
          // Recursively process (Claude might call more tools)
          finalText = await processClaudeResponse(followUp);
        }
      }
    }

    return finalText;
  }, [executeTool]);

  // Main orchestration: detect new user message and process through Claude
  useEffect(() => {
    if (!enabled || !isConnected || !anthropicRef.current) return;
    if (!lastUserMessage?.message?.content) return;

    const userText = lastUserMessage.message.content;

    // Skip if we already processed this message
    if (userText === lastProcessedMessage) return;
    if (isProcessing) return;

    // Process the new message
    const processMessage = async () => {
      setIsProcessing(true);
      setLastProcessedMessage(userText);
      setClaudeStatus('thinking');

      console.log('[ClaudeOrchestrator] Processing:', userText);

      try {
        // Pause Hume's built-in assistant while we use Claude
        pauseAssistant();

        // Send to Claude
        const response = await anthropicRef.current!.sendMessage(userText);

        // Process response (including any tool calls)
        const responseText = await processClaudeResponse(response);

        if (responseText) {
          setClaudeStatus('speaking');
          onClaudeResponse?.(responseText);

          // Send Claude's response to Hume for TTS
          console.log('[ClaudeOrchestrator] Sending to TTS:', responseText);
          sendAssistantInput(responseText);
        }

        // Resume Hume's assistant for next interaction
        resumeAssistant();

      } catch (error) {
        console.error('[ClaudeOrchestrator] Error:', error);
        onError?.(error as Error);
        resumeAssistant();
      } finally {
        setIsProcessing(false);
        setClaudeStatus('idle');
      }
    };

    processMessage();
  }, [
    enabled,
    isConnected,
    lastUserMessage,
    lastProcessedMessage,
    isProcessing,
    pauseAssistant,
    resumeAssistant,
    sendAssistantInput,
    processClaudeResponse,
    onClaudeResponse,
    onError
  ]);

  // Render status indicator
  if (!enabled) return null;

  const apiKeyPresent = !!import.meta.env.VITE_ANTHROPIC_API_KEY;

  return (
    <div style={{
      padding: '1rem',
      border: '1px solid #333',
      borderRadius: '8px',
      backgroundColor: '#1a1a1a',
      maxWidth: '500px',
      marginTop: '1rem'
    }}>
      <h2 style={{ margin: '0 0 0.75rem 0', fontSize: '1.125rem' }}>
        Claude Integration
      </h2>

      {!apiKeyPresent && (
        <div style={{
          padding: '0.75rem',
          backgroundColor: '#451a1a',
          border: '1px solid #ef4444',
          borderRadius: '4px',
          fontSize: '0.875rem',
          marginBottom: '0.75rem'
        }}>
          Missing VITE_ANTHROPIC_API_KEY in environment
        </div>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.875rem'
      }}>
        <div style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: claudeStatus === 'idle' ? '#6b7280' :
                          claudeStatus === 'thinking' ? '#eab308' : '#22c55e',
          animation: claudeStatus !== 'idle' ? 'pulse 1s infinite' : 'none'
        }} />
        <span style={{ color: '#888' }}>
          {claudeStatus === 'idle' && 'Ready'}
          {claudeStatus === 'thinking' && 'Claude is thinking...'}
          {claudeStatus === 'speaking' && 'Claude is responding...'}
        </span>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
