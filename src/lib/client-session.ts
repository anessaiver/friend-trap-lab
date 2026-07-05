/**
 * Anonymous, local-only session id. Lets us count revenge loops and dedupe
 * without accounts, cookies, or anything creepy.
 */
const KEY = "ftl-session";

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = window.localStorage.getItem(KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `s-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      window.localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}
