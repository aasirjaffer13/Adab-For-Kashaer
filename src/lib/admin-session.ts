const STORAGE_KEY = "adab_admin_token";
const CHANGE_EVENT = "adab:admin-session";

/**
 * Moderator session storage.
 *
 * The token itself is an HMAC-signed, expiring value issued by
 * `adminLogin` — it cannot be forged without `ADMIN_SESSION_SECRET`.
 * Storage here is only a convenience; every privileged call re-validates it
 * server-side.
 */

export function readAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function writeAdminToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, token);
  } catch {
    return;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function clearAdminToken(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    return;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * `storage` events never fire in the tab that made the change, so sign-in and
 * sign-out are broadcast with a custom event instead.
 */
export function subscribeToAdminSession(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CHANGE_EVENT, listener);
  return () => window.removeEventListener(CHANGE_EVENT, listener);
}
