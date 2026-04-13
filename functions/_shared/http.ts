import { withCors } from "./cors";

export function jsonResponse(payload: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(payload), {
    ...init,
    headers: withCors({
      "Content-Type": "application/json",
      ...init.headers,
    }),
  });
}

export function errorResponse(status: number, code: string, message: string): Response {
  return jsonResponse(
    {
      error: {
        code,
        message,
      },
    },
    { status }
  );
}

export async function readJson<T>(request: Request): Promise<T> {
  return request.json() as Promise<T>;
}
