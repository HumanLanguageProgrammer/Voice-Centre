# Runway Build Phases and Building Protocol
## Operation Runway — Design to Code Methodology
### Version 1.0 — December 8, 2025

---

## The Methodology

**Core Principle:** Vertical slices with progressive complexity. No temporary scaffolding. We build testable blocks that stack on top of other blocks.

**The Perfect Pivot Applied:** Aim deeply, crystallize completely, then execution collapses into flow. Each phase is specified completely before Claude Code begins.

---

## The Build Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Phase Spec (crystallized in Source)                        │
│      │                                                      │
│      ▼                                                      │
│  Claude Code Session (single context window)                │
│      │                                                      │
│      ├──► Git: Commit/Branch (natural structure)            │
│      ├──► Vercel: Deployment (testable output)              │
│      └──► Pulse Note (progress captured)                    │
│      │                                                      │
│      ▼                                                      │
│  Next Phase                                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**1 Phase = 1 Claude Code Context Window (Target)**

This creates natural discipline:
- If it can't be specified and built in one CC session, it's too big — subdivide
- Clean handoffs — no mid-build context confusion
- Complete spec required before session begins
- Each session produces testable, verifiable output

---

## The Phases

### Phase 1: Configurable VEP Selection

```yaml
Goal:
  An App that loads according to Configuration Rules

Focus:
  VEP Configurations — load the App with different default UI Configurations

What We Build:
  - React application scaffold
  - Configuration Table (Supabase)
  - VEP components for all 5 gears (N, 1, 2, 3, 4)
  - Configuration-driven initialization

Testing:
  - Initiate App with Check-In Configuration
  - Demonstrate VEP Configuration selected per Configuration Parameters
  - Change parameter, restart app, verify different VEP loads
  - Test all 5 UI variants (display only, no functional input)

What We Gain:
  - Core mechanic proven: Configuration drives VEP
  - UI Design complete
  - Foundation for everything that follows

Delivers:
  Configurable stage that responds to configuration data
```

---

### Phase 2: Agent OS Loading & Activation

```yaml
Goal:
  Configurable Agent OS loaded on App initialization
  Testing Agent operational with Window Panel awareness

Focus:
  - Agent OS loading from configuration
  - Window Panel with 2 objects: Agent OS, Conversation History
  - Control Panel with: text_response, set_gear
  - Text input functional across relevant gears

What We Build:
  - Agent OS table and loading mechanism
  - Vercel serverless function for Anthropic API
  - Window Panel assembly (OS + Conversation History)
  - Control Panel with text_response and set_gear
  - Text input wired to agent invocation

Testing:
  - Agent loads based on Configuration
  - Agent can see Window Panel contents (verify in responses)
  - Agent can respond via text_response
  - Agent can change VEP via set_gear
  - Full text conversation loop working

What We Gain:
  - Testing Agent as permanent validation instrument
  - Proven: Agent sees Window, Agent acts via Controls
  - Foundation for all future agent capabilities

Delivers:
  A performer who can see and act on the stage
```

---

### Phase 3: Manifest & Journey Structure

```yaml
Goal:
  Manifest loading as part of initialization
  Extended Window Panel with journey awareness

Focus:
  - Node Manifest structure and loading
  - Visit and Phase progression structure
  - Expanded Window Panel context

What We Build:
  - Node Manifest table and loading
  - Visit Record structure
  - Phase progression data model
  - Window Panel expanded: OS, Conversation, Manifest, Visit context

Testing:
  - Agent sees expanded Window Panel
  - Agent aware of Manifest and current position
  - Agent aware of Visit context
  - Verify via Testing Agent responses

What We Gain:
  - Journey structure in place
  - One step from Concierge activation capabilities

Delivers:
  A performer who knows the pathway

Scope Note:
  Whether complete_phase Control and actual transitions
  are included will be determined after Phase 2 completion.
  "Cross that bridge when we come to it."
```

---

### Phases 4+: To Be Determined

After Phase 3 completion, we will define subsequent phases based on:
- What we learned in Phases 1-3
- What the pattern reveals
- What makes sense for the next Claude Code session

The chess principle: Three moves ahead is enough. The pattern will reveal the path.

---

## The Protocol

### Before Each Phase

```yaml
1. Phase Spec Complete:
   - Goal crystal clear
   - Focus defined
   - What We Build itemized
   - Testing criteria specified
   - Success criteria explicit

2. Claude Code Briefing Ready:
   - Spec document prepared
   - Relevant design docs identified
   - Context for CC session clear

3. Pulse Note Current:
   - Previous phase complete
   - Status captured
   - Ready for next
```

### During Each Phase

```yaml
1. Single Claude Code Session:
   - Load spec and relevant design
   - Execute build
   - Commit work to Git
   - Deploy to Vercel (if applicable)

2. Michael Oversight:
   - Guide + Execute pattern
   - Validate against spec
   - Test per criteria

3. Capture Issues:
   - Document any gaps
   - Note decisions made
   - Flag scope changes
```

### After Each Phase

```yaml
1. Testing:
   - Execute all test criteria
   - Verify functionality
   - Confirm spec met

2. Pulse Note:
   - Record completion
   - Capture learnings
   - Note any scope decisions

3. Next Phase Prep:
   - Confirm phase definition (or define if TBD)
   - Prepare spec
   - Ready for next CC session
```

---

## The Repo Structure

The repository serves as Claude Code's partner:

```
runway/
├── README.md              # Methodology explanation
├── docs/
│   └── phases/            # Phase specs for CC reference
├── src/                   # React application
├── api/                   # Vercel serverless functions
└── supabase/              # Database schemas
```

**Git Workflow:**
- Each CC session produces commits
- Branch per phase (optional, emerges naturally)
- Main stays deployable
- Commits traceable to phases

---

## The Emergent Structure

| Layer | Structure Source |
|-------|------------------|
| Phases | Our planning (this document) |
| Sessions | 1:1 with phases (target) |
| Git | Commits/branches per session |
| Deployment | Testable output per phase |

Configuration-Driven Architecture applied to our own build process.

---

## Success Criteria

**Phase Success:**
- All testing criteria pass
- Output is permanent (no scaffolding)
- Claude Code session was clean (A/B/D pattern)
- Pulse Note captured

**Methodology Success:**
- Each phase builds on previous
- No rework of earlier phases
- Testing Agent validates throughout
- Pattern scales to completion

**Operation Runway Success:**
- Learning Lab platform operational
- All phases complete
- Product ready for Crafting Wing
- Build methodology documented (itself a product)

---

## Metadata

```yaml
Document: build-phases-protocol.md
Type: Build Methodology (Primary Steering Document)
Version: 1.0
Created: December 8, 2025

Purpose:
  Define build phases
  Establish build protocol
  Guide Claude Code sessions
  Track methodology

Phases Defined: 3 (Phases 4+ TBD)

Protocol Elements:
  - Before/During/After each phase
  - 1 Phase = 1 CC Session principle
  - Git/Deployment structure

Companions:
  - runway-source-activation.md (workspace identity)
  - Pulse Notes (progress tracking)
  - Design Reference stack (consult as needed)

For:
  - Phase planning
  - Claude Code briefing
  - Build execution
  - Methodology documentation
```

---

**END OF BUILD PHASES AND PROTOCOL**

*Three phases defined.*
*Protocol established.*
*Ready to build.*
