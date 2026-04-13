const DEFAULT_ITCH_API_ORIGIN = "https://debate-arena-492.pages.dev";

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

export function getApiUrl(path: string): string {
  const configuredOrigin = trimTrailingSlash(import.meta.env.VITE_API_BASE_URL ?? "");

  if (configuredOrigin) {
    return `${configuredOrigin}${path}`;
  }

  if (typeof window === "undefined") {
    return `${DEFAULT_ITCH_API_ORIGIN}${path}`;
  }

  const { hostname, origin, protocol } = window.location;

  if (protocol === "file:" || hostname.endsWith(".itch.io")) {
    return `${DEFAULT_ITCH_API_ORIGIN}${path}`;
  }

  return `${origin}${path}`;
}
