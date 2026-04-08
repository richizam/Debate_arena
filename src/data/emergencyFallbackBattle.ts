import type { Battle } from "../types/battle";

export function createFallbackBattle(player1: string, player2: string, topic: string): Battle {
  return {
    topic,
    fighters: [
      { id: "a", name: player1, persona: "" },
      { id: "b", name: player2, persona: "" },
    ],
    rounds: [
      { speaker: "a", text: "The future belongs to those bold enough to seize it. Playing by the rules gets you nowhere when the rules are broken!" },
      { speaker: "b", text: "Recklessness is not boldness. A leader who cannot control themselves will never control anything else." },
      { speaker: "a", text: "Control is an illusion! Innovation comes from breaking boundaries — not polishing trophies in glass cases!" },
      { speaker: "b", text: "Innovation without structure is chaos. Every great civilization was built on discipline, not on tantrums." },
      { speaker: "a", text: "Civilization? You mean the system that rewards obedience over genius? I refuse to kneel to mediocrity!" },
      { speaker: "b", text: "Genius without humility is just arrogance with better vocabulary. People follow those they trust, not those they fear." },
      { speaker: "a", text: "Fear? I inspire! When I walk into a room, people feel ALIVE. When you walk in, they check the exit signs." },
      { speaker: "b", text: "Leadership is not a performance. While you were making entrances, I was making results." },
      { speaker: "a", text: "Results on paper! But when the real crisis hits, your spreadsheets won't save a single person!" },
      { speaker: "b", text: "And your gut instinct will? The last time you followed your gut, the whole plan collapsed." },
      { speaker: "a", text: "Those failures led to breakthroughs! Controlled failure is the very engine of progress!" },
      { speaker: "b", text: "You use the word 'controlled' very loosely. The future needs builders, not arsonists with ambition." },
    ],
    judge: {
      winner: "b",
      reason: `While ${player1} brought undeniable passion, ${player2} demonstrated the composure and consistency essential for sustained leadership. A true leader must both inspire and deliver.`,
    },
  };
}
