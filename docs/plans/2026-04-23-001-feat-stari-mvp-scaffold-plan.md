---
title: "feat: Scaffold Ståri MVP (Next.js + Supabase + image generation)"
type: feat
status: active
date: 2026-04-23
origin: PRD.md, PROMPTS.md
---

# feat: Scaffold Ståri MVP (Next.js + Supabase + image generation)

## Overview

Greenfield build of **Ståri**, an interactive Norwegian storybook that renders black-and-white line-art illustrations in near real-time based on a user-supplied adjective. This plan covers the four scaffolding prompts in `PROMPTS.md`, glued together into a runnable Next.js app.

## Problem Frame

The repo currently contains only `PRD.md` and `PROMPTS.md`. There is no code, no package manifest, no database schema. To ship the MVP, we need:
- a Next.js (Pages Router) TypeScript project with Tailwind,
- a Supabase SQL schema file for the `stori` schema and its two tables,
- a reusable `StoryPage` component that captures the user's adjective and displays the generated image,
- a `/api/generate-image` API route that constructs the speed-optimized prompt and returns an image URL (mocked for now).

## Requirements Trace

- R1. Generate SQL for `stori.stories` and `stori.pages` with all constraints from PRD §5.
- R2. Next.js + TypeScript + Tailwind project with `src/` layout: `components/`, `services/`, `contexts/`, `pages/`.
- R3. `StoryPage.tsx` accepts `sentence_template`, `base_prompt_subject`, `base_prompt_setting` props, renders the sentence with inline adjective input, image placeholder, and disabled "Neste side" button.
- R4. `src/pages/api/generate-image.ts` accepts `{ subject, setting, adjective }`, constructs the PRD-specified speed-optimized prompt, leaves a placeholder for the real image API, and returns a mock image URL.
- R5. All user-facing copy in Norwegian Bokmål.

## Scope Boundaries

- No real image generation integration — only the prompt-construction + mock URL contract.
- No Framer Motion / Three.js / page-turn animation yet.
- No auth, no RLS policies, no Supabase data fetching wiring.
- No test framework setup. The MVP is a scaffold; verification is manual (dev server + visual check).

### Deferred to Separate Tasks

- Real image model integration (Imagen, Gemini, etc.): follow-up task.
- Framer Motion page-turn animation: follow-up task.
- Supabase client wiring + seed data loading: follow-up task (schema file is created now; app-side consumption later).

## Context & Research

### Relevant Code and Patterns

None — greenfield. Conventions to follow come from Next.js + Tailwind defaults and the PRD.

### Institutional Learnings

- `create-next-app` is interactive by default; pass flags (`--ts --tailwind --src-dir --no-app --no-eslint --import-alias "@/*" --use-npm --yes`) to scaffold non-interactively.
- On Windows, the repo path contains a non-ASCII character (`ståri`). Keep all file paths repo-relative; avoid tools that mishandle unicode paths (we rely on node/npm which do handle it).

## Key Technical Decisions

- **Pages Router, not App Router.** PROMPTS.md explicitly writes `src/pages/api/generate-image.ts`. Stick to Pages Router for minimum friction.
- **`src/` layout.** Matches PROMPTS.md §2 which specifies folders inside `/src`.
- **Mock image URL.** The API route returns a deterministic placeholder (e.g. `https://placehold.co/...`) and a TODO comment where the real model call belongs.
- **Tailwind for all styling.** No separate CSS files beyond globals.
- **Client-side state only for now.** A React context stub is created for future state sharing but the MVP keeps adjective state local to `StoryPage`.
- **SQL lives in `supabase/schema.sql`.** Checked in as plain SQL, not a migration tool — we have no Supabase CLI in scope.

## Open Questions

### Resolved During Planning

- Router choice: Pages Router (per PROMPTS.md).
- Directory layout: `src/` with `components/`, `services/`, `contexts/`, `pages/`, `pages/api/`.
- Adjective UX: single inline input (no suggestion chips yet) — keeps MVP tight. Chips are an easy follow-up.

### Deferred to Implementation

- Exact placeholder image URL — pick at implementation time.
- Whether the Norwegian "Neste side" button should still render when there's no next page — currently always disabled in MVP.

## Output Structure

    C:/git/ståri/
      PRD.md
      PROMPTS.md
      package.json
      next.config.mjs
      tsconfig.json
      tailwind.config.ts
      postcss.config.mjs
      README.md
      .gitignore
      supabase/
        schema.sql
      src/
        pages/
          _app.tsx
          index.tsx
          api/
            generate-image.ts
        components/
          StoryPage.tsx
        services/
          supabase.ts
        contexts/
          StoryContext.tsx
        styles/
          globals.css
        types/
          story.ts
      docs/
        plans/
          2026-04-23-001-feat-stari-mvp-scaffold-plan.md

## Implementation Units

- [ ] **Unit 1: Initialize Next.js project**

**Goal:** Scaffold a Next.js + TypeScript + Tailwind project with the `src/` Pages Router layout.

**Requirements:** R2

**Dependencies:** None

**Files:**
- Create: `package.json`, `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `.gitignore`, `src/pages/_app.tsx`, `src/pages/index.tsx`, `src/styles/globals.css`

**Approach:**
- Run `npx create-next-app@latest . --typescript --tailwind --src-dir --no-app --no-eslint --import-alias "@/*" --use-npm --yes` in `C:/git/ståri/`.
- Verify dev server boots on `http://localhost:3000`.

**Verification:**
- `package.json` exists with `next`, `react`, `typescript`, `tailwindcss` in dependencies.
- `src/pages/index.tsx` renders the default Next.js landing page.

- [ ] **Unit 2: Supabase SQL schema**

**Goal:** Produce a runnable SQL file that creates the `stori` schema plus `stories` and `pages` tables, matching PRD §5 exactly.

**Requirements:** R1

**Dependencies:** None (can run in parallel with Unit 1)

**Files:**
- Create: `supabase/schema.sql`

**Approach:**
- `CREATE SCHEMA IF NOT EXISTS stori;`
- `stori.stories`: `id uuid PK default gen_random_uuid()`, `title text not null`, `description text`, `created_at timestamptz default now()`.
- `stori.pages`: `id uuid PK default gen_random_uuid()`, `story_id uuid NOT NULL REFERENCES stori.stories(id) ON DELETE CASCADE`, `page_number integer not null`, `sentence_template text not null`, `base_prompt_subject text not null`, `base_prompt_setting text not null`, `created_at timestamptz default now()`.
- Add `UNIQUE(story_id, page_number)` to prevent duplicate ordering.
- Enable the `pgcrypto` extension (for `gen_random_uuid()`) if not already present.

**Verification:**
- File is a single SQL script that can be pasted into the Supabase SQL editor without modification.

- [ ] **Unit 3: Type definitions and Supabase service stub**

**Goal:** Give the rest of the app typed handles on the DB rows and a clean seam for future Supabase wiring.

**Requirements:** R2

**Dependencies:** Unit 1

**Files:**
- Create: `src/types/story.ts`, `src/services/supabase.ts`, `src/contexts/StoryContext.tsx`

**Approach:**
- `story.ts` exports `Story` and `Page` TypeScript interfaces mirroring the SQL columns (camelCase on the TS side for ergonomics; map when we actually hit Supabase).
- `supabase.ts` exports a lazily-initialized client using `process.env.NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`, but gracefully returns `null` when env vars are missing so the scaffold runs without Supabase configured.
- `StoryContext.tsx` is a thin provider + hook stub. Real state wiring deferred.

**Verification:**
- `tsc --noEmit` (run via `npm run build`) passes.

- [ ] **Unit 4: StoryPage component**

**Goal:** Render the PRD's book-page layout: sentence with inline adjective input on one side, image placeholder on the other, disabled "Neste side" button at the bottom.

**Requirements:** R3, R5

**Dependencies:** Unit 1

**Files:**
- Create: `src/components/StoryPage.tsx`
- Test: none (MVP — verified visually)

**Approach:**
- Functional component, props = `{ sentence_template, base_prompt_subject, base_prompt_setting }`.
- Split `sentence_template` on the `_____` token; render the prefix, the `<input>`, then the suffix inline. Fall back gracefully if no blank is present.
- Local `useState<string>('')` for the adjective.
- Right pane: `<div>` placeholder sized `aspect-square`, centered "Bilde kommer her…" text.
- "Neste side" button: `disabled` for MVP.
- Norwegian placeholder: `placeholder="Skriv inn et adjektiv"`.
- Tailwind two-column layout, responsive (stacked on mobile).

**Test scenarios:**
- Happy path: passing a `sentence_template` with one `_____` placeholder renders prefix + input + suffix in order.
- Edge case: `sentence_template` with no `_____` renders the whole sentence with no input.
- Happy path: typing into the input updates the local state (visible in DOM value).
- Integration: component mounts inside `src/pages/index.tsx` and renders without console errors.

**Verification:**
- `npm run dev`, load `/`, see the Norwegian sentence with an input and the image placeholder side by side.

- [ ] **Unit 5: Image generation API route**

**Goal:** Produce the PRD-specified speed-optimized prompt server-side and return a mock image URL.

**Requirements:** R4

**Dependencies:** Unit 1

**Files:**
- Create: `src/pages/api/generate-image.ts`

**Approach:**
- Standard Next.js Pages API handler, `POST` only (`405` otherwise).
- Body shape: `{ subject: string; setting: string; adjective: string }`.
- Validate all three are non-empty strings; return `400` with a JSON error otherwise.
- Build `prompt = \`fast generation, simple black and white line art, icon style. Subject: A ${adjective} ${subject}. Setting: ${setting}.\``.
- Leave a `// TODO: call real image model here (Imagen/Gemini/etc.)` comment.
- Return `{ imageUrl: string, prompt: string }` with `imageUrl` pointing at a public placeholder service, so downstream UI has something to render.

**Test scenarios:**
- Happy path: `POST` with valid body returns 200 and an `imageUrl` that is a valid URL + the constructed `prompt` field.
- Happy path: prompt string matches the PRD template exactly for a known input.
- Edge case: non-POST method returns 405.
- Error path: missing any of `subject`/`setting`/`adjective` returns 400.

**Verification:**
- `curl -X POST http://localhost:3000/api/generate-image -H "Content-Type: application/json" -d '{"subject":"A man","setting":"A forest","adjective":"brave"}'` returns the expected JSON.

- [ ] **Unit 6: Wire `StoryPage` into root route with sample page data**

**Goal:** Make the scaffold immediately demoable without any external services.

**Requirements:** R3, R5

**Dependencies:** Units 4, 5

**Files:**
- Modify: `src/pages/index.tsx`

**Approach:**
- Replace the Next.js boilerplate with a single `<StoryPage />` rendered against the PRD's "Mannen i Skogen" page 1 data:
  - `sentence_template`: `Det var en gang en _____ mann som bodde i skogen.`
  - `base_prompt_subject`: `A man`
  - `base_prompt_setting`: `A forest`
- Keep the existing `_app.tsx` + `globals.css` (Tailwind directives).
- Page title/heading in Norwegian: `Ståri — Mannen i Skogen`.

**Test scenarios:**
- Happy path: `/` renders without errors and shows the Norwegian sentence + input + image placeholder.

**Verification:**
- `npm run build` succeeds; `npm run dev` serves a working page at `/`.

## System-Wide Impact

- **Interaction graph:** None — greenfield scaffold. Future state comes in via `StoryContext`.
- **API surface parity:** The `/api/generate-image` contract (`{ subject, setting, adjective } -> { imageUrl, prompt }`) is the integration seam for future real-model work. Keep it stable.
- **Unchanged invariants:** N/A.

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Non-ASCII repo path (`ståri`) breaks a tool on Windows. | Stick to node/npm which handle it. If `create-next-app` misbehaves, fall back to manual scaffold via hand-written `package.json` + install. |
| `create-next-app` version drift changes default flags/output. | Pin via `@latest` but verify the generated tree before Unit 3 depends on it. |
| Supabase `gen_random_uuid()` requires `pgcrypto`. | Enable the extension explicitly in the schema file. |

## Sources & References

- Origin documents: `PRD.md`, `PROMPTS.md`
- Next.js Pages Router docs (for `pages/api` handler shape)
