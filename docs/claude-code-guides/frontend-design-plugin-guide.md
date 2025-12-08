# Claude Code Frontend-Design Plugin Guide

> A reference document for setting up the official Anthropic frontend-design plugin to create distinctive, production-grade UI interfaces.

---

## Overview

### What Is It?

The **frontend-design** plugin is one of 14 official plugins maintained by Anthropic in the `anthropics/claude-code` repository. It enhances Claude Code's ability to create frontend interfaces that are:

- **Distinctive** - Avoids generic "AI-generated" aesthetics
- **Production-grade** - High design quality ready for real use
- **Intentional** - Makes bold, purposeful design choices

### Why Use It?

Without this plugin, AI-generated UIs often look similar - the same rounded corners, the same color palettes, the same spacing patterns. This plugin guides Claude Code to:

1. Consider specific design directions (minimalist, brutalist, retro-futuristic, art deco, etc.)
2. Make bold typography and color choices
3. Add thoughtful animations and visual details
4. Create interfaces with personality and character

### Who Created It?

- **Authors:** Prithvi Rajasekaran & Alexander Bricken (Anthropic)
- **Version:** 1.0.0
- **Source:** `github.com/anthropics/claude-code/tree/main/plugins/frontend-design`

---

## Installation

### Prerequisites

- Claude Code v2.0.12 or higher
- A project directory where you want to enable the plugin

### Method 1: Settings Configuration (Recommended)

This method persists the plugin configuration in your project and works automatically for all team members.

**Step 1:** Create the `.claude` directory in your project root:
```bash
mkdir -p .claude
```

**Step 2:** Create `.claude/settings.json` with the following content:
```json
{
  "plugins": [
    "anthropics/claude-code/plugins/frontend-design"
  ]
}
```

**Step 3:** Commit to your repository:
```bash
git add .claude/settings.json
git commit -m "Add Claude Code frontend-design plugin configuration"
```

**Step 4:** Restart Claude Code in your project directory. The plugin loads automatically.

### Method 2: Slash Commands (Interactive)

Use this method for quick setup or testing.

**Step 1:** Add the Anthropic marketplace:
```
/plugin marketplace add anthropics/claude-code
```
You should see: `Successfully added marketplace: claude-code-plugins`

**Step 2:** Install the plugin:
```
/plugin install frontend-design@claude-code-plugins
```

**Step 3:** Verify installation:
```
/help
```
You should see new commands or capabilities listed.

---

## Usage

### How It Works

Once installed, the plugin is **auto-invoked** when you ask Claude Code to work on frontend/UI tasks. You don't need to explicitly activate it.

### Effective Prompts

When requesting UI work, consider specifying:

| Aspect | Example Prompt Addition |
|--------|------------------------|
| Design direction | "...with a minimalist/brutalist/retro-futuristic aesthetic" |
| Mood | "...that feels premium/playful/professional/bold" |
| Reference | "...inspired by Stripe's dashboard/Apple's website/Notion's interface" |
| Specific elements | "...with micro-animations on hover states" |

### Example Requests

**Basic:**
> "Create a landing page for our voice AI product"

**Better:**
> "Create a landing page for our voice AI product with a bold, modern aesthetic. Use strong typography hierarchy, generous whitespace, and subtle animations. Avoid generic startup template looks."

**Best:**
> "Create a landing page for our voice AI product. Design direction: minimalist with one bold accent color. Include micro-interactions on CTAs, a hero section with an abstract audio waveform visualization, and testimonials that feel authentic rather than templated."

---

## Other Useful Plugins

The Anthropic marketplace includes additional plugins you may find useful:

| Plugin | Purpose |
|--------|---------|
| `code-review` | Automated PR reviews with specialized agents |
| `feature-dev` | Structured 7-phase feature development workflow |
| `security-guidance` | Security reminders when editing files |
| `commit-commands` | Git workflow automation |
| `pr-review-toolkit` | Specialized PR review agents |

Install additional plugins by adding them to the `plugins` array in `.claude/settings.json`:

```json
{
  "plugins": [
    "anthropics/claude-code/plugins/frontend-design",
    "anthropics/claude-code/plugins/code-review",
    "anthropics/claude-code/plugins/security-guidance"
  ]
}
```

---

## Troubleshooting

### Plugin Not Loading

1. **Check Claude Code version:** Run `claude --version` - must be 2.0.12+
2. **Verify file location:** `.claude/settings.json` must be in project root
3. **Validate JSON:** Ensure no syntax errors in settings.json
4. **Restart Claude Code:** Close and reopen the session

### Plugin Not Affecting Output

1. Be explicit in your prompts about wanting distinctive design
2. Mention specific design directions or references
3. Ask Claude Code to "avoid generic AI aesthetics"

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│  FRONTEND-DESIGN PLUGIN - QUICK SETUP                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Create file: .claude/settings.json                  │
│                                                         │
│  2. Add content:                                        │
│     {                                                   │
│       "plugins": [                                      │
│         "anthropics/claude-code/plugins/frontend-design"│
│       ]                                                 │
│     }                                                   │
│                                                         │
│  3. Restart Claude Code                                 │
│                                                         │
│  4. Ask for UI work - plugin auto-activates             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## References

- Official repository: `github.com/anthropics/claude-code`
- Plugin source: `github.com/anthropics/claude-code/tree/main/plugins/frontend-design`
- Claude Code docs: `docs.anthropic.com/en/docs/claude-code`

---

*Document created: December 2024*
*For use with Claude AI (solution design) and Claude Code (implementation)*
