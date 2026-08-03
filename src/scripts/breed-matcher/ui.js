/* ===========================================================================
   Breed Matcher — UI LAYER
   ---------------------------------------------------------------------------
   All DOM work lives here. It owns no scoring: every number comes from
   engine.js, every breed fact from data.js, every service link from
   services.js. Lifted from the standalone tool with FOUR deliberate changes,
   and no others:

   1. CLIENTROUTER-SAFE. The site uses Astro view transitions, so this module is
      evaluated ONCE while the DOM is swapped on every navigation. `root`/`app`
      and the app state are (re)captured inside init(), never at module load, and
      init() re-runs on `astro:page-load`. (Same adaptation as
      src/scripts/dog-exercise-calculator/ui.js.)
   2. HANDLERS ARE NAMESPACED. The tool's markup uses inline onclick="", which
      needs globals — but an ES module has none. They are published as
      `window.ftBM` rather than as bare global names like `back` or `choose`,
      which would leak across every page of the site.
   3. IT REPORTS USAGE. Starting the quiz and reaching a result push the site's
      `tool_engagement` event (a key event, owner 2026-07-14) to the GTM
      dataLayer — consent-gated like everything else, and using only parameters
      already registered as GA4 custom dimensions.
   4. IT NO LONGER OWNS THE WHOLE VIEWPORT. The tool used to BE the page, so it
      scrolled the window to the top on every screen. It is now one section of a
      page, so it scrolls its own section into view instead — and never on the
      first render, which would otherwise yank a visitor past the hero on load.

   ⚠️ PLAIN JS ON PURPOSE — data.js/engine.js/services.js are imported by the node
   regression harness, which cannot load a .ts module.
   =========================================================================== */

import { BREEDS, QUESTIONS } from './data.js';
import { scoreBreed, whyLine, buildTips } from './engine.js';
import { svc, setGroomingUrl } from './services.js';

/* ===========================================================================
   Usage signal → the site's GTM dataLayer
   ---------------------------------------------------------------------------
   `tool_engagement` {tool, stage} — both already registered GA4 custom
   dimensions (2026-07-23), so this ships nothing GA4 cannot report on. De-duped
   so re-rendering the same result is one engagement, and wrapped so analytics
   can never break, slow or block the tool.
   =========================================================================== */
const ANALYTICS = { tool: 'breed-matcher' };

/** @param {'start'|'result'} stage @param {string} key de-dupe key for this stage */
function logUsage(stage, key) {
  try {
    if (state.logged[stage] === key) return;
    state.logged[stage] = key;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'tool_engagement', tool: ANALYTICS.tool, stage });
  } catch {
    /* analytics must never surface an error to the user */
  }
}

/* ===========================================================================
   Element references + state — both (re)captured per navigation
   =========================================================================== */

let root = null; // #bm-root  (the themed wrapper; carries data-grooming-url)
let app = null;  // #bm-app   (the screen the tool renders into)
let booted = false;

const CHECK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

function initialState() {
  return { screen: 'intro', step: 0, answers: {}, chosenBreed: null, logged: {} };
}
let state = initialState();

/* ===========================================================================
   Render
   =========================================================================== */

function setScreen(html) {
  app.innerHTML = html;
  app.classList.remove('fade');
  void app.offsetWidth;
  app.classList.add('fade');
  // Keep the tool's own section in view rather than jumping the whole page.
  // Skipped on the first render: the intro screen paints while the visitor is
  // still up in the hero, and scrolling then would drag them down the page.
  if (booted) {
    const top = root.getBoundingClientRect().top;
    if (top < 0 || top > 160) root.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  booted = true;
}

function renderIntro() {
  setScreen(`
    <section class="hero">
      <div class="eyebrow">Thinking about a new dog?</div>
      <h2>The dog you want, <em>made to work</em>.</h2>
      <p class="hero-lead">Most breed quizzes tell you you've chosen wrong. This one keeps your dream breed centre stage — gives you the honest fit for your life and space, then shows exactly how to close the gap.</p>
      <div class="spine">The right start prevents the problems people pay to fix later. We're the people who help you start right.</div>
      <ul class="hero-points">
        <li><span class="tick">${CHECK}</span><span>An honest match score for your real life — home, space, hours and all.</span></li>
        <li><span class="tick">${CHECK}</span><span>See your score move once the right support is factored in.</span></li>
        <li><span class="tick">${CHECK}</span><span>Plain-spoken tips from a working pro — the things that save you grief.</span></li>
      </ul>
      <button class="btn btn-primary btn-block" onclick="ftBM.goBreedSelect()">Start &nbsp;→</button>
      <p class="disclaimer" style="margin-top:18px">Takes about a minute. Nothing's saved or shared.</p>
    </section>`);
}

function goBreedSelect() {
  logUsage('start', '1');
  state.screen = 'breed';
  renderBreedSelect('');
}

function breedRows(filter) {
  const f = (filter || '').trim().toLowerCase();
  const list = BREEDS.filter((b) => b.name.toLowerCase().includes(f)).slice(0, 60);
  return list
    .map(
      (b) => `
    <button class="opt" onclick="ftBM.pickBreed('${b.name.replace(/'/g, "\\'")}')">
      <span>${b.name}</span><span class="breed-grp">${b.group}</span></button>`
    )
    .join('');
}

function renderBreedSelect(filter) {
  const rows = breedRows(filter);
  setScreen(`
    <div class="eyebrow">First — the one you've got your eye on</div>
    <div class="q-head"><h2>Which breed has caught your heart?</h2></div>
    <p class="q-help">We'll make this one the star of your results. Not sure yet? Skip it and we'll match you from scratch.</p>
    <div class="search-wrap">
      <input class="search-input" id="bm-breed-search" placeholder="Search 90+ breeds…" autocomplete="off"
        aria-label="Search breeds"
        oninput="ftBM.renderBreedSelectKeepFocus(this.value)" value="${(filter || '').replace(/"/g, '&quot;')}">
    </div>
    <div class="search-list">${rows || `<p class="q-help">No match — try another spelling, or skip.</p>`}</div>
    <div class="restart"><button class="btn-ghost" onclick="ftBM.skipBreed()">Skip — just match me →</button></div>
  `);
}

function renderBreedSelectKeepFocus(v) {
  const list = app.querySelector('.search-list');
  if (list) list.innerHTML = breedRows(v) || `<p class="q-help">No match — try another spelling, or skip.</p>`;
}

function pickBreed(name) { state.chosenBreed = name; startQuiz(); }
function skipBreed() { state.chosenBreed = null; startQuiz(); }
function startQuiz() { state.screen = 'quiz'; state.step = 0; renderQuestion(); }

function renderQuestion() {
  const q = QUESTIONS[state.step];
  const total = QUESTIONS.length;
  const pct = Math.round((state.step) / total * 100);
  const cur = state.answers[q.id];
  const isMulti = q.type === 'multi';
  const opts = q.opts
    .map((o) => {
      const sel = isMulti ? (Array.isArray(cur) && cur.includes(o.v)) : (cur === o.v);
      return `<button class="opt ${sel ? 'sel' : ''}" onclick="ftBM.choose('${q.id}','${o.v}',${isMulti})">
       <span class="box">${CHECK}</span><span>${o.label}</span></button>`;
    })
    .join('');
  setScreen(`
    <div class="progress">
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
      <div class="progress-label">${state.step + 1} / ${total}</div>
    </div>
    <div class="q-head"><h2>${q.title}</h2></div>
    ${q.help ? `<p class="q-help">${q.help}</p>` : `<div style="height:8px"></div>`}
    <div class="opts">${opts}</div>
    ${isMulti ? `<div class="multi-actions"><button class="btn btn-primary btn-block" onclick="ftBM.nextStep()">Continue →</button></div>` : ``}
    <div class="restart"><button class="btn-ghost" onclick="ftBM.back()">← Back</button></div>
  `);
  requestAnimationFrame(() => {
    const f = app.querySelector('.progress-fill');
    if (f) f.style.width = pct + '%';
  });
}

function choose(id, v, multi) {
  if (multi) {
    let arr = Array.isArray(state.answers[id]) ? [...state.answers[id]] : [];
    arr = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
    state.answers[id] = arr;
    renderQuestion();
  } else {
    state.answers[id] = v;
    setTimeout(nextStep, 170); // gentle auto-advance
  }
}

function nextStep() {
  if (state.step < QUESTIONS.length - 1) { state.step++; renderQuestion(); }
  else renderResults();
}

function back() {
  if (state.step > 0) { state.step--; renderQuestion(); }
  else goBreedSelect();
}

function renderResults() {
  state.screen = 'results';
  const a = state.answers;
  const ranked = BREEDS.map((b) => scoreBreed(b, a))
    .sort((x, y) => (y.hardNo ? -100 : y.supported) - (x.hardNo ? -100 : x.supported));

  let hero = null;
  if (state.chosenBreed) { hero = scoreBreed(BREEDS.find((b) => b.name === state.chosenBreed), a); }
  const heroIsHardNo = hero && hero.hardNo;

  // alternatives: top matches excluding the hero; surface more prominently on a hard-no
  const altPool = ranked.filter((r) => !hero || r.breed.name !== hero.breed.name);
  const altCount = heroIsHardNo ? 5 : 3;
  const alts = altPool.slice(0, altCount);

  let html = `<div class="result-top"><div class="eyebrow">Your results</div></div>`;

  if (hero) {
    html += heroCardHtml(hero, a);
  } else {
    html += `<div class="q-head"><h2 style="margin-bottom:6px">Your strongest matches</h2></div>
           <p class="q-help">Ranked for the life you've described. Tap any to make it the star.</p>`;
    html += heroCardHtml(alts[0] && ranked[0], a); // top match as hero when none chosen
  }

  // alternatives block
  const altTitle = hero
    ? (heroIsHardNo ? "Where we'd gently point you instead" : 'Others you might also fall for')
    : 'More that suit you';
  html += `<div class="section-lab">${altTitle}</div>
    <div class="alts">${alts.map((r) => altHtml(r)).join('')}</div>`;

  html += `<p class="disclaimer">These are honest generalisations to guide you — every dog is an individual, and the right upbringing changes everything. For a steer on your exact situation, ${svc('chat', 'have a chat with us')}.</p>
    <div class="footer-spine">Start right. The rest follows.</div>
    <div class="restart"><button class="btn-ghost" onclick="ftBM.restart()">↺ Start again</button></div>`;

  setScreen(html);
  animateBars();
  logUsage('result', JSON.stringify({ b: state.chosenBreed, a }));
}

function heroCardHtml(r, a) {
  if (!r) return '';
  const b = r.breed;
  const sizeWord = ['', 'toy', 'small', 'medium-sized', 'large', 'giant'][b.size];
  const lift = r.lift > 0 && !r.hardNo;

  // bridge numbers
  const bridgeHtml = r.hardNo
    ? `<div class="bar"><div class="base" data-w="${r.base}" style="background:var(--clay)"></div></div>`
    : lift
      ? `<div class="bar"><div class="base" data-w="${r.base}"></div><div class="lift" data-base="${r.base}" data-w="${r.supported}"></div></div>`
      : `<div class="bar"><div class="base" data-w="${r.supported}"></div></div>`;

  const numsHtml = (lift && !r.hardNo)
    ? `<div class="bridge-nums">
         <div class="bridge-num"><span class="lab">Your setup now</span><span class="val">${r.base}%</span></div>
         <span class="bridge-arrow">→</span>
         <div class="bridge-num after"><span class="lab">With our support</span><span class="val">${r.supported}%</span></div>
       </div>`
    : `<div class="bridge-nums">
         <div class="bridge-num"><span class="lab">${r.hardNo ? 'Honest match' : 'Match for you'}</span><span class="val" style="${r.hardNo ? 'color:var(--clay)' : ''}">${r.hardNo ? r.base : r.supported}%</span></div>
       </div>`;

  let inner = `
    <h3 class="breed-name">${b.name}</h3>
    <div class="breed-meta">${b.group} · ${sizeWord} breed</div>
    <div class="bridge">${numsHtml}${bridgeHtml}
      <div class="band ${r.band.k}"><span class="dot"></span>${r.band.t}</div>
    </div>
    <p class="why">${whyLine(r, a)}</p>`;

  // strong steer
  if (r.steer) {
    inner += `<div class="steer-note"><div class="st-head">⚠ Worth being straight with you</div>${r.steer.text}</div>`;
  }
  // hard-no honesty
  if (r.hardNo) {
    inner += `<div class="honest-note"><strong>This one we can't bridge.</strong> ${r.hardNo.reason} We'd rather tell you now than sell you a struggle.</div>`;
  }

  // bridges
  if (r.bridges.length) {
    inner += `<div class="section-lab">Closing the gap${lift ? ` · ${r.base}% → ${r.supported}%` : ''}</div>
      <div class="bridge-list">${r.bridges.map((g) => `
        <div class="bridge-item">
          <div class="bi-top"><span class="gap">${g.gap}</span>${(lift && g.lift) ? `<span class="lift-tag">${g.lift}</span>` : ''}</div>
          <div class="fix">${g.fix}</div>
        </div>`).join('')}</div>`;
  }
  // soft cautions
  if (r.cautions.length) {
    inner += r.cautions.map((c) => `<p class="why muted" style="font-size:14px;margin-top:14px">A gentle note — ${c}</p>`).join('');
  }

  // tips
  const tips = buildTips(r, a);
  inner += `<div class="section-lab">Whatever you choose — start it right</div>
    <p class="tip-key">A few things worth more than the breed decision itself.</p>
    <div class="tips">${tips.map((t) => `
      <div class="tip ${t.flag ? 'flag' : ''} ${t.first ? 'first-tip' : ''}">
        <div class="t-head">${t.head}${t.promote ? '<span class="pill">Read this</span>' : ''}</div>
        <div class="t-body">${t.body}</div>
      </div>`).join('')}</div>`;

  return `<div class="hero-card">${inner}</div>`;
}

function altHtml(r) {
  const b = r.breed;
  const score = r.hardNo ? r.base : r.supported;
  let line;
  if (r.hardNo) line = 'A fairer fit for your space';
  else if (r.lift >= 10) line = `${r.base}% now · ${r.supported}% with our support`;
  else line = `${b.group} · ${['', 'toy', 'small', 'medium', 'large', 'giant'][b.size]} breed`;
  return `<button class="alt" onclick="ftBM.chooseAlt('${b.name.replace(/'/g, "\\'")}')">
    <span class="a-score">${score}%</span>
    <span class="a-mid"><span class="a-name">${b.name}</span><span class="a-line">${line}</span></span>
    <span class="a-go">→</span></button>`;
}

function chooseAlt(name) { state.chosenBreed = name; renderResults(); }
function restart() { state.answers = {}; state.chosenBreed = null; state.step = 0; renderIntro(); }

function animateBars() {
  requestAnimationFrame(() => {
    setTimeout(() => {
      app.querySelectorAll('.bar .base').forEach((el) => { el.style.width = el.dataset.w + '%'; });
      app.querySelectorAll('.bar .lift').forEach((el) => {
        el.style.left = el.dataset.base + '%';
        el.style.width = (el.dataset.w - el.dataset.base) + '%';
      });
    }, 60);
  });
}

/* ===========================================================================
   Boot
   =========================================================================== */

/**
 * The homepage embeds this page in an iframe. A same-tab link inside a frame
 * would load the whole site into an 900px box, so when framed every one of our
 * own links is retargeted to the top window at click time. Capture phase, and
 * only when the author set no target — dynamically-injected links are covered
 * because this is delegated, not applied per element.
 */
function bindFramedLinks() {
  if (window.self === window.top) return;
  document.addEventListener(
    'click',
    (e) => {
      const a = e.target instanceof Element ? e.target.closest('a[href]') : null;
      if (a && !a.target && a.origin === window.location.origin) a.target = '_top';
    },
    true
  );
}

function init() {
  root = document.getElementById('bm-root');
  if (!root || root.dataset.bmInit === '1') return;
  app = document.getElementById('bm-app');
  if (!app) return;
  root.dataset.bmInit = '1';

  // The salon is a sister site; its URL is business data, handed over by the page.
  setGroomingUrl(root.dataset.groomingUrl);

  state = initialState();
  booted = false;

  // The tool's markup uses inline onclick="", so the handlers have to be
  // reachable by name — namespaced, never as bare globals.
  window.ftBM = { goBreedSelect, renderBreedSelectKeepFocus, pickBreed, skipBreed, choose, nextStep, back, chooseAlt, restart };

  bindFramedLinks();
  renderIntro();
}

// Run on first load AND after every Astro view transition into this page. The
// bmInit flag makes the same-DOM double-call harmless (the initial load also
// fires astro:page-load); a fresh DOM after navigation has no flag, so it inits.
init();
document.addEventListener('astro:page-load', init);
