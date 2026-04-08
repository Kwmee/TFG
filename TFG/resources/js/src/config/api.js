// Base URLs for the APIs used by the frontend.
// Vite only exposes variables that start with VITE_.
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const ROUTE_API_BASE_URL = (
  import.meta.env.VITE_ROUTE_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  ""
).replace(/\/$/, "");

export function buildApiUrl(baseUrl, path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!baseUrl || typeof window === "undefined") {
    return `${baseUrl}${normalizedPath}`;
  }

  try {
    const targetUrl = new URL(baseUrl);
    const currentUrl = new URL(window.location.origin);
    const isSameAppDifferentLocalHost =
      targetUrl.protocol === currentUrl.protocol &&
      targetUrl.port === currentUrl.port &&
      ["localhost", "127.0.0.1", "[::1]"].includes(targetUrl.hostname) &&
      ["localhost", "127.0.0.1", "[::1]"].includes(currentUrl.hostname);

    if (isSameAppDifferentLocalHost) {
      return `${window.location.origin}${normalizedPath}`;
    }
  } catch {
    // If baseUrl is relative or invalid, keep the fallback behavior.
  }

  return `${baseUrl}${normalizedPath}`;
}

export { API_BASE_URL, ROUTE_API_BASE_URL };
