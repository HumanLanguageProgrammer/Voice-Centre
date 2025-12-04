import { ConnectionStatus } from './components/ConnectionStatus'
import { MicrophoneControl } from './components/MicrophoneControl'
import './App.css'

/**
 * Voice Testing Centre - Phase 2: STT Proof
 *
 * Goal: Prove speech-to-text transcription works
 *
 * Success Criteria:
 * - Microphone captures audio
 * - Speech is transcribed accurately
 * - Transcriptions display in UI
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

      <ConnectionStatus />
      <MicrophoneControl />

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
