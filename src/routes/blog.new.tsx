import { createFileRoute, useNavigate, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { createBlogPost } from "@/services/blog-service";
import { BLOG_CATEGORIES } from "@/types/blog";
import { blogDraftSchema, deriveExcerpt, parseTags } from "@/lib/validation";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { BlogContent } from "@/components/blog/BlogContent";
import { toast } from "sonner";
import {
  PenSquare,
  Eye,
  Send,
  ShieldCheck,
  Quote,
  Heading2,
  List,
} from "lucide-react";

export const Route = createFileRoute("/blog/new")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/login", search: { redirect: "/blog/new" } });
    }
  },
  component: NewBlogPage,
  head: () => ({
    meta: [
      { title: "Write a Reflection — Adab Community Blog" },
      {
        name: "description",
        content: "Share your thoughts, essays, and reflections with the Adab community.",
      },
    ],
  }),
});

function NewBlogPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState(
    user?.email ? user.email.split("@")[0] : ""
  );
  const [category, setCategory] = useState<string>("Adab & Etiquette");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("adab, reflection");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<"title" | "content" | "excerpt", string>>
  >({});

  // Available categories without 'All'
  const categories = BLOG_CATEGORIES.filter((c) => c !== "All");

  const insertSnippet = (snippet: string) => {
    setContent((prev) => prev + (prev.endsWith("\n") ? "" : "\n\n") + snippet);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = blogDraftSchema.safeParse({
      title,
      authorName,
      category,
      excerpt,
      content,
      tagsInput,
    });

    if (!parsed.success) {
      const issues = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        title: issues.title?.[0],
        content: issues.content?.[0],
        excerpt: issues.excerpt?.[0],
      });
      toast.error("Please fix the highlighted fields before submitting.");
      return;
    }
    setFieldErrors({});

    setIsSubmitting(true);
    try {
      await createBlogPost({
        title: parsed.data.title,
        excerpt: parsed.data.excerpt || deriveExcerpt(parsed.data.content),
        content: parsed.data.content,
        author_name: parsed.data.authorName || "Anonymous Contributor",
        category: parsed.data.category,
        tags: parseTags(parsed.data.tagsInput),
      });

      // The author lands on /blog straight away — clear the stale feed.
      await queryClient.invalidateQueries({ queryKey: ["community-blogs"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-all-posts"] });

      toast.success(
        "Reflection submitted for review! Once approved by a moderator, it will appear publicly.",
        { duration: 6000 }
      );
      navigate({ to: "/blog" });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to submit reflection.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BlogHeader backTo="/blog" backLabel="All Reflections" showWriteButton={false} />

      <main className="mx-auto max-w-4xl px-6 py-10 md:py-14">
        {/* Page Title & Status */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Community Contributions
            </span>
            <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
              Write a Reflection
            </h1>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center rounded-lg border border-border bg-card p-1">
            <button
              type="button"
              onClick={() => setActiveTab("write")}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === "write"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <PenSquare className="h-3.5 w-3.5" />
              <span>Write</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === "preview"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview</span>
            </button>
          </div>
        </div>

        {/* Adab Code Alert Box */}
        <div className="mt-8 rounded-xl border border-border bg-secondary/30 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="text-sm leading-relaxed text-muted-foreground">
              <p className="font-semibold text-foreground">Writing with Adab & Moderation</p>
              <p className="mt-1">
                Adab is a reflective community space. Speak truth with gentleness (*qawlan layyina*),
                avoid slander and backbiting, and verify quotes. Every submission is reviewed by moderators
                before being published publicly.
              </p>
            </div>
          </div>
        </div>

        {activeTab === "write" ? (
          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Reflection Title *
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g. Guarding the Tongue in Group Chats"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-invalid={fieldErrors.title ? true : undefined}
                aria-describedby={fieldErrors.title ? "title-error" : undefined}
                className="mt-2 w-full rounded-xl border border-input bg-card px-4 py-3 font-serif text-xl text-foreground placeholder:font-sans placeholder:text-base placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring"
              />
              {fieldErrors.title && (
                <p id="title-error" role="alert" className="mt-1.5 text-xs text-destructive">
                  {fieldErrors.title}
                </p>
              )}
            </div>

            {/* Author & Category Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="author"
                  className="block font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Author Name / Pseudonym
                </label>
                <input
                  id="author"
                  type="text"
                  placeholder="Your Name or Anonymous"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-input bg-card px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Leave blank to publish as "Anonymous Contributor".
                </p>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Category *
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-input bg-card px-3.5 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label
                htmlFor="excerpt"
                className="block font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Brief Summary / Hook (Optional)
              </label>
              <textarea
                id="excerpt"
                rows={2}
                placeholder="A 1-2 sentence overview of your reflection..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                aria-invalid={fieldErrors.excerpt ? true : undefined}
                aria-describedby={fieldErrors.excerpt ? "excerpt-error" : undefined}
                className="mt-2 w-full rounded-lg border border-input bg-card px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring"
              />
              {fieldErrors.excerpt && (
                <p id="excerpt-error" role="alert" className="mt-1.5 text-xs text-destructive">
                  {fieldErrors.excerpt}
                </p>
              )}
            </div>

            {/* Content Field with formatting toolbar */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="content"
                  className="block font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Content *
                </label>
                {/* Format Helper Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => insertSnippet("## Subheading\n\n")}
                    className="inline-flex items-center gap-1 rounded border border-border px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                    title="Insert Heading"
                  >
                    <Heading2 className="h-3.5 w-3.5" />
                    <span>Heading</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      insertSnippet('> "Insert Quranic verse, Hadith, or scholarly quotation here."\n\n')
                    }
                    className="inline-flex items-center gap-1 rounded border border-border px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                    title="Insert Quote Block"
                  >
                    <Quote className="h-3.5 w-3.5" />
                    <span>Quote</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSnippet("1. First point\n2. Second point\n3. Third point\n\n")}
                    className="inline-flex items-center gap-1 rounded border border-border px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                    title="Insert List"
                  >
                    <List className="h-3.5 w-3.5" />
                    <span>List</span>
                  </button>
                </div>
              </div>

              <textarea
                id="content"
                rows={15}
                placeholder="Pour your thoughts here... You can use ## for headings, > for quotes, and 1. or - for lists."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                aria-invalid={fieldErrors.content ? true : undefined}
                aria-describedby={fieldErrors.content ? "content-error" : "content-hint"}
                className="mt-2 w-full rounded-xl border border-input bg-card p-4 font-mono text-sm leading-relaxed text-foreground placeholder:font-sans placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring"
              />
              {fieldErrors.content ? (
                <p id="content-error" role="alert" className="mt-1.5 text-xs text-destructive">
                  {fieldErrors.content}
                </p>
              ) : (
                <p id="content-hint" className="mt-1.5 text-xs text-muted-foreground">
                  At least 40 characters.
                </p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="block font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Tags (comma separated)
              </label>
              <input
                id="tags"
                type="text"
                placeholder="adab, humility, social media, youth"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="mt-2 w-full rounded-lg border border-input bg-card px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between border-t border-border pt-6">
              <Link
                to="/blog"
                className="text-sm font-medium text-muted-foreground hover:underline"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? "Submitting…" : "Submit for Review"}</span>
              </button>
            </div>
          </form>
        ) : (
          /* Preview View */
          <div className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-sm md:p-12">
            <div className="mb-8 border-b border-border pb-8 text-center">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
                {category}
              </span>
              <h1 className="mt-4 font-serif text-3xl font-medium tracking-tight text-foreground md:text-5xl">
                {title || "Untitled Reflection"}
              </h1>
              <p className="mt-4 text-sm text-muted-foreground">
                By <strong className="text-foreground">{authorName || "Anonymous Contributor"}</strong> · Just now
              </p>
              {excerpt && (
                <p className="mx-auto mt-4 max-w-2xl text-lg italic text-muted-foreground">
                  "{excerpt}"
                </p>
              )}
            </div>

            {content ? (
              <BlogContent content={content} />
            ) : (
              <p className="py-12 text-center text-sm italic text-muted-foreground">
                Nothing written yet. Switch back to the Write tab to draft your reflection.
              </p>
            )}

            <div className="mt-12 flex justify-center border-t border-border pt-8">
              <button
                type="button"
                onClick={() => setActiveTab("write")}
                className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
              >
                Return to Editor
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

