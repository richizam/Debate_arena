const KEY = "debate_arena_last_date";

function todayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
