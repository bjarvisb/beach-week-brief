# Beach Week Brief

A simple beach-week planning sheet for families. Weather, tides, low-tide walks, swim caution, UV, and beach conditions — updated every morning.

Currently live for **Sandbridge, Virginia Beach, VA**.

## Routes

- `/` — Landing page
- `/sandbridge` — Sandbridge 7-day beach brief

## Local development

```bash
npm install
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel (without GitHub)

```bash
# Install Vercel CLI if you haven't already
npm install -g vercel

# Log in (opens browser)
vercel login

# Preview deploy (from the project root)
vercel

# Production deploy
vercel --prod
```

Vercel will auto-detect Next.js and configure the build.

If you want to connect a custom domain (`beachweekbrief.com`):
1. Go to your project in [vercel.com/dashboard](https://vercel.com/dashboard)
2. Settings → Domains → Add `beachweekbrief.com`
3. Update your DNS to point to Vercel (they'll show the records)

## Architecture

Right now this is a static demo with hardcoded sample data. The next step is replacing `BRIEF` in the Sandbridge page with a server-generated `brief.json` that fetches from NWS and NOAA APIs.

```
Future data flow:
  NWS Forecast API + NOAA Tides + NWS Surf Zone + NWS Alerts
    → server-side fetch/parse (API route or cron)
    → brief.json
    → React page renders the JSON
    → same JSON powers the morning email (later)
```

## Data sources

- **NWS Forecast API** — 7-day weather (Wakefield, VA office / AKQ)
- **NOAA CO-OPS** — Tide predictions (Station 8639428, Sandbridge)
- **NWS Surf Zone Forecast** — Rip current, surf, UV, water temp (VAZ098)
- **NWS Alerts API** — Active beach/coastal alerts
