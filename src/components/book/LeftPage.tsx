import { ADJECTIVE_SUGGESTIONS } from "@/lib/adjectives";
import { parseSentenceTemplate } from "@/lib/sentence";

export interface CoverContent {
  type: "cover";
  eyebrow: string;
  title: string;
  subtitle: string;
}

export interface StoryContent {
  type: "story";
  sentenceTemplate: string;
  adjective: string;
  onAdjectiveChange: (value: string) => void;
  pageNumber: number;
  totalPages: number;
}

export type LeftPageContent = CoverContent | StoryContent;

interface LeftPageProps {
  content: LeftPageContent;
}

export default function LeftPage({ content }: LeftPageProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-12 py-10 text-center">
      {content.type === "cover" ? <Cover content={content} /> : <Story content={content} />}
    </div>
  );
}

function Cover({ content }: { content: CoverContent }) {
  return (
    <>
      <div className="text-[12px] font-medium uppercase tracking-[0.32em] text-coral-600">
        — {content.eyebrow} —
      </div>
      <h1 className="mt-5 font-script text-7xl leading-[1.05] text-ink-800 md:text-[88px]">
        {content.title}
      </h1>
      <div className="mt-6 text-[12px] uppercase tracking-[0.32em] text-ink-600">
        {content.subtitle}
      </div>
    </>
  );
}

function Story({ content }: { content: StoryContent }) {
  const { prefix, suffix, hasBlank } = parseSentenceTemplate(content.sentenceTemplate);
  return (
    <>
      <div className="text-[11px] uppercase tracking-[0.32em] text-ink-500">
        Side {content.pageNumber} av {content.totalPages}
      </div>
      <p className="mt-7 font-serif text-[30px] italic leading-[1.55] text-ink-800 md:text-[34px]">
        <span>{prefix}</span>
        {hasBlank && (
          <input
            type="text"
            value={content.adjective}
            onChange={(e) => content.onAdjectiveChange(e.target.value)}
            placeholder="adjektiv"
            aria-label="Skriv inn et adjektiv"
            className="adjective-input"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        )}
        <span>{suffix}</span>
      </p>

      {hasBlank && (
        <div className="mt-7 flex max-w-[420px] flex-wrap items-center justify-center gap-2">
          {ADJECTIVE_SUGGESTIONS.map((word) => {
            const active = content.adjective === word;
            return (
              <button
                key={word}
                type="button"
                onClick={() => content.onAdjectiveChange(word)}
                className="rounded-full px-3 py-1 text-[13px] transition"
                style={{
                  background: active ? "#e88966" : "transparent",
                  color: active ? "#fbf8f0" : "#b55d3d",
                  border: active ? "1.5px solid #d0714e" : "1.5px solid rgba(208,113,78,0.45)",
                  fontStyle: "italic",
                  fontFamily: "var(--font-serif), Georgia, serif",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = "rgba(232,137,102,0.1)";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
              >
                {word}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
