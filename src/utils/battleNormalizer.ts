import type { Battle, DebateLine, SpeakerId } from "../types/battle";

export function normalizeBattle(raw: unknown): Battle {
  if (!raw || typeof raw !== "object") throw new Error("Battle is not an object");

  const obj = raw as Record<string, unknown>;

  if (!Array.isArray(obj.rounds)) throw new Error("Missing rounds array");
  if (!Array.isArray(obj.fighters) || obj.fighters.length < 2) throw new Error("Bad fighters");

  const rawRounds = obj.rounds as Array<Record<string, unknown>>;

  // Take up to 12 rounds, force correct alternation
  const fixed: DebateLine[] = rawRounds.slice(0, 12).map((r, i) => ({
    speaker: (i % 2 === 0 ? "a" : "b") as SpeakerId,
    text: (typeof r.text === "string" ? r.text : "").trim() || "...",
  }));

  // Pad to exactly 12 if short
  while (fixed.length < 12) {
    fixed.push({
      speaker: (fixed.length % 2 === 0 ? "a" : "b") as SpeakerId,
      text: "...",
    });
  }

  const judge = obj.judge as { winner?: unknown; reason?: unknown } | undefined;
  const winner: SpeakerId = judge?.winner === "b" ? "b" : "a";

  const rawFighters = obj.fighters as Array<Record<string, unknown>>;

  return {
    topic: (typeof obj.topic === "string" ? obj.topic : "").trim() || "Open Debate",
    fighters: [
      {
        id: "a",
        name: (typeof rawFighters[0]?.name === "string" ? rawFighters[0].name : "").trim() || "Fighter A",
        persona: (typeof rawFighters[0]?.persona === "string" ? rawFighters[0].persona : "").trim() || "",
      },
      {
        id: "b",
        name: (typeof rawFighters[1]?.name === "string" ? rawFighters[1].name : "").trim() || "Fighter B",
        persona: (typeof rawFighters[1]?.persona === "string" ? rawFighters[1].persona : "").trim() || "",
      },
    ],
    rounds: fixed,
    judge: {
      winner,
      reason: (typeof judge?.reason === "string" ? judge.reason : "").trim() || "The judge has spoken.",
    },
  };
}
