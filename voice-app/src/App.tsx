import { useState } from 'react'
import { useVoice } from '@humeai/voice-react'
import { ConnectionStatus } from './components/ConnectionStatus'
import { MicrophoneControl } from './components/MicrophoneControl'
import { ColorBox } from './components/ColorBox'
import './App.css'

// EVI Configuration IDs
const HUME_LLM_CONFIG_ID = '355ec6bc-b12e-401d-9f04-0e01a3946cf0'; // Hume's built-in LLM
const CLAUDE_LLM_CONFIG_ID = '048c41d4-2c73-4161-82ab-9530aa3d5941'; // Custom LLM → Claude

/**
 * Voice Testing Centre - Phase 5: Clean Claude Integration
 *
 * Architecture:
 * - Claude OFF: Hume EVI with built-in LLM
 * - Claude ON: Hume EVI with Custom LLM → /api/chat/completions → Claude
 *
 * The Custom LLM config completely replaces Hume's LLM with Claude.
 * No dual-LLM conflict - clean separation of concerns.
 */
function App() {
  const [claudeEnabled, setClaudeEnabled] = useState(true);
  const { status, disconnect } = useVoice();

  const isConnected = status.value === 'connected';

  // Get the appropriate config based on Claude toggle
  const currentConfigId = claudeEnabled ? CLAUDE_LLM_CONFIG_ID : HUME_LLM_CONFIG_ID;
  const currentConfigLabel = claudeEnabled ? 'Claude (Custom LLM)' : 'Hume (Built-in)';

  // Handle mode toggle - disconnect if connected so user reconnects with new config
  const handleModeToggle = () => {
    if (isConnected) {
      disconnect();
    }
    setClaudeEnabled(!claudeEnabled);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem',
      backgroundColor: '#242424'
    }}>
      <h1 style={{
        fontSize: '1.5rem',
        marginBottom: '0.5rem',
        color: '#fff'
      }}>
        Voice Testing Centre
      </h1>
      <p style={{
        color: '#888',
        marginBottom: '2rem',
        fontSize: '0.875rem'
      }}>
        Hume AI + Anthropic Claude Integration Proof
      </p>

      {/* LLM Mode Toggle */}
      <div style={{
        padding: '1rem',
        border: '1px solid #333',
        borderRadius: '8px',
        backgroundColor: '#1a1a1a',
        maxWidth: '400px',
        marginBottom: '1rem',
        width: '100%'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1rem' }}>LLM Mode</h2>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#888' }}>
              {claudeEnabled
                ? 'Using Claude via Custom LLM endpoint'
                : 'Using Hume\'s built-in LLM'}
            </p>
          </div>
          <button
            onClick={handleModeToggle}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: claudeEnabled ? '#a855f7' : '#6b7280',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500
            }}
          >
            {claudeEnabled ? 'Claude' : 'Hume'}
          </button>
        </div>
        {isConnected && (
          <p style={{
            margin: '0.75rem 0 0 0',
            fontSize: '0.75rem',
            color: '#eab308'
          }}>
            Switching modes will disconnect. Reconnect to apply.
          </p>
        )}
      </div>

      {/* Phase 1: Connection - now with configId */}
      <ConnectionStatus
        configId={currentConfigId}
        configLabel={currentConfigLabel}
      />

      {/* Phase 2: STT */}
      <MicrophoneControl />

      {/* Phase 3: Tool Execution */}
      <ColorBox />

      <footer style={{
        marginTop: '3rem',
        color: '#666',
        fontSize: '0.75rem',
        textAlign: 'center'
      }}>
        <p>Hume AI WebSocket + Anthropic Claude Integration Test</p>
        <p style={{ marginTop: '0.5rem' }}>
          Part of Operation Runway - Voice Proof Tributary
        </p>
      </footer>
    </div>
  )
}

export default App
