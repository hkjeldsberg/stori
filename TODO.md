## TODO
- [x] Add some suggestions for adjectives (5-10)
- [x] While loading the image add a skeleton to illustrate the loading
- [x] Add a Storybook as the favicon
- [x] Add option to generate new story. The new story should be generated and stored.
- [x] Add option to select another story. Only pre-existing stories.
- [x] In general stories should be 5-7 pages long (5-7 sentences)
- [x] Bump the font size to make it easier to read.
- [x] Add a page-flip animation when flipping to next page

---

### Notes on delivery

- **Adjective chips** — 8 Norwegian suggestions (modig, snill, liten, stor, rask, morsom, lur, glad) rendered as coral pills under the input (`src/lib/adjectives.ts`, `src/components/book/LeftPage.tsx`).
- **Skeleton loader** — flat pastel scene with a sweeping CSS highlight bar replaces the old "Tegner…" text while images load (`src/components/book/Skeleton.tsx`).
- **Favicon** — `public/favicon.svg`, `apple-touch-icon.svg`, `icon.svg`: flat pastel open book with coral spine and mint bookmark, wired into `_app.tsx`.
- **New story** — `POST /api/stories/generate`. When `SUPABASE_SERVICE_ROLE_KEY` is configured, the story is persisted; otherwise it's returned in-memory from the template library.
- **Pick another story** — `GET /api/stories` returns every Supabase story + every unused template (de-duped by title). `StoryPicker.tsx` dropdown in the header lets you switch.
- **5-7 page stories** — Mannen i Skogen expanded to 6 pages; 5 new Norwegian templates (Prinsessen i Slottet, Bjørnen på Fjellet, Havfruen i Havet, Trollet under Broen, Jenta og Stjernene), all 6 pages (`src/data/storyLibrary.ts`).
- **Bigger fonts** — story body 30–34 px italic (was 26–28 px); cover title 7xl–[88px] (was 6xl–7xl).
- **Page-flip animation** — replaced horizontal slide with a 3D rotateY + translateX + scale flip, 650 ms cubic-bezier, `perspective: 2400px` on the card wrapper (`src/components/book/Book.tsx`).
- **One-time action:** re-run `supabase/schema.sql` to upgrade the seeded "Mannen i Skogen" from 2 → 6 pages (`ON CONFLICT DO UPDATE` preserves other data).
