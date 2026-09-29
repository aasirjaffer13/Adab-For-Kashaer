import type { AuthError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/**
 * Where the provider sends the user back to. Going through /login keeps the
 * original `redirect` search param intact (the schema is `.passthrough()`),
 * so the router lands on the right page once the session exists.
 */
export function oauthRedirectTo(path: string): string {
  return `${window.location.origin}/login?redirect=${encodeURIComponent(path)}`;
}

/** Turns GoTrue's OAuth errors into something the user can actually act on. */
function oauthErrorMessage(error: AuthError): string {
  const hint = `${error.code ?? ""} ${error.message}`.toLowerCase();

  if (hint.includes("provider_not_enabled") || hint.includes("provider not")) {
    return "Google sign-in isn't enabled for this project yet. Turn on the Google provider in Supabase → Authentication → Providers.";
  }
  if (hint.includes("redirect_url_not_allowed")) {
    return "Supabase doesn't allow this site as a redirect URL. Add it in Supabase → Authentication → URL Configuration → Redirect URLs.";
  }
  if (hint.includes("invalid_client") || hint.includes("client_id")) {
    return "Google rejected the credentials. Check the Client ID / Secret in Supabase → Authentication → Providers → Google.";
  }
  return error.message;
}

/**
 * Signs in with Google through Supabase's own OAuth endpoint, so it works on
 * any host (the Lovable `/~oauth/initiate` broker only exists on Lovable
 * hosting and 404s everywhere else).
 *
 * Resolves to `null` on success (the browser is about to navigate away) or to
 * a user-facing error message.
 */
export async function signInWithGoogle(redirectTo: string): Promise<string | null> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      // Otherwise Google silently reuses whatever account the browser is
      // already signed into, with no way to pick a different one.
      queryParams: { prompt: "select_account" },
    },
  });

  return error ? oauthErrorMessage(error) : null;
}
