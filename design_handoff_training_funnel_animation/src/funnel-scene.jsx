// funnel-scene.jsx — "Convergence Core" for The Fairy Tails K9 Centre
// Landscape, top→bottom: input cards fan across the top, wires cable down and
// feed a luminous convergence core (orbital rings + ripples), which blooms
// into the single outcome. Engine globals are read lazily from window.
const LINEAR = (t) => t;

const W = 1920, H = 1080;

// ── Fairy Tails tokens ──────────────────────────────────────────────────────
const INK   = '#1C1C1E';
const INK_2 = '#6E6E76';
const INK_3 = '#A6A6AD';
const PAGE  = '#F4F5F7';
const CARD  = '#FFFFFF';
const BLUE  = '#00AFF1';
const BLUE_D= '#0090C8';
const BLUE_DEEP = '#006A94';
const AMBER = '#FF9500';
const PURPLE= '#AF52DE';
const GREEN = '#34C759';
const FONT  = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif";

// ── geometry ────────────────────────────────────────────────────────────────
const CORE = { x: 960, y: 674 };
const PUPPY_BASE = 380;          // image-slot intrinsic px; scaled via transform
const PUPPY_MIN = 15, PUPPY_MAX = 152;   // radius, tiny → grown
const CHIP_W = 340;
const MARGIN = 76;
const CY0 = 118;                 // first chip row
const CHIP_BOTTOM = 452;         // chips must finish above the wire field

const DEG = Math.PI / 180;

// ── the inputs, grouped (one group per top column) ──────────────────────────
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

function parseExtra(s) {
  return String(s || '').split(/[\n,]/).map((x) => x.trim()).filter(Boolean);
}

// ── math helpers ────────────────────────────────────────────────────────────
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp  = (a, b, t) => a + (b - a) * t;
const seg   = (t, s, d, e = LINEAR) => e(clamp((t - s) / d));
const cubic = (t, a, b, c, d) => {
  const u = 1 - t;
  return u*u*u*a + 3*u*u*t*b + 3*u*t*t*c + t*t*t*d;
};
const smooth = (x) => { x = clamp(x); return x*x*(3 - 2*x); };

// ── layout: 4 columns across the top, then route a wire from each chip ───────
function buildLayout(groups) {
  const cols = groups.length;
  const colW = (W - MARGIN * 2) / cols;
  const maxCount = groups.reduce((m, g) => Math.max(m, g.chips.length), 0);
  let step = (CHIP_BOTTOM - CY0) / maxCount;
  step = Math.max(42, Math.min(58, step));
  const chipH = Math.max(36, Math.min(46, Math.round(step - 10)));

  const items = [], chips = [];
  let idx = 0;
  groups.forEach((g, ci) => {
    const cx = Math.round(MARGIN + colW * (ci + 0.5));
    const left = Math.round(cx - CHIP_W / 2);
    items.push({ type: 'header', name: g.name, color: g.color, left, y: 72 });
    const cnt = g.chips.length;
    g.chips.forEach((label, ri) => {
      const cy = Math.round(CY0 + chipH / 2 + ri * step);
      const cyBottom = cy + chipH / 2;
      // fan angle: column position + slight per-row spread → clean, non-crossing
      const base = ((cx - CORE.x) / 720) * 60;                 // degrees
      const spread = (ri - (cnt - 1) / 2) * 3.2;
      const ang = (base + spread) * DEG;
      const chip = { label, color: g.color, cx, left, cy, chipH, i: idx++,
                     cyBottom, ang, cp1x: cx, cp1y: cyBottom + 150 };
      chips.push(chip); items.push({ type: 'chip', ...chip });
    });
  });
  return { items, chips };
}

// wire routing onto a ring of radius `ringR` around the core (recomputed per
// frame so the wires stay attached to the growing puppy's edge)
const ringPt = (ang, r) => ({ x: CORE.x + r * Math.sin(ang), y: CORE.y - r * Math.cos(ang) });
const wirePath = (c, ringR) => {
  const e = ringPt(c.ang, ringR), q = ringPt(c.ang, ringR + 140);
  return `M ${c.cx} ${c.cyBottom} C ${c.cp1x} ${c.cp1y} ${q.x.toFixed(1)} ${q.y.toFixed(1)} ${e.x.toFixed(1)} ${e.y.toFixed(1)}`;
};
const wireX = (c, ringR, p) => cubic(p, c.cx, c.cp1x, ringPt(c.ang, ringR + 140).x, ringPt(c.ang, ringR).x);
const wireY = (c, ringR, p) => cubic(p, c.cyBottom, c.cp1y, ringPt(c.ang, ringR + 140).y, ringPt(c.ang, ringR).y);

// per-chip timings
const popStart  = (i) => 3.9 + i * 0.28;
const connStart = (i) => popStart(i) + 0.35;
const CONN_DRAW = 0.9;
const OUT0 = 20.4;

// ── scene ───────────────────────────────────────────────────────────────────
function Scene({ items, chips }) {
  const { useTime, Easing } = window;
  const t = useTime();
  const ITEMS = items, CHIPS = chips, N = chips.length;

  const cam = 1 + 0.03 * seg(t, 14, 9, Easing.easeInOutSine);
  const fieldFade = seg(t, 3.0, 1.0, Easing.easeOutQuad);
  const dim = 1 - 0.55 * seg(t, OUT0 - 0.2, 1.6, Easing.easeInOutSine);

  // the puppy grows across the whole timeline (tiny → full)
  const grow = seg(t, 4.2, 18.5, Easing.easeInOutSine);
  const R = lerp(PUPPY_MIN, PUPPY_MAX, grow);   // puppy radius
  const ringR = R + 24;                         // wires attach just outside it
  const puppyScale = (R * 2) / PUPPY_BASE;

  // core energy ramps as streams connect, then hands off to the outcome
  const charge = clamp((t - 5.5) / 9);
  const bloom  = seg(t, OUT0, 0.7, Easing.easeOutCubic);
  const coreOn = (0.35 + 0.65 * charge) * (1 - 0.6 * seg(t, OUT0, 1.1));
  const pulse  = 0.5 + 0.5 * Math.sin(t * 2.6);
  const rot    = t * 26;   // deg/s, orbital rings

  // flowing particles down every wire, onto the puppy's edge
  const flowOn = 1 - 0.5 * seg(t, OUT0 - 0.2, 1.6);
  const particles = [];
  if (flowOn > 0.01) {
    for (let li = 0; li < N; li++) {
      const c = CHIPS[li];
      if (t < connStart(li) + CONN_DRAW) continue;
      for (let k = 0; k < 3; k++) {
        let p = ((t * 0.17) + li * 0.13 + k * 0.34) % 1;
        if (p < 0) p += 1;
        const a = smooth(p / 0.08) * (1 - smooth((p - 0.82) / 0.18)) * flowOn * dim;
        if (a <= 0.02) continue;
        const r = 3.2 + 1.6 * smooth(p);   // grows as it nears the core
        particles.push(<circle key={li + '-' + k} cx={wireX(c, ringR, p)} cy={wireY(c, ringR, p)}
                               r={r} fill={c.color} opacity={a * 0.95} />);
      }
    }
  }

  // ripples pulsing out from the puppy's halo
  const ripples = [];
  if (coreOn > 0.02) {
    for (let r = 0; r < 3; r++) {
      let ph = ((t * 0.5) + r / 3) % 1;
      const rad = lerp(ringR, ringR + 130, ph);
      const op = (1 - ph) * coreOn * 0.4;
      ripples.push(<circle key={'rp' + r} cx={CORE.x} cy={CORE.y} r={rad}
                           fill="none" stroke={BLUE} strokeWidth={2} opacity={op} />);
    }
  }

  return (
    <div style={{ position: 'absolute', inset: 0, transform: `scale(${cam})`,
                  transformOrigin: '50% 60%' }}>

      {/* eyebrow */}
      <div style={{ position: 'absolute', left: MARGIN, top: 40, opacity: fieldFade * dim,
        font: `700 15px/1 ${FONT}`, letterSpacing: '0.16em', color: INK_3,
        textTransform: 'uppercase' }}>Everything we do</div>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
           style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#eafaff" stopOpacity={clamp((coreOn + bloom) * 0.95)} />
            <stop offset="30%" stopColor="#7fd8ff" stopOpacity={coreOn * 0.85} />
            <stop offset="70%" stopColor={BLUE}    stopOpacity={coreOn * 0.45} />
            <stop offset="100%" stopColor={BLUE}   stopOpacity="0" />
          </radialGradient>
          <radialGradient id="field" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor={BLUE} stopOpacity={0.10 * fieldFade} />
            <stop offset="100%" stopColor={BLUE} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ambient field behind everything */}
        <circle cx={CORE.x} cy={CORE.y} r="360" fill="url(#field)" />

        {/* wires */}
        <g style={{ opacity: dim }}>
          {CHIPS.map((c) => {
            const d = seg(t, connStart(c.i), CONN_DRAW, Easing.easeOutCubic);
            if (d <= 0) return null;
            return (
              <path key={c.i} d={wirePath(c, ringR)} fill="none" stroke={c.color}
                    strokeOpacity="0.30" strokeWidth="1.5" strokeLinecap="round"
                    strokeDasharray="1400" strokeDashoffset={1400 * (1 - d)} />
            );
          })}
        </g>

        {/* flowing particles */}
        {particles}

        {/* ── halo around the growing puppy ── */}
        {ripples}
        {/* rim entry sparks — a soft dot per stream, in its own colour */}
        {CHIPS.map((c) => {
          const on = seg(t, connStart(c.i) + CONN_DRAW, 0.5) * coreOn;
          if (on <= 0.02) return null;
          const e = ringPt(c.ang, ringR);
          return <circle key={'sp' + c.i} cx={e.x} cy={e.y} r={3.4}
                         fill={c.color} opacity={on * (0.55 + 0.45 * pulse)} />;
        })}
        {/* orbital rings, scaling with the puppy */}
        <g transform={`rotate(${rot} ${CORE.x} ${CORE.y})`} opacity={coreOn}>
          <ellipse cx={CORE.x} cy={CORE.y} rx={ringR + 34} ry={(ringR + 34) * 0.34} fill="none"
                   stroke={BLUE} strokeOpacity="0.5" strokeWidth="1.5" />
        </g>
        <g transform={`rotate(${-rot * 0.7 + 60} ${CORE.x} ${CORE.y})`} opacity={coreOn}>
          <ellipse cx={CORE.x} cy={CORE.y} rx={ringR + 64} ry={(ringR + 64) * 0.3} fill="none"
                   stroke={BLUE_D} strokeOpacity="0.35" strokeWidth="1.5" />
        </g>
        {/* soft glow halo behind the puppy */}
        <circle cx={CORE.x} cy={CORE.y} r={ringR + 110 + 60 * bloom} fill="url(#coreGlow)" />
      </svg>

      {/* ── the growing puppy portrait ── */}
      <div style={{ position: 'absolute', left: CORE.x, top: CORE.y,
        width: PUPPY_BASE, height: PUPPY_BASE,
        transform: `translate(-50%,-50%) scale(${puppyScale})`,
        borderRadius: '50%', overflow: 'hidden', background: CARD,
        boxShadow: `0 0 0 ${10 / puppyScale}px #fff, 0 ${24 / puppyScale}px ${70 / puppyScale}px rgba(0,110,160,0.28)` }}>
        <image-slot id="ft-puppy" shape="circle" fit="cover"
          placeholder="Drop a puppy photo"
          style={{ width: '100%', height: '100%', display: 'block' }}></image-slot>
      </div>

      {/* headers + chips */}
      {ITEMS.map((it, k) => {
        if (it.type === 'header') {
          const op = seg(t, 3.4, 0.7) * dim;
          return (
            <div key={'h' + k} style={{ position: 'absolute', left: it.left, top: it.y,
              width: CHIP_W, display: 'flex', alignItems: 'center', gap: 9, opacity: op,
              font: `700 13px/1 ${FONT}`, letterSpacing: '0.11em', color: INK_2,
              textTransform: 'uppercase' }}>
              <span style={{ width: 8, height: 8, borderRadius: 3, background: it.color,
                flex: '0 0 auto' }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis',
                whiteSpace: 'nowrap' }}>{it.name}</span>
            </div>
          );
        }
        const p = seg(t, popStart(it.i), 0.5, Easing.easeOutCubic);
        if (p <= 0) return null;
        return (
          <div key={'c' + k} style={{ position: 'absolute', left: it.left, top: it.cy,
            width: CHIP_W, height: it.chipH, boxSizing: 'border-box',
            transform: `translateY(calc(-50% + ${(1 - p) * -12}px)) scale(${0.97 + 0.03 * p})`,
            opacity: p * dim, display: 'flex', alignItems: 'center', gap: 11,
            padding: '0 15px', background: CARD, borderRadius: 12,
            borderLeft: `3px solid ${it.color}`,
            boxShadow: '0 0.5px 0 rgba(16,24,40,0.04), 0 3px 10px rgba(16,24,40,0.05)' }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: it.color,
              flex: '0 0 auto' }} />
            <span style={{ font: `600 18px/1 ${FONT}`, color: INK, letterSpacing: '-0.01em',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.label}</span>
          </div>
        );
      })}

      <Outcome t={t} />
    </div>
  );
}

function Outcome({ t }) {
  const { Easing } = window;
  if (t < OUT0 - 0.1) return null;
  const eb   = seg(t, OUT0, 0.6, Easing.easeOutCubic);
  const rise = seg(t, OUT0 + 0.15, 0.7, Easing.easeOutCubic);
  const line = seg(t, OUT0 + 0.55, 0.7, Easing.easeOutQuad);
  const cap  = seg(t, OUT0 + 0.9, 0.7, Easing.easeOutCubic);
  const logo = seg(t, OUT0 + 1.4, 0.8, Easing.easeOutCubic);
  // sits just below the grown puppy
  const top = CORE.y + PUPPY_MAX + 26;
  return (
    <div style={{ position: 'absolute', left: CORE.x, top: top, width: 720,
      transform: 'translateX(-50%)', textAlign: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ font: `700 13px/1 ${FONT}`, letterSpacing: '0.2em', color: INK_3,
        textTransform: 'uppercase', opacity: eb,
        transform: `translateY(${(1 - eb) * 8}px)` }}>The outcome</div>
      <div style={{ font: `800 42px/1.05 ${FONT}`, color: BLUE, letterSpacing: '-0.03em',
        marginTop: 9, opacity: clamp(rise * 1.3),
        transform: `translateY(${(1 - rise) * 14}px)`, textWrap: 'balance' }}>
        A confident, reliable dog
      </div>
      <div style={{ width: 60, height: 2, borderRadius: 2, background: 'rgba(60,60,67,0.18)',
        margin: '14px 0 0', transform: `scaleX(${line})` }} />
      <div style={{ font: `500 19px/1.4 ${FONT}`, color: INK_2, marginTop: 13,
        opacity: cap, maxWidth: 560, letterSpacing: '-0.005em' }}>
        Not one activity — many connected pieces, working as one.
      </div>
      <div style={{ marginTop: 16, opacity: logo, transform: `translateY(${(1 - logo) * 12}px)` }}>
        <img src="logo.png" alt="The Fairy Tails K9 Centre"
             style={{ height: 52, display: 'block' }} />
      </div>
    </div>
  );
}

// ── opening title ───────────────────────────────────────────────────────────
function Title() {
  const { useTime, Easing } = window;
  const t = useTime();
  const inn = seg(t, 0.25, 0.9, Easing.easeOutCubic);
  const out = 1 - seg(t, 2.9, 0.6, Easing.easeInQuad);
  const cover = 1 - seg(t, 2.7, 0.9, Easing.easeInOutSine);
  const op = clamp(inn * out);
  if (cover <= 0.01 && op <= 0.01) return null;
  const sub = seg(t, 0.9, 0.9, Easing.easeOutCubic);
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: PAGE, opacity: cover }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', opacity: op,
        transform: `translateY(${(1 - inn) * 16}px)` }}>
        <div style={{ font: `700 18px/1 ${FONT}`, letterSpacing: '0.22em', color: BLUE_DEEP,
          textTransform: 'uppercase', marginBottom: 28 }}>The Fairy Tails · K9 Centre</div>
        <div style={{ font: `800 74px/1.1 ${FONT}`, color: INK, letterSpacing: '-0.03em',
          textAlign: 'center', maxWidth: 1160, textWrap: 'balance' }}>
          Behaviour training isn’t one thing.
        </div>
        <div style={{ font: `500 30px/1.4 ${FONT}`, color: INK_2, textAlign: 'center',
          marginTop: 22, opacity: sub, letterSpacing: '-0.01em' }}>
          It’s the sum of many small things, done consistently.
        </div>
      </div>
    </>
  );
}

function FunnelScene(props) {
  const { Stage, Sprite } = window;
  if (!Stage) return null;
  const groups = GROUPS.map((g) => ({ ...g, chips: [...g.chips] }));
  parseExtra(props.extraSocialising).forEach((l) => groups[0].chips.push(l));
  parseExtra(props.extraWorld).forEach((l) => groups[1].chips.push(l));
  parseExtra(props.extraPeople).forEach((l) => groups[2].chips.push(l));
  parseExtra(props.extraHealth).forEach((l) => groups[3].chips.push(l));
  const layout = buildLayout(groups);
  return (
    <Stage width={W} height={H} duration={28} background={PAGE}>
      <Sprite start={0} end={28}><Scene items={layout.items} chips={layout.chips} /></Sprite>
      <Sprite start={0} end={4}><Title /></Sprite>
    </Stage>
  );
}

window.FunnelScene = FunnelScene;
