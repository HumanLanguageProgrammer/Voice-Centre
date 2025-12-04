import { ConnectionStatus } from './components/ConnectionStatus'
import { MicrophoneControl } from './components/MicrophoneControl'
import { ColorBox } from './components/ColorBox'
import { ToolHandler } from './components/ToolHandler'
import './App.css'

/**
 * Voice Testing Centre - Phase 3: Tool Execution
 *
 * Goal: Prove voice → tool execution → response works
 *
 * Flow:
 * 1. User says "make the box blue"
 * 2. Hume STT transcribes
 * 3. Hume LLM decides to call change_box_color tool
 * 4. ToolHandler executes and updates ColorBox
 * 5. Response sent back to Hume
 * 6. Hume TTS speaks confirmation
 */
function App() {
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
        Hume AI + Anthropic Integration Proof
      </p>

      {/* Tool execution handler (invisible) */}
      <ToolHandler
        onToolExecuted={(name, args, result) => {
          console.log('[App] Tool executed:', name, args, '→', result);
        }}
      />

      {/* Phase 1: Connection */}
      <ConnectionStatus />

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
