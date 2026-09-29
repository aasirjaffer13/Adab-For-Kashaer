import { z } from "zod";

/**
 * Validates a post-login redirect target.
 *
 * Only in-app paths are allowed: `//evil.com` is a protocol-relative URL and
 * `https://evil.com` is absolute, both of which would bounce the user off-site
 * after a successful sign-in or email confirmation.
 */
export const safeRedirectSchema = z
  .string()
  .max(512, "Redirect target is too long")
  .regex(/^\/(?!\/)/, "Redirect must be a path inside this app")
  .default("/dashboard");

export type AppPath = `/${string}`;

/** Narrows a already-validated redirect to a path TanStack Router accepts. */
export function asAppPath(value: string): AppPath {
  return value.startsWith("/") && !value.startsWith("//")
    ? (value as AppPath)
    : "/dashboard";
}
