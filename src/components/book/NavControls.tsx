interface NavControlsProps {
  spreadCount: number;
  spreadIdx: number;
  animating: boolean;
  label: string;
  onPrev: () => void;
  onNext: () => void;
  onJump: (idx: number) => void;
}

export default function NavControls({
  spreadCount,
  spreadIdx,
  animating,
  label,
  onPrev,
  onNext,
  onJump,
}: NavControlsProps) {
  const canPrev = !animating && spreadIdx > 0;
  const canNext = !animating && spreadIdx < spreadCount - 1;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6">
        <PillButton
          disabled={!canPrev}
          onClick={onPrev}
          ariaLabel="Forrige side"
          variant="ghost"
        >
          <span className="mr-1 text-base">←</span>
          <span className="text-[11px] uppercase tracking-[0.24em]">Forrige</span>
        </PillButton>

        <div className="flex items-center gap-2">
          {Array.from({ length: spreadCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Gå til side ${i}`}
              onClick={() => {
                if (!animating) onJump(i);
              }}
              className="transition-all"
              style={{
                width: i === spreadIdx ? 10 : 6,
                height: i === spreadIdx ? 10 : 6,
                borderRadius: "50%",
                border: "none",
                padding: 0,
                background: i === spreadIdx ? "#d0714e" : "rgba(61,40,23,0.22)",
                cursor: animating ? "default" : "pointer",
              }}
            />
          ))}
        </div>

        <PillButton
          disabled={!canNext}
          onClick={onNext}
          ariaLabel="Neste side"
          variant="solid"
        >
          <span className="text-[11px] uppercase tracking-[0.24em]">Neste side</span>
          <span className="ml-1 text-base">→</span>
        </PillButton>
      </div>

      <div className="text-[10px] uppercase tracking-[0.3em] text-ink-500">{label}</div>
    </div>
  );
}

interface PillButtonProps {
  disabled?: boolean;
  onClick: () => void;
  ariaLabel: string;
  variant: "solid" | "ghost";
  children: React.ReactNode;
}

function PillButton({ disabled, onClick, ariaLabel, variant, children }: PillButtonProps) {
  const solid = variant === "solid";
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className="inline-flex items-center justify-center rounded-full px-5 py-2.5 font-serif transition"
      style={{
        background: solid ? "#e88966" : "transparent",
        color: solid ? "#fbf8f0" : "#b55d3d",
        border: solid ? "none" : "1.5px solid #d0714e",
        opacity: disabled ? 0.35 : 1,
        cursor: disabled ? "default" : "pointer",
        letterSpacing: "0.08em",
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        e.currentTarget.style.background = solid ? "#d0714e" : "rgba(208,113,78,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = solid ? "#e88966" : "transparent";
      }}
    >
      {children}
    </button>
  );
}
