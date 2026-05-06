const KEY = "debate_arena_share_bonus";

function todayUtc(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function hasUnclaimedShareBonus(): boolean {
  try {
    return localStorage.getItem(KEY) === todayUtc();
  } catch {
    return false;
  }
}

export function claimShareBonus(): boolean {
  try {
    if (localStorage.getItem(KEY) === todayUtc()) {
      return false;
    }
    localStorage.setItem(KEY, todayUtc());
    return true;
  } catch {
    return false;
  }
}

export function consumeShareBonus(): boolean {
  try {
    if (localStorage.getItem(KEY) !== todayUtc()) {
      return false;
    }
    localStorage.removeItem(KEY);
    return true;
  } catch {
    return false;
  }
}
