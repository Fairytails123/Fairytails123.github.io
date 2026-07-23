/* ===========================================================================
   Dog Walking Calculator — UI LAYER
   ---------------------------------------------------------------------------
   All DOM work lives here. It owns no rules and no numbers: every figure comes
   from engine.js, every user-facing string comes from copy.js, every fact comes
   from data.js. That separation is what lets the whole thing be restyled — or
   dropped into an Astro page — without touching the maths.

   Element lookup is by [data-dwc="..."] hooks and ids ONLY. Class names are
   free to change with the theme; nothing here reads them.
   =========================================================================== */

import {
  BANDS,
  BAND_ORDER,
  RULES,
  calculate,
  validate,
  normaliseInput,
  searchBreedsWithMeta,
  getBreedBySlug,
  getBand,
  hasNoMatches,
  parseQuery,
  buildQuery,
} from './engine.js';

import { COPY, formatRange, formatStageNote, formatPuppyHint } from './copy.js';

/* ===========================================================================
   Usage signal → the site's GTM dataLayer
   ===========================================================================
   The standalone tool shipped a disabled fire-and-forget beacon. On the site we
   drop it and reuse the existing consent-gated GTM/GA4 path instead: submitting
   the calculator pushes `tool_engagement` — one of the site's four key events
   (owner, 2026-07-14) — carrying the tool name. De-duped so pressing the button
   twice on the same dog is one engagement, and wrapped so analytics can never
   break, slow or block the calculator.
   =========================================================================== */
const ANALYTICS = { tool: 'dog-exercise-calculator' };

/**
 * @param {object} result
 * @param {'result'|'deeplink_result'} stage How the answer was reached. A `?breed=`
 *   deep link from the 97-breed table auto-computes without a button press — that is
 *   the page's PRIMARY SEO mechanic, so it must count as engagement, but it is tagged
 *   separately so it can always be told apart from a hand-driven calculation.
 */
function logUsage(result, stage) {
  try {
    // Pressing the button twice on the same dog is one engagement, not two.
    const key = JSON.stringify({
      mode: result.input.mode,
      band: result.band.id,
      breed: result.breed ? result.breed.slug : null,
      stage: result.lifeStage,
    });
    if (key === state.lastLoggedKey) return;
    state.lastLoggedKey = key;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'tool_engagement', tool: ANALYTICS.tool, stage: stage || 'result' });
  } catch {
    /* analytics must never surface an error to the user */
  }
}

/* ===========================================================================
   Tiny DOM helpers
   =========================================================================== */

// ⚠️ ClientRouter-safe: the site uses Astro view transitions, so this module is
// evaluated ONCE but the DOM is swapped on every navigation. `root` and every
// node reference below are therefore (re)captured inside init(), not at module
// load, and init() re-runs on `astro:page-load`. (Adapted from the standalone
// tool's ui.js — the only change the Astro-page integration needs, per its
// INTEGRATION.md §6. The engine/data/copy modules are untouched.)
let root = null;

/** @param {string} hook @returns {HTMLElement|null} */
const el = (hook) => root.querySelector(`[data-dwc="${hook}"]`);
/** @param {string} hook @returns {HTMLElement[]} */
const all = (hook) => Array.from(root.querySelectorAll(`[data-dwc="${hook}"]`));

/** Escape text for safe insertion into innerHTML. */
function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

/** @param {HTMLElement|null} node @param {boolean} shown */
function show(node, shown) {
  if (node) node.hidden = !shown;
}

/* ===========================================================================
   Element references
   =========================================================================== */

// (Re)captured in init() on every navigation — see the ClientRouter note above.
// `footer` is intentionally gone: the sourcing + vet disclaimer are rendered
// server-side on the Astro page (crawlable, single-sourced from copy.js), so the
// tool no longer injects them client-side.
let nodes = {};
function captureNodes() {
  return {
    form: document.getElementById('dwc-form'),
    modeButtons: all('mode'),
    panelBreed: el('panel-breed'),
    panelEnergy: el('panel-energy'),

    breedInput: el('breed-input'),
    breedListbox: el('breed-listbox'),
    breedSearchWrap: el('breed-search-wrap'),
    breedChosen: el('breed-chosen'),
    breedChosenName: el('breed-chosen-name'),
    breedChosenBand: el('breed-chosen-band'),
    breedChange: el('breed-change'),
    breedNoMatch: el('breed-nomatch'),
    searchNote: el('search-note'),

    bandGroup: el('band-group'),
    stageButtons: all('stage'),
    stageNote: el('stage-note'),
    puppyWrap: el('puppy-months-wrap'),
    puppyMonths: el('puppy-months'),
    puppyHint: el('puppy-hint'),

    submit: el('submit'),
    result: el('result'),
  };
}

/* ===========================================================================
   Application state
   =========================================================================== */

// A fresh state object per navigation (init() reassigns it), so a return visit
// via the ClientRouter never inherits the previous page's choices.
function initialState() {
  return {
    mode: 'breed',
    /** kept independently of bandId so switching modes never loses a choice */
    breedSlug: null,
    bandId: null,
    lifeStage: 'adult',
    puppyMonths: null,

    /** suggestion list */
    suggestions: [],
    /** total matches before truncation, and whether these are typo corrections */
    searchTotal: 0,
    searchIsFuzzy: false,
    activeIndex: -1,
    listOpen: false,

    /** last payload logged, so a repeat submit does not inflate usage stats */
    lastLoggedKey: null,

    /** once true, edits recompute the result live instead of leaving it stale */
    hasSubmitted: false,
  };
}
let state = initialState();

/** @returns {object} the engine Input for the current state */
function currentInput() {
  return normaliseInput({
    mode: state.mode,
    breedSlug: state.breedSlug,
    bandId: state.bandId,
    lifeStage: state.lifeStage,
    puppyMonths: state.puppyMonths,
  });
}

/* ===========================================================================
   Rendering — form
   =========================================================================== */

function renderMode() {
  for (const btn of nodes.modeButtons) {
    const active = btn.dataset.value === state.mode;
    btn.setAttribute('aria-checked', String(active));
    btn.tabIndex = active ? 0 : -1;
    btn.classList.toggle('is-active', active);
  }
  show(nodes.panelBreed, state.mode === 'breed');
  show(nodes.panelEnergy, state.mode === 'energy');
}

function renderStage() {
  for (const btn of nodes.stageButtons) {
    const active = btn.dataset.value === state.lifeStage;
    btn.setAttribute('aria-checked', String(active));
    btn.tabIndex = active ? 0 : -1;
    btn.classList.toggle('is-active', active);
  }
  nodes.stageNote.textContent = formatStageNote(state.lifeStage);
  show(nodes.puppyWrap, state.lifeStage === 'puppy');

  // Keep the native constraints in step with the single source of truth.
  nodes.puppyMonths.min = String(RULES.puppy.minMonths);
  nodes.puppyMonths.max = String(RULES.puppy.maxMonths);
  nodes.puppyHint.textContent = formatPuppyHint();
}

/** Build the energy cards from the dataset so bands have one source of truth. */
function renderBandCards() {
  nodes.bandGroup.innerHTML = BAND_ORDER.map((id) => {
    const band = BANDS[id];
    return `
      <button type="button" class="dwc__card" role="radio" aria-checked="false"
              data-dwc="band" data-value="${esc(id)}" tabindex="-1">
        <span class="dwc__card-label">${esc(band.label)}</span>
        <span class="dwc__card-summary">${esc(band.summary)}</span>
        <span class="dwc__card-range">${esc(formatRange(band.minMinutes, band.maxMinutes))}</span>
      </button>`;
  }).join('');
  renderBandSelection();
}

function renderBandSelection() {
  const cards = all('band');
  cards.forEach((card, i) => {
    const active = card.dataset.value === state.bandId;
    card.setAttribute('aria-checked', String(active));
    card.classList.toggle('is-active', active);
    // Roving tabindex: the checked one, or the first if none chosen yet.
    card.tabIndex = active || (!state.bandId && i === 0) ? 0 : -1;
  });
}

function renderBreedChoice() {
  const breed = getBreedBySlug(state.breedSlug);
  show(nodes.breedChosen, Boolean(breed));
  show(nodes.breedSearchWrap, !breed);

  if (breed) {
    const band = getBand(breed.band);
    nodes.breedChosenName.textContent = breed.name;
    nodes.breedChosenBand.textContent = COPY.chosenBandSuffix(band.label);
    closeList();
  }
}

/* ===========================================================================
   Rendering — the suggestion listbox (ARIA 1.2 combobox pattern)
   =========================================================================== */

function renderSuggestions() {
  const items = state.suggestions;

  if (!items.length) {
    nodes.breedListbox.innerHTML = '';
    closeList();
    return;
  }

  nodes.breedListbox.innerHTML = items
    .map((breed, i) => {
      const band = getBand(breed.band);
      return `
        <li class="dwc__option" role="option" id="dwc-opt-${i}"
            aria-selected="${i === state.activeIndex}"
            data-dwc="option" data-slug="${esc(breed.slug)}" data-index="${i}">
          <span class="dwc__option-name">${esc(breed.name)}</span>
          <span class="dwc__option-band">${esc(band.label)}</span>
        </li>`;
    })
    .join('');

  // Sibling of the listbox, never a child of it: a listbox may only contain
  // options, so the note lives outside and is announced via the input's
  // aria-describedby instead.
  let note = '';
  if (state.searchIsFuzzy) {
    note = COPY.search.didYouMean;
  } else if (state.searchTotal > items.length) {
    note = COPY.search.showingSomeOfMany(items.length, state.searchTotal);
  }
  nodes.searchNote.textContent = note;
  show(nodes.searchNote, Boolean(note));

  openList();
  syncActiveDescendant();
}

function syncActiveDescendant() {
  const options = all('option');
  options.forEach((opt, i) => {
    const active = i === state.activeIndex;
    opt.setAttribute('aria-selected', String(active));
    opt.classList.toggle('is-active', active);
    if (active) opt.scrollIntoView({ block: 'nearest' });
  });
  nodes.breedInput.setAttribute(
    'aria-activedescendant',
    state.activeIndex >= 0 && options[state.activeIndex] ? `dwc-opt-${state.activeIndex}` : ''
  );
}

function openList() {
  state.listOpen = true;
  show(nodes.breedListbox, true);
  nodes.breedInput.setAttribute('aria-expanded', 'true');
}

function closeList() {
  state.listOpen = false;
  state.activeIndex = -1;
  show(nodes.breedListbox, false);
  show(nodes.searchNote, false);
  nodes.breedInput.setAttribute('aria-expanded', 'false');
  nodes.breedInput.setAttribute('aria-activedescendant', '');
}

/* ===========================================================================
   Errors
   =========================================================================== */

const ERROR_FIELDS = ['breed', 'band', 'puppyMonths'];

function clearErrors() {
  for (const field of ERROR_FIELDS) {
    const node = el(`error-${field}`);
    if (node) {
      node.textContent = '';
      show(node, false);
    }
  }
  nodes.breedInput.removeAttribute('aria-invalid');
  nodes.puppyMonths.removeAttribute('aria-invalid');
}

/**
 * @param {{field:string, code:string, message:string}[]} errors
 */
function renderErrors(errors) {
  clearErrors();
  for (const error of errors) {
    const node = el(`error-${error.field}`);
    if (node) {
      node.textContent = error.message;
      show(node, true);
    }
    if (error.field === 'breed') nodes.breedInput.setAttribute('aria-invalid', 'true');
    if (error.field === 'puppyMonths') nodes.puppyMonths.setAttribute('aria-invalid', 'true');
  }

  // Move focus to the first thing that needs fixing.
  const first = errors[0];
  if (!first) return;
  if (first.field === 'breed') nodes.breedInput.focus();
  else if (first.field === 'puppyMonths') nodes.puppyMonths.focus();
  else if (first.field === 'band') {
    const card = all('band')[0];
    if (card) card.focus();
  }
}

/* ===========================================================================
   Rendering — the result
   =========================================================================== */

/**
 * @param {object} r result from engine.calculate
 * @returns {string} HTML
 */
function resultHtml(r) {
  const title = r.breed ? r.breed.name : r.band.descriptor;
  const headline = formatRange(r.headline.minMinutes, r.headline.maxMinutes);

  const parts = [];

  parts.push(`
    <div class="dwc__result-card">
      <p class="dwc__result-eyebrow">${esc(COPY.result.eyebrow(r.lifeStage))}</p>
      <h2 class="dwc__result-title">${esc(title)}</h2>
      <p class="dwc__result-band">${esc(r.band.label)}</p>

      <p class="dwc__result-figure">
        <strong class="dwc__result-minutes">${esc(headline)}</strong>
        <span class="dwc__result-unit">${esc(COPY.result.perDay)}</span>
      </p>`);

  /* ---- stage-specific detail ---- */
  if (r.lifeStage === 'puppy') {
    parts.push(`
      <p class="dwc__result-breakdown">${esc(
        COPY.result.puppyBreakdown(r.puppy.sessionsPerDay, r.puppy.perSession, r.puppy.months, r.puppy.cappedAtAdult)
      )}</p>`);

    if (r.puppy.cappedAtAdult) {
      parts.push(`<p class="dwc__result-note">${esc(COPY.result.puppyCapped(r.puppy.uncappedPerDay, r.adultBaseline.maxMinutes))}</p>`);
    }

    parts.push(`
      <p class="dwc__result-baseline">${esc(
        COPY.result.adultBaseline(formatRange(r.adultBaseline.minMinutes, r.adultBaseline.maxMinutes))
      )}</p>`);
  }

  if (r.lifeStage === 'senior') {
    parts.push(`
      <p class="dwc__result-breakdown">${esc(COPY.result.seniorBreakdown(r.senior.sessionsPerDay))}</p>
      <p class="dwc__result-baseline">${esc(
        COPY.result.adultBaseline(formatRange(r.adultBaseline.minMinutes, r.adultBaseline.maxMinutes))
      )}</p>`);
  }

  if (r.lifeStage === 'adult') {
    parts.push(`<p class="dwc__result-breakdown">${esc(COPY.result.adultBreakdown(r.headline.sessionsPerDay))}</p>`);
  }

  parts.push(`</div>`);

  /* ---- cautions ---- */
  if (r.cautions.length) {
    parts.push(`
      <div class="dwc__cautions">
        <h3 class="dwc__cautions-title">${esc(COPY.result.cautionsTitle)}</h3>
        <ul class="dwc__cautions-list">
          ${r.cautions
            .map((c) => {
              const text = COPY.cautions[c.id];
              if (!text) return '';
              return `<li class="dwc__caution dwc__caution--${esc(c.severity)}">
                        <strong>${esc(text.title)}</strong> ${esc(text.body)}
                      </li>`;
            })
            .join('')}
        </ul>
      </div>`);
  }

  /* ---- mental stimulation ---- */
  parts.push(`
    <div class="dwc__enrichment">
      <h3 class="dwc__enrichment-title">${esc(COPY.result.enrichmentTitle)}</h3>
      <p class="dwc__enrichment-intro">${esc(COPY.result.enrichmentIntro)}</p>
      <ul class="dwc__enrichment-list">
        ${COPY.result.enrichmentIdeas.map((i) => `<li>${esc(i)}</li>`).join('')}
      </ul>
    </div>`);

  /* ---- cross-link to the sibling tool ---- */
  parts.push(`
    <p class="dwc__crosslink">
      <a href="${esc(COPY.crossLink.href)}">${esc(COPY.crossLink.text)}</a>
    </p>`);

  return parts.join('');
}

/**
 * Compute and display. Returns true when a result was rendered.
 * @param {{focusResult?: boolean, log?: boolean}} [opts]
 * @returns {boolean}
 */
function computeAndRender(opts = {}) {
  const input = currentInput();
  const { ok, errors } = validate(input);

  if (!ok) {
    renderErrors(errors);
    show(nodes.result, false);
    nodes.result.innerHTML = '';
    return false;
  }

  clearErrors();
  const result = calculate(input);

  nodes.result.innerHTML = resultHtml(result);
  show(nodes.result, true);

  // Make the result linkable and shareable without reloading the page.
  try {
    const qs = buildQuery(input);
    history.replaceState(null, '', qs || location.pathname);
  } catch {
    /* file:// and sandboxed iframes reject replaceState — ignore */
  }

  if (opts.focusResult) nodes.result.focus();
  if (opts.log) logUsage(result, opts.logStage);
  return true;
}

/** After the first submit, keep the card in step with the inputs. */
function refreshIfLive() {
  if (!state.hasSubmitted) return;
  computeAndRender({ focusResult: false, log: false });
}

/* ===========================================================================
   Events
   =========================================================================== */

/** Shared roving-focus arrow handling for the radiogroup toolbars. */
function handleRovingKeys(event, buttons, onPick) {
  const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
  if (!keys.includes(event.key)) return;
  event.preventDefault();

  const currentIndex = buttons.findIndex((b) => b.getAttribute('aria-checked') === 'true');
  const from = currentIndex === -1 ? 0 : currentIndex;
  let next = from;

  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (from + 1) % buttons.length;
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (from - 1 + buttons.length) % buttons.length;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = buttons.length - 1;

  onPick(buttons[next].dataset.value);
  buttons[next].focus();
}

function bindEvents() {
  /* ---- mode ---- */
  for (const btn of nodes.modeButtons) {
    btn.addEventListener('click', () => setMode(btn.dataset.value));
    btn.addEventListener('keydown', (e) => handleRovingKeys(e, nodes.modeButtons, setMode));
  }

  /* ---- life stage ---- */
  for (const btn of nodes.stageButtons) {
    btn.addEventListener('click', () => setStage(btn.dataset.value));
    btn.addEventListener('keydown', (e) => handleRovingKeys(e, nodes.stageButtons, setStage));
  }

  /* ---- energy cards (delegated: they are rendered from data) ---- */
  nodes.bandGroup.addEventListener('click', (e) => {
    const card = e.target.closest('[data-dwc="band"]');
    if (card) setBand(card.dataset.value);
  });
  nodes.bandGroup.addEventListener('keydown', (e) => handleRovingKeys(e, all('band'), setBand));

  /* ---- breed search ---- */
  nodes.breedInput.addEventListener('input', onBreedInput);
  nodes.breedInput.addEventListener('keydown', onBreedKeydown);
  nodes.breedInput.addEventListener('blur', () => {
    // Delay so a click on an option is not cancelled by the list closing.
    window.setTimeout(closeList, 150);
  });

  nodes.breedListbox.addEventListener('mousedown', (e) => {
    // mousedown, not click: fires before blur.
    const option = e.target.closest('[data-dwc="option"]');
    if (option) {
      e.preventDefault();
      selectBreed(option.dataset.slug);
    }
  });

  nodes.breedChange.addEventListener('click', () => {
    state.breedSlug = null;
    renderBreedChoice();
    nodes.breedInput.value = '';
    state.suggestions = [];
    renderSuggestions();
    show(nodes.breedNoMatch, false);
    nodes.breedInput.focus();
    refreshIfLive();
  });

  /* ---- puppy months ---- */
  nodes.puppyMonths.addEventListener('input', () => {
    const raw = nodes.puppyMonths.value.trim();
    state.puppyMonths = raw === '' ? null : Number(raw);
    refreshIfLive();
  });

  /* ---- submit ---- */
  nodes.form.addEventListener('submit', (e) => {
    e.preventDefault();
    closeList();
    const rendered = computeAndRender({ focusResult: true, log: true });
    if (rendered) state.hasSubmitted = true;
  });
}

/* ---- state setters ---- */

function setMode(mode) {
  if (!mode || state.mode === mode) return;
  state.mode = mode;
  renderMode();
  clearErrors();
  refreshIfLive();
}

function setStage(stage) {
  if (!stage || state.lifeStage === stage) return;
  state.lifeStage = stage;
  renderStage();
  clearErrors();
  refreshIfLive();
}

function setBand(bandId) {
  if (!bandId || !getBand(bandId)) return;
  state.bandId = bandId;
  renderBandSelection();
  clearErrors();
  refreshIfLive();
}

function selectBreed(slug) {
  const breed = getBreedBySlug(slug);
  if (!breed) return;
  state.breedSlug = breed.slug;
  nodes.breedInput.value = breed.name;
  state.suggestions = [];
  state.activeIndex = -1;
  show(nodes.breedNoMatch, false);
  renderBreedChoice();
  clearErrors();
  refreshIfLive();
}

/* ---- breed search handlers ---- */

function onBreedInput() {
  const query = nodes.breedInput.value;

  // Typing after choosing means they are choosing again.
  if (state.breedSlug) {
    state.breedSlug = null;
    renderBreedChoice();
  }

  const { results, total, isFuzzy } = searchBreedsWithMeta(query);
  state.suggestions = results;
  state.searchTotal = total;
  state.searchIsFuzzy = isFuzzy;
  state.activeIndex = results.length ? 0 : -1;
  renderSuggestions();

  const noMatch = hasNoMatches(query);
  nodes.breedNoMatch.textContent = noMatch ? COPY.noMatch(query.trim()) : '';
  show(nodes.breedNoMatch, noMatch);

  refreshIfLive();
}

function onBreedKeydown(event) {
  const count = state.suggestions.length;

  switch (event.key) {
    case 'ArrowDown':
      if (!count) return;
      event.preventDefault();
      if (!state.listOpen) openList();
      state.activeIndex = (state.activeIndex + 1) % count;
      syncActiveDescendant();
      break;

    case 'ArrowUp':
      if (!count) return;
      event.preventDefault();
      if (!state.listOpen) openList();
      state.activeIndex = (state.activeIndex - 1 + count) % count;
      syncActiveDescendant();
      break;

    case 'Home':
      if (!state.listOpen || !count) return;
      event.preventDefault();
      state.activeIndex = 0;
      syncActiveDescendant();
      break;

    case 'End':
      if (!state.listOpen || !count) return;
      event.preventDefault();
      state.activeIndex = count - 1;
      syncActiveDescendant();
      break;

    case 'Enter':
      // Only intercept Enter when a suggestion is highlighted; otherwise let
      // the form submit normally.
      if (state.listOpen && state.activeIndex >= 0 && state.suggestions[state.activeIndex]) {
        event.preventDefault();
        selectBreed(state.suggestions[state.activeIndex].slug);
      }
      break;

    case 'Escape':
      if (state.listOpen) {
        event.preventDefault();
        closeList();
      }
      break;

    case 'Tab':
      closeList();
      break;

    default:
      break;
  }
}

/* ===========================================================================
   Boot
   =========================================================================== */

function applyDeepLink() {
  const prefill = parseQuery(window.location.search);
  if (prefill.mode) state.mode = prefill.mode;
  if (prefill.breedSlug) state.breedSlug = prefill.breedSlug;
  if (prefill.bandId) state.bandId = prefill.bandId;
  if (prefill.lifeStage) state.lifeStage = prefill.lifeStage;
  if (prefill.puppyMonths !== undefined && prefill.puppyMonths !== null) {
    state.puppyMonths = prefill.puppyMonths;
    nodes.puppyMonths.value = String(prefill.puppyMonths);
  }

  const breed = getBreedBySlug(state.breedSlug);
  if (breed) nodes.breedInput.value = breed.name;

  // A link that fully specifies a dog should land on the answer.
  return Boolean(validate(currentInput()).ok && (prefill.breedSlug || prefill.bandId));
}

function init() {
  root = document.getElementById('dwc-root');
  if (!root || root.dataset.dwcInit === '1') return;
  nodes = captureNodes();
  if (!nodes.form) return;
  root.dataset.dwcInit = '1';
  state = initialState();

  renderBandCards();
  bindEvents();

  const shouldAutoCompute = applyDeepLink();

  renderMode();
  renderStage();
  renderBreedChoice();

  if (shouldAutoCompute) {
    // A `?breed=` arrival IS the answer being delivered — the 97-breed table's deep links
    // are how this page is meant to earn search traffic. Logging it stops that traffic
    // reporting as total disengagement (and stops it suppressing the tool's key-event rate
    // against the estimator and toilet-schedule tools). `lastLoggedKey` still de-dupes the
    // follow-up "Calculate" press on the same dog.
    const rendered = computeAndRender({ focusResult: false, log: true, logStage: 'deeplink_result' });
    if (rendered) state.hasSubmitted = true;
  }
}

// Run on first load AND after every Astro view transition into this page. The
// dwcInit flag makes the same-DOM double-call harmless (the initial load also
// fires astro:page-load); a fresh DOM after navigation has no flag, so it inits.
init();
document.addEventListener('astro:page-load', init);
