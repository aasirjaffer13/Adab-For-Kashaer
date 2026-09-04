import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBlogPosts, getLikedPostIds } from "@/services/blog-service";
import { BLOG_CATEGORIES, type BlogPost } from "@/types/blog";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { Search, Heart, Clock, ArrowRight, PenSquare, Tag, Sparkles } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/blog/")({
  component: BlogIndexPage,
  head: () => ({
    meta: [
      { title: "Reflections & Essays — Adab Community Blog" },
      {
        name: "description",
        content:
          "Explore community reflections and essays on digital ethics, lowering the gaze, character, and contemporary Islamic life.",
      },
    ],
  }),
});

function BlogIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [likedIds, setLikedIds] = useState<string[]>([]);

  useEffect(() => {
    setLikedIds(getLikedPostIds());
  }, []);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["community-blogs"],
    queryFn: getBlogPosts,
  });

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.author_name.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  // Designate the first post as featured if no active search or filter
  const isDefaultView = selectedCategory === "All" && !searchQuery.trim();
  const featuredPost = isDefaultView && filteredPosts.length > 0 ? filteredPosts[0] : null;
  const gridPosts = isDefaultView ? filteredPosts.slice(1) : filteredPosts;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BlogHeader />

      <main className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        {/* Editorial Title Banner */}
        <section className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3.5 py-1 text-xs font-semibold text-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Community Reflections</span>
          </div>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Words that heal, remind, and elevate.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
            An open forum where believers share perspectives on digital etiquette, lowering the gaze,
            spiritual resilience, and the adab we owe one another online.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/blog/new"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              <PenSquare className="h-4 w-4" />
              <span>Write your reflection</span>
            </Link>
          </div>
        </section>

        {/* Filter Controls & Search */}
        <section className="mt-14 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {BLOG_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search reflections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-input bg-card py-1.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
        </section>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-2xl border border-border bg-muted/40 p-6"
              />
            ))}
          </div>
        )}

        {/* Featured Story */}
        {!isLoading && featuredPost && (
          <section className="mt-10">
            <Link
              to="/blog/$blogId"
              params={{ blogId: featuredPost.id }}
              className="group block overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:border-primary/40 hover:shadow-md md:p-12"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="rounded-full bg-secondary px-2.5 py-1 text-primary">
                  Featured Reflection
                </span>
                <span>•</span>
                <span>{featuredPost.category}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {featuredPost.read_time_minutes} min read
                </span>
              </div>

              <h2 className="mt-4 font-serif text-2xl font-medium tracking-tight text-foreground transition-colors group-hover:text-primary md:text-3xl lg:text-4xl">
                {featuredPost.title}
              </h2>

              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                {featuredPost.excerpt}
              </p>

              <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary font-serif text-sm font-semibold text-foreground">
                    {featuredPost.author_name.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {featuredPost.author_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(featuredPost.created_at), "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm font-semibold text-primary">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Heart
                      className={`h-4 w-4 ${
                        likedIds.includes(featuredPost.id)
                          ? "fill-destructive text-destructive"
                          : ""
                      }`}
                    />
                    {featuredPost.likes_count}
                  </span>
                  <span className="inline-flex items-center gap-1 group-hover:underline">
                    Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Grid of Articles */}
        {!isLoading && gridPosts.length > 0 && (
          <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {gridPosts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                isLiked={likedIds.includes(post.id)}
              />
            ))}
          </section>
        )}

        {/* Empty State */}
        {!isLoading && filteredPosts.length === 0 && (
          <div className="mt-16 rounded-2xl border border-dashed border-border py-20 text-center">
            <Tag className="mx-auto h-8 w-8 text-muted-foreground/60" />
            <h3 className="mt-4 font-serif text-xl font-medium text-foreground">
              No reflections found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery
                ? `No results matching "${searchQuery}". Try different keywords or reset filters.`
                : "No articles found in this category yet. Be the first to write one!"}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              {(searchQuery || selectedCategory !== "All") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="rounded-md border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  Reset filters
                </button>
              )}
              <Link
                to="/blog/new"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                <PenSquare className="h-3.5 w-3.5" />
                <span>Write a reflection</span>
              </Link>
            </div>
          </div>
        )}

        {/* Bottom Community Banner */}
        <section className="mt-20 rounded-2xl border border-border bg-secondary/30 p-8 text-center md:p-12">
          <h3 className="font-serif text-2xl font-medium tracking-tight text-foreground md:text-3xl">
            Have a thought, story, or lesson to share?
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
            Adab is shaped by the collective conscience of our community. Share your insights on digital
            behavior, guarding the tongue, and honoring modesty.
          </p>
          <div className="mt-6">
            <Link
              to="/blog/new"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              <PenSquare className="h-4 w-4" />
              <span>Write your reflection</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function BlogCard({ post, isLiked }: { post: BlogPost; isLiked: boolean }) {
  return (
    <Link
      to="/blog/$blogId"
      params={{ blogId: post.id }}
      className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
    >
      <div>
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span className="rounded-md bg-secondary px-2 py-0.5 text-foreground">
            {post.category}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.read_time_minutes} min
          </span>
        </div>

        <h3 className="mt-4 font-serif text-xl font-medium tracking-tight text-foreground transition-colors group-hover:text-primary">
          {post.title}
        </h3>

        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
        <div>
          <span className="font-medium text-foreground">{post.author_name}</span>
          <span className="mx-1.5">·</span>
          <span>{format(new Date(post.created_at), "MMM d, yyyy")}</span>
        </div>

        <div className="flex items-center gap-1">
          <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-destructive text-destructive" : ""}`} />
          <span>{post.likes_count}</span>
        </div>
      </div>
    </Link>
  );
}

