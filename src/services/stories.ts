import { getSupabaseClient, getSupabaseServiceClient } from "@/services/supabase";
import {
  mannenISkogenDescription,
  mannenISkogenId,
  mannenISkogenPages,
  mannenISkogenTitle,
} from "@/data/mannen-i-skogen";
import { storyTemplates, type StoryTemplate } from "@/data/storyLibrary";
import type { Page, Story } from "@/types/story";

interface PageRow {
  id: string;
  story_id: string;
  page_number: number;
  sentence_template: string;
  base_prompt_subject: string;
  base_prompt_setting: string;
  created_at: string;
}

interface StoryRow {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
}

export type StoryOrigin = "supabase" | "template";

export interface StoryWithPages {
  id: string;
  title: string;
  description: string | null;
  origin: StoryOrigin;
  pages: Page[];
}

function mapPage(r: PageRow): Page {
  return {
    id: r.id,
    storyId: r.story_id,
    pageNumber: r.page_number,
    sentenceTemplate: r.sentence_template,
    basePromptSubject: r.base_prompt_subject,
    basePromptSetting: r.base_prompt_setting,
    createdAt: r.created_at,
  };
}

function mapStory(r: StoryRow): Story {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    createdAt: r.created_at,
  };
}

function templateToStory(t: StoryTemplate): StoryWithPages {
  return {
    id: t.id,
    title: t.title,
    description: t.description,
    origin: "template",
    pages: t.pages,
  };
}

function mannenTemplate(): StoryTemplate {
  return {
    id: mannenISkogenId,
    title: mannenISkogenTitle,
    description: mannenISkogenDescription,
    pages: mannenISkogenPages.map((p) => ({
      id: p.id,
      storyId: p.storyId,
      pageNumber: p.pageNumber,
      sentenceTemplate: p.sentenceTemplate,
      basePromptSubject: p.basePromptSubject,
      basePromptSetting: p.basePromptSetting,
      createdAt: p.createdAt,
    })),
  };
}

function allTemplates(): StoryTemplate[] {
  return [mannenTemplate(), ...storyTemplates];
}

export async function fetchFirstStoryWithPages(): Promise<{ story: Story; pages: Page[] } | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  const { data: storyRows, error: storyErr } = await client
    .from("stories")
    .select("id, title, description, created_at")
    .order("created_at", { ascending: true })
    .limit(1);

  if (storyErr || !storyRows || storyRows.length === 0) {
    if (storyErr) console.error("stories fetch error:", storyErr.message);
    return null;
  }

  const story = mapStory(storyRows[0] as StoryRow);

  const { data: pageRows, error: pageErr } = await client
    .from("pages")
    .select(
      "id, story_id, page_number, sentence_template, base_prompt_subject, base_prompt_setting, created_at",
    )
    .eq("story_id", story.id)
    .order("page_number", { ascending: true });

  if (pageErr || !pageRows || pageRows.length === 0) {
    if (pageErr) console.error("pages fetch error:", pageErr.message);
    return null;
  }

  return { story, pages: (pageRows as PageRow[]).map(mapPage) };
}

export async function fetchAllStories(): Promise<StoryWithPages[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  const { data: storyRows, error: storyErr } = await client
    .from("stories")
    .select("id, title, description, created_at")
    .order("created_at", { ascending: true });

  if (storyErr || !storyRows || storyRows.length === 0) {
    if (storyErr) console.error("stories list error:", storyErr.message);
    return [];
  }

  const { data: pageRows, error: pageErr } = await client
    .from("pages")
    .select(
      "id, story_id, page_number, sentence_template, base_prompt_subject, base_prompt_setting, created_at",
    )
    .in(
      "story_id",
      (storyRows as StoryRow[]).map((s) => s.id),
    )
    .order("page_number", { ascending: true });

  if (pageErr) {
    console.error("pages bulk fetch error:", pageErr.message);
    return [];
  }

  const pagesByStory = new Map<string, Page[]>();
  for (const row of (pageRows ?? []) as PageRow[]) {
    const bucket = pagesByStory.get(row.story_id) ?? [];
    bucket.push(mapPage(row));
    pagesByStory.set(row.story_id, bucket);
  }

  return (storyRows as StoryRow[])
    .map<StoryWithPages>((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      origin: "supabase",
      pages: pagesByStory.get(s.id) ?? [],
    }))
    .filter((s) => s.pages.length > 0);
}

export async function listStoriesForPicker(): Promise<StoryWithPages[]> {
  const remote = await fetchAllStories();
  const remoteIds = new Set(remote.map((s) => s.id));
  const remoteTitles = new Set(remote.map((s) => s.title.trim().toLowerCase()));
  const templates = allTemplates().filter(
    (t) => !remoteIds.has(t.id) && !remoteTitles.has(t.title.trim().toLowerCase()),
  );
  return [...remote, ...templates.map(templateToStory)];
}

export function getTemplateById(id: string): StoryTemplate | null {
  return allTemplates().find((t) => t.id === id) ?? null;
}

export function getRandomTemplate(excludeId?: string): StoryTemplate {
  const pool = allTemplates().filter((t) => t.id !== excludeId);
  const list = pool.length > 0 ? pool : allTemplates();
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * Persists a template into Supabase when the service-role key is configured.
 * Returns the persisted story (with its newly-minted UUID). When Supabase is
 * not configured, returns the template as-is with its original id/page ids.
 */
export async function instantiateTemplate(template: StoryTemplate): Promise<StoryWithPages> {
  const service = getSupabaseServiceClient();
  if (!service) {
    return templateToStory(template);
  }

  const { data: inserted, error: storyErr } = await service
    .from("stories")
    .insert({ title: template.title, description: template.description })
    .select("id, title, description, created_at")
    .single();

  if (storyErr || !inserted) {
    console.error("story insert error:", storyErr?.message);
    return templateToStory(template);
  }

  const storyId = (inserted as StoryRow).id;
  const rows = template.pages.map((p) => ({
    story_id: storyId,
    page_number: p.pageNumber,
    sentence_template: p.sentenceTemplate,
    base_prompt_subject: p.basePromptSubject,
    base_prompt_setting: p.basePromptSetting,
  }));

  const { data: pageRows, error: pagesErr } = await service
    .from("pages")
    .insert(rows)
    .select(
      "id, story_id, page_number, sentence_template, base_prompt_subject, base_prompt_setting, created_at",
    );

  if (pagesErr || !pageRows) {
    console.error("pages insert error:", pagesErr?.message);
    return templateToStory(template);
  }

  const s = inserted as StoryRow;
  return {
    id: s.id,
    title: s.title,
    description: s.description,
    origin: "supabase",
    pages: (pageRows as PageRow[])
      .map(mapPage)
      .sort((a, b) => a.pageNumber - b.pageNumber),
  };
}
