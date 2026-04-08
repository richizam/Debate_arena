interface Env {
  DEEPSEEK_API_KEY: string;
}

interface RequestBody {
  fighterAName: string;
  fighterBName: string;
  topic: string;
  language: string;
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  es: "Spanish",
  de: "German",
  fr: "French",
  ru: "Russian",
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { status: 204, headers: corsHeaders });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {

  let body: RequestBody;
  try {
    body = await context.request.json() as RequestBody;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  const { fighterAName, fighterBName, topic, language } = body;
  const langName = LANGUAGE_NAMES[language] ?? "English";
  const apiKey = context.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "DEEPSEEK_API_KEY not configured" }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  const systemPrompt = `You are scripting a LIVE argument between two real people for a debate game. This is NOT a formal debate — it is a heated, reactive, personal argument where each person directly responds to what the other just said.

REACTIVITY IS THE #1 RULE:
- Every single line must directly react to the previous line. If A said "my 8 Ballon d'Ors prove I'm the best", B must address THAT claim — mock it, counter it, flip it, or expose a flaw in it. B cannot just pivot to their own talking points as if A said nothing.
- Characters interrupt each other's logic, not just take turns making speeches.
- Use phrases like "You just said...", "That's exactly my point —", "Wait, you're claiming...", "So now you admit...", "After everything you just said..."
- The argument should ESCALATE. Early lines are confident, mid lines get sharper and more personal, final lines are maximum intensity.

AUTHENTICITY RULES:
- Real people use their actual achievements, stats, rivalries, and domain language.
- They sound like themselves, not like generic debaters.

LANGUAGE: Write everything in ${langName} only.

Respond with valid JSON only. No markdown, no code fences.`;

  const userPrompt = `Write a reactive, escalating argument between these two people:

FIGHTER A: ${fighterAName}
FIGHTER B: ${fighterBName}
TOPIC: "${topic}"

Think of it as a real argument that builds line by line — each person hears what the other said and fires back directly at it. Not two monologues. A real fight.

Write all 12 lines in order and make sure each line is a direct reaction to the one before it. The argument should feel like it's spiraling toward a breaking point by line 12.

Each line: 1-2 sentences, punchy, 15-40 words, readable on screen. Written entirely in ${langName}.

Respond with this EXACT JSON (no other text):
{
  "topic": "${topic}",
  "fighters": [
    {"id": "a", "name": "${fighterAName}", "persona": ""},
    {"id": "b", "name": "${fighterBName}", "persona": ""}
  ],
  "rounds": [
    {"speaker": "a", "text": "..."},
    {"speaker": "b", "text": "..."},
    {"speaker": "a", "text": "..."},
    {"speaker": "b", "text": "..."},
    {"speaker": "a", "text": "..."},
    {"speaker": "b", "text": "..."},
    {"speaker": "a", "text": "..."},
    {"speaker": "b", "text": "..."},
    {"speaker": "a", "text": "..."},
    {"speaker": "b", "text": "..."},
    {"speaker": "a", "text": "..."},
    {"speaker": "b", "text": "..."}
  ],
  "judge": {
    "winner": "a or b",
    "reason": "2-3 sentence dramatic verdict in ${langName}, referencing specific moments from the argument"
  }
}`;

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.9,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("DeepSeek API error:", response.status, errText);
      return new Response(JSON.stringify({ error: `DeepSeek error: ${response.status}` }), {
        status: 502,
        headers: corsHeaders,
      });
    }

    const data = await response.json() as DeepSeekResponse;
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(JSON.stringify({ error: "Empty response from DeepSeek" }), {
        status: 502,
        headers: corsHeaders,
      });
    }

    const battle: unknown = JSON.parse(content);
    return new Response(JSON.stringify(battle), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("start-battle function error:", err);
    return new Response(JSON.stringify({ error: "Failed to generate debate" }), {
      status: 502,
      headers: corsHeaders,
    });
  }
};
