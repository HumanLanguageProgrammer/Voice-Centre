import { useState } from 'react'
import { ConnectionStatus } from './components/ConnectionStatus'
import { MicrophoneControl } from './components/MicrophoneControl'
import { ColorBox } from './components/ColorBox'
import { ClaudeOrchestrator } from './components/ClaudeOrchestrator'
import './App.css'

/**
 * Voice Testing Centre - Phase 4: Claude Integration
 *
 * Goal: Prove the full voice loop with Claude as the LLM
 *
 * Flow:
 * 1. User speaks → Hume STT transcribes
 * 2. Transcription → Anthropic Claude
 * 3. Claude decides to call tools or respond
 * 4. Tool execution (change_box_color)
 * 5. Claude's response → Hume TTS
 * 6. Voice output to user
 */
function App() {
  const [claudeEnabled, setClaudeEnabled] = useState(true);
  const [lastClaudeResponse, setLastClaudeResponse] = useState<string | null>(null);

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

      {/* Claude Orchestrator (invisible processing) */}
      <ClaudeOrchestrator
        enabled={claudeEnabled}
        onToolExecuted={(name, args, result) => {
          console.log('[App] Claude tool executed:', name, args, '→', result);
        }}
        onClaudeResponse={(text) => {
          setLastClaudeResponse(text);
        }}
        onError={(error) => {
          console.error('[App] Claude error:', error);
        }}
      />

      {/* Phase 1: Connection */}
      <ConnectionStatus />

      {/* Phase 2: STT */}
      <MicrophoneControl />

      {/* Phase 3 & 4: Tool Execution with Claude */}
      <ColorBox />

      {/* Claude Toggle & Status */}
      <div style={{
        padding: '1rem',
        border: '1px solid #333',
        borderRadius: '8px',
        backgroundColor: '#1a1a1a',
        maxWidth: '500px',
        marginTop: '1rem',
        width: '100%'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.125rem' }}>
            Phase 4: Claude LLM
          </h2>
          <button
            onClick={() => setClaudeEnabled(!claudeEnabled)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: claudeEnabled ? '#22c55e' : '#6b7280',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            {claudeEnabled ? 'Claude ON' : 'Claude OFF'}
          </button>
        </div>

        <p style={{
          color: '#888',
          fontSize: '0.75rem',
          margin: '0 0 0.75rem 0'
        }}>
          {claudeEnabled
            ? 'Claude is processing your voice input and responding via Hume TTS.'
            : 'Hume EVI is handling responses directly (no Claude).'}
        </p>

        {lastClaudeResponse && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#0d0d0d',
            borderRadius: '4px',
            fontSize: '0.875rem'
          }}>
            <div style={{ color: '#666', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
              Last Claude Response:
            </div>
            <div style={{ color: '#a5b4fc' }}>
              {lastClaudeResponse}
            </div>
          </div>
        )}
      </div>

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
