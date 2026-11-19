// ProgressStore: the earned-trophy checklist, saved in the browser's localStorage,
// with export to a file and import from a file. Nothing leaves the browser.
export const PROGRESS_KEY = 'gta6-trophy-checklist';
export const SETTINGS_KEY = 'gta6-trophy-settings';

// A realistic early-game set used by the "Try sample progress" button and ?sample=1:
// the opening story trophies plus a few activities a player picks up in Chapter 1-2.
export const SAMPLE_EARNED = [2, 3, 4, 8, 9, 16, 20, 21, 35, 42, 53, 55];

export function loadEarned() {
  try {
    const raw = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? '[]');
    if (!Array.isArray(raw)) return new Set();
    return new Set(raw.filter((n) => typeof n === 'number'));
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

export function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}') ?? {};
  } catch {
    return {};
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function exportProgress(earned) {
  const blob = new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned].sort((a, b) => a - b) }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'gta6-trophy-progress.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export async function importProgressFile(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const list = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(list)) throw new Error('That file does not hold a trophy list.');
  const ids = list.filter((n) => typeof n === 'number');
  return new Set(ids);
}
