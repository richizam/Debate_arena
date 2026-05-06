import type { ContextPack } from "./grok";

function bullets(label: string, items: string[]): string {
  if (items.length === 0) {
    return "";
  }
  const lines = items.map((item) => `- ${item}`).join("\n");
  return `${label}:\n${lines}`;
}

export function buildEnrichedSystemPrompt(basePrompt: string, pack: ContextPack): string {
  const sections = [
    bullets("FACTS (treat as accurate)", pack.facts),
    bullets("PUBLIC DISCOURSE (frame as opinions, not facts)", pack.discourse),
    bullets("UNCERTAIN (never quote as fact, must mark as rumor or unverified)", pack.uncertain),
    bullets("AVOID (do not mention, do not allude to, off-limits)", pack.avoid),
  ].filter((section) => section.length > 0);

  if (sections.length === 0) {
    return basePrompt;
  }

  const liveBlock = `
LIVE CONTEXT (researched ${new Date(pack.fetchedAt).toISOString()}, ${pack.sourcesCount} sources):
${sections.join("\n\n")}

RULES FOR USING LIVE CONTEXT:
- Weave FACTS into specific lines so the debate feels current.
- Reference PUBLIC DISCOURSE only as "people are saying" / "fans are debating" — never as established fact.
- For UNCERTAIN items, characters may bring them up only if they explicitly call them rumors or unverified.
- AVOID items are completely off-limits. Do not mention them, joke about them, or hint at them.
- If a fighter would not realistically know a piece of context, leave it out.`;

  return `${basePrompt}\n${liveBlock}`;
}
