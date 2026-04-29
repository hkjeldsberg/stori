// Pastel skeleton for the image pane while the illustration is being generated.
// Built from solid shapes + a sweeping shimmer band (CSS keyframe in globals.css).

export default function Skeleton() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-cream-100">
      <svg viewBox="0 0 320 320" width="100%" height="100%" aria-hidden>
        {/* sky */}
        <rect width="320" height="320" fill="#f5efe3" />
        {/* hill silhouettes */}
        <path d="M-10 230 Q90 200 180 220 Q260 238 330 210 L330 320 L-10 320 Z" fill="#dfe8db" />
        <path d="M-10 260 Q90 238 190 255 Q260 270 330 250 L330 320 L-10 320 Z" fill="#c7dcca" />
        {/* sun */}
        <circle cx="252" cy="70" r="22" fill="#ecd5bf" />
        {/* subject placeholder */}
        <rect x="140" y="210" width="40" height="58" rx="8" fill="#d9c9ac" />
        <circle cx="160" cy="198" r="12" fill="#d9c9ac" />
      </svg>

      {/* Shimmer sweep */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.55) 50%, transparent 80%)",
          animation: "skeleton-sweep 1.8s ease-in-out infinite",
          backgroundSize: "200% 100%",
        }}
      />

      <div
        className="absolute bottom-3 left-0 right-0 text-center font-serif text-[13px] italic text-ink-500/85"
      >
        Tegner bildet…
      </div>
    </div>
  );
}
