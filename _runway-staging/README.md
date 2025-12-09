# Runway

**Operation Runway** — Proto-build for The Learning Lab

---

## What Is This?

Runway is the rehearsal before the concert. We build a complete **Digital Engagement System (DES)** — the infrastructure layer where AI agents guide visitors through learning journeys — but activate only a **Testing Agent** to validate the design.

Think: Full sound and vision, limited set list.

---

## The Product

**The Learning Lab** is an AI-powered teaching platform where visitors engage with cultivated agents (Concierge, Librarian) who guide personalized learning journeys about cognitive systems and AI.

Runway builds the stage. The Learning Lab brings the performers.

---

## Architecture Overview

### Three-Panel Model

| Panel | Purpose |
|-------|---------|
| **Window Panel** | What the agent sees (Information Objects) |
| **Control Panel** | What the agent can do (10 Controls) |
| **Visitor Engagement Panel (VEP)** | What the visitor sees (5 Gears) |

### The Five Gears

| Gear | Name | Character |
|------|------|-----------|
| N | Neutral | Phase transition / loading |
| 1 | Tour Bus | Guided navigation (pressable prompts) |
| 2 | Free Form | Open exploration (text input) |
| 3 | Deep Dive | Sustained text engagement |
| 4 | Voice | Listening intelligence (voice input) |

---

## Build Phases

| Phase | Focus | Status |
|-------|-------|--------|
| 1 | Configurable VEP Selection | In Progress |
| 2 | Agent OS Loading & Activation | Planned |
| 3 | Manifest & Journey Structure | Planned |
| 4+ | TBD | Future |

**Methodology:** 1 Phase = 1 Claude Code Session

---

## Project Structure

```
runway/
├── README.md
├── docs/
│   ├── phase-1/
│   │   ├── builders-kit.md
│   │   └── wireframes/
│   └── reference/
│       ├── runway-source-reference.md
│       └── build-phases-protocol.md
├── src/                    # React application (Phase 1+)
├── api/                    # Vercel serverless functions (Phase 2+)
└── supabase/
    └── migrations/         # Database schemas
```

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Backend | Supabase |
| Deployment | Vercel |
| AI (Phase 2+) | Anthropic Claude |

---

## Documentation

- **Phase 1 Spec:** `docs/phase-1/builders-kit.md`
- **Architecture Reference:** `docs/reference/runway-source-reference.md`
- **Build Methodology:** `docs/reference/build-phases-protocol.md`

---

*The stage awaits construction.*
*Configuration drives the show.*
