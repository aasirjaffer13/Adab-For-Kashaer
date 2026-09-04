import { Link } from "@tanstack/react-router";
import { PenSquare, Moon, Sun, ArrowLeft } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";

interface Props {
  backTo?: "/blog" | "/";
  backLabel?: string;
  showWriteButton?: boolean;
}

export function BlogHeader({ backTo, backLabel, showWriteButton = true }: Props) {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          {backTo ? (
            <Link
              to={backTo}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{backLabel || "Back"}</span>
            </Link>
          ) : (
            <Link to="/" className="flex items-baseline gap-2">
              <span className="font-serif text-2xl font-semibold tracking-tight text-foreground">
                Adab
              </span>
              <span className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Reflections
              </span>
            </Link>
          )}
        </div>

        <nav className="flex items-center gap-3">
          <Link
            to="/"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
          >
            Home Guide
          </Link>

          <Link
            to="/blog"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            All Reflections
          </Link>

          {showWriteButton && (
            <Link
              to="/blog/new"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-1.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              <PenSquare className="h-4 w-4" />
              <span>Write a Reflection</span>
            </Link>
          )}

          <button
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              search={{ redirect: "/blog" }}
              className="hidden rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted sm:inline-block"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

