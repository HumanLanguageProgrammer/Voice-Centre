# Voice Proof: Claude Code Specification
## Technical Build Guide
### December 3, 2025

---

## Overview

Build a minimal application that proves the voice loop:

```
Voice In → STT → LLM + Tool → TTS → Voice Out
```

**This is a learning build.** When something is unclear or breaks, pause and report back rather than pushing through.

---

## Technology Stack

```yaml
Frontend:
  - React (Vite)
  - Minimal styling (Tailwind or plain CSS, nothing fancy)
  
APIs:
  - Hume AI: STT and TTS (WebSocket-based)
  - Anthropic Claude: LLM reasoning (REST API)
  
Deployment:
  - Vercel (when ready to test deployed)
  - Local development first

Repository:
  - Fresh Git repo (provided by Michael)
```

---

## Environment Variables Required

```bash
# .env.local
VITE_HUME_API_KEY=xxx        # Hume AI API key
VITE_HUME_SECRET_KEY=xxx     # Hume secret if required
VITE_ANTHROPIC_API_KEY=xxx   # Anthropic API key
```

**Security Note:** Determine if Hume connection should be direct from browser or proxied through serverless function. Document the decision and rationale.

---

## The Target UI

```
┌─────────────────────────────────────────────────┐
│                                                 │
│   Connection Status: ● Connected                │
│                                                 │
│   ┌─────────────────────────────────────────┐   │
│   │                                         │   │
│   │              [ BOX ]                    │   │
│   │           (changes color)               │   │
│   │                                         │   │
│   └─────────────────────────────────────────┘   │
│                                                 │
│   [ 🎤 Record ]                                 │
│                                                 │
│   Heard: "Make the box blue"                    │
│                                                 │
│   Response: "I've changed the box to blue."     │
│                                                 │
│   [ 🔊 Playing... ]                             │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Phase 1: Connection Proof

### Goal
Establish WebSocket connection to Hume and display connection status.

### Tasks

```yaml
1. Project Setup:
   - Initialize Vite + React project
   - Configure environment variables
   - Basic component structure

2. Hume Connection:
   - Research Hume WebSocket connection pattern
   - Implement connection establishment
   - Handle connection states (connecting, connected, disconnected, error)
   - Display connection status in UI

3. Document:
   - How does Hume WebSocket connection work?
   - What authentication is required?
   - Connection lifecycle (open, close, error events)
   - Any surprises or gotchas
```

### Success Criteria
- App shows "Connected" status when Hume WebSocket is open
- App shows "Disconnected" when connection closes
- Connection can be manually closed and reopened

### Output
Report back with:
- Working connection code
- Connection pattern documentation
- Any questions or uncertainties

---

## Phase 2: STT Proof

### Goal
Record audio in browser, stream to Hume, receive transcription.

### Tasks

```yaml
1. Audio Recording:
   - Implement MediaRecorder in browser
   - Configure for Hume's preferred format
   - IMPORTANT: MediaRecorder settings were a Basecamp gotcha
     - Test different mimeTypes
     - Document what works

2. Stream to Hume:
   - Send audio chunks via WebSocket
   - Handle Hume's STT response format
   - Display transcription in UI

3. UI Updates:
   - Record button (click to start/stop)
   - Visual feedback during recording
   - Display transcription result

4. Document:
   - MediaRecorder configuration that works
   - Audio format requirements
   - Hume STT response structure
   - Latency observations
   - Any surprises or gotchas
```

### Success Criteria
- Click record, speak, click stop
- Transcription appears in UI
- Works reliably (10 consecutive tests)

### Output
Report back with:
- Working STT code
- MediaRecorder settings that work
- STT pattern documentation

---

## Phase 3: LLM Integration

### Goal
Send transcription to Anthropic Claude, execute tool call, return response.

### Tasks

```yaml
1. Anthropic Integration:
   - Set up Claude API call (REST)
   - System prompt for voice assistant
   - Tool definition for change_box_color

2. Tool Definition:
   ```javascript
   {
     name: "change_box_color",
     description: "Changes the color of the box on screen",
     input_schema: {
       type: "object",
       properties: {
         color: {
           type: "string",
           description: "The color to change the box to (e.g., 'blue', 'red', '#FF5733')"
         }
       },
       required: ["color"]
     }
   }
   ```

3. Orchestration:
   - Transcription complete → Call Claude
   - Parse tool call from response
   - Execute tool (update React state)
   - Capture text response for TTS

4. UI Updates:
   - Box changes color when tool executes
   - Display Claude's text response

5. Document:
   - Orchestration pattern (WebSocket STT → REST LLM)
   - Tool execution flow
   - State management approach
   - Any timing considerations
```

### Success Criteria
- Say "Make the box green"
- Box turns green
- Response text displayed

### Output
Report back with:
- Working LLM integration
- Orchestration pattern documentation
- Tool execution code

---

## Phase 4: TTS Proof

### Goal
Send response text to Hume Octave, receive audio, play in browser.

### Tasks

```yaml
1. Hume TTS (Octave):
   - Research Hume Octave TTS API
   - Implement TTS request
   - Handle audio response (streaming or complete)

2. Audio Playback:
   - Play TTS audio in browser
   - Handle audio element or Web Audio API
   - Visual feedback during playback

3. Expression/Style:
   - How do we configure voice?
   - How do we set emotional tone?
   - Document configuration options

4. UI Updates:
   - Playback indicator
   - Audio plays automatically after LLM response

5. Document:
   - TTS request format
   - Audio response handling
   - Voice/expression configuration
   - Playback pattern
   - Latency observations
```

### Success Criteria
- Response text converts to speech
- Audio plays in browser
- Voice sounds natural/expressive

### Output
Report back with:
- Working TTS code
- Voice configuration options
- TTS pattern documentation

---

## Phase 5: Full Loop

### Goal
Integrate all phases into seamless end-to-end flow.

### Tasks

```yaml
1. Integration:
   - Connect all phases into single flow
   - Handle state transitions cleanly
   - Error handling at each stage

2. Reliability Testing:
   - Run full loop 10+ times consecutively
   - Document any failures
   - Test connection recovery

3. Edge Cases:
   - What if STT returns empty?
   - What if LLM doesn't return tool call?
   - What if TTS fails?
   - Connection drop mid-flow?

4. Performance:
   - Measure end-to-end latency
   - Identify bottlenecks
   - Document typical timing

5. Final Documentation:
   - Complete architecture diagram
   - All patterns documented
   - All gotchas captured
   - Go/No-Go recommendation
```

### Success Criteria
- Full loop works reliably
- Clear understanding of all patterns
- Documentation complete

### Output
- Voice Integration Specification (for Runway)
- Gotcha Documentation
- Go/No-Go Recommendation

---

## Important Guidelines

### When Stuck or Confused

```yaml
DO:
  - Pause and report back
  - Document what's unclear
  - Ask for guidance

DON'T:
  - Push through with guesses
  - Add workarounds without documenting
  - Ship broken code
```

### Documentation Approach

For each phase, capture:

```yaml
What Worked:
  - Configuration that succeeded
  - Patterns that held up

What Didn't Work:
  - Approaches that failed
  - Why they failed

Surprises:
  - Unexpected behaviors
  - Things not in documentation

Questions:
  - Remaining uncertainties
  - Things to verify
```

### Code Quality

```yaml
Priority:
  1. Works correctly
  2. Is understandable
  3. Is documented
  4. (Distant fourth) Is elegant

This is proof code, not production code.
Clarity over cleverness.
```

---

## Reference: Basecamp Gotchas

Known issues from previous voice work:

```yaml
MediaRecorder:
  - Format/mimeType matters for Hume
  - Some configurations fail silently
  - Test explicitly and document what works

Hume Voice Selection:
  - Voice configuration may not be obvious
  - Document how to set voice/style

WebSocket State:
  - Connection can drop
  - Need to handle reconnection
  - State management during connection changes
```

---

## Checkpoint Communication

After each phase, provide:

```markdown
## Phase [N] Complete

### What Was Built
- [Brief description]

### What Works
- [Confirmed working features]

### What Was Learned
- [Key insights, patterns discovered]

### Gotchas Found
- [Anything that surprised or tripped us up]

### Questions/Uncertainties
- [Anything still unclear]

### Ready for Phase [N+1]?
- [Yes/No, any blockers]
```

---

## Let's Begin

**Start with Phase 1: Connection Proof**

1. Set up the Vite + React project
2. Research Hume WebSocket connection
3. Implement and display connection status
4. Report back with findings

When Phase 1 is complete, we'll review together before proceeding to Phase 2.

---

**END OF CLAUDE CODE SPECIFICATION**
