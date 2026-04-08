# Debate Arena

A dramatic AI debate web app with retro pixel-art arcade presentation. Two fighters debate a topic, an AI judge picks a winner, and the audience votes.

## Stack

- **Vite** + **React 18** + **TypeScript**
- **Plain CSS** (no Tailwind, no UI kits)
- **Cloudflare Pages Functions** (serverless backend)
- **DeepSeek API** (debate generation, OpenAI-compatible)

## Prerequisites

- Node.js 18+
- A [DeepSeek API key](https://platform.deepseek.com/)
- (For deployment) A Cloudflare account

## Setup

```bash
npm install
```

Create `.dev.vars` for local Wrangler dev:

```bash
cp .dev.vars.example .dev.vars
# Edit .dev.vars and paste your DEEPSEEK_API_KEY
```

## Running Locally

```bash
# With Cloudflare Functions (full stack — recommended)
npm run pages:dev
# Opens at http://localhost:3000

# Vite only (frontend, API calls will fall back to hardcoded battle)
npm run dev
```

## Building & Deploying

```bash
npm run build         # TypeScript check + Vite build → dist/
npm run deploy        # Build + deploy to Cloudflare Pages
```

For production, set `DEEPSEEK_API_KEY` in the Cloudflare Pages dashboard under **Settings → Environment variables**.

## Image Assets

All images live in `public/images/` and are served at `/images/<filename>`:

| File | Purpose |
|---|---|
| `debate_arena_main.jpg` | Arena background (intro, debate, judge screens) |
| `versus_page.jpg` | VS splash screen background |
| `player_1.png` | Fighter A (Axel) portrait — transparent PNG |
| `player_2.png` | Fighter B (Bruno) portrait — transparent PNG |
| `judge.png` | Judge portrait — transparent PNG |
| `results_debate_arena.jpg` | Results screen background |

## Game Flow

```
IntroScreen → [API call] → VsScreen → DebateScreen → JudgeScreen → ResultScreen
```

1. **IntroScreen** — Title, matchup, topic, Start button
2. **VsScreen** — Dramatic VS reveal, auto-transitions after ~2s
3. **DebateScreen** — 12 alternating messages auto-play (~4s each), active speaker highlighted
4. **JudgeScreen** — Judge portrait, winner announcement, reason
5. **ResultScreen** — Winner card, audience vote buttons, Rematch

## DeepSeek Integration

`POST /api/start-battle` (handled by `functions/api/start-battle.ts`):
- Sends fighter names, personas, and topic to DeepSeek
- Requests strict JSON with exactly 12 alternating debate rounds + judge verdict
- Uses `response_format: { type: "json_object" }` for reliable JSON output
- Client normalizes the response (forces 12 rounds, correct alternation)

**The frontend never calls DeepSeek directly.**

## Fallback Behavior

If DeepSeek is unavailable (missing API key, network error, bad response):
- The API returns a 502 error
- The client catches it and loads a hardcoded battle from `src/data/emergencyFallbackBattle.ts`
- The game continues normally — the user sees no error

## Project Structure

```
src/
  components/     Screen + UI components
  data/           emergencyFallbackBattle.ts
  styles/         CSS (variables, reset, app, screens, components)
  types/          battle.ts — TypeScript types
  utils/          battleNormalizer, timers, classNames
  App.tsx         State machine + screen orchestration
  main.tsx        Entry point

functions/api/
  start-battle.ts  DeepSeek integration
  vote.ts          Vote stub (no DB yet)

public/images/    All 6 pixel-art assets
```
