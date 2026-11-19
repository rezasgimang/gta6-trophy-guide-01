// TrophyFilters: which trophies a view shows, and what the spoiler setting hides.
// Kinds: story, missable, collectible, activity, online (the game has 0 online trophies).
export const KINDS = ['all', 'story', 'missable', 'collectible', 'activity', 'online'];

export function countByKind(trophies) {
  const counts = { all: trophies.length, story: 0, missable: 0, collectible: 0, activity: 0, online: 0 };
  for (const t of trophies) counts[t.kind] = (counts[t.kind] ?? 0) + 1;
  return counts;
}

export function matchesFilter(trophy, state) {
  if (state.kind !== 'all' && trophy.kind !== state.kind) return false;
  if (state.grade !== 'all' && trophy.grade !== state.grade) return false;
  if (state.earnedOnly && !state.earned.has(trophy.id)) return false;
  if (state.search) {
    const hay = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    if (!hay.includes(state.search.toLowerCase())) return false;
  }
  return true;
}

// The spoiler rule: a story trophy the player has not earned yet shows nothing
// but a placeholder — no name, no description, no guide — until it is ticked.
export function isSpoilerHidden(trophy, state) {
  return state.spoilers && trophy.is_story && !state.earned.has(trophy.id);
}
