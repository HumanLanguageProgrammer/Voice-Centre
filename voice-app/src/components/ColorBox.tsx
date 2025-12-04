import { useState, useEffect, useCallback } from 'react';
import { useVoice } from '@humeai/voice-react';

/**
 * ColorBox - A box that changes color via voice commands
 *
 * Phase 3 Goal: Prove tool execution works
 * User says "make the box blue" → tool executes → box turns blue
 */

// Tool definition for Hume EVI
export const colorBoxTool = {
  name: 'change_box_color',
  description: 'Changes the color of the box displayed on screen. Use this when the user asks to change, set, or make the box a different color.',
  parameters: {
    type: 'object',
    properties: {
      color: {
        type: 'string',
        description: 'The color to change the box to (e.g., red, blue, green, yellow, purple, orange, pink, etc.)'
      }
    },
    required: ['color']
  }
};

interface ColorBoxProps {
  onColorChange?: (color: string) => void;
}

export function ColorBox({ onColorChange }: ColorBoxProps) {
  const [boxColor, setBoxColor] = useState('#6b7280'); // gray default
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [toolCallCount, setToolCallCount] = useState(0);

  const { status } = useVoice();
  const isConnected = status.value === 'connected';

  // Handle color change from tool call
  const handleColorChange = useCallback((color: string) => {
    // Normalize color input
    const normalizedColor = color.toLowerCase().trim();

    // Map common color names to CSS colors
    const colorMap: Record<string, string> = {
      red: '#ef4444',
      blue: '#3b82f6',
      green: '#22c55e',
      yellow: '#eab308',
      purple: '#a855f7',
      orange: '#f97316',
      pink: '#ec4899',
      cyan: '#06b6d4',
      white: '#ffffff',
      black: '#000000',
      gray: '#6b7280',
      grey: '#6b7280',
    };

    const cssColor = colorMap[normalizedColor] || normalizedColor;

    setBoxColor(cssColor);
    setLastCommand(color);
    setToolCallCount(prev => prev + 1);
    onColorChange?.(color);

    console.log(`[ColorBox] Changed to: ${color} (${cssColor})`);

    return cssColor;
  }, [onColorChange]);

  // Expose the handler globally so the tool call handler can access it
  useEffect(() => {
    (window as any).__colorBoxHandler = handleColorChange;
    return () => {
      delete (window as any).__colorBoxHandler;
    };
  }, [handleColorChange]);

  return (
    <div style={{
      padding: '1.5rem',
      border: '1px solid #333',
      borderRadius: '8px',
      backgroundColor: '#1a1a1a',
      maxWidth: '500px',
      marginTop: '1rem'
    }}>
      <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem' }}>
        Phase 3: Tool Execution
      </h2>

      {!isConnected && (
        <p style={{ color: '#888', fontSize: '0.875rem' }}>
          Connect to Hume first to test tool execution.
        </p>
      )}

      {/* The Color Box */}
      <div style={{
        width: '100%',
        height: '120px',
        backgroundColor: boxColor,
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem',
        transition: 'background-color 0.3s ease',
        border: '2px solid #333'
      }}>
        <span style={{
          color: boxColor === '#ffffff' || boxColor === '#eab308' ? '#000' : '#fff',
          fontWeight: 'bold',
          fontSize: '1.25rem',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
        }}>
          {boxColor.toUpperCase()}
        </span>
      </div>

      {/* Instructions */}
      <div style={{
        padding: '0.75rem',
        backgroundColor: '#0d0d0d',
        borderRadius: '4px',
        marginBottom: '1rem',
        fontSize: '0.875rem',
        color: '#888'
      }}>
        <strong style={{ color: '#fff' }}>Try saying:</strong>
        <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0 }}>
          <li>"Make the box blue"</li>
          <li>"Change the box to red"</li>
          <li>"Set the box color to purple"</li>
        </ul>
      </div>

      {/* Status */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: '#666'
      }}>
        <span>Tool calls: {toolCallCount}</span>
        {lastCommand && (
          <span>Last: "{lastCommand}"</span>
        )}
      </div>
    </div>
  );
}
