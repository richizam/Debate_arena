import type { Language } from "../types/battle";

export interface SuggestedBattle {
  id: string;
  fighterA: string;
  fighterB: string;
  topic: string;
  tags: string[];
  lang: Language;
  isLive: boolean;
  weight: number;
  validUntil: string;
}

interface SuggestionsFile {
  version: number;
  battles: SuggestedBattle[];
}

let cache: SuggestionsFile | null = null;
let inflight: Promise<SuggestionsFile | null> | null = null;

async function loadFile(): Promise<SuggestionsFile | null> {
  if (cache) {
    return cache;
  }

  if (inflight) {
    return inflight;
  }

  inflight = (async () => {
    try {
      const response = await fetch("/data/suggested-battles.json", { cache: "force-cache" });
      if (!response.ok) {
        return null;
      }
      const data = (await response.json()) as SuggestionsFile;
      cache = data;
      return data;
    } catch {
      return null;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

function shuffleByWeight(battles: SuggestedBattle[]): SuggestedBattle[] {
  return battles
    .map((battle) => ({
      battle,
      score: Math.random() * Math.max(battle.weight, 1),
    }))
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.battle);
}

export async function loadSuggestions(lang: Language, limit = 8): Promise<SuggestedBattle[]> {
  const file = await loadFile();
  if (!file) {
    return [];
  }

  const now = Date.now();
  const filtered = file.battles.filter((battle) => {
    if (battle.lang !== lang) {
      return false;
    }
    const validUntil = Date.parse(battle.validUntil);
    return Number.isNaN(validUntil) ? true : validUntil > now;
  });

  return shuffleByWeight(filtered).slice(0, limit);
}
