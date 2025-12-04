import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { VoiceProvider } from '@humeai/voice-react'
import './index.css'
import App from './App.tsx'

/**
 * Voice Testing Centre - Phase 1: Connection Proof
 *
 * The VoiceProvider wraps the app and manages:
 * - WebSocket connection to Hume EVI
 * - Microphone access
 * - Audio playback queue
 * - Message history
 *
 * Note: Auth is passed to connect(), not the provider
 */

const apiKey = import.meta.env.VITE_HUME_API_KEY

if (!apiKey) {
  console.warn(
    '[Voice Centre] VITE_HUME_API_KEY not found.\n' +
    'Copy .env.example to .env.local and add your Hume API key.'
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VoiceProvider
      onMessage={(message) => {
        // Log all WebSocket messages for debugging
        console.log('[Hume Message]', message.type, message)
      }}
      onClose={(event) => {
        console.log('[Hume] WebSocket closed', event)
      }}
    >
      <App />
    </VoiceProvider>
  </StrictMode>,
)
