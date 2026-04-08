interface Env {}

interface VoteBody {
  topic: string;
  winner: string;
  userVote: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  try {
    const body = await context.request.json() as VoteBody;
    console.log("Vote received:", JSON.stringify(body));
  } catch {
    // non-critical
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: corsHeaders,
  });
};
