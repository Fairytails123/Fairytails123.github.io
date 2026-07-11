# Handoff: Service Rain Hero Animation — The Fairy Tails K9 Centre

## Overview
An interactive hero-section animation for the (already designed) marketing website. All 106 daycare services fall like gentle rain in brand blue while an animated black puppy — matching the centre's logo silhouette — watches, wanders, sits, and leaps to catch words. Visitors can hover to slow/highlight a word and click/tap it to send the dog after it. A small fairy (the second logo mark) flies across every ~25s trailing sparkles. The piece communicates the breadth of the daycare's services while staying in the brand's "Apple-grade calm" register.

## About the Design Files
The files in this bundle are **design references created in HTML** — a working prototype showing the intended look and behaviour, **not production code to copy directly**. `Daycare Hero.dc.html` runs on a small design-tool runtime (`support.js`, bundled only so the reference opens in a browser). Your task is to **recreate this animation in the website's existing environment** (React, Vue, plain JS — whatever the site uses), following its established patterns. If the site is static HTML, a single vanilla-JS module + inline SVG is the ideal target.

Good news: ~95% of the file is portable as-is.
- The **SVG dog rig** (inside `<div ref="{{ dogWrapRef }}">`) is plain SVG — copy it verbatim; the `data-part` attributes are the animation hooks.
- The **animation engine** (everything inside `<script data-dc-script>`) is framework-agnostic JavaScript: a `SERVICES` array, a rAF loop (`tick`), a drop system (`spawnDrop`/`updateDrops`), a dog state machine (`updateDog`/`startLeap`/`applyDog`), and FX helpers (`ripple`/`burst`/`floatLabel`/`glint`/`updateFairy`). Port it into a class or closure; replace `this.xxxRef.current` with real element references and `this.props.x ?? default` with your config object. React `setState` is used only for the caught-counter text.
- Template `{{ holes }}` / `<sc-if>` are trivial: the hint caption, the caught counter, and the visually-hidden `<ul>` of services.

## Fidelity
**High-fidelity.** Colours, typography, spacing, timings, easings, SVG geometry and choreography are final. Recreate pixel-perfectly and motion-perfectly.

## Screens / Views
One view: **the hero animation stage** (drop-in for the existing hero placeholder).

- **Container**: `position: relative; width: 100%; height: 100%` (fill the hero placeholder; `min-height: 540px`), `background: #FFFFFF`, `overflow: hidden`, `font-family: 'Plus Jakarta Sans', -apple-system, system-ui, sans-serif`.
- **Layer stack (z-index)**:
  - `0` Floor band — bottom strip, `height: clamp(48px, 9%, 76px)`, `background: #F8FBFE`, `border-top: 1px solid rgba(60,60,67,0.08)`. Its top edge is the "ground line" all physics use.
  - `1` Rain layer — absolutely-positioned `<span>` words (created at runtime), container `pointer-events: none`, each span `pointer-events: auto`.
  - `2` Dog — wrapper div moved with `translate3d`, containing the SVG rig (intrinsic 210×148, viewBox `-75 -100 150 106`, ground at local y=0 ⇒ 139.6px from SVG top).
  - `3` Hint caption (bottom-centre, pulse dot 6px `#00AFF1` + 13px/600 text `rgba(28,28,30,0.42)`: "Click a falling word — the dog will catch it"; "Tap" on coarse pointers) and caught counter (bottom-right, 12.5px/600, `rgba(28,28,30,0.5)`, tabular-nums: "N of 106 services caught", shown after first catch).
  - `4` FX layer — ripples, catch bursts, floating caught-word labels, fairy SVG. `pointer-events: none`.
- **Word spans**: Plus Jakarta Sans 600, `letter-spacing: -0.01em`, colour `#00AFF1`. Depth `d∈[0,1]` drives: font-size `lerp(12.5, 25, d)`px (×0.78 under 640px width; ×0.82 if >30 chars; ×0.78 more if >55), opacity `lerp(0.30, 0.92, d^1.3)`, blur `blur(1.8→0.4px)` only when `d<0.4`, fall speed `lerp(26, 78, d)`px/s. Padding 8×10 with negative margin for a generous hit area.
- **Accessibility**: rain/dog/FX layers are `aria-hidden`; a visually-hidden `<h2>Our daycare services</h2>` + `<ul>` lists all 106 services; container `aria-label` describes the scene.

## Interactions & Behaviour
- **Ambient rain**: population ramps in over ~5s to `clamp(width/46, 10, 38) × density`. Spawn x avoids the last 4 spawn positions (min gap `min(120px, 12%)`). Words sway: `sin(t·f·2π+φ) × amp`, f ∈ 0.18–0.42Hz, amp 5–13px (less for near words). All 106 words cycle before any repeats (shuffled queue excluding on-screen words).
- **Cursor repel**: within 150px radius, words push horizontally up to 62px (falloff `(1-dist/150)²`, spring-damped `damp(4)`), and fall speed slows up to 55% — the rain "parts" around the cursor.
- **Hover a word**: fall speed ×0.22, scale → 1.14 (spring `damp(14)`), colour → `#0090C8`, opacity → 1. Reverts on leave.
- **Click/tap a word**: word becomes the dog's target (slows to ×0.45, stays highlighted). Dog runs under it (max 560px/s, accel spring `damp(6)`), waits looking up (tail 3.2Hz, crouch grows as the word nears), then leaps when needed jump height ≤170 (`T=0.56s`, or a 0.42s dive if low): parabolic `air = h·4p(1-p)`, jaw opens to 21° until p=0.52, word magnet-lerps to the mouth from p=0.26, **catch at p=0.5** → 10-particle burst (blues `#00AFF1 #5AC8FA #0090C8 #B7E9FC`, 420–620ms, `cubic-bezier(0.17,0.67,0.4,1)`), big ripple, caught word floats up 66px over 1.3s in `#0090C8` 700, counter increments. Land squash (sy 0.92 / sx 1.06, 0.16s) → celebrate 1.0s (tail 4.5Hz 17°, hop, tongue). Clicks during a leap queue as `pending`.
- **Missed word** (lands first): small ground ripple; dog trots over and sniffs (head down 36°, 1.25s).
- **Auto-catch**: when idle/sitting, every 7–12s the dog picks a catchable word itself (disable via config).
- **Idle life**: breathing bob (1.4px @1.7Hz), tail wag 1.7Hz/8°, head + pupil track nearest near-depth word or the cursor, blinks every 2.4–6s (120ms, eyelid scaleY 0.12), ear flicks every 4–8s, **sits after 7.5s idle** (rump drops 9px, pitch −14°, hind legs fold, tail sweeps floor), **play-bows** after 18s without interaction (1.75s, front legs fold, tail 4.5Hz/18°).
- **Word landings**: elliptical ripple ring (26–44px wide, aspect 0.32, border 1.5px `rgba(0,175,241,0.38)`, 720ms ease-out, scale 0.15→1 + fade).
- **Fairy flyby**: first at ~8s, then every 22–36s. 44×34 SVG sprite crosses the top (6.5–9s traverse, gentle arc + 2.6Hz bob, wings flutter ±16° @ ~8Hz), dropping blue glints every 140ms (7px radial dots, 550–950ms, grow-then-vanish).
- **Turns**: facing flips via scaleX through 0 with `damp(17)` easing (quick paper-thin turn).
- **Reduced motion** (`prefers-reduced-motion`): no loop — ~8–24 static words scattered, dog standing at rest pose. All CSS animations killed by media query.
- **Touch**: `pointer: coarse` switches hint copy to "Tap…"; tap = click.
- **Tab hidden**: rAF pauses automatically; `dt` is clamped to 50ms so resume never jumps.

## State Management
- Drop objects: `{el, wordIndex, depth, x0, y, v, ox (repel offset), sway params, state: fall|target, hover, scale}`.
- Dog state machine: `enter → idle ⇄ sit / run → wait → leap → land → celebrate / sniff / bow`, plus `target`, `pending`, `face`, spring-damped pose object (13 channels: bodyY, pitch, sx, sy, headRot, jaw, 8 leg angles) smoothed with `1-exp(-rate·dt)` (rate 10 body / 14 legs / 16–19 airborne). Ear is a true spring (k=90, damping 11); tail = smoothed sine (per-state Hz/amp/base).
- UI state: `caught` count, `isTouch`. Everything else lives outside the render cycle.
- Config (exposed as tweakable props in the prototype): `rainDensity` 0.4–1.8 (default 1), `fallSpeed` 0.5–1.6 (1), `autoCatch` (true), `dogScale` 0.7–1.3 (1), `showHint` (true).

## Design Tokens
- Brand blue `#00AFF1` · brand dark `#0090C8` (hover/caught) · brand deep `#006A94` · ink `#111111`/`#1C1C1E` · floor `#F8FBFE` · hairline `rgba(60,60,67,0.08)` · white background.
- Dog rendering: body/head/tail fill = vertical gradient `#1C1C22 → #0C0C10` (userSpaceOnUse, y −95→0); near legs `#14141A`; near paws `#101015`; far legs/paws `#34343C`; ear `#2A2A33`; rim-light strokes `rgba(255,255,255,0.07–0.08)` width 2; tail curl accent `rgba(255,255,255,0.8)` width 1.5; eye white + pupil `#0C0C10` + 0.7r highlight; nose glint `rgba(255,255,255,0.5)`; tongue `#F09CA9`; shadow ellipse `rgba(17,17,17,0.09)` (shrinks ×0.45 and fades at jump apex).
- Type: Plus Jakarta Sans 400–800 (Google Fonts; site likely already loads it). Words 600; hint/counter 600 @13/12.5px.
- Motion: UI transitions 150–250ms `ease`; ripple 600–720ms ease-out; burst ≤620ms; float label 1.3s; pulse dot 2s ease-in-out; entrance fades 500ms ease (`translateY(10px)→0`).

## Assets
None external. Everything is inline SVG (dog rig, fairy) and CSS. Only dependency: Plus Jakarta Sans via Google Fonts. The dog/fairy are original vector artwork echoing the centre's logo silhouettes (black puppy + fairy, sky-blue accents).

## Files
- `Daycare Hero.dc.html` — the reference. Template/markup at top (layers, SVG rig with `data-part` hooks + rotation pivots listed in `applyDog()`); full engine in the `<script data-dc-script>` block. All keyframes (`ftRipple`, `ftBurst`, `ftFloat`, `ftPulse`, `ftGlint`, `ftIn`) in the `<style>` block.
- `support.js` — design-tool runtime, **reference only, do not ship**.

## Integration contract
Mount into the existing hero placeholder: give the component the placeholder's full width/height (≥540px tall), white background behind, nothing overlapping the bottom floor band. It self-measures via ResizeObserver (mobile <640px: dog ×0.7, smaller/denser-capped rain). Clean up on unmount: cancel rAF, disconnect ResizeObserver, remove pointer listeners.
