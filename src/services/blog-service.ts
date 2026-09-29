import { supabase } from "@/integrations/supabase/client";
import type { BlogPost } from "@/types/blog";

const LIKED_POSTS_KEY = "adab_liked_blogs_v1";

export function getLikedPostIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LIKED_POSTS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

/** Toggles a post id in local storage and returns whether it is now liked. */
export function saveLikedPostId(id: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const current = getLikedPostIds();
    const isNowLiked = !current.includes(id);
    const updated = isNowLiked ? [...current, id] : current.filter((x) => x !== id);
    localStorage.setItem(LIKED_POSTS_KEY, JSON.stringify(updated));
    return isNowLiked;
  } catch {
    return false;
  }
}

/**
 * Route params are interpolated into a PostgREST `or()` filter, so restrict the
 * alphabet before it reaches the query string.
 */
function sanitizeIdOrSlug(value: string): string {
  return value.replace(/[^A-Za-z0-9._-]/g, "").slice(0, 120);
}

/** Fetch every published (approved) post for the public feed. */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

/** Fetch a single post by id or slug. Returns null when nothing matches. */
export async function getBlogPostById(idOrSlug: string): Promise<BlogPost | null> {
  const key = sanitizeIdOrSlug(idOrSlug);
  if (!key) return null;

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .or(`id.eq.${key},slug.eq.${key}`)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Create a new blog post. Submissions always land as `pending`; only the
 * moderator server function can change `status` (see 20260908 migration).
 */
export async function createBlogPost(params: {
  title: string;
  excerpt: string;
  content: string;
  author_name: string;
  category: string;
  tags?: string[];
  cover_image?: string | null;
  read_time_minutes?: number;
}): Promise<BlogPost> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in to submit a reflection.");
  }

  const estimatedReadTime =
    params.read_time_minutes ||
    Math.max(1, Math.round(params.content.trim().split(/\s+/).length / 200));

  const slug =
    params.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 60) +
    "-" +
    Date.now().toString(36);

  const { data, error } = await supabase
    .from("blogs")
    .insert({
      id: "blog_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      title: params.title.trim(),
      slug,
      excerpt: params.excerpt.trim(),
      content: params.content.trim(),
      author_name: params.author_name.trim() || "Anonymous Contributor",
      author_id: user.id,
      category: params.category || "Adab & Etiquette",
      tags: params.tags ?? ["adab", "reflection"],
      cover_image: params.cover_image ?? null,
      read_time_minutes: estimatedReadTime,
      likes_count: 0,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    throw new Error(
      error.code === "42501"
        ? "You are not allowed to publish from this account."
        : error.message,
    );
  }

  return data;
}

/** Increments or decrements the like counter, rolling back on failure. */
export async function togglePostLike(id: string): Promise<{ isLiked: boolean }> {
  const isLiked = saveLikedPostId(id);

  const { error } = await supabase.rpc("increment_blog_likes", {
    blog_id: id,
    amount: isLiked ? 1 : -1,
  });

  if (error) {
    saveLikedPostId(id);
    throw new Error(error.message);
  }

  return { isLiked };
}
