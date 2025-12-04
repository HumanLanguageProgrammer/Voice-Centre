# Voice Integration Report: Voice Testing Centre

**Project:** Voice-Centre (Tributary to Operation Runway)
**Date:** December 2025
**Status:** Proof Complete - Go for Runway Integration

---

## Executive Summary

The Voice Testing Centre successfully proved the integration pattern for combining **Hume AI** (voice interface) with **Anthropic Claude** (LLM reasoning). The proof validates a clean architecture with no blocking issues for Operation Runway.

**Key Result:** Voice → STT → Claude → Tool Execution → TTS → Voice works reliably.

---

## Architecture Proven

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER                                     │
│                    speaks / hears                                │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                    HUME EVI                                      │
│              (WebSocket Connection)                              │
│  ┌─────────────┐                    ┌─────────────┐             │
│  │     STT     │ ──transcription──► │     TTS     │             │
│  │  (Speech    │                    │   (Octave   │             │
│  │   Input)    │                    │   Voice)    │             │
│  └─────────────┘                    └─────────────┘             │
└─────────────────────┬───────────────────────────────────────────┘
                      │ Custom LLM Protocol
                      │ (OpenAI-compatible)
┌─────────────────────▼───────────────────────────────────────────┐
│              VERCEL SERVERLESS FUNCTION                          │
│                /api/chat/completions                             │
│                                                                  │
│  • Receives OpenAI-format messages from Hume                    │
│  • Converts to Anthropic format                                 │
│  • Calls Claude API with tools                                  │
│  • Converts response back to OpenAI format                      │
│  • Returns to Hume for TTS                                      │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                 ANTHROPIC CLAUDE API                             │
│                                                                  │
│  • Reasoning and conversation                                   │
│  • Tool calling (change_box_color proven)                       │
│  • Context management                                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Components

### 1. Frontend (React + Vite)

| Component | Purpose |
|-----------|---------|
| `VoiceProvider` | Wraps app, manages Hume WebSocket |
| `ConnectionStatus` | Connect/disconnect with configId |
| `MicrophoneControl` | Mute/unmute, audio level display |
| `ColorBox` | Visual tool execution feedback |

**Key Package:** `@humeai/voice-react` - handles WebSocket, microphone, audio playback

### 2. Backend (Vercel Serverless)

| Endpoint | Purpose |
|----------|---------|
| `/api/chat/completions` | OpenAI-compatible bridge to Claude |

**Key Package:** `@anthropic-ai/sdk` - Claude API client

### 3. Hume EVI Configuration

| Config | LLM | Use Case |
|--------|-----|----------|
| Default | Hume's built-in | Simple interactions |
| Custom LLM | Claude via endpoint | Complex reasoning, tools |

---

## Gotchas & Solutions

### Gotcha #1: Node.js Polyfills Required
**Symptom:** Build fails with `stream.Readable` import errors
**Cause:** Hume SDK has Node.js dependencies
**Solution:**
```bash
npm install stream-browserify
```
```ts
// vite.config.ts
resolve: {
  alias: {
    stream: 'stream-browserify',
  },
}
```

### Gotcha #2: React Version Compatibility
**Symptom:** Blank page, `Cannot read properties of null (reading 'useRef')`
**Cause:** `@humeai/voice-react` requires React 18, Vite scaffolds React 19
**Solution:**
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

### Gotcha #3: Dual-LLM Conflict (Browser Orchestration)
**Symptom:** Two different responses - Hume's LLM and Claude both responding
**Cause:** Browser-side Claude calls + Hume's built-in LLM active simultaneously
**Solution:** Use Hume's Custom LLM feature instead of browser orchestration
- Configure EVI with Custom Language Model URL
- Point to your `/api/chat/completions` endpoint
- Hume's LLM is completely replaced, not competing

### Gotcha #4: API Key Exposure
**Symptom:** Security concern - API keys visible in browser
**Cause:** Client-side API calls expose keys
**Solution:** Server-side endpoint handles Claude calls
- `VITE_*` env vars → browser (Hume key only)
- Non-prefixed env vars → server only (Anthropic key)

---

## Environment Variables

### Client-Side (Browser)
```bash
VITE_HUME_API_KEY=xxx        # Hume WebSocket auth
```

### Server-Side (Vercel Functions)
```bash
ANTHROPIC_API_KEY=xxx        # Claude API (secure)
```

---

## Tool Calling Pattern

### Tool Definition (Claude Format)
```ts
{
  name: 'change_box_color',
  description: 'Changes the color of the box on screen',
  input_schema: {
    type: 'object',
    properties: {
      color: { type: 'string' }
    },
    required: ['color']
  }
}
```

### Execution Flow
1. User says: "Make the box blue"
2. Hume STT transcribes
3. Custom LLM endpoint receives transcription
4. Claude decides to call `change_box_color` tool
5. Endpoint returns tool call in OpenAI format
6. Hume handles tool execution callback
7. Result sent back to Claude
8. Claude generates confirmation
9. Hume TTS speaks response

---

## Performance Observations

| Metric | Observation |
|--------|-------------|
| Connection time | < 1 second |
| STT latency | Near real-time |
| Claude response | 1-3 seconds |
| TTS playback | Immediate after text |
| Full loop | ~3-5 seconds total |

---

## Recommendations for Runway

### 1. Use Custom LLM Architecture
Don't try to orchestrate in the browser. Use Hume's Custom LLM feature with a server endpoint. This is cleaner, more secure, and avoids dual-LLM conflicts.

### 2. EVI Config Per Use Case
Create multiple Hume EVI configurations:
- **Simple voice interactions** → Hume's built-in LLM
- **Complex reasoning/tools** → Custom LLM → Claude

### 3. Tool Definition Strategy
Define tools in the server endpoint, not client-side. The endpoint acts as the single source of truth for Claude's capabilities.

### 4. Voice Selection
Hume offers multiple voices with different characteristics. Select based on:
- Brand alignment
- Clarity for your use case
- Emotional expression needs

### 5. Error Handling
Implement robust error handling for:
- WebSocket disconnections (auto-reconnect)
- Claude API failures (fallback to Hume LLM)
- Tool execution errors (graceful degradation)

---

## Files to Carry Forward

```
voice-app/
├── api/
│   └── chat/completions.ts    # OpenAI-compatible Claude bridge
├── src/
│   ├── components/
│   │   ├── ConnectionStatus.tsx
│   │   ├── MicrophoneControl.tsx
│   │   └── ColorBox.tsx       # Tool execution example
│   ├── services/
│   │   └── anthropic.ts       # Claude API client (if needed)
│   └── main.tsx               # VoiceProvider setup
├── .env.example
└── vite.config.ts             # Node.js polyfills
```

---

## Decision: Go for Runway

**Recommendation:** Proceed with Hume AI + Claude integration for Operation Runway

**Confidence:** High

**Rationale:**
- Architecture proven end-to-end
- No blocking technical issues
- Clear patterns for tool execution
- Security model validated (server-side keys)
- Performance acceptable for voice interaction

---

## Session Credits

**Cultivators:** Michael Mac Sweeney, Claude E2E, Claude Code
**Duration:** Single focused session
**Methodology:** Build small, prove patterns, document gotchas

*"Prove it small. Integrate it confident."*
