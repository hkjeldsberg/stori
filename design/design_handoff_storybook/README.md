# Handoff: Pip's Forest Adventure — Interactive Children's Storybook

## Overview

An interactive children's storybook rendered as a two-page book spread. The left page shows a story sentence in a fairy-tale typographic style; the right page shows a hand-drawn line-art illustration of that sentence. Users navigate between 10 story pages (plus a cover) with a 3D CSS page-flip animation that mimics physically turning a book page.

---

## About the Design Files

The file `Pip's Forest Adventure.html` in this bundle is a **high-fidelity design reference built in HTML/React**. It is a prototype showing the intended look, feel, and interactions — **not production code to copy directly**.

Your task is to **recreate this design in your target codebase** using its established framework, component library, and patterns. If no codebase exists yet, React (with TypeScript) is the recommended implementation choice given the component-heavy structure. The HTML reference should be used as a visual and behavioral spec.

---

## Fidelity

**High-fidelity.** This is a pixel-accurate prototype with final colours, typography, spacing, illustrations, and animations. Recreate it as closely as possible using your stack's existing patterns and libraries.

---

## Screens / Views

### 1. Book Spread (the only screen)

The entire UI is a single full-viewport screen — a centred book spread that scales to fit any window size.

#### Overall Layout

| Property | Value |
|---|---|
| Viewport background | `radial-gradient(ellipse at 50% 60%, #2d5a27 0%, #172f13 100%)` |
| Book total width | `866px` (420 left + 26 spine + 420 right) |
| Book height | `580px` |
| Scaling | JS `transform: scale(N)` applied to a wrapper div; N = `min(vw / (866+160), vh / (580+120), 0.98)` — keeps the book centred and letterboxed at any viewport size |
| Book drop shadow | `drop-shadow(0 22px 44px rgba(0,0,0,0.58))` |

#### Left Page (Text)

| Property | Value |
|---|---|
| Width × Height | `420 × 580px` |
| Background (story pages) | `linear-gradient(90deg, #e4d4a8 0%, #f5edd4 9%, #f5edd4 100%)` — slightly darker near spine |
| Background (cover) | `#f0e4c8` |
| Paper noise texture | SVG `feTurbulence` fractalNoise overlay at 5.5% opacity, `mix-blend-mode: multiply` |
| Spine-edge shadow | `linear-gradient(90deg, transparent, rgba(0,0,0,0.10))`, width 38px, right edge |
| Content inset | `58px 46px` from page edges |
| Content alignment | Centred vertically and horizontally |

**Story text typography:**

| Property | Value |
|---|---|
| Font family | `'IM Fell English', Georgia, serif` |
| Style | Italic |
| Size | `21px` |
| Line height | `1.85` |
| Colour | `#3a2410` |
| Text align | Centre |
| `text-wrap` | `pretty` |

**Page number:**

| Property | Value |
|---|---|
| Font | `'IM Fell English'`, `12px` |
| Colour | `#9a7840` |
| Letter spacing | `0.1em` |
| Position | Absolute, `bottom: 28px`, horizontally centred |
| Format | `— N —` |

**Cover page text (left side):**

| Element | Font | Size | Colour |
|---|---|---|---|
| Eyebrow (`A Story for Children`) | IM Fell English, uppercase, `0.2em` tracking | `13px` | `#9a7028` |
| Title (`Pip's Forest Adventure`) | Cinzel Decorative | `25px` | `#3e2208` |
| Subtitle (`A tale of curiosity…`) | IM Fell English, italic | `13px` | `#7a5020` |
| Decorative dividers | `48px` wide, `1px` tall, `#9a7028`, 50% opacity | — | — |
| Fleurons (`✦ ✦ ✦`) | — | `12px` | `#9a7028`, `0.35em` tracking |
| Title text shadow | `1px 1px 0 rgba(255,228,170,0.8)` | — | — |

#### Right Page (Illustration)

| Property | Value |
|---|---|
| Width × Height | `420 × 580px` |
| Background | `linear-gradient(90deg, #f5edd4 0%, #f5edd4 92%, #ece0c0 100%)` |
| Spine-edge shadow | `linear-gradient(270deg, transparent, rgba(0,0,0,0.07))`, width 34px, left edge |
| Content inset | `58px 44px` from page edges |
| Illustration | SVG, `width: 100%`, `height: 100%`, `viewBox="0 0 300 370"` |

#### Ornate Border (both pages)

Rendered as an absolutely-positioned SVG (`inset: 0`, `z-index: 15`) with `preserveAspectRatio="none"` so it stretches to the page.

| Element | Value |
|---|---|
| Outer rect stroke | `2px`, colour `#8b6c40` (story) / `#7a5018` (cover), `rx: 2` |
| Inner rect stroke | `1px`, same colour, 45% opacity, inset by 8px |
| Corner ornaments | Filled circle (`r=5`) + two curved strokes at each corner, rotated 0/90/180/270° |
| Mid-edge accents | Ellipses `rx=13 ry=5.5` at top/bottom centres; `rx=5.5 ry=13` at left/right centres |

#### Spine

| Property | Value |
|---|---|
| Width | `26px` |
| Background | `linear-gradient(90deg, #5c3a10 0%, #8c5c28 15%, #b8823c 32%, #d0a050 50%, #b8823c 68%, #8c5c28 85%, #5c3a10 100%)` |
| Box shadow | `2px 0 7px rgba(0,0,0,.32)`, `-2px 0 7px rgba(0,0,0,.22)` |
| Title text | `'Cinzel Decorative'`, `8px`, `rgba(255,238,190,0.8)`, `0.16em` tracking, rotated `-90deg` |

#### Top / Bottom Book Edges

| Edge | Background |
|---|---|
| Top (`3px` high) | `linear-gradient(90deg, #e4d4a0, #f8edd0, #e4d4a0)` |
| Bottom (`4px` high) | `linear-gradient(90deg, #c0902a, #d4a83c, #c0902a)` — golden gilded look |

---

## Interactions & Behaviour

### Page Turn Animation

This is the core interaction. When the user navigates forward:

1. The **current right page** (illustration) visually lifts and flips 180° to the left, sweeping over the spine and landing on top of the current left page.
2. The **back face** of the flipping page reveals the **next left page** (story text).
3. Simultaneously, the **next right page** (illustration) is revealed underneath.
4. After the animation completes (~760ms), state is committed.

For navigating backward, the mirror image occurs: the **current left page** flips right.

**CSS animation spec:**

```css
/* Going next — right page flips left */
@keyframes flipNext {
  0%   { transform: rotateY(0deg); }
  100% { transform: rotateY(-180deg); }
}

/* Going prev — left page flips right */
@keyframes flipPrev {
  0%   { transform: rotateY(0deg); }
  100% { transform: rotateY(180deg); }
}

.flip-page {
  transform-style: preserve-3d;
  position: absolute;
  width: 420px; height: 580px;
}
.flip-page.to-left {
  animation: flipNext 0.75s cubic-bezier(0.45, 0, 0.2, 1) forwards;
  transform-origin: left center;   /* hinge = spine edge */
}
.flip-page.to-right {
  animation: flipPrev 0.75s cubic-bezier(0.45, 0, 0.2, 1) forwards;
  transform-origin: right center;  /* hinge = spine edge */
}

/* Front and back faces */
.flip-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.flip-back {
  transform: rotateY(180deg); /* faces away initially; becomes visible at end of flip */
}
```

**Important DOM structure during animation (going next):**

```
<book>                                       perspective: 2200px
  <left-container>   z-index: 1             overflow: hidden
    <LeftPage idx={current}/>
  </left-container>
  <spine/>           z-index: 3
  <right-container>  z-index: 4 (↑ during anim)   overflow: visible (↑ during anim)
    <RightPage idx={next}/>                  z-index: 1  (revealed underneath)
    <div class="flip-page to-left">          z-index: 3
      <div class="flip-face">               (front = current right)
        <RightPage idx={current}/>
      </div>
      <div class="flip-face flip-back">     (back = next left)
        <LeftPage idx={next}/>
      </div>
    </div>
  </right-container>
</book>
```

The **right container must have `overflow: visible`** during animation so the flipping page can sweep into the left-page space. Its `z-index` is raised above the spine so the flip appears on top.

After the animation timer fires (760ms), advance state and return to the idle layout.

### Navigation Controls

- **Prev / Next arrow buttons**: circular, `46×46px`, `border-radius: 50%`, `border: 1.5px solid rgba(255,255,255,0.45)`, `background: rgba(255,255,255,0.12)`, `backdrop-filter: blur(4px)`, white arrow character
  - Hover: `background: rgba(255,255,255,0.28)`
  - Disabled (first/last page or mid-animation): `opacity: 0.3`, `cursor: default`
- **Progress dots**: `6px` circles (`9px` when active), `rgba(255,255,255,0.28)` / `rgba(255,255,255,0.95)`, clickable to jump
- **Page label**: `'IM Fell English'`, `11px`, `rgba(255,255,255,0.55)`, e.g. `Cover` or `Page 3 of 10`
- **Keyboard**: `ArrowLeft` / `ArrowRight` trigger prev/next
- **Persistence**: current spread index saved to `localStorage` key `pip_spread`; restored on load

---

## State Management

```typescript
type AnimDir = 'next' | 'prev' | null;

const [spreadIdx, setSpreadIdx] = useState<number>(0);   // current spread (0 = cover)
const [animDir, setAnimDir]     = useState<AnimDir>(null);
const [pending, setPending]     = useState<number | null>(null); // target spread during anim
```

**Transition flow:**
1. User triggers `go('next')` → set `pending = spreadIdx + 1`, `animDir = 'next'`
2. After `760ms` → set `spreadIdx = pending`, clear `animDir` and `pending`
3. Block new actions while `animDir !== null`

---

## Illustrations

Each of the 11 illustrations (cover + 10 scenes) is an inline SVG with `viewBox="0 0 300 370"`. They use a consistent visual language:

| Property | Value |
|---|---|
| Stroke colour | `#5a3c22` (warm dark brown) |
| Stroke width | `1.8px` general; `1.5px` for secondary details |
| Line caps / joins | `round` / `round` |
| Fill style | Flat pastel fills; shapes outlined with stroke |

**Shared pastel palette used in illustrations:**

| Name | Hex |
|---|---|
| Ink (stroke) | `#5a3c22` |
| Forest green | `#7ab860` |
| Dark green | `#4a7840` |
| Light green | `#b0d898` |
| Brown | `#a07840` |
| Light brown | `#c8a060` |
| Sky blue | `#a8d8e8` |
| Yellow | `#f4d858` |
| Pink | `#f0a8b8` |
| Purple | `#c8b0e8` |
| Blue | `#80bcd8` |
| Cream (bunny fur) | `#f0e0c0` |

**Reusable drawn characters:**

- **Bunny (Pip)**: round cream body + head, pink inner ears, dot eyes, pink nose, fluffy white tail, simple arm/leg paths. Supports `facing='front'` (default) or `facing='back'` (tail visible, no face features).
- **Tree**: trunk rect + two stacked ellipses (canopy + darker top)
- **Flower**: 5 petal-circles arranged radially + yellow centre dot + stem line
- **Mushroom**: rect stem + ellipse cap with white spots; optional `glow` variant adds a soft pink outer glow
- **Duck**: body ellipse + head circle + orange beak path + dot eye + wing stroke + orange legs

**Scene list:**

| Spread | Scene description |
|---|---|
| 0 (Cover) | Forest clearing, sun with rays, trees, burrow entrance, Pip peeking out, flowers |
| 1 | Forest home — Pip emerging from burrow, surrounding trees, flowers, sparkle stars |
| 2 | Morning hop — sunrise, meadow path, dewdrop circles, flowers, Pip mid-hop |
| 3 | Hidden path — fork in the path with bushes, mystery sparkles, question mark |
| 4 | Mushroom path — glowing mushrooms + golden flowers lining a winding path |
| 5 | Following path — dense forest, winding path disappearing into a light glow, Pip from behind |
| 6 | Pond + willow — sparkling pond, drooping willow branches, Pip at the edge |
| 7 | Ducks — pond, three ducks in a row with speech bubbles ("quack!"), Pip watching |
| 8 | Playing in water — bright sun, splashing water, Pip's head visible above water, two ducks |
| 9 | Sunset — gradient sky, low sun, crescent moon, silhouette trees, Pip walking home |
| 10 | Cozy burrow — warm interior, sleeping Pip in bed, candle, dream cloud with stars, window |

---

## Design Tokens

### Colours

| Token | Hex | Usage |
|---|---|---|
| `forest-bg-from` | `#2d5a27` | Viewport background gradient start |
| `forest-bg-to` | `#172f13` | Viewport background gradient end |
| `paper-cream` | `#f5edd4` | Page base colour |
| `paper-warm` | `#f0e4c8` | Cover page base |
| `paper-shadow` | `#e4d4a8` | Left edge of left page |
| `paper-edge` | `#ece0c0` | Right edge of right page |
| `ink-dark` | `#3a2410` | Story body text |
| `ink-medium` | `#9a7840` | Page numbers, decorative text |
| `ink-light` | `#9a7028` | Cover decorative elements |
| `spine-mid` | `#d0a050` | Spine highlight |
| `spine-dark` | `#5c3a10` | Spine edges |
| `border-gold` | `#8b6c40` | Ornate border stroke (story pages) |
| `border-gold-cover` | `#7a5018` | Ornate border stroke (cover) |
| `title-dark` | `#3e2208` | Cover title |

### Typography

| Token | Value |
|---|---|
| `font-story` | `'IM Fell English', Georgia, serif` — story body text |
| `font-display` | `'Cinzel Decorative', serif` — titles and spine |
| `size-body` | `21px` |
| `size-caption` | `12–13px` |
| `size-title` | `25px` |
| `leading-body` | `1.85` |

### Spacing

| Token | Value |
|---|---|
| `page-inset-v` | `58px` top/bottom |
| `page-inset-h` | `46px` left/right (text page) / `44px` (illustration page) |
| `page-num-bottom` | `28px` |
| `nav-gap` | `28px` between controls |

### Animation

| Token | Value |
|---|---|
| `flip-duration` | `750ms` |
| `flip-easing` | `cubic-bezier(0.45, 0, 0.2, 1)` |
| `flip-commit-delay` | `760ms` (slightly after animation ends) |

### Geometry

| Token | Value |
|---|---|
| `page-width` | `420px` |
| `page-height` | `580px` |
| `spine-width` | `26px` |
| `book-width` | `866px` |
| `perspective` | `2200px` |

---

## Assets

No external image assets. All illustrations are inline SVGs drawn with paths, basic shapes, and CSS gradients. Google Fonts used:

- **IM Fell English** (`ital@0;1`) — `https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1`
- **Cinzel Decorative** (`wght@400;700`) — `https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700`

---

## Files in This Package

| File | Description |
|---|---|
| `Pip's Forest Adventure.html` | Full hi-fi prototype — single-file React app (Babel inline). Open in any browser to review. |
| `README.md` | This document — complete implementation spec. |

---

## Implementation Notes for Developers

1. **Viewport scaling**: The book is a fixed `866×580px` element; wrap it in a div that applies `transform: scale(N)` based on window dimensions. Recalculate on `resize`.
2. **3D flip**: The key subtlety is that during a "next" flip, `overflow: visible` is required on the right container and its `z-index` must exceed the spine's `z-index` so the flipping page sweeps above it.
3. **Back face content**: When the right page flips left, its back face shows the *next* left page. This works naturally in CSS `preserve-3d` — the back face div with `transform: rotateY(180deg)` renders its content un-mirrored once the parent has rotated `-180deg`.
4. **Blocking interactions**: Disable navigation while an animation is in progress to prevent state corruption.
5. **Illustrations**: Each scene SVG is self-contained. They can be extracted into individual `.svg` files or React components without modification.
