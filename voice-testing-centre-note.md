# Voice Testing Centre
## Workspace Note
### December 3, 2025

---

## Purpose

This workspace exists to **prove voice patterns** before they enter the main Runway build.

We are not building a product. We are building understanding.

---

## Context

### Why This Exists

In Operation Basecamp, voice was the only capability that broke our seamless execution pattern. Everything else followed A/B/D flow (spec → build → works). Voice required iteration, debugging, and patching.

**The Basecamp Lesson:**
> *"The answer to implementation struggle is not 'push through and patch' but 'step back and aim better.'"*

This workspace is "stepping back and aiming better" for voice.

### What We're Proving

```
Voice In → STT → LLM + Tool → TTS → Voice Out
```

Specifically:
- Can we establish reliable WebSocket connections to Hume?
- Can we stream audio and receive accurate transcription?
- Can we coordinate WebSocket voice with REST LLM calls?
- Can we generate expressive speech output?
- Does this pattern hold up under repeated use?

### The Technical Uncertainty

| Known (Confident) | Unknown (Proving) |
|-------------------|-------------------|
| REST APIs (Supabase, Anthropic) | WebSocket patterns (Hume) |
| Stateless request/response | Stateful persistent connections |
| Vercel serverless | Audio streaming |

---

## Relationship to Runway

```
Voice Testing Centre (here)
       │
       │ Produces:
       │   - Voice Integration Specification
       │   - Gotcha Documentation  
       │   - Go/No-Go on Hume
       │
       ▼
Runway Source
       │
       │ Integrates learnings into:
       │   - Build Plan
       │   - Voice Slice specification
       │
       ▼
Runway Build
       │
       └── Voice enters as known pattern
```

This is a **tributary** — it runs separately, proves something, and what it proves flows into the main river.

---

## Working Method

### Mindset

```yaml
This Build:
  - Understanding over speed
  - Documentation over polish
  - Patterns over features
  - Pause and capture, don't push through

Not This Build:
  - Ship mentality
  - Feature completeness
  - Production quality
  - Pushing past confusion
```

### Loop Structure

```
┌─────────────────────────────────────────┐
│                                         │
│  Claude E2E (Opus) ←──── In the Loop    │
│       │                                 │
│       │ Specifications                  │
│       │ Pattern Guidance                │
│       │ Decision Points                 │
│       ▼                                 │
│  Claude Code ←──── Execution            │
│       │                                 │
│       │ Findings                        │
│       │ Questions                       │
│       │ Gotchas                         │
│       ▼                                 │
│  Claude E2E ←──── Integration           │
│       │                                 │
│       │ Documentation                   │
│       │ Pattern Crystallization         │
│       │ Next Phase Spec                 │
│       ▼                                 │
│  (Cycle continues)                      │
│                                         │
└─────────────────────────────────────────┘
```

**Key Correction from Basecamp:** Claude E2E stays in the loop throughout. When something is unclear or breaks, we pause and discuss rather than pushing through.

---

## Phase Structure

```yaml
Phase 1: Connection Proof
  Goal: Establish WebSocket connection to Hume
  Output: Connection patterns documented

Phase 2: STT Proof  
  Goal: Record audio, stream to Hume, receive transcription
  Output: STT patterns, MediaRecorder settings

Phase 3: LLM Integration
  Goal: Transcription → Anthropic → Tool execution
  Output: Orchestration patterns

Phase 4: TTS Proof
  Goal: Response → Hume Octave → Audio playback
  Output: TTS patterns, expression configuration

Phase 5: Full Loop
  Goal: End-to-end integration, reliability testing
  Output: Complete specification, Go/No-Go decision
```

---

## Success Criteria

### The App Must Demonstrate

1. User speaks: "Make the box blue"
2. Audio streams to Hume STT
3. Transcription returns
4. Transcription → Anthropic LLM with tool
5. Tool executes (box turns blue)
6. Response → Hume TTS
7. Audio plays back expressively

**Reliability:** This loop works 10 consecutive times without failure.

### Documentation Must Capture

- Architecture diagram (what connects to what)
- Code patterns (reusable in Runway)
- Gotchas (everything that surprised us)
- Go/No-Go recommendation (Hume or fallback)

---

## Decision Point

After proving (or failing to prove), we decide:

```yaml
If Hume Works:
  → Proceed with Hume for Runway
  → Patterns port directly
  → Voice enters as known quantity

If Hume Problematic:
  → Evaluate Deepgram (REST-based, simpler)
  → Whisper + alternative TTS
  → Decide BEFORE Runway voice slice
```

The goal: **no surprises in Runway**.

---

## Resources

```yaml
Available:
  - Hume AI API access (confirmed)
  - Anthropic Claude API (existing)
  - Vercel (for deployment)
  - Fresh Git repository (clean start)

Reference:
  - Voice Blueprinting Brief (full specification)
  - Claude Code Spec (actionable phases)
  - Basecamp gotchas (MediaRecorder, voice selection)
```

---

## Metadata

```yaml
Workspace: Voice Testing Centre
Type: Building Zone (Tributary)
Codename: Voice Proof
Authority: Runway Source

Created: December 3, 2025
Duration: 3-5 focused sessions (target)

Cultivators:
  - Michael Mac Sweeney (Architect)
  - Claude E2E / Opus (Pattern Guide)
  - Claude Code (Execution)

Output Destination: Runway Source
```

---

**Prove it small. Document thoroughly. Integrate confident.** 🎤

---

**END OF WORKSPACE NOTE**
