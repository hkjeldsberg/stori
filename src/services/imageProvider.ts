// Resolve an image URL for a given prompt.
//
// Providers:
//   svg-local    — Generates a flat pastel SVG scene as a data URL. No network
//                  dependency. Default — always works, fits the flat aesthetic.
//   placeholder  — placehold.co static CDN. Often blocked on corp networks.
//   pollinations — Real AI-generated image via image.pollinations.ai. No API
//                  key required, but blocked by many corporate firewalls.
//
// Swap in Imagen/Gemini by adding another entry here.

export type ImageProviderName = "svg-local" | "placeholder" | "pollinations";
export type ImageProviderFn = (prompt: string) => string;

const pollinations: ImageProviderFn = (prompt) =>
  `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=640&height=640&nologo=true&model=flux`;

const placeholder: ImageProviderFn = (prompt) => {
  const m = prompt.match(/Subject:\s*A\s+([^\s]+)/i);
  const label = m ? m[1] : "bilde";
  return `https://placehold.co/640x640/e88966/fbf8f0.png?text=${encodeURIComponent(label)}&font=playfair`;
};

// ─── svg-local ────────────────────────────────────────────────────────
// Build a small set of flat pastel scenes and pick colours from the
// adjective. Always renders — no network calls, no placeholders.

const PALETTES = [
  { sky: "#fbf8f0", sun: "#e88966", mountain: "#9dc0ae", ground: "#c4dfd0", tree: "#4a7a5c", path: "#d8c49a", accent: "#d0714e" },
  { sky: "#f5efe3", sun: "#c49360", mountain: "#b8d4c5", ground: "#d9ead9", tree: "#86a598", path: "#c9b58a", accent: "#e88966" },
  { sky: "#eef5ee", sun: "#ee9878", mountain: "#86a598", ground: "#b8d4c5", tree: "#2d5a27", path: "#d8c49a", accent: "#b55d3d" },
  { sky: "#fbf4e8", sun: "#d0714e", mountain: "#c4dfd0", ground: "#d9ead9", tree: "#4a7a5c", path: "#c9a870", accent: "#e88966" },
  { sky: "#f0f4fb", sun: "#6699cc", mountain: "#a0b8d0", ground: "#c8daea", tree: "#3a5a7a", path: "#b8c9d8", accent: "#4a7aaa" },
  { sky: "#f9f0f5", sun: "#c47a99", mountain: "#c4a0b8", ground: "#dac8d4", tree: "#7a3a5a", path: "#d4b8c8", accent: "#aa4a7a" },
  { sky: "#f4fbf0", sun: "#78b850", mountain: "#a0c890", ground: "#c0e0b0", tree: "#2a6020", path: "#b0d090", accent: "#509840" },
  { sky: "#fdf5e8", sun: "#d4a020", mountain: "#d0b870", ground: "#e8d8a0", tree: "#806010", path: "#d8c060", accent: "#b88010" },
];

// Use a mix of char codes and position to reduce palette collisions for similar short words.
function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function parsePrompt(prompt: string): { subject: string; setting: string; adjective: string } {
  const subjectMatch = prompt.match(/Subject:\s*A\s+([^.]+)\./i);
  const settingMatch = prompt.match(/Setting:\s*([^.]+)\./i);
  const subjectFull = subjectMatch ? subjectMatch[1].trim() : "";
  const setting = settingMatch ? settingMatch[1].trim() : "";
  const adjMatch = subjectFull.match(/^(\S+)/);
  const adjective = adjMatch ? adjMatch[1] : "";
  const subject = subjectFull.replace(/^\S+\s*/, "").trim();
  return { subject, setting, adjective };
}

function renderSceneSvg(prompt: string): string {
  const { subject, setting, adjective } = parsePrompt(prompt);
  const h = hashString(adjective || "x");
  const palette = PALETTES[h % PALETTES.length];
  // Secondary hash from upper bits: varies sun radius and cloud position independently of palette.
  const sunVariant = (h >>> 8) % 4;
  const sunR = [17, 22, 28, 14][sunVariant];
  const sunX = [250, 240, 260, 245][sunVariant];
  const sunY = [66, 58, 72, 52][sunVariant];

  const hasMan = /man|woman|person|boy|girl|child/i.test(subject);
  const inForest = /forest|wood|tree/i.test(setting);
  const onPath = /path|road|journey|way|trail/i.test(setting);
  const nearWater = /water|river|lake|pond|sea/i.test(setting);

  const trees = inForest
    ? `
    <g>
      <polygon points="60,240 80,180 100,240" fill="${palette.tree}"/>
      <polygon points="55,260 80,200 105,260" fill="${palette.tree}"/>
      <rect x="77" y="258" width="6" height="14" fill="#8a5a32"/>
      <polygon points="220,240 240,180 260,240" fill="${palette.tree}"/>
      <polygon points="215,260 240,200 265,260" fill="${palette.tree}"/>
      <rect x="237" y="258" width="6" height="14" fill="#8a5a32"/>
    </g>`
    : "";

  const path = onPath
    ? `<path d="M160 320 Q165 280 158 250 Q150 220 162 195" stroke="${palette.path}" stroke-width="14" stroke-linecap="round" fill="none" opacity="0.7"/>`
    : "";

  const water = nearWater
    ? `<ellipse cx="160" cy="280" rx="110" ry="22" fill="${palette.mountain}" opacity="0.6"/>`
    : "";

  const man = hasMan
    ? `
    <g transform="translate(160 230)" stroke="#3d2817" stroke-width="1.6" stroke-linecap="round" fill="none">
      <circle cx="0" cy="-28" r="6" fill="${palette.sky}" stroke="#3d2817"/>
      <path d="M-6 -22 L-7 -4 L-2 -4 L-2 12 L-6 26 M6 -22 L7 -4 L2 -4 L2 12 L6 26" fill="${palette.accent}"/>
      <path d="M-6 -18 L-12 -4"/>
      <path d="M6 -18 L13 -4"/>
      <path d="M13 -8 L20 28" stroke="#3d2817" stroke-width="1.8"/>
    </g>`
    : `
    <g transform="translate(160 240)" fill="${palette.accent}" stroke="#3d2817" stroke-width="1.6">
      <circle cx="0" cy="0" r="16"/>
      <circle cx="-5" cy="-4" r="2" fill="#3d2817" stroke="none"/>
      <circle cx="5" cy="-4" r="2" fill="#3d2817" stroke="none"/>
    </g>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" width="640" height="640" role="img" aria-label="${escapeXml(adjective + " " + subject)}">
  <rect width="320" height="320" fill="${palette.sky}"/>
  <circle cx="${sunX}" cy="${sunY}" r="${sunR}" fill="${palette.sun}" opacity="0.9"/>
  <g opacity="0.6">
    <ellipse cx="70" cy="60" rx="22" ry="10" fill="#ffffff"/>
    <ellipse cx="90" cy="54" rx="18" ry="9" fill="#ffffff"/>
  </g>
  <path d="M-10 240 Q80 200 170 220 Q250 240 330 210 L330 320 L-10 320 Z" fill="${palette.mountain}" opacity="0.75"/>
  <path d="M-10 260 Q90 230 170 245 Q240 260 330 240 L330 320 L-10 320 Z" fill="${palette.ground}"/>
  ${water}
  ${path}
  ${trees}
  ${man}
  <text x="160" y="306" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="14" fill="#3d2817" opacity="0.7">${escapeXml(adjective)}</text>
</svg>`;

  return svg;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const svgLocal: ImageProviderFn = (prompt) => {
  const svg = renderSceneSvg(prompt);
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

// ──────────────────────────────────────────────────────────────────────

const providers: Record<ImageProviderName, ImageProviderFn> = {
  "svg-local": svgLocal,
  placeholder,
  pollinations,
};

export function getImageProvider(): { name: ImageProviderName; build: ImageProviderFn } {
  const raw = (process.env.IMAGE_PROVIDER ?? "svg-local").toLowerCase();
  const name = (raw in providers ? raw : "svg-local") as ImageProviderName;
  return { name, build: providers[name] };
}
