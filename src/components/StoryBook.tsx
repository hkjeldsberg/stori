import { useCallback, useMemo, useState } from "react";
import Book, { type Spread } from "@/components/book/Book";
import StoryPicker from "@/components/book/StoryPicker";
import type { Page } from "@/types/story";
import type { StoryWithPages } from "@/services/stories";

interface StoryBookProps {
  initialStoryId: string;
  initialTitle: string;
  initialPages: Page[];
}

export default function StoryBook({ initialStoryId, initialTitle, initialPages }: StoryBookProps) {
  const [currentStory, setCurrentStory] = useState<{
    id: string;
    title: string;
    pages: Page[];
  }>({ id: initialStoryId, title: initialTitle, pages: initialPages });
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const spreads = useMemo<Spread[]>(() => {
    const ordered = [...currentStory.pages].sort((a, b) => a.pageNumber - b.pageNumber);
    return [
      {
        kind: "cover",
        eyebrow: "En fortelling du dikter selv",
        title: currentStory.title,
        subtitle: "God fornøyelse",
      },
      ...ordered.map<Spread>((p) => ({
        kind: "story",
        id: p.id,
        pageNumber: p.pageNumber,
        sentenceTemplate: p.sentenceTemplate,
        basePromptSubject: p.basePromptSubject,
        basePromptSetting: p.basePromptSetting,
      })),
    ];
  }, [currentStory]);

  const applyStory = useCallback((story: StoryWithPages | { id: string; title: string; pages: Page[] }) => {
    setCurrentStory({ id: story.id, title: story.title, pages: story.pages });
    try {
      window.localStorage.setItem("stari_active_story", story.id);
    } catch {
      /* ignore */
    }
  }, []);

  const handleSelect = useCallback(
    async (story: StoryWithPages) => {
      if (story.origin === "supabase") {
        applyStory(story);
        return;
      }
      // Template — try to instantiate into Supabase so it survives reloads.
      setBusy(true);
      setToast(null);
      try {
        const res = await fetch("/api/stories/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ templateId: story.id }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { story: created } = (await res.json()) as { story: StoryWithPages };
        applyStory(created);
      } catch (err) {
        console.error("select story failed:", err);
        // Fallback: show the template contents directly.
        applyStory(story);
        setToast("Fortellingen ble ikke lagret, men du kan lese den nå.");
      } finally {
        setBusy(false);
      }
    },
    [applyStory],
  );

  const handleGenerateRandom = useCallback(async () => {
    setBusy(true);
    setToast(null);
    try {
      const res = await fetch("/api/stories/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ excludeId: currentStory.id }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { story } = (await res.json()) as { story: StoryWithPages };
      applyStory(story);
      setToast(`Fant en ny fortelling: ${story.title}`);
    } catch (err) {
      console.error("generate failed:", err);
      setToast("Kunne ikke lage ny fortelling.");
    } finally {
      setBusy(false);
      window.setTimeout(() => setToast(null), 3200);
    }
  }, [applyStory, currentStory.id]);

  return (
    <>
      <Book
        spreads={spreads}
        storageKey={`stari_spread:${currentStory.id}`}
        toolbar={
          <div className="flex flex-col items-center gap-2">
            <StoryPicker
              activeStoryId={currentStory.id}
              onSelect={handleSelect}
              onGenerateRandom={handleGenerateRandom}
              busy={busy}
            />
            {toast && (
              <div className="text-[10px] uppercase tracking-[0.3em] text-ink-500/80">
                {toast}
              </div>
            )}
          </div>
        }
      />
    </>
  );
}
