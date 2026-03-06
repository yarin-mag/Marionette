/**
 * Demo mode is activated by adding ?demo=true to the URL.
 * e.g. http://localhost:5173/?demo=true
 *
 * All data-fetching hooks check this flag and return mock data instead
 * of hitting the real API, so the server doesn't need to be running.
 */
export function useDemoMode(): boolean {
  return new URLSearchParams(window.location.search).get("demo") === "true";
}
