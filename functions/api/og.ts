import { withCors } from "../_shared/cors";

const WIDTH = 1200;
const HEIGHT = 630;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function clampToFit(text: string, max: number): string {
  if (text.length <= max) {
    return text;
  }
  return `${text.slice(0, Math.max(0, max - 1))}…`;
}

interface OgParams {
  fighterA: string;
  fighterB: string;
  topic: string;
  winner: "a" | "b" | null;
}

function readParams(url: URL): OgParams {
  const fighterA = clampToFit((url.searchParams.get("a") ?? "Debate Arena").trim(), 22);
  const fighterB = clampToFit((url.searchParams.get("b") ?? "AI Showdown").trim(), 22);
  const topic = clampToFit((url.searchParams.get("topic") ?? "Two AIs. One topic. Pick a side.").trim(), 90);
  const winnerRaw = (url.searchParams.get("w") ?? "").toLowerCase();
  const winner = winnerRaw === "a" ? "a" : winnerRaw === "b" ? "b" : null;
  return { fighterA, fighterB, topic, winner };
}

function buildSvg(params: OgParams): string {
  const a = escapeXml(params.fighterA);
  const b = escapeXml(params.fighterB);
  const topic = escapeXml(params.topic);
  const winnerName = params.winner === "a" ? a : params.winner === "b" ? b : null;
  const winnerColor = params.winner === "a" ? "#ff4444" : params.winner === "b" ? "#44aaff" : null;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#04040f"/>
      <stop offset="0.55" stop-color="#0b0d24"/>
      <stop offset="1" stop-color="#04040f"/>
    </linearGradient>
    <radialGradient id="aGlow" cx="0.3" cy="0.5" r="0.45">
      <stop offset="0" stop-color="#ff4444" stop-opacity="0.32"/>
      <stop offset="1" stop-color="#ff4444" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="bGlow" cx="0.7" cy="0.5" r="0.45">
      <stop offset="0" stop-color="#44aaff" stop-opacity="0.32"/>
      <stop offset="1" stop-color="#44aaff" stop-opacity="0"/>
    </radialGradient>
    <filter id="redShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="6"/>
      <feOffset dx="0" dy="0"/>
      <feFlood flood-color="#ff4444" flood-opacity="0.85"/>
      <feComposite in2="SourceAlpha" operator="in"/>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="blueShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="6"/>
      <feOffset dx="0" dy="0"/>
      <feFlood flood-color="#44aaff" flood-opacity="0.85"/>
      <feComposite in2="SourceAlpha" operator="in"/>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#aGlow)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bGlow)"/>

  <text x="600" y="92" font-family="'Press Start 2P','Courier New',monospace" font-size="32" font-weight="900" fill="#00f0ff" text-anchor="middle" letter-spacing="8">DEBATE ARENA</text>
  <line x1="120" y1="118" x2="1080" y2="118" stroke="#00f0ff" stroke-opacity="0.35" stroke-width="2"/>

  <text x="340" y="290" font-family="'Press Start 2P','Courier New',monospace" font-size="64" font-weight="900" fill="#ff4444" text-anchor="middle" filter="url(#redShadow)">${a}</text>
  <text x="600" y="288" font-family="'Press Start 2P','Courier New',monospace" font-size="84" font-weight="900" fill="#ffe600" text-anchor="middle" letter-spacing="6">VS</text>
  <text x="860" y="290" font-family="'Press Start 2P','Courier New',monospace" font-size="64" font-weight="900" fill="#44aaff" text-anchor="middle" filter="url(#blueShadow)">${b}</text>

  <foreignObject x="80" y="360" width="1040" height="160">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: 'Courier New', monospace; font-size: 36px; color: #dde0ff; font-style: italic; text-align: center; line-height: 1.4;">${topic}</div>
  </foreignObject>

  ${
    winnerName
      ? `<rect x="380" y="540" width="440" height="60" fill="#000" fill-opacity="0.55" stroke="${winnerColor}" stroke-width="2"/>
  <text x="600" y="582" font-family="'Press Start 2P','Courier New',monospace" font-size="24" font-weight="900" fill="${winnerColor}" text-anchor="middle" letter-spacing="4">WINNER: ${winnerName}</text>`
      : `<text x="600" y="582" font-family="'Press Start 2P','Courier New',monospace" font-size="22" font-weight="700" fill="#7788aa" text-anchor="middle" letter-spacing="3">debatearena.xyz</text>`
  }
</svg>`;
}

export const onRequestGet: PagesFunction = async ({ request }) => {
  const url = new URL(request.url);
  const params = readParams(url);
  const svg = buildSvg(params);

  return new Response(svg, {
    headers: withCors({
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, immutable",
    }),
  });
};
