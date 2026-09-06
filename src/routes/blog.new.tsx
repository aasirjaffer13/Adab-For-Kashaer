import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { createBlogPost } from "@/services/blog-service";
import { BLOG_CATEGORIES } from "@/types/blog";
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
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/blog/new")({
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

  // Available categories without 'All'
  const categories = BLOG_CATEGORIES.filter((c) => c !== "All");

  const insertSnippet = (snippet: string) => {
    setContent((prev) => prev + (prev.endsWith("\n") ? "" : "\n\n") + snippet);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please provide a title for your reflection");
      return;
    }

    if (!content.trim()) {
      toast.error("Please write some content before publishing");
      return;
    }

    setIsSubmitting(true);
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const generatedExcerpt =
        excerpt.trim() ||
        content
          .replace(/^[#>*\d.-]+\s*/gm, "")
          .slice(0, 160)
          .trim() + "...";

      await createBlogPost({
        title,
        excerpt: generatedExcerpt,
        content,
        author_name: authorName.trim() || "Anonymous Contributor",
        category,
        tags,
      });

      toast.success(
        "Reflection submitted for review! Once approved by a moderator, it will appear publicly.",
        { duration: 6000 }
      );
      navigate({
        to: "/blog",
      });
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to submit reflection. Please try again.");
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
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
                required
                placeholder="e.g. Guarding the Tongue in Group Chats"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 w-full rounded-xl border border-input bg-card px-4 py-3 font-serif text-xl text-foreground placeholder:font-sans placeholder:text-base placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring"
              />
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
                className="mt-2 w-full rounded-lg border border-input bg-card px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring"
              />
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
                required
                placeholder="Pour your thoughts here... You can use ## for headings, > for quotes, and 1. or - for lists."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-2 w-full rounded-xl border border-input bg-card p-4 font-mono text-sm leading-relaxed text-foreground placeholder:font-sans placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring"
              />
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

