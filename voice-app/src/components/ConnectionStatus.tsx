import { useVoice } from '@humeai/voice-react';

/**
 * ConnectionStatus - Displays the current WebSocket connection state
 *
 * Phase 1 Goal: Prove we can establish and monitor a Hume WebSocket connection
 */
export function ConnectionStatus() {
  const { status, readyState, error, connect, disconnect } = useVoice();

  // Map status to visual indicator
  const getStatusColor = () => {
    switch (status.value) {
      case 'connected':
        return '#22c55e'; // green
      case 'connecting':
        return '#eab308'; // yellow
      case 'disconnected':
        return '#6b7280'; // gray
      case 'error':
        return '#ef4444'; // red
      default:
        return '#6b7280';
    }
  };

  const getStatusText = () => {
    switch (status.value) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  const apiKey = import.meta.env.VITE_HUME_API_KEY;

  const handleConnect = () => {
    if (!apiKey) {
      console.error('[Hume] No API key configured');
      return;
    }

    connect({
      auth: { type: 'apiKey', value: apiKey }
    })
      .then(() => {
        console.log('[Hume] Connection initiated');
      })
      .catch((err) => {
        console.error('[Hume] Connection failed:', err);
      });
  };

  const handleDisconnect = () => {
    disconnect();
    console.log('[Hume] Disconnected');
  };

  return (
    <div style={{
      padding: '1.5rem',
      border: '1px solid #333',
      borderRadius: '8px',
      backgroundColor: '#1a1a1a',
      maxWidth: '400px'
    }}>
      <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem' }}>
        Hume WebSocket Connection
      </h2>

      {/* API Key Warning */}
      {!apiKey && (
        <div style={{
          padding: '0.75rem',
          backgroundColor: '#451a1a',
          border: '1px solid #ef4444',
          borderRadius: '4px',
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}>
          <strong>Missing API Key:</strong> Copy .env.example to .env.local and add your Hume API key.
        </div>
      )}

      {/* Status Indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem'
      }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(),
          boxShadow: status.value === 'connected'
            ? `0 0 8px ${getStatusColor()}`
            : 'none'
        }} />
        <span style={{ fontWeight: 500 }}>{getStatusText()}</span>
        <span style={{ color: '#888', fontSize: '0.875rem' }}>
          (readyState: {readyState})
        </span>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          padding: '0.75rem',
          backgroundColor: '#451a1a',
          border: '1px solid #ef4444',
          borderRadius: '4px',
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}>
          <strong>Error:</strong> {error.message || String(error)}
        </div>
      )}

      {/* Connection Controls */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={handleConnect}
          disabled={!apiKey || status.value === 'connected' || status.value === 'connecting'}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: (!apiKey || status.value === 'connected') ? '#333' : '#22c55e',
            color: 'white',
            cursor: (!apiKey || status.value === 'connected') ? 'not-allowed' : 'pointer',
            opacity: (!apiKey || status.value === 'connected') ? 0.5 : 1
          }}
        >
          Connect
        </button>
        <button
          onClick={handleDisconnect}
          disabled={status.value === 'disconnected'}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: status.value === 'disconnected' ? '#333' : '#ef4444',
            color: 'white',
            cursor: status.value === 'disconnected' ? 'not-allowed' : 'pointer',
            opacity: status.value === 'disconnected' ? 0.5 : 1
          }}
        >
          Disconnect
        </button>
      </div>

      {/* Debug Info */}
      <details style={{ marginTop: '1rem' }}>
        <summary style={{ cursor: 'pointer', color: '#888' }}>
          Debug Info
        </summary>
        <pre style={{
          fontSize: '0.75rem',
          backgroundColor: '#0d0d0d',
          padding: '0.5rem',
          borderRadius: '4px',
          overflow: 'auto'
        }}>
{JSON.stringify({
  status: status.value,
  readyState,
  hasError: !!error,
  apiKeyPresent: !!apiKey
}, null, 2)}
        </pre>
      </details>
    </div>
  );
}
