import { useVoice } from '@humeai/voice-react';

/**
 * MicrophoneControl - Controls for microphone input and transcription display
 *
 * Phase 2 Goal: Prove STT works - speak and see transcription
 *
 * Note: The Hume React SDK handles MediaRecorder internally.
 * We control it via mute/unmute and observe transcriptions in messages.
 */
export function MicrophoneControl() {
  const {
    isMuted,
    mute,
    unmute,
    messages,
    lastUserMessage,
    lastVoiceMessage,
    status,
    micFft,
  } = useVoice();

  const isConnected = status.value === 'connected';

  // Get user messages (transcriptions) from the conversation
  const userMessages = messages.filter(
    (msg) => msg.type === 'user_message'
  );

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
        Phase 2: Speech-to-Text
      </h2>

      {!isConnected && (
        <p style={{ color: '#888', fontSize: '0.875rem' }}>
          Connect to Hume first to enable microphone.
        </p>
      )}

      {isConnected && (
        <>
          {/* Microphone Control */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <button
              onClick={() => isMuted ? unmute() : mute()}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: isMuted ? '#22c55e' : '#ef4444',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 500,
                minWidth: '140px'
              }}
            >
              {isMuted ? '🎤 Unmute Mic' : '🔇 Mute Mic'}
            </button>

            {/* Audio Level Indicator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              height: '24px'
            }}>
              {!isMuted && micFft && micFft.slice(0, 8).map((level, i) => (
                <div
                  key={i}
                  style={{
                    width: '4px',
                    height: `${Math.max(4, level * 24)}px`,
                    backgroundColor: '#22c55e',
                    borderRadius: '2px',
                    transition: 'height 0.05s'
                  }}
                />
              ))}
              {isMuted && (
                <span style={{ color: '#666', fontSize: '0.75rem' }}>
                  Mic muted
                </span>
              )}
            </div>
          </div>

          {/* Last User Transcription */}
          <div style={{
            padding: '1rem',
            backgroundColor: '#0d0d0d',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: '#888',
              marginBottom: '0.5rem'
            }}>
              Your last words (STT):
            </div>
            <div style={{
              fontSize: '1rem',
              color: lastUserMessage ? '#fff' : '#666',
              minHeight: '1.5rem'
            }}>
              {lastUserMessage?.message?.content || 'Speak to see transcription...'}
            </div>
          </div>

          {/* Last Assistant Response */}
          <div style={{
            padding: '1rem',
            backgroundColor: '#1a1a2e',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: '#888',
              marginBottom: '0.5rem'
            }}>
              Assistant response:
            </div>
            <div style={{
              fontSize: '1rem',
              color: lastVoiceMessage ? '#a5b4fc' : '#666',
              minHeight: '1.5rem'
            }}>
              {lastVoiceMessage?.message?.content || 'Waiting for response...'}
            </div>
          </div>

          {/* Conversation History */}
          <details style={{ marginTop: '1rem' }}>
            <summary style={{ cursor: 'pointer', color: '#888' }}>
              Conversation History ({messages.length} messages)
            </summary>
            <div style={{
              maxHeight: '200px',
              overflow: 'auto',
              marginTop: '0.5rem',
              padding: '0.5rem',
              backgroundColor: '#0d0d0d',
              borderRadius: '4px',
              fontSize: '0.75rem'
            }}>
              {messages.length === 0 && (
                <p style={{ color: '#666' }}>No messages yet</p>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: '0.5rem',
                    padding: '0.5rem',
                    backgroundColor: msg.type === 'user_message' ? '#1a2e1a' : '#1a1a2e',
                    borderRadius: '4px'
                  }}
                >
                  <div style={{ color: '#888', fontSize: '0.625rem' }}>
                    {msg.type}
                  </div>
                  <div style={{ color: '#fff' }}>
                    {msg.type === 'user_message' && msg.message?.content}
                    {msg.type === 'assistant_message' && msg.message?.content}
                    {msg.type !== 'user_message' && msg.type !== 'assistant_message' && (
                      <span style={{ color: '#666' }}>[{msg.type}]</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </details>

          {/* Debug: User transcriptions only */}
          <details style={{ marginTop: '0.5rem' }}>
            <summary style={{ cursor: 'pointer', color: '#888' }}>
              STT Transcriptions Only ({userMessages.length})
            </summary>
            <div style={{
              marginTop: '0.5rem',
              padding: '0.5rem',
              backgroundColor: '#0d0d0d',
              borderRadius: '4px',
              fontSize: '0.75rem'
            }}>
              {userMessages.map((msg, i) => (
                <div key={i} style={{ marginBottom: '0.25rem', color: '#22c55e' }}>
                  "{msg.message?.content}"
                </div>
              ))}
            </div>
          </details>
        </>
      )}
    </div>
  );
}
