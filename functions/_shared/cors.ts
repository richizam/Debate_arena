export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function withCors(headers?: HeadersInit): Headers {
  const result = new Headers(corsHeaders);

  if (headers) {
    new Headers(headers).forEach((value, key) => {
      result.set(key, value);
    });
  }

  return result;
}

export function optionsResponse(): Response {
  return new Response(null, {
    status: 204,
    headers: withCors(),
  });
}
