const apiBaseUrl = import.meta.env.DEV ? "" : (import.meta.env.VITE_API_URL || "");

export function apiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiBaseUrl}${normalizedPath}`;
}
