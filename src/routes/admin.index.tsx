import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminListPosts,
  adminLogin,
  adminUpdatePostStatus,
  adminVerifySession,
} from "@/services/admin.functions";
import {
  clearAdminToken,
  readAdminToken,
  writeAdminToken,
} from "@/lib/admin-session";
import type { BlogPostStatus } from "@/types/blog";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { BlogContent } from "@/components/blog/BlogContent";
import { toast } from "sonner";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Lock,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
  head: () => ({
    meta: [
      { title: "Moderation Dashboard — Adab Admin" },
      {
        name: "robots",
        content: "noindex, nofollow",
      },
    ],
  }),
});

type Tab = "pending" | "approved" | "rejected" | "all";

const TABS: { id: Tab; label: string }[] = [
  { id: "pending", label: "Pending Review" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "all", label: "All Posts" },
];

function AdminDashboardPage() {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => readAdminToken());
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const [currentTab, setCurrentTab] = useState<Tab>("pending");
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [rejectingPostId, setRejectingPostId] = useState<string | null>(null);
  const [rejectionNote, setRejectionNote] = useState("");

  const isAuthenticated = token !== null;

  // The stored token is opaque and signed by the server — re-check it so an
  // expired session drops back to the gate instead of erroring on every call.
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    adminVerifySession({ data: { token } })
      .then(({ ok }) => {
        if (cancelled || ok) return;
        clearAdminToken();
        setToken(null);
      })
      .catch(() => {
        // Network hiccup: keep the session and let the query surface problems.
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const {
    data: posts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-all-posts"],
    queryFn: () => adminListPosts({ data: { token: token! } }),
    enabled: isAuthenticated,
    retry: false,
  });

  const updateMutation = useMutation({
    mutationFn: (input: { id: string; status: BlogPostStatus; note?: string }) =>
      adminUpdatePostStatus({ data: { token: token!, ...input } }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-posts"] });
      queryClient.invalidateQueries({ queryKey: ["community-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog-post", variables.id] });
      if (variables.status === "approved") {
        toast.success("Reflection approved and published!");
      } else if (variables.status === "rejected") {
        toast.info("Reflection has been rejected.");
      }
      setRejectingPostId(null);
      setRejectionNote("");
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to update status. Please try again.",
      );
    },
  });

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);
    setPasswordError("");
    try {
      const { token: nextToken } = await adminLogin({
        data: { password: passwordInput },
      });
      writeAdminToken(nextToken);
      setToken(nextToken);
      setPasswordInput("");
    } catch (err: unknown) {
      setPasswordError(
        err instanceof Error ? err.message : "Moderator sign-in failed.",
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = () => {
    clearAdminToken();
    setToken(null);
    setPasswordInput("");
  };

  const counts = useMemo(() => {
    return {
      pending: posts.filter((p) => p.status === "pending").length,
      approved: posts.filter((p) => p.status === "approved").length,
      rejected: posts.filter((p) => p.status === "rejected").length,
      all: posts.length,
    };
  }, [posts]);

  const displayedPosts = useMemo(() => {
    if (currentTab === "all") return posts;
    return posts.filter((p) => p.status === currentTab);
  }, [posts, currentTab]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <BlogHeader backTo="/blog" backLabel="Back to Blog" showWriteButton={false} />

        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Lock className="h-6 w-6" aria-hidden="true" />
              </div>
              <h1 className="mt-4 font-serif text-2xl font-semibold tracking-tight text-foreground">
                Moderator Access
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in with the moderator password to review, accept, or reject reflections.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="moderator-password"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Moderator password
                </label>
                <input
                  id="moderator-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter moderator password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  aria-invalid={passwordError ? true : undefined}
                  aria-describedby={passwordError ? "moderator-password-error" : undefined}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring"
                  autoFocus
                />
                {passwordError && (
                  <p
                    id="moderator-password-error"
                    role="alert"
                    className="mt-1.5 text-xs text-destructive"
                  >
                    {passwordError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSigningIn}
                className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSigningIn ? "Verifying…" : "Access Dashboard"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BlogHeader backTo="/blog" backLabel="View Public Blog" showWriteButton={false} />

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Top Header */}
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-0.5 text-xs font-semibold text-foreground">
              <ShieldAlert className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>Moderation Dashboard</span>
            </div>
            <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight text-foreground">
              Reflection Moderation
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Review submissions to ensure adherence to Adab guidelines before public display.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="self-start rounded-md border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground sm:self-auto"
          >
            Sign Out
          </button>
        </div>

        {/* Tab Filters with Badges */}
        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter submissions">
          {TABS.map((tab) => {
            const isActive = currentTab === tab.id;
            const count = counts[tab.id];
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls="moderation-list"
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="mt-8" id="moderation-list" role="tabpanel">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded-xl border border-border bg-muted/40 p-6"
                />
              ))}
            </div>
          ) : isError ? (
            <div
              role="alert"
              className="rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center"
            >
              <h3 className="font-serif text-lg font-medium text-foreground">
                Could not load submissions
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {error instanceof Error ? error.message : "Something went wrong."}
              </p>
              <button
                onClick={() => refetch()}
                className="mt-4 rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
              >
                Try again
              </button>
            </div>
          ) : displayedPosts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-16 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-muted-foreground/60" aria-hidden="true" />
              <h3 className="mt-4 font-serif text-lg font-medium text-foreground">
                {currentTab === "pending"
                  ? "All caught up!"
                  : `No ${currentTab} reflections found`}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {currentTab === "pending"
                  ? "There are no pending submissions awaiting review right now."
                  : `No reflections currently marked as ${currentTab}.`}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {displayedPosts.map((post) => {
                const isExpanded = expandedPostId === post.id;
                const isRejecting = rejectingPostId === post.id;

                return (
                  <article
                    key={post.id}
                    className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all"
                  >
                    <div className="p-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                              post.status === "approved"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : post.status === "rejected"
                                ? "bg-destructive/10 text-destructive"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {post.status === "approved" && <CheckCircle2 className="h-3 w-3" aria-hidden="true" />}
                            {post.status === "rejected" && <XCircle className="h-3 w-3" aria-hidden="true" />}
                            {post.status === "pending" && <Clock className="h-3 w-3" aria-hidden="true" />}
                            <span>{post.status}</span>
                          </span>

                          <span className="rounded bg-secondary px-2 py-0.5 text-xs font-medium text-foreground">
                            {post.category}
                          </span>

                          <span className="text-xs text-muted-foreground">
                            Submitted {format(new Date(post.created_at), "MMM d, yyyy 'at' h:mm a")}
                          </span>
                        </div>

                        {/* Direct action buttons for fast moderation */}
                        <div className="flex items-center gap-2">
                          {post.status !== "approved" && (
                            <button
                              type="button"
                              disabled={updateMutation.isPending}
                              onClick={() =>
                                updateMutation.mutate({
                                  id: post.id,
                                  status: "approved",
                                })
                              }
                              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Approve</span>
                            </button>
                          )}

                          {post.status !== "rejected" && (
                            <button
                              type="button"
                              disabled={updateMutation.isPending}
                              onClick={() => {
                                if (isRejecting) {
                                  setRejectingPostId(null);
                                } else {
                                  setRejectingPostId(post.id);
                                  setRejectionNote(post.admin_note || "");
                                }
                              }}
                              className="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20 disabled:opacity-50"
                            >
                              <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Reject</span>
                            </button>
                          )}

                          <button
                            type="button"
                            aria-expanded={isExpanded}
                            onClick={() =>
                              setExpandedPostId(isExpanded ? null : post.id)
                            }
                            className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
                          >
                            <span>{isExpanded ? "Collapse" : "Preview Full"}</span>
                            {isExpanded ? (
                              <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Title & Author */}
                      <h2 className="mt-4 font-serif text-2xl font-medium tracking-tight text-foreground">
                        {post.title}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        By <strong className="text-foreground">{post.author_name}</strong> · {post.read_time_minutes} min read
                      </p>

                      {/* Excerpt */}
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {post.excerpt}
                      </p>

                      {/* Rejection Note Display if rejected */}
                      {post.status === "rejected" && post.admin_note && (
                        <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">
                          <strong>Rejection reason:</strong> {post.admin_note}
                        </div>
                      )}

                      {/* Inline Rejection Reason Box */}
                      {isRejecting && (
                        <div className="mt-4 rounded-lg border border-border bg-secondary/30 p-4">
                          <label
                            htmlFor={`rejection-reason-${post.id}`}
                            className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                          >
                            Reason for rejection (Optional)
                          </label>
                          <input
                            id={`rejection-reason-${post.id}`}
                            type="text"
                            placeholder="e.g. Does not meet Adab guidelines, duplicate submission, etc."
                            value={rejectionNote}
                            onChange={(e) => setRejectionNote(e.target.value)}
                            className="mt-2 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring"
                          />
                          <div className="mt-3 flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setRejectingPostId(null)}
                              className="rounded px-3 py-1 text-xs font-semibold text-muted-foreground hover:bg-muted"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              disabled={updateMutation.isPending}
                              onClick={() =>
                                updateMutation.mutate({
                                  id: post.id,
                                  status: "rejected",
                                  note: rejectionNote.trim(),
                                })
                              }
                              className="rounded bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground hover:bg-destructive/90"
                            >
                              Confirm Rejection
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Expanded Full View */}
                      {isExpanded && (
                        <div className="mt-6 border-t border-border pt-6">
                          <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
                            <span className="font-semibold uppercase tracking-wider">
                              Full Submission Preview
                            </span>
                            {post.status === "approved" && (
                              <Link
                                to="/blog/$blogId"
                                params={{ blogId: post.id }}
                                className="inline-flex items-center gap-1 text-primary hover:underline"
                              >
                                View public page <ArrowRight className="h-3 w-3" aria-hidden="true" />
                              </Link>
                            )}
                          </div>
                          <div className="rounded-xl border border-border bg-background p-6">
                            <BlogContent content={post.content} />
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
