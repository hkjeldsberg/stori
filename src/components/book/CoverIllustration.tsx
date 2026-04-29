// Flat pastel cover motif: small man silhouette with a walking stick on a
// hillside flanked by pine trees and a distant cloud.

const INK = "#3d2817";
const CORAL = "#e88966";
const CORAL_DARK = "#d0714e";
const TREE_DARK = "#4a7a5c";
const TREE_LIGHT = "#86a598";
const GROUND = "#c4dfd0";
const GROUND_DARK = "#9dc0ae";
const CLOUD = "#ffffff";
const CREAM = "#fbf8f0";

function Pine({ x, y, h = 70 }: { x: number; y: number; h?: number }) {
  const w = h * 0.55;
  return (
    <g>
      <rect x={x - 4} y={y} width={8} height={h * 0.28} fill="#8a5a32" />
      <polygon
        points={`${x},${y - h} ${x + w / 2},${y - h * 0.4} ${x + w * 0.35},${y - h * 0.4} ${x + w / 2 + 4},${y - 2} ${x - w / 2 - 4},${y - 2} ${x - w * 0.35},${y - h * 0.4} ${x - w / 2},${y - h * 0.4}`}
        fill={TREE_DARK}
      />
    </g>
  );
}

export default function CoverIllustration() {
  return (
    <svg viewBox="0 0 300 300" style={{ width: "100%", height: "100%" }} aria-hidden>
      {/* sky */}
      <rect width={300} height={300} fill={CREAM} />

      {/* distant cloud */}
      <g transform="translate(200 60)">
        <ellipse cx={10} cy={14} rx={18} ry={10} fill={CLOUD} />
        <ellipse cx={28} cy={8} rx={16} ry={12} fill={CLOUD} />
        <ellipse cx={44} cy={14} rx={14} ry={9} fill={CLOUD} />
      </g>

      {/* sun */}
      <circle cx={72} cy={72} r={22} fill={CORAL} opacity={0.9} />

      {/* hills */}
      <path d="M-10 230 Q80 180 160 210 Q230 235 320 200 L320 320 L-10 320 Z" fill={GROUND_DARK} />
      <path d="M-10 250 Q90 220 170 238 Q240 254 320 232 L320 320 L-10 320 Z" fill={GROUND} />

      {/* trees */}
      <Pine x={42} y={230} h={78} />
      <Pine x={240} y={225} h={92} />
      <Pine x={268} y={240} h={60} />

      {/* path */}
      <path
        d="M150 320 Q156 280 148 250 Q140 226 152 208"
        stroke="#d8c49a"
        strokeWidth={14}
        strokeLinecap="round"
        fill="none"
        opacity={0.75}
      />

      {/* man silhouette with walking stick */}
      <g transform="translate(150 220)" stroke={INK} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <circle cx={0} cy={-30} r={6} fill={CREAM} stroke={INK} />
        <path d="M-7 -24 L-8 -4 L-2 -4 L-2 14 L-6 28 M8 -24 L9 -4 L3 -4 L3 14 L7 28" fill={CORAL_DARK} />
        <path d="M-7 -20 L-12 -4" />
        <path d="M8 -20 L14 -4" />
        {/* walking stick */}
        <path d="M14 -8 L22 30" stroke={INK} strokeWidth={1.8} />
      </g>

      {/* small flower accents */}
      <circle cx={60} cy={265} r={3} fill={CORAL} />
      <circle cx={66} cy={268} r={2} fill={CORAL_DARK} />
      <circle cx={222} cy={262} r={3} fill={CORAL} />

      {/* abstract birds */}
      <path d="M108 58 Q118 50 128 58" stroke={TREE_LIGHT} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <path d="M128 58 Q136 50 144 58" stroke={TREE_LIGHT} strokeWidth={1.8} fill="none" strokeLinecap="round" />
    </svg>
  );
}
