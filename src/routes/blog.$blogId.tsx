import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBlogPostById, togglePostLike, getLikedPostIds } from "@/services/blog-service";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { BlogContent } from "@/components/blog/BlogContent";
import { format } from "date-fns";
import { Heart, Share2, Clock, ArrowLeft, PenSquare, Tag, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/blog/$blogId")({
  component: BlogPostPage,
});

function BlogPostPage() {
  const { blogId } = Route.useParams();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsLiked(getLikedPostIds().includes(blogId));
  }, [blogId]);

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", blogId],
    queryFn: () => getBlogPostById(blogId),
  });

  const likeMutation = useMutation({
    mutationFn: () => togglePostLike(blogId),
    onSuccess: (res) => {
      setIsLiked(res.isLiked);
      queryClient.invalidateQueries({ queryKey: ["blog-post", blogId] });
      queryClient.invalidateQueries({ queryKey: ["community-blogs"] });
      if (res.isLiked) {
        toast.success("Thank you for your appreciation!");
      }
    },
  });

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post?.title || "Adab Reflection",
          text: post?.excerpt || "Read this reflection on Adab",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success("Article link copied to clipboard!");
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <BlogHeader backTo="/blog" backLabel="All Reflections" />
        <main className="mx-auto max-w-3xl px-6 py-20">
          <div className="h-8 w-32 animate-pulse rounded bg-muted" />
          <div className="mt-6 h-12 w-full animate-pulse rounded bg-muted" />
          <div className="mt-8 space-y-4">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-muted" />
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <BlogHeader backTo="/blog" backLabel="All Reflections" />
        <main className="mx-auto max-w-2xl px-6 py-24 text-center">
          <h1 className="font-serif text-3xl font-medium">Reflection not found</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            The article you are looking for may have been moved or does not exist.
          </p>
          <div className="mt-6">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to all reflections</span>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BlogHeader backTo="/blog" backLabel="All Reflections" />

      <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        {/* Breadcrumb / Category & Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-muted-foreground">
          <span className="rounded-full bg-secondary px-3 py-1 text-foreground">
            {post.category}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.read_time_minutes} min read
          </span>
          <span>•</span>
          <span>{format(new Date(post.created_at), "MMMM d, yyyy")}</span>
        </div>

        {/* Title */}
        <h1 className="mt-6 font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        {/* Author Byline & Actions Toolbar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-t border-border py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary font-serif text-base font-semibold text-foreground">
              {post.author_name.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{post.author_name}</p>
              <p className="text-xs text-muted-foreground">Community Contributor</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
              className={`inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                isLiked
                  ? "border-destructive/40 bg-destructive/10 text-destructive"
                  : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              title={isLiked ? "Unlike reflection" : "Like reflection"}
            >
              <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-destructive" : ""}`} />
              <span>{post.likes_count}</span>
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title="Share reflection"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Excerpt Lead */}
        {post.excerpt && (
          <p className="mt-8 border-l-2 border-primary/40 pl-4 font-serif text-xl italic leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        )}

        {/* Article Body */}
        <div className="mt-10">
          <BlogContent content={post.content} />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-border pt-6">
            <Tag className="h-3.5 w-3.5 text-muted-foreground" />
            {post.tags.map((tag, i) => (
              <span
                key={i}
                className="rounded-md bg-secondary px-2.5 py-1 text-xs text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* End of article reaction & action box */}
        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-8 text-center">
          <h3 className="font-serif text-xl font-medium text-foreground">
            Did this reflection resonate with you?
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Support the writer with an appreciation, or share your own reflection with the community.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => likeMutation.mutate()}
              className={`inline-flex items-center gap-2 rounded-md px-5 py-2 text-sm font-semibold transition-colors ${
                isLiked
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              <span>{isLiked ? "Appreciated" : "Appreciate this reflection"}</span>
            </button>

            <Link
              to="/blog/new"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <PenSquare className="h-4 w-4" />
              <span>Write your own response</span>
            </Link>
          </div>
        </div>

        {/* Back to all reflections */}
        <div className="mt-10 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to all community reflections</span>
          </Link>
        </div>
      </article>
    </div>
  );
}

