# Phase 1 Wireframes

This folder should contain the visual specifications for VEP configurations.

## Required Files

| File | Description |
|------|-------------|
| `conceptual-layout.png` | Three Areas model overview |
| `gear-1-tour-bus.png` | Gear 1: Pressable prompts, image dominant |
| `gear-2-free-form.png` | Gear 2: Text input + mic, balanced layout |
| `gear-3-deep-dive.png` | Gear 3: Text dominant, image thumbnail |
| `gear-4-voice.png` | Gear 4: Image only, recording button |
| `neutral-transition.png` | Neutral: Transition/loading state |

## Adding Wireframes

Michael: Please add the wireframe images to this folder and commit:

```bash
cd runway
git add docs/phase-1/wireframes/
git commit -m "Add Phase 1 wireframe images"
git push
```

## Design Summary

### Color Palette (from wireframes)
- **Background:** White
- **Text:** Dark navy (#1a2e3b approx)
- **Borders:** Dark navy
- **Controls:** Teal (#1e6b7b approx)

### Layout Pattern
- Three Areas: Display (largest), Input, Status (single line)
- Viewport-locked, no scrolling
- Display Area subdivides differently per gear
