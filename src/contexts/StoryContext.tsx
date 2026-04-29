import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import type { Page, Story } from "@/types/story";

interface StoryContextValue {
  story: Story | null;
  pages: Page[];
  currentPageIndex: number;
  setStory: (s: Story | null) => void;
  setPages: (p: Page[]) => void;
  goToNextPage: () => void;
}

const StoryContext = createContext<StoryContextValue | undefined>(undefined);

export function StoryProvider({ children }: { children: ReactNode }) {
  const [story, setStory] = useState<Story | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const value = useMemo<StoryContextValue>(
    () => ({
      story,
      pages,
      currentPageIndex,
      setStory,
      setPages,
      goToNextPage: () =>
        setCurrentPageIndex((i) => Math.min(i + 1, Math.max(pages.length - 1, 0))),
    }),
    [story, pages, currentPageIndex],
  );

  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>;
}

export function useStory(): StoryContextValue {
  const ctx = useContext(StoryContext);
  if (!ctx) throw new Error("useStory must be used within a StoryProvider");
  return ctx;
}
