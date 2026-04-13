# Debate Arena

Arcade-style AI debate app built with Vite, React, Cloudflare Pages Functions, Supabase Auth, and Dodo recurring subscriptions.

## Stack

- Vite + React 18 + TypeScript
- Plain CSS
- Cloudflare Pages Functions
- DeepSeek API
- Supabase Auth + Postgres
- Dodo Payments

## Runtime Overview

- Frontend runs in Vite/Cloudflare Pages
- Backend endpoints live in `functions/api/*`
- Authenticated paid flows use Supabase magic-link auth
- Billing state is stored in Supabase
- Subscription checkout and portal sessions are created through Dodo

## Required Accounts

- DeepSeek
- Cloudflare Pages
- Supabase
- Dodo Payments

## Local Setup

Install dependencies:

```bash
npm install
```

Frontend env for Vite:

```bash
cp .env.example .env.local
```

Populate:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- optional `VITE_API_BASE_URL`

Backend env for Wrangler / Pages Functions:

```bash
cp .dev.vars.example .dev.vars
```

Populate:

- `DEEPSEEK_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DODO_API_KEY`
- `DODO_API_BASE_URL`
- `DODO_WEBHOOK_SECRET`
- `DODO_PRICE_ID_PACK_25_MONTHLY`
- `DODO_PRICE_ID_PACK_50_MONTHLY`
- `DODO_PRICE_ID_PACK_100_MONTHLY`
- `DODO_RETURN_URL_SUCCESS`
- `DODO_RETURN_URL_CANCEL`
- `DODO_PORTAL_RETURN_URL`

## Supabase

Run the migration in Supabase SQL Editor:

`supabase/migrations/20260413_billing_backend.sql`

This creates:

- `profiles`
- `credit_wallets`
- `credit_ledger`
- `billing_subscriptions`
- `billing_webhook_events`

## Supabase Auth Configuration

In Supabase Auth settings, configure:

- Site URL: your production app URL
- Redirect URLs: include your production app URL

For production this project expects:

- `https://www.debatearena.xyz`

## Dodo

Recurring plans are configured through these env vars:

- `DODO_PRICE_ID_PACK_25_MONTHLY`
- `DODO_PRICE_ID_PACK_50_MONTHLY`
- `DODO_PRICE_ID_PACK_100_MONTHLY`

Webhook endpoint:

- `/api/webhooks/dodo`

## Development

Frontend only:

```bash
npm run dev
```

Full stack with Pages Functions:

```bash
npm run pages:dev
```

## Build

```bash
npm run build
```

## Deploy

```bash
npm run deploy
```

Cloudflare Pages must define both:

- frontend build vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- backend runtime vars: all keys from `.dev.vars.example`

## API Endpoints

- `POST /api/start-battle`
- `POST /api/vote`
- `GET /api/billing/status`
- `POST /api/billing/create-checkout-session`
- `POST /api/billing/create-portal-session`
- `POST /api/webhooks/dodo`

## Notes

- Unauthenticated users keep the legacy free daily debate flow.
- Authenticated users use paid credits from Supabase.
- Paid debates only consume one credit after successful AI generation.
