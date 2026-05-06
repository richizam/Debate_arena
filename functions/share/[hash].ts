import type { Env } from "../_shared/env";
import { getSupabaseAdmin } from "../_shared/supabase";

interface SharedBattleRow {
  id: string;
  fighters_json: Array<{ id: "a" | "b"; name: string; persona: string }>;
  topic: string;
  verdict_json: { winner: "a" | "b"; reason: string };
}

const VALID_ID = /^[a-f0-9]{6,32}$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function clamp(text: string, max: number): string {
  if (text.length <= max) {
    return text;
  }
  return `${text.slice(0, max - 1)}…`;
}

function buildHtml(input: {
  origin: string;
  hash: string;
  fighterA: string;
  fighterB: string;
  topic: string;
  winnerName: string;
  ogUrl: string;
}): string {
  const safeHash = encodeURIComponent(input.hash);
  const matchPath = `/?match=${safeHash}`;
  const title = escapeHtml(`${input.fighterA} vs ${input.fighterB}`);
  const description = escapeHtml(
    clamp(`${input.winnerName} won. Topic: ${input.topic}. Pick your champion on Debate Arena.`, 200)
  );
  const ogUrl = escapeHtml(input.ogUrl);
  const shareUrl = escapeHtml(`${input.origin}/share/${input.hash}`);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — Debate Arena</title>
<meta name="description" content="${description}">
<meta property="og:type" content="website">
<meta property="og:url" content="${shareUrl}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${ogUrl}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${ogUrl}">
<meta http-equiv="refresh" content="0; url=${escapeHtml(matchPath)}">
<style>body{background:#04040f;color:#dde0ff;font-family:system-ui,sans-serif;text-align:center;padding:48px}a{color:#00f0ff}</style>
</head>
<body>
<p>Loading the debate…</p>
<p><a href="${escapeHtml(matchPath)}">Open Debate Arena</a></p>
<script>window.location.replace(${JSON.stringify(matchPath)});</script>
</body>
</html>`;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const hashRaw = String(context.params.hash ?? "").toLowerCase();
  const url = new URL(context.request.url);
  const origin = url.origin;
  const fallbackPath = `/?match=${encodeURIComponent(hashRaw)}`;

  if (!VALID_ID.test(hashRaw)) {
    return Response.redirect(`${origin}/`, 302);
  }

  if (!context.env.SUPABASE_URL || !context.env.SUPABASE_SERVICE_ROLE_KEY) {
    return Response.redirect(`${origin}${fallbackPath}`, 302);
  }

  const admin = getSupabaseAdmin(context.env);
  const { data } = await admin
    .from("shared_battles")
    .select("id, fighters_json, topic, verdict_json")
    .eq("id", hashRaw)
    .maybeSingle<SharedBattleRow>();

  if (!data) {
    return Response.redirect(`${origin}/`, 302);
  }

  const fighterA = data.fighters_json.find((f) => f.id === "a")?.name ?? "Fighter A";
  const fighterB = data.fighters_json.find((f) => f.id === "b")?.name ?? "Fighter B";
  const winnerName = data.verdict_json.winner === "a" ? fighterA : fighterB;

  const ogParams = new URLSearchParams({
    a: fighterA,
    b: fighterB,
    topic: data.topic,
    w: data.verdict_json.winner,
  });
  const ogUrl = `${origin}/api/og?${ogParams.toString()}`;

  const html = buildHtml({
    origin,
    hash: hashRaw,
    fighterA,
    fighterB,
    topic: data.topic,
    winnerName,
    ogUrl,
  });

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=600, s-maxage=3600",
    },
  });
};
