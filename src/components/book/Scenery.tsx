// Flat pastel scenery scattered around the card.
// All SVGs are pure shapes, no gradients. Position via absolute % for responsiveness.

const CORAL = "#e88966";
const CORAL_DARK = "#d0714e";
const INK = "#3d2817";
const CLOUD = "#ffffff";
const MOUNTAIN = "#9dc0ae";
const TREE_DARK = "#4a7a5c";
const TREE_LIGHT = "#86a598";
const BIRD = "#7fa893";

function Cloud({ size = 60 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 120 60" aria-hidden>
      <ellipse cx="32" cy="38" rx="28" ry="18" fill={CLOUD} />
      <ellipse cx="66" cy="28" rx="24" ry="20" fill={CLOUD} />
      <ellipse cx="94" cy="38" rx="22" ry="16" fill={CLOUD} />
    </svg>
  );
}

function Balloon({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.35} viewBox="0 0 60 80" aria-hidden>
      <path d="M30 2 C12 2 6 20 6 34 C6 46 16 54 30 56 C44 54 54 46 54 34 C54 20 48 2 30 2 Z" fill={CORAL} />
      <path d="M30 2 C22 2 18 20 18 34 C18 46 23 54 30 56" fill={CLOUD} opacity="0.65" />
      <path d="M30 2 L30 56" stroke={CORAL_DARK} strokeWidth="1.4" />
      <line x1="22" y1="56" x2="18" y2="64" stroke={INK} strokeWidth="1" />
      <line x1="38" y1="56" x2="42" y2="64" stroke={INK} strokeWidth="1" />
      <rect x="20" y="64" width="20" height="10" rx="2" fill="#a37142" stroke={INK} strokeWidth="1.2" />
    </svg>
  );
}

function Bird({ size = 60 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 100 60" aria-hidden>
      <path d="M8 34 Q28 14 48 34 Q68 14 92 34" fill="none" stroke={BIRD} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M42 30 Q50 24 58 30 L50 36 Z" fill={BIRD} />
    </svg>
  );
}

function Mountain({ size = 260 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.45} viewBox="0 0 520 230" aria-hidden>
      <path d="M0 230 L120 90 L200 170 L300 60 L420 170 L520 110 L520 230 Z" fill={MOUNTAIN} opacity="0.55" />
      <path d="M0 230 L90 140 L170 200 L270 120 L380 210 L520 170 L520 230 Z" fill={MOUNTAIN} opacity="0.85" />
    </svg>
  );
}

function Tree({ size = 80, variant = "pine" }: { size?: number; variant?: "pine" | "round" }) {
  if (variant === "round") {
    return (
      <svg width={size} height={size * 1.1} viewBox="0 0 60 66" aria-hidden>
        <rect x="26" y="42" width="8" height="22" fill="#8a5a32" />
        <circle cx="30" cy="30" r="22" fill={TREE_LIGHT} />
        <circle cx="22" cy="22" r="12" fill={TREE_DARK} opacity="0.5" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 60 84" aria-hidden>
      <rect x="26" y="58" width="8" height="24" fill="#8a5a32" />
      <polygon points="30,6 52,40 40,40 55,60 8,60 20,40 8,40" fill={TREE_DARK} />
    </svg>
  );
}

function Mushroom({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.9} viewBox="0 0 36 32" aria-hidden>
      <rect x="14" y="16" width="8" height="14" rx="1.5" fill="#f5efe3" stroke={INK} strokeWidth="1.2" />
      <path d="M2 18 Q18 2 34 18 Q28 22 18 22 Q8 22 2 18 Z" fill={CORAL} stroke={INK} strokeWidth="1.2" />
      <circle cx="12" cy="14" r="1.6" fill={CLOUD} opacity="0.85" />
      <circle cx="22" cy="10" r="1.2" fill={CLOUD} opacity="0.85" />
    </svg>
  );
}

interface ScatteredProps {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  rotate?: number;
  children: React.ReactNode;
}
function Scattered({ top, left, right, bottom, rotate = 0, children }: ScatteredProps) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        right,
        bottom,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        pointerEvents: "none",
      }}
    >
      {children}
    </div>
  );
}

/**
 * Scattered scenery elements that decorate the viewport behind the card.
 * Positioned to avoid the center where the card sits.
 */
export default function Scenery() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* top row — clouds and a balloon */}
      <Scattered top="6%" left="8%">
        <Cloud size={110} />
      </Scattered>
      <Scattered top="4%" left="36%">
        <Cloud size={70} />
      </Scattered>
      <Scattered top="9%" right="22%">
        <Bird size={58} />
      </Scattered>
      <Scattered top="14%" right="6%">
        <Balloon size={90} />
      </Scattered>

      {/* mid — a bird and extra cloud */}
      <Scattered top="42%" left="3%">
        <Bird size={44} />
      </Scattered>
      <Scattered top="30%" right="3%">
        <Cloud size={80} />
      </Scattered>

      {/* bottom — mountains and trees as a grounding line */}
      <Scattered bottom="-4%" left="-6%">
        <Mountain size={560} />
      </Scattered>
      <Scattered bottom="-3%" right="-10%">
        <Mountain size={520} />
      </Scattered>
      <Scattered bottom="6%" left="6%">
        <Tree size={70} variant="pine" />
      </Scattered>
      <Scattered bottom="4%" left="18%">
        <Tree size={56} variant="round" />
      </Scattered>
      <Scattered bottom="5%" right="9%">
        <Tree size={80} variant="pine" />
      </Scattered>
      <Scattered bottom="3%" right="22%">
        <Mushroom size={42} />
      </Scattered>
      <Scattered bottom="4%" left="32%">
        <Mushroom size={32} />
      </Scattered>
    </div>
  );
}
