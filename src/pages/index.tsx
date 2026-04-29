import type { GetServerSideProps } from "next";
import StoryBook from "@/components/StoryBook";
import {
  mannenISkogenId,
  mannenISkogenPages,
  mannenISkogenTitle,
} from "@/data/mannen-i-skogen";
import { fetchFirstStoryWithPages } from "@/services/stories";
import type { Page } from "@/types/story";

interface HomeProps {
  storyId: string;
  title: string;
  pages: Page[];
  source: "supabase" | "seed";
}

export default function Home({ storyId, title, pages, source }: HomeProps) {
  return (
    <main>
      <StoryBook initialStoryId={storyId} initialTitle={title} initialPages={pages} />
      {source === "seed" && (
        <p
          style={{
            position: "fixed",
            top: 12,
            right: 16,
            fontSize: 10,
            letterSpacing: "0.08em",
            color: "rgba(61,40,23,0.35)",
            fontFamily: "var(--font-serif), Georgia, serif",
            zIndex: 50,
            pointerEvents: "none",
          }}
        >
          innebygde eksempeldata · sett NEXT_PUBLIC_SUPABASE_URL for ekte data
        </p>
      )}
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    const remote = await fetchFirstStoryWithPages();
    if (remote) {
      return {
        props: {
          storyId: remote.story.id,
          title: remote.story.title,
          pages: remote.pages,
          source: "supabase",
        },
      };
    }
  } catch (err) {
    console.error("Supabase load failed, falling back to seed:", err);
  }

  return {
    props: {
      storyId: mannenISkogenId,
      title: mannenISkogenTitle,
      pages: mannenISkogenPages,
      source: "seed",
    },
  };
};
