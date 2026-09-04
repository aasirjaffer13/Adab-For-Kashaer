import { Outlet, createRootRouteWithContext, HeadContent, Scripts, useRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { useAuth, type AuthState } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";


import appCss from "../styles.css?url";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      retry: 1,
    },
  },
});

interface RouterContext {
  auth: AuthState;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      auth: {
        isAuthenticated: !!session,
        user: session?.user ?? null,
        session,
        isLoading: false,
      } as AuthState,
    };
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Adab — Dignity in how we see, speak, and scroll" },
      { name: "description", content: "A calm, Islamic-corrective guide to online behavior: the gaze, the comment, and the adab we owe one another." },
      { name: "author", content: "Adab" },
      { property: "og:title", content: "Adab — Dignity in how we see, speak, and scroll" },
      { property: "og:description", content: "A calm, Islamic-corrective guide to online behavior: the gaze, the comment, and the adab we owe one another." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Adab — Dignity in how we see, speak, and scroll" },
      { name: "twitter:description", content: "A calm, Islamic-corrective guide to online behavior: the gaze, the comment, and the adab we owe one another." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Nunito+Sans:ital,opsz,wght@0,6..12,400;0,6..12,500;0,6..12,600;0,6..12,700;1,6..12,400&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const router = useRouter();
  const auth = useAuth();

  // When auth state changes, invalidate the router so beforeLoad re-runs
  useEffect(() => {
    router.invalidate();
  }, [auth.isAuthenticated, router]);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="bottom-right" />
      
    </QueryClientProvider>
  );
}
