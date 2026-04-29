import {
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import LeftPage, { type LeftPageContent, type StoryContent } from "@/components/book/LeftPage";
import RightPage, { type ImageState, type RightPageContent } from "@/components/book/RightPage";
import NavControls from "@/components/book/NavControls";
import Scenery from "@/components/book/Scenery";
import { CARD_H } from "@/components/book/constants";
import type { GenerateImageResponse } from "@/types/story";

export interface SpreadCover {
  kind: "cover";
  eyebrow: string;
  title: string;
  subtitle: string;
}

export interface SpreadStory {
  kind: "story";
  id: string;
  pageNumber: number;
  sentenceTemplate: string;
  basePromptSubject: string;
  basePromptSetting: string;
}

export type Spread = SpreadCover | SpreadStory;

interface BookProps {
  spreads: Spread[];
  storageKey?: string;
  /** Fires when the active spread changes (after anim commit). */
  onSpreadChange?: (idx: number) => void;
  /** Rendered above the card — e.g. story picker / new-story pills. */
  toolbar?: ReactNode;
}

const DEBOUNCE_MS = 400;
const FLIP_MS = 650;

export default function Book({ spreads, storageKey = "stari_spread", onSpreadChange, toolbar }: BookProps) {
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [animating, setAnimating] = useState(false);
  const [adjectives, setAdjectives] = useState<Record<string, string>>({});
  const [images, setImages] = useState<Record<string, ImageState>>({});
  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(false);

  // Restore spread position from localStorage.
  useLayoutEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw !== null) {
        const parsed = Number.parseInt(raw, 10);
        if (Number.isFinite(parsed) && parsed >= 0 && parsed < spreads.length) {
          setIdx(parsed);
        } else {
          setIdx(0);
        }
      } else {
        setIdx(0);
      }
    } catch {
      setIdx(0);
    }
    // re-run whenever the identity of the spreads array changes (story swap)
    // storageKey is part of deps so a caller can force reset via new key.
  }, [storageKey, spreads]);

  useEffect(() => {
    if (mountedRef.current) onSpreadChange?.(idx);
    mountedRef.current = true;
  }, [idx, onSpreadChange]);

  const persist = useCallback(
    (i: number) => {
      try {
        window.localStorage.setItem(storageKey, String(i));
      } catch {
        /* ignore */
      }
    },
    [storageKey],
  );

  const go = useCallback(
    (dir: "next" | "prev") => {
      if (animating) return;
      const ni = dir === "next" ? idx + 1 : idx - 1;
      if (ni < 0 || ni >= spreads.length) return;
      setDirection(dir === "next" ? 1 : -1);
      setAnimating(true);
      setIdx(ni);
      persist(ni);
      window.setTimeout(() => setAnimating(false), FLIP_MS);
    },
    [animating, idx, spreads.length, persist],
  );

  const jump = useCallback(
    (target: number) => {
      if (animating || target === idx || target < 0 || target >= spreads.length) return;
      setDirection(target > idx ? 1 : -1);
      setAnimating(true);
      setIdx(target);
      persist(target);
      window.setTimeout(() => setAnimating(false), FLIP_MS);
    },
    [animating, idx, spreads.length, persist],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go("next");
      if (e.key === "ArrowLeft") go("prev");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const currentSpread = spreads[idx];
  const activeSpread: SpreadStory | null =
    currentSpread?.kind === "story" ? currentSpread : null;
  const activeAdjective = activeSpread ? adjectives[activeSpread.id] ?? "" : "";

  useEffect(() => {
    if (!activeSpread) return;
    const trimmed = activeAdjective.trim();
    const id = activeSpread.id;

    if (!trimmed) {
      abortRef.current?.abort();
      setImages((p) => ({ ...p, [id]: { status: "idle" } }));
      return;
    }

    const timer = window.setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setImages((p) => ({ ...p, [id]: { status: "loading" } }));

      fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: activeSpread.basePromptSubject,
          setting: activeSpread.basePromptSetting,
          adjective: trimmed,
        }),
        signal: controller.signal,
      })
        .then(async (res) => {
          if (!res.ok) {
            const body = (await res.json().catch(() => ({}))) as { error?: string };
            throw new Error(body.error ?? `HTTP ${res.status}`);
          }
          return (await res.json()) as GenerateImageResponse;
        })
        .then(({ imageUrl, prompt }) => {
          setImages((p) => ({ ...p, [id]: { status: "ready", url: imageUrl, prompt } }));
        })
        .catch((err: unknown) => {
          if (err instanceof DOMException && err.name === "AbortError") return;
          const message = err instanceof Error ? err.message : "Ukjent feil";
          setImages((p) => ({ ...p, [id]: { status: "error", message } }));
        });
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [activeSpread, activeAdjective]);

  const handleImageLoadFailure = useCallback((id: string, message: string) => {
    setImages((p) => ({ ...p, [id]: { status: "error", message } }));
  }, []);

  const storyCount = useMemo(
    () => spreads.filter((s) => s.kind === "story").length,
    [spreads],
  );

  const buildLeft = useCallback(
    (spread: Spread): LeftPageContent => {
      if (spread.kind === "cover") {
        return {
          type: "cover",
          eyebrow: spread.eyebrow,
          title: spread.title,
          subtitle: spread.subtitle,
        };
      }
      const onAdjectiveChange: StoryContent["onAdjectiveChange"] = (value) => {
        setAdjectives((p) => ({ ...p, [spread.id]: value }));
      };
      return {
        type: "story",
        sentenceTemplate: spread.sentenceTemplate,
        adjective: adjectives[spread.id] ?? "",
        onAdjectiveChange,
        pageNumber: spread.pageNumber,
        totalPages: storyCount,
      };
    },
    [adjectives, storyCount],
  );

  const buildRight = useCallback(
    (spread: Spread): RightPageContent => {
      if (spread.kind === "cover") return { type: "cover" };
      return {
        type: "story",
        image: images[spread.id] ?? { status: "idle" },
        hasAdjective: (adjectives[spread.id] ?? "").trim().length > 0,
        onImageLoadFailure: (msg) => handleImageLoadFailure(spread.id, msg),
      };
    },
    [adjectives, images, handleImageLoadFailure],
  );

  const label = useMemo(() => {
    const spread = spreads[idx];
    if (!spread) return "";
    if (spread.kind === "cover") return "Omslag";
    return `Side ${spread.pageNumber} av ${storyCount}`;
  }, [idx, spreads, storyCount]);

  if (!currentSpread) return null;
  const left = buildLeft(currentSpread);
  const right = buildRight(currentSpread);
  const isCover = currentSpread.kind === "cover";

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Scenery />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
          zIndex: 1,
          width: "100%",
        }}
      >
        {toolbar && <div style={{ zIndex: 2 }}>{toolbar}</div>}

        <div
          style={{
            width: "min(960px, calc(100vw - 32px))",
            height: CARD_H,
            position: "relative",
            perspective: "2400px",
          }}
        >
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={idx}
              custom={direction}
              initial={{
                rotateY: direction === 1 ? 42 : -42,
                x: direction * 90,
                opacity: 0,
                scale: 0.92,
              }}
              animate={{ rotateY: 0, x: 0, opacity: 1, scale: 1 }}
              exit={{
                rotateY: direction === 1 ? -42 : 42,
                x: -direction * 90,
                opacity: 0,
                scale: 0.92,
              }}
              transition={{ duration: FLIP_MS / 1000, ease: [0.32, 0.72, 0.28, 1] }}
              className="shadow-card"
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 28,
                background: "#fbf8f0",
                overflow: "hidden",
                display: "grid",
                gridTemplateColumns: isCover ? "1fr" : "1fr 1fr",
                transformStyle: "preserve-3d",
                transformOrigin: direction === 1 ? "left center" : "right center",
              }}
            >
              <div style={{ position: "relative" }}>
                <LeftPage content={left} />
              </div>
              {!isCover && (
                <div style={{ position: "relative" }}>
                  <RightPage content={right} />
                </div>
              )}
              {isCover && (
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    right: 32,
                    bottom: 32,
                    width: 180,
                    height: 180,
                  }}
                >
                  <RightPage content={right} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <NavControls
          spreadCount={spreads.length}
          spreadIdx={idx}
          animating={animating}
          label={label}
          onPrev={() => go("prev")}
          onNext={() => go("next")}
          onJump={jump}
        />

        <div className="text-[10px] uppercase tracking-[0.3em] text-ink-500/60">
          ← → piltaster virker også
        </div>
      </div>
    </div>
  );
}
