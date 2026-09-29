import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { PenSquare } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const DEFAULT_CLASS =
  "inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90";

interface Props {
  children?: ReactNode;
  className?: string;
}

/**
 * Single source of truth for the "Write" call to action: signed-in authors go
 * straight to the editor, visitors are sent to sign in with a return path.
 */
export function WriteReflectionLink({
  children = "Write your reflection",
  className = DEFAULT_CLASS,
}: Props) {
  const { isAuthenticated } = useAuth();

  return (
    <Link
      to={isAuthenticated ? "/blog/new" : "/login"}
      search={isAuthenticated ? undefined : { redirect: "/blog/new" }}
      className={className}
    >
      <PenSquare className="h-4 w-4" />
      <span>{children}</span>
    </Link>
  );
}
