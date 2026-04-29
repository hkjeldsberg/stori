import { useEffect, useRef, useState } from "react";
import type { StoryWithPages } from "@/services/stories";

interface StoryPickerProps {
  activeStoryId: string;
  onSelect: (story: StoryWithPages) => void;
  onGenerateRandom: () => void;
  busy: boolean;
}

export default function StoryPicker({
  activeStoryId,
  onSelect,
  onGenerateRandom,
  busy,
}: StoryPickerProps) {
  const [open, setOpen] = useState(false);
  const [stories, setStories] = useState<StoryWithPages[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open || stories !== null) return;
    setLoading(true);
    setError(null);
    fetch("/api/stories")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as { stories: StoryWithPages[] };
      })
      .then(({ stories: list }) => setStories(list))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Ukjent feil");
      })
      .finally(() => setLoading(false));
  }, [open, stories]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div className="flex items-center gap-3">
      <div ref={dropdownRef} className="relative">
        <ToolbarButton
          variant="ghost"
          onClick={() => setOpen((v) => !v)}
          disabled={busy}
          ariaLabel="Bytt fortelling"
        >
          Bytt fortelling
          <span className="ml-1 text-[10px]">▾</span>
        </ToolbarButton>

        {open && (
          <div
            role="listbox"
            className="shadow-card"
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              minWidth: 280,
              maxHeight: 360,
              overflowY: "auto",
              background: "#fbf8f0",
              border: "1px solid rgba(61,40,23,0.12)",
              borderRadius: 16,
              padding: 8,
              zIndex: 20,
            }}
          >
            {loading && (
              <div className="px-3 py-4 text-center font-serif text-sm italic text-ink-500">
                Henter fortellinger…
              </div>
            )}
            {error && (
              <div className="px-3 py-4 text-center font-serif text-sm italic text-coral-600">
                {error}
              </div>
            )}
            {stories && stories.length === 0 && !loading && (
              <div className="px-3 py-4 text-center font-serif text-sm italic text-ink-500">
                Ingen fortellinger å vise.
              </div>
            )}
            {stories?.map((story) => {
              const active = story.id === activeStoryId;
              return (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => {
                    onSelect(story);
                    setOpen(false);
                  }}
                  className="w-full rounded-xl text-left transition"
                  style={{
                    padding: "10px 14px",
                    background: active ? "rgba(232,137,102,0.14)" : "transparent",
                    color: "#3d2817",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.background = "rgba(61,40,23,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div className="font-serif text-[15px]">{story.title}</div>
                  <div className="mt-0.5 text-[11px] text-ink-500">
                    {story.pages.length} sider
                    {story.origin === "template" && " · mal"}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <ToolbarButton
        variant="solid"
        onClick={onGenerateRandom}
        disabled={busy}
        ariaLabel="Ny fortelling"
      >
        {busy ? "Lager…" : "Ny fortelling"}
      </ToolbarButton>
    </div>
  );
}

interface ToolbarButtonProps {
  variant: "solid" | "ghost";
  disabled?: boolean;
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}

function ToolbarButton({ variant, disabled, onClick, ariaLabel, children }: ToolbarButtonProps) {
  const solid = variant === "solid";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="pill inline-flex items-center justify-center rounded-full transition"
      style={{
        padding: "8px 16px",
        fontSize: 11,
        letterSpacing: "0.24em",
        textTransform: "uppercase",
        background: solid ? "#e88966" : "rgba(255,255,255,0.55)",
        color: solid ? "#fbf8f0" : "#b55d3d",
        border: solid ? "none" : "1.5px solid #d0714e",
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? "default" : "pointer",
        backdropFilter: solid ? undefined : "blur(4px)",
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        e.currentTarget.style.background = solid ? "#d0714e" : "rgba(255,255,255,0.85)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = solid ? "#e88966" : "rgba(255,255,255,0.55)";
      }}
    >
      {children}
    </button>
  );
}
