# Debate Arena — Session Log
**Date:** 2026-04-06

---

## What We Built

A full playable MVP of **Debate Arena** — a dramatic AI debate web app with retro pixel-art arcade presentation. Two fighters debate a topic, an AI judge picks a winner, and the audience votes.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite + React 18 + TypeScript |
| Styling | Plain CSS (no Tailwind, no UI kits) |
| Backend | Cloudflare Pages Functions |
| AI | DeepSeek API (OpenAI-compatible) |
| State | Local React state only |
| Deployment target | itch.io (static) + Cloudflare Pages (backend) |

---

## Project Structure

```
Debate_arena/
  public/images/
    debate_arena_main.jpg     Arena background (intro, debate, judge)
    versus_page.jpg           VS screen background
    player_1.png              Fighter A portrait (transparent PNG)
    player_2.png              Fighter B portrait (transparent PNG)
    judge.png                 Judge portrait (transparent PNG)
    results_debate_arena.jpg  Results screen background

  src/
    components/
      IntroScreen.tsx         Player name inputs + language selector
      VsScreen.tsx            Dramatic VS reveal, auto-transitions
      DebateScreen.tsx        12 manual-click messages, active speaker glow
      JudgeScreen.tsx         Judge portrait + animated verdict
      ResultScreen.tsx        Winner card + audience vote buttons
      PixelButton.tsx         Reusable retro button
      DialogueBox.tsx         Bottom dialogue panel
      SpeakerBadge.tsx        Colored speaker name label
    data/
      emergencyFallbackBattle.ts   Factory function for offline fallback
      i18n.ts                      All UI translations (5 languages)
    styles/
      variables.css           Neon color palette, fonts, z-layers
      reset.css               Box-sizing, image-rendering: pixelated
      app.css                 Screen opacity transitions
      screens.css             Per-screen layouts + language selector
      components.css          Button, dialogue box, speaker badge
    types/
      battle.ts               Fighter, DebateLine, JudgeVerdict, Battle, Language
    utils/
      timers.ts               wait() with AbortSignal support
      classNames.ts           cn() helper
      battleNormalizer.ts     Validates/fixes DeepSeek JSON output
    App.tsx                   State machine + screen orchestration
    main.tsx                  Entry point

  functions/api/
    start-battle.ts           DeepSeek integration (server-side)
    vote.ts                   Vote stub (no DB yet)

  .env.example
  .dev.vars                   Local DeepSeek API key (gitignore this)
  README.md
  SESSION_LOG.md              This file
```

---

## Game Flow

```
IntroScreen → [API call to DeepSeek] → VsScreen → DebateScreen → JudgeScreen → ResultScreen
```

1. **IntroScreen** — User types Player 1 and Player 2 names + topic, picks language, clicks START
2. **VsScreen** — Dramatic VS reveal using versus_page.jpg, auto-advances after ~2s
3. **DebateScreen** — 12 messages, user clicks NEXT to advance each one, active speaker glows and scales up
4. **JudgeScreen** — Judge portrait animates in, winner announced with reason
5. **ResultScreen** — Winner card, audience vote buttons (POST /api/vote), REMATCH button

---

## Key Design Decisions

### Dynamic matchups
- No hardcoded Axel/Bruno — user types any two names (Messi, Cristiano, Tesla, Newton, etc.)
- DeepSeek infers the persona, voice, and domain from the name

### Manual message advancement
- Originally auto-advanced every 4 seconds — changed to click-to-advance
- User controls the pace; NEXT button + clicking anywhere on screen advances
- Last message becomes "JUDGE VERDICT ▶"

### Reactive debate prompt (most important improvement)
- Early prompt produced "scripted" feeling debates — two people giving speeches
- Fixed by rewriting the prompt to enforce reactivity:
  - Every line must directly attack/counter the previous line
  - Phrases like "You just said...", "So now you admit...", "Wait, you're claiming..."
  - Escalation arc: confident → sharp → personal → maximum intensity
- Result: debates feel like real arguments, not prepared monologues

### Single DeepSeek call (not two instances)
- We discussed running two separate DeepSeek instances that take turns
- Decided against it for MVP because:
  - 12 API calls instead of 1 = up to 60 seconds of wait time
  - 12x the cost per debate
  - The quality gap is small with good prompt engineering
- The reactive prompt achieves ~90% of the two-instance feel at zero extra cost

### AbortController for cleanup
- Single AbortController ref in App.tsx
- Aborted on REMATCH/restart — cancels any in-flight fetch
- Threaded through DebateScreen for timer cancellation (timers removed, but pattern kept)

---

## Languages Supported

| Code | Language | Flag | Default Topic |
|---|---|---|---|
| en | English | 🇺🇸 | Who is the greatest of all time? |
| es | Spanish | 🇪🇸 | ¿Quién es el mejor de todos los tiempos? |
| de | German | 🇩🇪 | Wer ist der Größte aller Zeiten? |
| fr | French | 🇫🇷 | Qui est le meilleur de tous les temps ? |
| ru | Russian | 🇷🇺 | Кто лучший из всех времён? |

The selected language controls:
- All UI labels (buttons, input labels, progress text)
- The entire debate content (DeepSeek writes in that language)
- The judge verdict
- The default topic placeholder

---

## DeepSeek Integration

### Endpoint
`POST /api/start-battle` — Cloudflare Pages Function

### Request body
```json
{
  "fighterAName": "Messi",
  "fighterBName": "Cristiano Ronaldo",
  "topic": "Who is the greatest of all time?",
  "language": "en"
}
```

### What happens
1. Cloudflare Function reads `DEEPSEEK_API_KEY` from env (never exposed to frontend)
2. Calls `https://api.deepseek.com/chat/completions` with `response_format: json_object`
3. Prompt instructs DeepSeek to write a reactive, escalating argument in the chosen language
4. Response is parsed and returned to frontend
5. `battleNormalizer.ts` validates and fixes the output (forces 12 rounds, correct alternation)
6. On any failure → `createFallbackBattle()` loads a hardcoded debate seamlessly

### Prompt philosophy
The system prompt frames this as a **live heated argument**, not a formal debate. Key instructions:
- Each line must directly react to the previous line (not pivot to own talking points)
- Reference real achievements, stats, domain-specific language
- Use reactive phrases to make it feel like a real fight
- Escalate toward a breaking point by line 12

---

## Fallback System

`src/data/emergencyFallbackBattle.ts` exports `createFallbackBattle(player1, player2, topic)` — a factory function that generates a generic 12-line debate using the user's actual player names and topic. Triggered when:
- `DEEPSEEK_API_KEY` is missing
- DeepSeek returns an error
- JSON parsing fails
- Response doesn't normalize properly

---

## Running Locally

```bash
# 1. Install
npm install

# 2. Add your DeepSeek key to .dev.vars
# DEEPSEEK_API_KEY=sk-your-key-here

# 3. Run (Vite + Cloudflare Functions together)
npm run pages:dev
# → http://127.0.0.1:8788
```

---

## Monetization Discussion

### Platform: itch.io
- itch.io only hosts static files — the DeepSeek backend must be deployed separately on Cloudflare Pages
- itch.io pays out via PayPal (works in Ecuador)

### Payment processor: Gumroad (recommended for Ecuador)
- Stripe is not available in Ecuador
- Gumroad works in Ecuador, pays via PayPal
- Gumroad auto-generates license keys for every purchase
- Plan: user buys "100 Debate Credits — $3.99" on Gumroad, gets a key, pastes it in the game

### Credit system plan (not yet built)
- **Free tier:** 1 debate per day tracked in `localStorage`
- **Paid tier:** 100 debates for $3.99 via Gumroad
- Flow: Gumroad purchase → license key → user pastes in game → `/api/redeem-key` validates via Gumroad API → 100 credits stored in Cloudflare KV → each debate deducts 1 credit

### What needs to be built for monetization
- [ ] Daily limit gate in frontend (`localStorage` date check)
- [ ] "Unlock Credits" button → opens Gumroad link
- [ ] License key input field in game
- [ ] `functions/api/redeem-key.ts` — validates key via Gumroad API, writes credits to KV
- [ ] `functions/api/start-battle.ts` — check KV credits before calling DeepSeek
- [ ] Cloudflare KV namespace setup

---

## Deployment Plan (not yet done)

1. Push repo to GitHub
2. Connect to Cloudflare Pages
3. Set `DEEPSEEK_API_KEY` in Cloudflare Pages dashboard → Settings → Environment variables
4. `npm run build` → `dist/` folder
5. Zip `dist/` and upload to itch.io as HTML5 game
6. Update frontend API base URL to point to deployed Cloudflare Pages URL

---

## Future Ideas Discussed

### Two-instance real-time debate (Groq)
- Run two separate LLM instances that take turns generating one line each
- Each instance gets the full conversation history and reacts to the actual previous line
- Blocked on speed with DeepSeek (12 calls × 2-5s = too slow)
- **Groq** is the right tool for this — custom inference hardware, ~200-400ms per response
- Models: Llama 3.1 8B (~$0.05/1M tokens), Llama 3.3 70B (~$0.59/1M tokens)
- At those prices, one full 12-turn debate with Llama 8B costs ~$0.0004
- Groq has a free tier (~30 req/min on 8B) — enough for a small launch
- Implementation: backend streams 12 individual Groq calls instead of 1 batch DeepSeek call; frontend already handles manual click-through perfectly
- **Verify current pricing at groq.com/pricing**

### Share card
- Generate an image of the result to share on X/Twitter
- Drives organic traffic

### Premium topic packs
- Historical matchups, science battles, pop culture

---

## API Key Security Notes

- `DEEPSEEK_API_KEY` lives only in `.dev.vars` (local) and Cloudflare Pages env vars (production)
- Never committed to git — add `.dev.vars` to `.gitignore`
- Frontend never touches the key — all AI calls go through Cloudflare Functions
