# Ståri

Interaktiv norsk billedbok som genererer enkle, ikoniske illustrasjoner nesten i sanntid basert på adjektiver brukeren skriver inn.

See `PRD.md` for the full product spec and `docs/plans/` for implementation plans.

## Stack

- Next.js 15 (Pages Router) + TypeScript + Tailwind CSS
- Supabase for content (`stori` schema — see `supabase/schema.sql`)
- Framer Motion for page-turn transitions
- Typography via `next/font/google`: **Satisfy** (script) + **Cormorant Garamond** (serif)
- Locally-generated SVG illustration provider (no external API required)

## Local development

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Environment variables

Create `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
IMAGE_PROVIDER=svg-local
```

All three are optional — the app renders without any of them.

### `IMAGE_PROVIDER`

Controls which service renders the illustration on the right page. Defaults to `svg-local`.

| Value          | What it does                                                                                   | Works offline / behind corp firewall? |
|---             |---                                                                                             |---                                    |
| `svg-local`    | Renders a flat pastel SVG scene as a data URL (default). Deterministic, no network calls.      | ✅ yes                                |
| `placeholder`  | placehold.co static CDN. Shows the adjective as text on a coral tile.                          | ⚠️ often blocked                       |
| `pollinations` | Real AI-generated image via image.pollinations.ai. Slow (5–15s) and blocked on many corpnets.  | ⚠️ often blocked                       |

## Database

Paste the contents of `supabase/schema.sql` into the Supabase SQL editor to create the `stori` schema, grant the `anon`/`authenticated` roles the right permissions, enable RLS with a public-read policy, and seed the "Mannen i Skogen" story. It's idempotent — safe to re-run.

After running the SQL, expose the schema in the Supabase dashboard:
**Project Settings → API → Exposed schemas → add `stori`.**

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build + type-check
- `npm test` — run the unit test suite via `node --test`
- `npm run type-check` — TypeScript check only
