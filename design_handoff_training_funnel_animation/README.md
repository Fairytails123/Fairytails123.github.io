# Handoff: Dog Training Funnel — "Convergence Core" animation

## Overview
A 28-second, 1920×1080 landscape brand animation for **The Fairy Tails K9 Centre**.
Input labels (dog-training activities, management practices, skills, and health
factors) sit in four labelled groups across the top. Coloured wires cable down
from each label and converge on a glowing circular **puppy portrait** at the
centre-bottom that **grows** as the animation plays. Particles flow continuously
along the wires into the puppy's halo; orbital rings and ripples pulse around it.
At the end the outcome line — *"A confident, reliable dog"* — and the logo resolve
beneath it.

Message: dog behaviour training is not one activity — it is many connected pieces
working together toward one outcome.

## About the design files
The files in this bundle are a **working design reference built in HTML + React**
(a prototype showing the intended look and behaviour), **not** a production module
to drop in verbatim. The task is to **recreate this animation inside the website's
existing environment** (React/Next, Vue, Svelte, plain JS, etc.) using its
established build tooling and conventions. The prototype is high enough fidelity
that most teams can lift `funnel-scene.jsx` and `animations.jsx` almost as-is (see
"Integration" below) — but you own adapting module format, asset paths, and mount
point to the target codebase.

## Fidelity
**High-fidelity (hifi).** Final colours, typography, spacing, geometry, timing, and
motion are all specified here and encoded in `src/funnel-scene.jsx`. Recreate
pixel-for-pixel; the design width is 1920×1080 and the engine auto-scales to fit
any container while preserving aspect ratio.

---

## Files in this bundle

```
design_handoff_training_funnel_animation/
├── README.md                 ← this document
├── standalone.html           ← self-contained demo (open in a browser to preview)
├── src/
│   ├── funnel-scene.jsx       ← THE DESIGN. All layout, labels, geometry, timing, motion.
│   ├── animations.jsx         ← timeline engine: <Stage>, <Sprite>, useTime(), Easing
│   ├── image-slot.js          ← <image-slot> web component (the puppy photo drop target)
│   └── logo.png               ← Fairy Tails wordmark (shown at the end)
└── reference/
    ├── Dog Training Funnel.dc.html   ← how the prototype was assembled + the tweakable props
    └── support.js                    ← prototype-only runtime (NOT needed for integration)
```

`funnel-scene.jsx` is the file you edit and integrate. `animations.jsx` is an
unmodified dependency (the timeline/scrubber/scaling engine). `reference/` is
context only — you do **not** need `support.js` in production.

---

## Integration

### The component
`funnel-scene.jsx` defines `FunnelScene` and assigns it to `window.FunnelScene`.
It reads the engine primitives (`Stage`, `Sprite`, `useTime`, `Easing`) from
`window`, which `animations.jsx` sets. Both are plain React (React 18) written in
JSX with the **classic** runtime (`React.createElement`, global `React`).

### Fastest path (lift as-is)
1. Add `animations.jsx`, `funnel-scene.jsx`, `image-slot.js`, and `logo.png` to
   your project.
2. Ensure `image-slot.js` runs once (it self-registers the `<image-slot>` custom
   element).
3. Load/evaluate `animations.jsx` **before** `funnel-scene.jsx` (the scene depends
   on the globals the engine sets).
4. Mount into a full-size container:
   ```js
   ReactDOM.createRoot(el).render(React.createElement(window.FunnelScene, props));
   ```
`standalone.html` shows this exact flow (it fetches + Babel-transforms the two JSX
files at runtime purely for a zero-build preview — in a real app use your bundler).

### Recommended path (module-ify for a bundler)
In a Vite/webpack/Next project, convert the two files to ES modules:
- In `animations.jsx`, replace the trailing `Object.assign(window, { … })` with
  `export { Stage, Sprite, useTime, useTimeline, Easing, interpolate, animate, clamp };`
- In `funnel-scene.jsx`, replace each `const { … } = window;` with a top-level
  `import { … } from './animations.jsx';`, and replace the trailing
  `window.FunnelScene = FunnelScene;` with `export { FunnelScene };`
- Import and render `<FunnelScene {...props} />` wherever the site needs it.
Behaviour is identical; you gain tree-shaking and type-checking.

### Where it goes on the site
Mount it in a **full-width 16:9 hero/section container**. The engine (`<Stage>`)
scales the 1920×1080 canvas down to fit the container width and centres it, so the
parent just needs a sensible width (and it will set its own height by aspect
ratio). Autoplay + loop are on by default; a scrubber/playback bar is available
from the engine if you want manual controls.

---

## Editing labels (add / remove / update) — the key requirement

All labels live in **one array** at the top of `src/funnel-scene.jsx`, named
`GROUPS`. Each entry is a group (a top column) with a `name`, a `color`, and a
`chips` array of label strings:

```js
const GROUPS = [
  { name: 'Daycare & socialising', color: BLUE, chips: [
    'Doggy daycare', 'Daycare management', 'Play with other dogs',
    'Reliable recall', 'Barriers & spaces',
  ]},
  { name: 'Out in the world', color: AMBER, chips: [
    'Walking in a park', 'Calm in a café', 'Walking in town',
    'Behaviour in public', 'Staying away from home', 'Travelling in cars and vans',
  ]},
  { name: 'Handling & people', color: PURPLE, chips: [
    'Safe handling', 'Grooming', 'Moving between places',
    'Parent training', 'Staff skills, always updated',
  ]},
  { name: 'Health & wellbeing', color: GREEN, chips: [
    'Gut health', 'Tummy issues', 'Dental issues',
    'Pain', 'Ear infections', 'Joint problems',
  ]},
];
```

- **Add a label:** add a string to a group's `chips` array.
- **Remove a label:** delete the string.
- **Update a label:** edit the string.
- **Rename a group / recolour it:** change its `name` / `color`.
- **Add or remove a whole group:** add/remove an entry (the layout re-flows to
  however many groups exist; the top row auto-splits into that many columns).

Everything else adapts automatically: `buildLayout()` recomputes chip positions,
vertical spacing (auto-fits within the top zone), each wire's fan angle and path,
and the pop-in / wire-draw / particle timing. No coordinates are hand-tuned per
label. Keep labels short (they render on one line and ellipsize if very long); the
comfortable range is roughly **4–7 labels per group**.

### Optional: per-instance extra labels (props)
`FunnelScene` also accepts four optional string props that **append** extra labels
(comma- or newline-separated) on top of `GROUPS`, without editing the source —
useful for CMS-driven or per-page additions:
`extraSocialising`, `extraWorld`, `extraPeople`, `extraHealth`
(mapped to groups 1–4 respectively). Permanent changes belong in `GROUPS`; props
are for dynamic top-ups.

### The final outcome text
Edit the `Outcome` component in `funnel-scene.jsx`: the eyebrow ("The outcome"),
the headline ("A confident, reliable dog"), and the sub-line string.

### The puppy photo
The centre portrait is an `<image-slot id="ft-puppy">`. In the prototype the user
drops a photo onto it and it persists via a sidecar file. **In production, set a
real image** by giving the slot a `src` (a hosted photo URL), or replace the
`<image-slot>` element with a plain `<img>`/background image inside the same
circular wrapper if you don't need the drop-to-fill behaviour. A warm, natural-
light photo of a calm dog fits the brand (no stock photography per brand rules).

---

## Screens / Views

Single continuous animation, one full-bleed 1920×1080 canvas, four phases.

**1. Title (0–3s).** Full page-colour cover. Eyebrow "THE FAIRY TAILS · K9 CENTRE",
headline "Behaviour training isn't one thing.", sub "It's the sum of many small
things, done consistently." Fades and lifts away.

**2. Inputs appear (≈4–11s).** Small uppercase eyebrow "Everything we do" top-left.
Four group headers with a colour dot, then label chips pop in (staggered,
`scale 0.97→1` + slide). Chips are white rounded cards with a 3px coloured
left-border and a colour dot.

**3. Convergence (≈5–20s).** A wire draws from each chip's bottom, curving down and
in to attach on a ring just outside the puppy. Coloured particles flow along the
wires continuously. The puppy portrait grows from tiny to full; its glow halo,
two counter-rotating orbital rings, and outward ripples scale and pulse with it.
Per-stream coloured "entry sparks" glint where each wire meets the ring.

**4. Outcome (≈20–28s).** Chips dim to ~45%. Beneath the fully-grown puppy: eyebrow
"THE OUTCOME", headline "A confident, reliable dog" (brand blue), a short rule,
the sub-line "Not one activity — many connected pieces, working as one.", and the
logo.

### Layout geometry (design space = 1920×1080)
- **Top zone (chips):** first chip row at y≈118, chips finish above y≈452. Four
  columns, 76px side margins, each chip 340px wide. Row spacing auto-fits (42–58px).
- **Core (puppy centre):** `{ x: 960, y: 674 }`. Puppy radius animates 15px → 152px.
- **Wires:** cubic Béziers from each chip's bottom to a ring at `puppyRadius + 24`,
  fan angle derived from the chip's column x-position plus a small per-row spread.
- **Outcome block:** centred at x=960, starting ~26px below the grown puppy.

---

## Interactions & behaviour
- **Autoplay + loop**, driven by the `Stage` timeline (28s). No user input required.
- **Scaling:** `Stage` measures its container and scales the 1920×1080 canvas to fit
  (letterbox-free width fit), so it's responsive to any container size.
- **Scrubber / playback bar & video export** are provided by `animations.jsx` if
  you choose to surface them; otherwise it just plays.
- **Puppy photo:** drag-and-drop fill in the prototype (`<image-slot>`); set a fixed
  `src` for production.
- All motion uses the engine's frame clock (`useTime()`); nothing depends on CSS
  animation, so it stays in sync with the scrubber and with video export.

### Motion timing (seconds, at the design's default)
- Title in 0.25, out at ~2.9.
- Chips: first pop at 3.9, each subsequent +0.28; wire draw starts 0.35 after its
  chip, over 0.9.
- Puppy growth: eased over t≈4.2 → 22.7.
- Particles: continuous; ~0.17 units/sec cadence, three per wire.
- Orbital rings: 26°/s (one ring reversed at 0.7×).
- Outcome sequence begins at t=20.4 (eyebrow → headline → rule → sub → logo, ~0.15–1.4s apart).
Easing throughout is the engine's `easeOutCubic` / `easeInOutSine` / `easeOutQuad`.

## State
None external. The only internal state is the timeline playhead, owned by
`animations.jsx`. `FunnelScene` is otherwise a pure function of `useTime()` plus
the (static) `GROUPS` data and optional label props.

---

## Design tokens (exact values, from `funnel-scene.jsx`)

**Brand & service colours**
- Brand blue `#00AFF1` (primary — headline, core glow, links, "full day" group)
- Brand blue dark `#0090C8` · deep `#006A94`
- Amber `#FF9500` ("Out in the world")
- Purple `#AF52DE` ("Handling & people")
- Green `#34C759` ("Health & wellbeing")

**Neutrals**
- Page `#F4F5F7` · Card `#FFFFFF`
- Ink `#1C1C1E` · secondary `#6E6E76` · tertiary `#A6A6AD`

**Typography** — Plus Jakarta Sans (Google Fonts), system fallback.
- Title headline 74px / 800 / -0.03em
- Group header 13px / 700 / uppercase / 0.11em
- Chip label 18px / 600 / -0.01em
- Outcome headline 42px / 800 / -0.03em, eyebrows 13–14px / 700 / uppercase / 0.2em
- Numbers, where any: use `font-variant-numeric: tabular-nums` (brand rule)

**Radii / shadow**
- Chip radius 12px; chip shadow `0 0.5px 0 rgba(16,24,40,.04), 0 3px 10px rgba(16,24,40,.05)`
- Chip left accent: 3px solid group colour
- Puppy frame: 10px white ring + soft `rgba(0,110,160,.28)` drop shadow

**Canvas**: 1920×1080, background `#F4F5F7`, duration 28s.

## Assets
- `logo.png` — Fairy Tails K9 Centre wordmark (included). Replace with the site's
  canonical logo asset if one exists.
- Puppy photo — **not included**; supply a real, warm-toned photo of a calm dog
  (brand rule: real photography, no stock, no illustration).
- Fonts — Plus Jakarta Sans via Google Fonts (`<link>` in `standalone.html`); load
  it through the site's normal font pipeline in production.

## Brand notes (from the Fairy Tails design system)
- British English, sentence case (only the wordmark is styled). Voice: trustworthy,
  practical, warm — no hype, no "guaranteed", no emoji in customer-facing copy.
- Solid neutral backgrounds; the only "gradient" here is the functional radial core
  glow. Keep it that way.
