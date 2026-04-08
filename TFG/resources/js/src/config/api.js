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
  return `${baseUrl}${normalizedPath}`;
}

export { API_BASE_URL, ROUTE_API_BASE_URL };
