-- Ståri — Supabase schema
-- Source of truth: PRD.md §5. Paste this into the Supabase SQL editor (or run via psql).
-- Safe to run multiple times.
--
-- After running, expose the schema in Supabase dashboard:
--   Project Settings → API → Exposed schemas → add "stori".

create extension if not exists "pgcrypto";

create schema if not exists stori;

-- ────────────────────────────────────────────────────────────────────
-- Tables
-- ────────────────────────────────────────────────────────────────────

-- stori.stories: top-level storybook metadata
create table if not exists stori.stories (
    id          uuid primary key default gen_random_uuid(),
    title       text not null,
    description text,
    created_at  timestamptz not null default now()
);

-- stori.pages: ordered pages belonging to a story
create table if not exists stori.pages (
    id                   uuid primary key default gen_random_uuid(),
    story_id             uuid not null references stori.stories(id) on delete cascade,
    page_number          integer not null,
    sentence_template    text not null,
    base_prompt_subject  text not null,
    base_prompt_setting  text not null,
    created_at           timestamptz not null default now(),
    constraint pages_page_number_positive check (page_number > 0),
    constraint pages_story_page_unique    unique (story_id, page_number)
);

create index if not exists pages_story_id_idx on stori.pages (story_id);

-- ────────────────────────────────────────────────────────────────────
-- Grants
-- Without these, the anon / authenticated roles that PostgREST uses
-- hit "permission denied for schema stori" even when the schema is
-- exposed in the dashboard.
-- ────────────────────────────────────────────────────────────────────

grant usage on schema stori to anon, authenticated, service_role;

-- Read-only for anon + authenticated; full access for service_role.
grant select on all tables in schema stori to anon, authenticated;
grant all    on all tables in schema stori to service_role;

-- Sequences (for serial/identity columns — none today, but future-proof).
grant usage, select on all sequences in schema stori to anon, authenticated;
grant all            on all sequences in schema stori to service_role;

-- Future tables/sequences in this schema inherit the same grants.
alter default privileges in schema stori
    grant select on tables to anon, authenticated;
alter default privileges in schema stori
    grant all    on tables to service_role;
alter default privileges in schema stori
    grant usage, select on sequences to anon, authenticated;
alter default privileges in schema stori
    grant all           on sequences to service_role;

-- ────────────────────────────────────────────────────────────────────
-- Row-Level Security
-- Enable RLS on every table and attach a public-read policy.
-- Write paths go through the service_role key (server-side only),
-- which bypasses RLS.
-- ────────────────────────────────────────────────────────────────────

alter table stori.stories enable row level security;
alter table stori.pages   enable row level security;

drop policy if exists "stories are public"   on stori.stories;
drop policy if exists "pages are public"     on stori.pages;

create policy "stories are public"
    on stori.stories
    for select
    to anon, authenticated
    using (true);

create policy "pages are public"
    on stori.pages
    for select
    to anon, authenticated
    using (true);

-- ────────────────────────────────────────────────────────────────────
-- Seed: "Mannen i Skogen" — 6 pages.
-- Additional story templates live in src/data/storyLibrary.ts and are
-- instantiated into Supabase on demand when the user picks one or hits
-- "Ny fortelling". They are not seeded here so each user's library grows
-- organically.
-- ────────────────────────────────────────────────────────────────────

insert into stori.stories (id, title, description)
values ('11111111-1111-1111-1111-111111111111',
        'Mannen i Skogen',
        'En liten fortelling om en mann som bor i skogen.')
on conflict (id) do nothing;

insert into stori.pages (story_id, page_number, sentence_template, base_prompt_subject, base_prompt_setting)
values
    ('11111111-1111-1111-1111-111111111111', 1,
     'Det var en gang en _____ mann som bodde i skogen.',
     'A man', 'A forest'),
    ('11111111-1111-1111-1111-111111111111', 2,
     'En morgen la han ut på en _____ reise.',
     'A man walking', 'A winding forest road'),
    ('11111111-1111-1111-1111-111111111111', 3,
     'Underveis møtte han en _____ ugle i et tre.',
     'An owl', 'A tall oak tree'),
    ('11111111-1111-1111-1111-111111111111', 4,
     'Uglen viste ham en _____ sti gjennom skogen.',
     'A narrow path', 'A mossy forest floor'),
    ('11111111-1111-1111-1111-111111111111', 5,
     'Ved enden av stien fant han en _____ hytte.',
     'A wooden cabin', 'A forest clearing'),
    ('11111111-1111-1111-1111-111111111111', 6,
     'Inne satte han seg ned med en _____ kopp te.',
     'A cup of tea', 'A cozy fireplace')
on conflict (story_id, page_number) do update
set sentence_template    = excluded.sentence_template,
    base_prompt_subject  = excluded.base_prompt_subject,
    base_prompt_setting  = excluded.base_prompt_setting;
