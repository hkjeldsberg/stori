import { useEffect, useRef, useState } from "react";
import CoverIllustration from "@/components/book/CoverIllustration";
import Skeleton from "@/components/book/Skeleton";
import { IMAGE_LOAD_TIMEOUT_MS } from "@/components/book/constants";

export type ImageState =
  | { status: "idle" }
  | { status: "loading"; url?: string; prompt?: string }
  | { status: "ready"; url: string; prompt: string }
  | { status: "error"; message: string };

export interface CoverIllustrationContent {
  type: "cover";
}

export interface StoryIllustrationContent {
  type: "story";
  image: ImageState;
  hasAdjective: boolean;
  onImageLoadFailure: (message: string) => void;
}

export type RightPageContent = CoverIllustrationContent | StoryIllustrationContent;

interface RightPageProps {
  content: RightPageContent;
}

export default function RightPage({ content }: RightPageProps) {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-cream-50 ring-1 ring-ink-500/10">
        {content.type === "cover" ? <CoverIllustration /> : <StoryIllustration content={content} />}
      </div>
    </div>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full items-center justify-center px-6 text-center font-serif text-base italic text-ink-500">
      {children}
    </div>
  );
}

function StoryIllustration({ content }: { content: StoryIllustrationContent }) {
  const { image, hasAdjective, onImageLoadFailure } = content;

  if (image.status === "idle") {
    return (
      <Frame>
        {hasAdjective ? "Venter på et adjektiv…" : "Skriv et adjektiv til venstre for å tegne bildet."}
      </Frame>
    );
  }

  if (image.status === "error") {
    return (
      <Frame>
        <span>
          Bildetjenesten er ikke tilgjengelig.
          <br />
          <span className="text-xs not-italic text-ink-500/70">{image.message}</span>
        </span>
      </Frame>
    );
  }

  // loading or ready — render the <img> in both cases once we have a URL,
  // because the load event is what flips us from loading→ready. Keep a
  // shimmer overlay while loading.
  return <LoadingImage state={image} onImageLoadFailure={onImageLoadFailure} />;
}

function LoadingImage({
  state,
  onImageLoadFailure,
}: {
  state: Extract<ImageState, { status: "loading" } | { status: "ready" }>;
  onImageLoadFailure: (message: string) => void;
}) {
  const url = state.status === "ready" ? state.url : state.url;
  const isReady = state.status === "ready";
  const [failed, setFailed] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!url || isReady) return;
    timerRef.current = window.setTimeout(() => {
      if (!failed) {
        onImageLoadFailure("Tidsavbrudd — tjenesten svarer ikke.");
      }
    }, IMAGE_LOAD_TIMEOUT_MS);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [url, isReady, failed, onImageLoadFailure]);

  if (!url) {
    return <Skeleton />;
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={url}
        src={url}
        alt={state.status === "ready" ? state.prompt : "Illustrasjon"}
        onError={() => {
          setFailed(true);
          onImageLoadFailure("Bildet kunne ikke lastes (blokkert av nettverk?).");
        }}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: isReady ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      />
      {!isReady && (
        <div className="absolute inset-0">
          <Skeleton />
        </div>
      )}
    </>
  );
}
