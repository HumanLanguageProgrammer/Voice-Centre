# Voice Blueprinting Brief
## Tributary Build: Proving Voice Patterns for Operation Runway
### December 3, 2025

---

## Mission

Build a minimal proof-of-concept application that validates our voice integration patterns before they enter the main Runway build. This is an **aiming investment** — the goal is understanding and specification, not a shippable product.

**Codename:** Voice Proof

**Philosophy:** Prove it small, integrate it confident.

---

## Strategic Context

### Why This Exists

In Operation Basecamp, voice was the **only** capability that broke our seamless execution pattern. The A/B/D phases executed flawlessly from specification; Phase C (voice) required iteration, debugging, and patching.

Critical gaps from Basecamp:
- Learnings not fully captured (Claude Code in "ship" mode)
- Gotchas documented but not eliminated
- WebSocket patterns not fully understood
- Integration architecture unclear

### What We're De-Risking

| Known Stack (High Confidence) | Unknown Stack (Needs Proving) |
|-------------------------------|-------------------------------|
| Browser ↔ Vercel ↔ Supabase (REST) | Browser ↔ ??? ↔ Hume (WebSocket) |
| Browser ↔ Vercel ↔ Anthropic (REST) | Stateful connection patterns |
| Request → Response → Done | Connection persistence |
| Stateless, proven patterns | Real-time audio streaming |

### Relationship to Runway

```
Voice Blueprinting (this tributary)
       │
       │ Produces: Voice Integration Specification
       │ Produces: Architecture clarity
       │ Produces: Go/No-Go decision on Hume
       │
       ▼
Runway Build (main river)
  └── Voice integrates as known pattern, not exploration
```

---

## Scope

### What We're Building

A minimal application with one purpose: prove the voice loop works reliably.

```yaml
UI Elements:
  - Connection status indicator (WebSocket state)
  - Record button (click-to-toggle, not push-to-talk)
  - Visual target (colored box for tool demonstration)
  - Transcription display (what the agent heard)
  - Response display (what the agent said)
  - Audio playback (TTS output)

Technology Stack:
  - React (Vite, minimal styling)
  - Vercel (deployment + any serverless needs)
  - Hume AI (STT via WebSocket, TTS via Octave)
  - Anthropic Claude (LLM reasoning, REST API)
```

### The Loop to Prove

```
┌─────────────────────────────────────────────────────────────────┐
│                     THE VOICE LOOP                              │
│                                                                 │
│  1. User clicks record, speaks: "Make the box blue"            │
│                          │                                      │
│                          ▼                                      │
│  2. Audio streams to Hume STT (WebSocket)                       │
│                          │                                      │
│                          ▼                                      │
│  3. Transcription returns: "Make the box blue"                  │
│                          │                                      │
│                          ▼                                      │
│  4. Transcription → Anthropic LLM (REST)                        │
│     With tool: change_box_color(color: string)                  │
│                          │                                      │
│                          ▼                                      │
│  5. LLM returns:                                                │
│     - Tool call: change_box_color("blue")                       │
│     - Response: "I've changed the box to blue for you."         │
│                          │                                      │
│                          ▼                                      │
│  6. React executes tool (box turns blue)                        │
│                          │                                      │
│                          ▼                                      │
│  7. Response text → Hume TTS (WebSocket/Octave)                 │
│     With expression styling                                     │
│                          │                                      │
│                          ▼                                      │
│  8. Audio streams back, plays in browser                        │
│                                                                 │
│  LOOP COMPLETE                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### What We're NOT Building

- Production UI or styling
- Visit lifecycle
- Multiple agents
- Conversation history
- Database persistence
- Anything beyond the minimal loop

---

## Technical Unknowns to Resolve

### 1. Connection Architecture

```yaml
Questions:
  - Does browser connect directly to Hume?
  - Or does connection route through Vercel?
  - Where do Hume API keys live? (Security consideration)
  - Is there a token/session handshake pattern?

What We Need to Learn:
  - The actual connection topology
  - Security pattern for API keys
  - Whether Vercel serverless is involved at all
```

### 2. WebSocket Reliability

```yaml
Questions:
  - What happens when connection drops mid-stream?
  - Automatic reconnection? Manual handling?
  - Timeout behaviors?
  - Error states and recovery?

What We Need to Learn:
  - Connection lifecycle patterns
  - Error handling requirements
  - Reconnection strategy
```

### 3. Audio Streaming Patterns

```yaml
Questions:
  - How does audio chunk into the WebSocket?
  - MediaRecorder configuration (the Basecamp gotcha)
  - TTS streaming — does it play as it arrives?
  - Latency characteristics?

What We Need to Learn:
  - Optimal MediaRecorder settings
  - Audio format requirements (Hume preferences)
  - Playback strategy (buffer vs stream)
```

### 4. Orchestration Layer

```yaml
Questions:
  - How does WebSocket voice coordinate with REST LLM?
  - Where does orchestration logic live?
  - Sequencing: STT complete → LLM call → TTS start
  - State management during the loop

What We Need to Learn:
  - The coordination pattern
  - State machine for voice loop
  - Error handling at each transition
```

### 5. Hume-Specific Patterns

```yaml
Questions:
  - Hume STT vs Whisper — what's the actual difference in integration?
  - Octave TTS — how do we specify expression/style?
  - Voice selection — how does that work?
  - EVI consideration — unified voice solution worth exploring?

What We Need to Learn:
  - Hume's preferred integration pattern
  - Expression/emotion configuration
  - Whether EVI simplifies or complicates
```

---

## Success Criteria

### Primary (Must Achieve)

| Criterion | Validation |
|-----------|------------|
| Voice input transcribes accurately | Speak 10 phrases, 9+ correct |
| Tool calls execute from voice | "Make box [color]" works reliably |
| TTS plays expressively | Response audio plays with appropriate tone |
| Loop completes end-to-end | Full cycle works 10 consecutive times |
| Connection survives normal use | 15-minute session without forced reconnect |

### Secondary (Should Achieve)

| Criterion | Validation |
|-----------|------------|
| Connection recovery works | Simulate drop, verify recovery |
| Error states are handled | Graceful degradation, clear feedback |
| Latency is acceptable | Full loop < 5 seconds typical |
| Pattern is understood | Can explain architecture clearly |

### Documentation (Must Produce)

| Artefact | Purpose |
|----------|---------|
| Architecture Diagram | What connects to what, how data flows |
| Integration Specification | Patterns for Runway integration |
| Gotcha Documentation | Everything that surprised us |
| Go/No-Go Recommendation | Proceed with Hume, or fallback to Deepgram |

---

## Decision Point: Hume vs Fallback

After blueprinting, we make a strategic decision:

```yaml
If Hume Proves Reliable:
  - Proceed with Hume for Runway
  - Use blueprinting patterns directly
  - Voice enters as known quantity

If Hume Proves Problematic:
  - Evaluate Deepgram as fallback (REST-based, simpler)
  - Whisper STT + Deepgram TTS as option
  - Decide before voice enters Runway

The Goal:
  Voice integration in Runway should be A/B/D pattern (seamless)
  Not C pattern (struggle and patch)
```

---

## Build Approach

### Methodology

This is a **learning build**, not a shipping build.

```yaml
Mindset:
  - Understanding over speed
  - Documentation over polish
  - Patterns over features

Process:
  - Claude E2E (Opus) stays in loop for specification
  - Claude Code executes with clear specs
  - Findings documented as they emerge
  - Pause and capture, don't push through confusion
```

### Suggested Sequence

```yaml
Phase 1: Connection Proof
  - Establish WebSocket connection to Hume
  - Display connection status
  - Understand connection lifecycle
  - Document: Connection patterns

Phase 2: STT Proof
  - Record audio in browser
  - Stream to Hume
  - Receive transcription
  - Document: STT patterns, MediaRecorder settings

Phase 3: LLM Integration
  - Transcription → Anthropic (REST)
  - Tool definition and execution
  - Response generation
  - Document: Orchestration patterns

Phase 4: TTS Proof
  - Response → Hume Octave
  - Audio streaming back
  - Playback in browser
  - Expression/style configuration
  - Document: TTS patterns

Phase 5: Full Loop
  - End-to-end integration
  - Reliability testing
  - Error handling
  - Document: Complete specification
```

### Duration Expectation

```yaml
Target: 3-5 focused sessions
Not Weeks: This is a tributary, not a river

If It Takes Longer:
  - That's signal about complexity
  - Factor into Runway planning
  - Consider fallback options earlier
```

---

## Resources Available

```yaml
API Access:
  - Hume AI (confirmed available)
  - Anthropic Claude (existing)
  - Vercel (existing project or new)

Reference:
  - Basecamp gotchas (MediaRecorder, Hume voice selection)
  - Hume documentation
  - Previous voice implementation (for pattern reference, not reuse)

Environment:
  - Fresh build (not patching Basecamp code)
  - Minimal dependencies
  - Focus on the proof, not the polish
```

---

## Output Artefacts

Upon completion, Voice Blueprinting produces:

### 1. Voice Integration Specification

```yaml
For Runway Build Team:
  - Architecture diagram
  - Connection patterns
  - Code patterns (reusable)
  - Configuration requirements
  - Error handling patterns
```

### 2. Gotcha Documentation

```yaml
What We Learned:
  - MediaRecorder settings that work
  - Hume-specific quirks
  - Timing/sequencing requirements
  - Things that broke and why
```

### 3. Go/No-Go Recommendation

```yaml
Decision:
  - Proceed with Hume? Yes/No
  - If No, recommended fallback
  - Rationale for decision
  - Risk assessment for Runway
```

### 4. Updated Build Plan Input

```yaml
For Runway Planning:
  - Accurate effort estimate for voice slice
  - Dependencies identified
  - Integration points clarified
  - Any architectural implications
```

---

## Workspace Setup

When activating Voice Blueprinting workspace:

```yaml
Workspace: Voice Proof (Building Zone - Tributary)
Nature: Short-term, focused build
Authority: Runway Source

Contains:
  - This brief (specification)
  - Build log (as work progresses)
  - Findings documentation (emerging learnings)
  - Output artefacts (upon completion)

Relationship:
  - Feeds into: Runway Source (specifications)
  - Does not feed into: Runway codebase directly
  - Learnings inform: Runway Voice Slice
```

---

## Closing

This blueprinting exercise is an **aiming investment**. 

We know from Basecamp that voice is where complexity lives. Rather than discover that complexity again inside Runway, we prove patterns small, document thoroughly, and integrate with confidence.

The goal: when voice enters Runway, it enters as a known quantity — ready for A/B/D seamless execution.

**Prove it small. Integrate it confident.**

---

## Metadata

```yaml
Document: voice-blueprinting-brief.md
Type: Build Specification (Tributary)
Version: 1.0
Created: December 3, 2025

Cultivators: Michael Mac Sweeney + Claude E2E
Status: READY FOR ACTIVATION

Purpose:
  - Define Voice Blueprinting scope
  - Establish success criteria
  - Capture what we're learning
  - Specify output artefacts

Relationship to Runway:
  - Tributary feeding main river
  - Produces specification, not code for integration
  - De-risks voice before main build

Next Steps:
  - Create Voice Proof workspace
  - Begin Phase 1: Connection Proof
  - Document as we go
```

---

**END OF VOICE BLUEPRINTING BRIEF**

*Prove it small.*
*Document thoroughly.*
*Integrate confident.* 🎤✨
