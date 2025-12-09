# Runway Source Reference Document
## December 3, 2025

---

## 1. Product Essence

The Learning Lab is an AI-powered teaching platform where visitors engage with cultivated agents (Concierge, Librarian) who guide personalized learning journeys about cognitive systems and AI. The product's core innovation is **adaptive engagement** — the system meets visitors where they are, adapts how it teaches based on observed signals, and delivers value through curated 10-node pathways. The architecture is self-demonstrating: visitors learn about Context Windows, cognitive systems, and AI by experiencing a product built on those very principles.

---

## 2. Architectural Components

### The Atomic Unit: Visitor Engagement Cycle

```
READ  →  REASON  →  RESPOND
 │          │          │
 │          │          └── Agent signals via Control Panel
 │          └── LRM cognition
 └── Agent reads Window Panel
```

Every agent operation follows this indivisible pattern. A visit comprises many cycles.

---

### The Three-Panel Model

| Panel | Question | Contains |
|-------|----------|----------|
| **Window Panel** | What does the agent see? | Information Objects (Agent OS, Visit Record, Node Manifest, Node Repository, Conversation History) |
| **Control Panel** | What can the agent do? | 10 Controls across 6 categories (Mixing Desk) |
| **Visitor Engagement Panel** | What does the visitor see? | UI configured through 5 Gears |

---

### The Five Gears (Engagement Spectrum)

| Gear | Name | Latency | Cognitive Force | Character |
|------|------|---------|-----------------|-----------|
| **N** | Opening | Minimal | Minimal | Pre-determined welcome |
| **1** | Rail | Low | Low | Guided navigation |
| **2** | Explorer | Medium | Medium | Open exploration |
| **3** | Deep Text | High | High | Sustained text engagement |
| **M** | Max | Highest | Highest | Listening intelligence (voice) |

**Core Principle:** Gears are states on a spectrum. Agent always decides gear each cycle.

---

### The Visit Lifecycle (Three Phases)

```
ARRIVAL
    │
    ▼
┌─────────────────────────────────────────┐
│           CHECK-IN                      │
│   Agent: Concierge                      │
│   Manifest: Template (Supabase)         │
│   Output: Concierge Notes               │
└─────────────────────────────────────────┘
    │
    │ complete_phase
    ▼
┌─────────────────────────────────────────┐
│          ENGAGEMENT                     │
│   Agent: Librarian                      │
│   Manifest: Composed (first cycle)      │
│   Output: Learning + Librarian Notes    │
└─────────────────────────────────────────┘
    │
    │ complete_phase
    ▼
┌─────────────────────────────────────────┐
│          CHECK-OUT                      │
│   Agent: Concierge                      │
│   Manifest: Template (Supabase)         │
│   Output: Visit complete                │
└─────────────────────────────────────────┘
    │
    ▼
DEPARTURE
```

---

### Two Signal Languages

| Language | Controls | Purpose |
|----------|----------|---------|
| **Composition** | retrieve_node, rebuild_pathway | Build or rebuild the manifest |
| **Progression** | complete_node, complete_phase | Advance through the journey |

**Tram Line Principle:** React knows forward. Agent signals completion. React moves.

---

### Control Inventory (Mixing Desk)

| Category | Controls | Terminal? |
|----------|----------|-----------|
| VEP Configuration | set_gear | No |
| Visitor Communication | display_prompts, text_response, voice_response | Yes |
| Display | display_node | No |
| Navigation | complete_node, complete_stage | complete_stage: Yes |
| Knowledge | retrieve_node, rebuild_pathway | No |
| Memory | add_note | No |

**Key Insight:** Communicate IS Yield — no separate yield signal needed.

---

### Information Objects (Window Panel)

| Object | Question Answered | Persistence |
|--------|-------------------|-------------|
| **Agent OS** | Who am I, how do I operate? | Config → React |
| **Visit Record** | Who is visiting, journey so far? | React ↔ Supabase |
| **Node Manifest** | Where are we, where going? | React (instantiated) |
| **Node Repository** | What can I teach? | Supabase → React |
| **Conversation History** | What have we discussed? | React (accumulates, clears between phases) |

---

### VEP Components (Reusable)

**Display:** Response Panel, Image Panel (full/thumbnail)

**Input:** Pressable Prompts (all gears), Text Input, Voice Input

**Navigation:** Return to Text, Next

**Constant:** Pressable prompts remain available across all gears as foundation layer.

---

## 3. Design State

### Crystallized (Ready for Build)

| Component | Document | Status |
|-----------|----------|--------|
| Visitor Engagement Cycle | Agent-Operational-Architecture-v3 | ✅ |
| Three-Panel Model | Agent-Operational-Architecture-v3 | ✅ |
| Five Gears System | VEP-Overview-v2, Agent-Operational-v3 | ✅ |
| Information Objects | Window-Registry-Overview | ✅ |
| Control Inventory | Mixing-Desk-Overview | ✅ |
| Visit Lifecycle (3 phases) | Visit-Lifecycle-Architecture | ✅ |
| Signal Languages | Visit-Lifecycle-Architecture | ✅ |
| VEP Components | VEP-Overview-v2 | ✅ |

### Open / Deferred

| Component | Notes |
|-----------|-------|
| Max Gear (Voice) | Requires audio infrastructure — post-Runway |
| rebuild_pathway | Full re-composition mid-journey — post-Runway |
| Library Map composition intelligence | Edges, prerequisites, vector reasoning — post-Runway |
| Thinking Time Display | Explored (Bridge Note), not finalized |
| Agent Cultivation (Concierge, Librarians) | Crafting Wing work |
| Node Content | Library Wing work |

---

## 4. Build-Relevant Observations

### Architectural Boundaries

```yaml
React Layer:
  - Orchestration (assembles windows, invokes LRM, executes signals)
  - State management (Information Objects as React Cache)
  - VEP rendering (gear configurations)
  - Supabase synchronization

LRM Layer:
  - Transient, invoked per cycle
  - Reads Window, reasons, returns signals
  - Does NOT manage state directly

Supabase Layer:
  - Persistence (Visit Records, Templates, Node Repository)
  - Source of truth for content and cross-session data
```

### Key Integration Points

1. **Window Assembly:** React gathers Information Objects → packages as context → invokes LRM
2. **Signal Execution:** LRM returns controls → React executes immediately → updates state
3. **Phase Transitions:** complete_phase triggers persist → clear → load → initialize sequence
4. **VEP Configuration:** set_gear updates React state → UI reconfigures → next cycle reflects

### Runway Scope (In/Out)

**In Scope:**
- All three phases operational
- Gears N, 1, 2, 3 (not Max)
- Template + Composed manifest patterns
- Core controls (excluding rebuild_pathway, voice_response)
- Information Objects full implementation
- VEP components (excluding Voice Input)

**Out of Scope:**
- Max Gear / Voice
- Full Library Map intelligence
- Return visitor handling
- Journey resumption

---

## Document Metadata

```yaml
Document: runway-source-reference.md
Type: Reference Summary (Source Centre)
Version: 1.0
Created: December 3, 2025

Purpose: Provide Source Centre with clear product view for build planning

Source Documents:
  - runway-genesis-session-capture.md
  - Agent-Operational-Architecture-v3.md
  - Window-Registry-Overview.md
  - Mixing-Desk-Overview.md
  - Visitor-Engagement-Panel-Overview-v2.md
  - Visit-Lifecycle-Architecture.md
  - Bridge Notes (×2)

Nature: Observation, not evaluation
Owner: Source Centre (for orchestration)
```

---

**END OF PRODUCT DESIGN SUMMARY**

*Observed at Master Product Design Centre. Summarized for Source.*
*Design crystallized. Build planning enabled.*
