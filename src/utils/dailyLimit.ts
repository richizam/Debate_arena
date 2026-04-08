const KEY = "debate_arena_last_date";

function todayString(): string {
  return new Date().toISOString().slice(0, 10); // "2026-04-08"
}

export function hasUsedDailyDebate(): boolean {
  try {
    return localStorage.getItem(KEY) === todayString();
  } catch {
    return false;
  }
}

export function markDailyDebateUsed(): void {
  try {
    localStorage.setItem(KEY, todayString());
  } catch {
    // localStorage unavailable (e.g. itch.io iframe privacy settings)
  }
}
