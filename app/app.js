// Leonida Trophy Guide — renders the 55 trophies from data/trophies.json as a
// checklist with progress, filters, a spoiler setting, export and import.
// URL params the page honours: ?grade=silver|gold|bronze|platinum,
// ?kind=story|missable|collectible|activity|online, ?spoilers=on, ?sample=1.
import { loadEarned, saveEarned, loadSettings, saveSettings, exportProgress, importProgressFile, SAMPLE_EARNED } from './store.js';
import { countByKind, matchesFilter, isSpoilerHidden } from './filters.js';

const cardsEl = document.getElementById('cards');
const params = new URLSearchParams(location.search);
const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;

const settings = loadSettings();
const state = {
  earned: loadEarned(),
  kind: params.get('kind') ?? 'all',
  grade: params.get('grade') ?? 'all',
  search: '',
  spoilers: params.get('spoilers') === 'on' || settings.spoilers === true,
  earnedOnly: false,
};

// ?sample=1 seeds a realistic early-game checklist on a fresh browser, so the
// tracker can be tried at a glance. It never overwrites saved progress.
if (params.get('sample') === '1' && state.earned.size === 0) {
  state.earned = new Set(SAMPLE_EARNED);
  saveEarned(state.earned);
}

const GRADES = ['platinum', 'gold', 'silver', 'bronze'];
const SOURCE_NAMES = {
  'outputlag.com': 'OutputLag',
  'playday.one': 'Playday',
  'gtabase.com': 'GTABase',
  'press-start.com.au': 'Press Start',
};

function sourceName(url) {
  for (const [host, name] of Object.entries(SOURCE_NAMES)) {
    if (url.includes(host)) return name;
  }
  return 'Source';
}

function gradeLabel(grade) {
  return grade[0].toUpperCase() + grade.slice(1);
}

function renderProgress() {
  const total = trophies.length;
  const done = state.earned.size;
  const pct = Math.round((done / total) * 100);
  document.getElementById('progress-count').textContent = `${done} of ${total}`;
  document.getElementById('progress-pct').textContent = `${pct}% to platinum`;
  const bar = document.getElementById('progress-bar');
  bar.style.width = `${pct}%`;
  document.getElementById('progress-bar-wrap').setAttribute('aria-valuenow', String(done));
  const chips = document.getElementById('grade-chips');
  chips.replaceChildren();
  for (const grade of GRADES) {
    const ofGrade = trophies.filter((t) => t.grade === grade);
    const got = ofGrade.filter((t) => state.earned.has(t.id)).length;
    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.innerHTML = '';
    const strong = document.createElement('strong');
    strong.textContent = gradeLabel(grade);
    chip.append(strong, document.createTextNode(` ${got}/${ofGrade.length}`));
    chips.append(chip);
  }
}

function renderKindCounts() {
  const counts = countByKind(trophies);
  for (const el of document.querySelectorAll('[data-count]')) {
    el.textContent = `(${counts[el.dataset.count] ?? 0})`;
  }
}

function trophyCard(trophy) {
  const earned = state.earned.has(trophy.id);
  const article = document.createElement('article');
  article.className = 'card' + (earned ? ' earned' : '');
  article.dataset.trophyId = String(trophy.id);

  const head = document.createElement('div');
  head.className = 'card-head';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned;
  box.setAttribute('aria-label', `Earned: ${trophy.name}`);
  box.addEventListener('change', () => {
    if (box.checked) state.earned.add(trophy.id);
    else state.earned.delete(trophy.id);
    saveEarned(state.earned);
    render();
  });
  head.append(box);

  const title = document.createElement('div');
  title.className = 'card-title';
  const h3 = document.createElement('h3');
  h3.textContent = trophy.name;
  if (earned) h3.className = 'earned-name';
  title.append(h3);

  const badges = document.createElement('div');
  badges.className = 'badges';
  const gradeBadge = document.createElement('span');
  gradeBadge.className = `badge ${trophy.grade}`;
  gradeBadge.textContent = gradeLabel(trophy.grade);
  badges.append(gradeBadge);
  const kindBadge = document.createElement('span');
  kindBadge.className = 'badge kind';
  kindBadge.textContent = trophy.kind === 'collectible' ? 'Collectible' : trophy.kind[0].toUpperCase() + trophy.kind.slice(1);
  badges.append(kindBadge);
  if (trophy.missable) {
    const b = document.createElement('span');
    b.className = 'badge missable';
    b.textContent = 'Potentially missable';
    badges.append(b);
  }
  if (trophy.hidden) {
    const b = document.createElement('span');
    b.className = 'badge hidden-tag';
    b.textContent = 'Hidden';
    badges.append(b);
  }
  if (trophy.unconfirmed) {
    const b = document.createElement('span');
    b.className = 'badge unconfirmed';
    b.textContent = 'Unconfirmed';
    badges.append(b);
  }
  title.append(badges);
  head.append(title);
  article.append(head);

  if (isSpoilerHidden(trophy, state)) {
    const hidden = document.createElement('p');
    hidden.className = 'spoiler-hidden';
    hidden.textContent = 'Hidden story trophy — tick it as earned to reveal its name and guide.';
    article.append(hidden);
    return article;
  }

  const official = document.createElement('p');
  official.className = 'official';
  const officialLabel = document.createElement('span');
  officialLabel.className = 'label';
  officialLabel.textContent = 'Official description';
  official.append(officialLabel, document.createTextNode(trophy.description));
  article.append(official);

  const guide = document.createElement('p');
  guide.className = 'guide-text';
  const guideLabel = document.createElement('span');
  guideLabel.className = 'label';
  guideLabel.textContent = 'Guide';
  guide.append(guideLabel, document.createTextNode(trophy.guide));
  article.append(guide);

  const sources = document.createElement('p');
  sources.className = 'sources';
  sources.append(document.createTextNode('Sources: '));
  trophy.sources.forEach((url, i) => {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = sourceName(url);
    sources.append(a);
  });
  article.append(sources);
  return article;
}

function render() {
  renderProgress();
  const shown = trophies.filter((t) => matchesFilter(t, state));
  cardsEl.replaceChildren();
  if (shown.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = state.kind === 'online'
      ? 'No online trophies here — everything in GTA VI is single-player.'
      : 'No trophies match those filters. Clear the search or pick another kind.';
    cardsEl.append(empty);
  } else {
    for (const t of shown) cardsEl.append(trophyCard(t));
  }
  document.getElementById('result-line').textContent =
    `Showing ${shown.length} of ${trophies.length} trophies · ${state.earned.size} earned`;
  document.getElementById('online-note').hidden = state.kind !== 'online';
  for (const btn of document.querySelectorAll('.kind-btn')) {
    btn.classList.toggle('active', btn.dataset.kind === state.kind);
  }
}

function wireControls() {
  document.getElementById('search').addEventListener('input', (e) => {
    state.search = e.target.value.trim();
    render();
  });
  const gradeSelect = document.getElementById('grade-select');
  gradeSelect.value = state.grade;
  gradeSelect.addEventListener('change', () => {
    state.grade = gradeSelect.value;
    render();
  });
  const spoilerToggle = document.getElementById('spoiler-toggle');
  spoilerToggle.checked = state.spoilers;
  spoilerToggle.addEventListener('change', () => {
    state.spoilers = spoilerToggle.checked;
    saveSettings({ ...loadSettings(), spoilers: state.spoilers });
    render();
  });
  document.getElementById('earned-only').addEventListener('change', (e) => {
    state.earnedOnly = e.target.checked;
    render();
  });
  document.getElementById('kind-row').addEventListener('click', (e) => {
    const btn = e.target.closest('.kind-btn');
    if (!btn) return;
    state.kind = btn.dataset.kind;
    render();
  });
  document.getElementById('export-btn').addEventListener('click', () => exportProgress(state.earned));
  document.getElementById('import-input').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      state.earned = await importProgressFile(file);
      saveEarned(state.earned);
      render();
    } catch (err) {
      alert(`Could not import that file: ${err.message}`);
    }
    e.target.value = '';
  });
  document.getElementById('sample-btn').addEventListener('click', () => {
    state.earned = new Set(SAMPLE_EARNED);
    saveEarned(state.earned);
    render();
  });
  document.getElementById('reset-btn').addEventListener('click', () => {
    state.earned = new Set();
    saveEarned(state.earned);
    render();
  });
}

renderKindCounts();
wireControls();
render();

// ?scroll=<px> jumps the page to that offset after the first render, so a
// deep view of the guide can be captured as a screenshot.
const scrollTo = Number(params.get('scroll'));
if (Number.isFinite(scrollTo) && scrollTo > 0) {
  requestAnimationFrame(() => window.scrollTo(0, scrollTo));
}
