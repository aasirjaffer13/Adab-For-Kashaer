import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { safeRedirectSchema, asAppPath } from "@/lib/safe-redirect";

const confirmSearchSchema = z
  .object({
    code: z.string().default(""),
    redirect: safeRedirectSchema,
  })
  .passthrough();

export const Route = createFileRoute("/auth/confirm")({
  validateSearch: confirmSearchSchema,
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: AuthConfirmPage,
});

function AuthConfirmPage() {
  const { code, redirect: redirectTo } = Route.useSearch();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const exchangeCode = async () => {
      if (!code) {
        setError("No confirmation code found.");
        setLoading(false);
        return;
      }

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        setError(exchangeError.message);
        setLoading(false);
        return;
      }

      // `redirectTo` is validated to be an in-app path, so this can never
      // navigate the browser to another origin.
      window.location.assign(asAppPath(redirectTo));
    };

    exchangeCode();
  }, [code, redirectTo]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm rounded-lg border border-border bg-card/90 p-8 text-center shadow-sm backdrop-blur-sm">
          <p role="alert" className="text-sm text-destructive">{error}</p>
          <a href="/login" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
            Back to Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card/90 p-8 text-center shadow-sm backdrop-blur-sm">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {loading ? "Confirming your account…" : "Redirecting…"}
        </p>
      </div>
    </div>
  );
}
