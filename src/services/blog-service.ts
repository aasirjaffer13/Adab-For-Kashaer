import { supabase } from "@/integrations/supabase/client";
import type { BlogPost, BlogPostStatus } from "@/types/blog";

const STORAGE_KEY = "adab_community_blogs_v1";
const LIKED_POSTS_KEY = "adab_liked_blogs_v1";

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: "digital-gaze-in-algorithmic-age",
    title: "Guarding the Gaze When the Algorithm Feeds Desire",
    slug: "guarding-the-gaze-when-the-algorithm-feeds-desire",
    excerpt:
      "Lowering the gaze was revealed for bustling streets and desert crossroads. How does a believer practice it when the marketplace is in their palm, engineered to capture their eyes?",
    category: "The Digital Gaze",
    tags: ["adab", "gaze", "algorithms", "mindfulness"],
    author_name: "Tariq Al-Andalusi",
    read_time_minutes: 5,
    likes_count: 34,
    status: "approved",
    created_at: "2026-08-28T14:00:00.000Z",
    updated_at: "2026-08-28T14:00:00.000Z",
    content: `## The Modern Marketplace of the Eyes

In classical Islamic ethics, the gaze (*an-nazar*) was described as an arrow from the quiver of Iblis. The scholars of the heart—Al-Ghazali, Ibn Qayyim, and Ibn al-Jawzi—wrote volumes warning of the first casual look that lingers into a second deliberate gaze.

Yet when those treaties were penned, a person had to physically step into the town market or walk down an alleyway to face such tests. If you remained in your study or within the sanctuary of your home, the world could not force its images upon you.

Today, the market has moved into our bedroom. Worse still, the marketplace is powered by multi-billion-dollar recommendation algorithms that reward provocation, sensuality, and dopamine triggers. The algorithm does not merely reflect what we search for; it amplifies our fleeting weaknesses.

> *"Tell the believing men to lower their gaze and guard their modesty. That is purer for them. Indeed, Allah is Acquainted with what they do."* (Surah An-Nur 24:30)

Notice the divine wisdom in the sequencing: Allah subhanahu wa ta'ala addresses the men before the women, and addresses their eyes before their limbs. Purity of heart begins at the threshold of vision.

### Practical Steps for the Digital Gaze

1. **Resetting the Feed Aggressively**: Use the "Not Interested" or "Mute" feature ruthlessly. Do not linger for even two seconds on content that compromises your soul, as the feed registers your dwell-time.
2. **The 3-Second Rule**: When an unsolicited image appears, train your thumb to immediately scroll past. The first glance is forgiven; the lingering gaze is counted.
3. **Physical Boundaries**: Ban phones from the bedroom after nightfall. Spiritual discipline is often won or lost in the quiet hours when fatigue lowers cognitive restraint.
4. **Cultivating Al-Muraqabah**: Remember that Allah's sight upon you is faster than your screen's refresh rate. True dignity is what we do when only the angels are recording.`,
  },
  {
    id: "the-death-of-gentle-advice",
    title: "The Death of Gentle Advice: How Call-Out Culture Hijacked Nasihah",
    slug: "the-death-of-gentle-advice-how-call-out-culture-hijacked-nasihah",
    excerpt:
      "When did correcting a fellow Muslim transform from a quiet, tearful embrace into a public spectator sport designed to harvest retweets and likes?",
    category: "Adab & Etiquette",
    tags: ["nasihah", "discourse", "social-media", "character"],
    author_name: "Maryam K.",
    read_time_minutes: 6,
    likes_count: 52,
    status: "approved",
    created_at: "2026-08-30T10:30:00.000Z",
    updated_at: "2026-08-30T10:30:00.000Z",
    content: `## When Sincerity Becomes Spectacle

Imam ash-Shafi'i famously wrote:

> *"Counsel me in private, and spare me advice in the assembly. For advice given before people is a type of scolding that I do not love to hear."*

Today, if a young Muslim woman posts a reflection or photo where a strand of hair shows, or where a brother makes a grammatical mistake in Arabic, the comment section explodes. Men who have not prayed Tahajjud in months suddenly assume the robes of the Grand Mufti, typing paragraphs of condemnation punctuated with harsh emojis.

We must ask ourselves with utter honesty: **Who is this comment for?**

Is it genuinely intended to guide the soul back to Allah? Or is it a performative badge of piety meant to demonstrate to other onlookers that we are righteous while this person is deficient?

### The Conditions of True Nasihah

Classical scholars outlined three non-negotiable criteria for advice to be considered *Nasihah* rather than *Fadheehah* (public humilation):

1. **Ikhlas (Purity of Intention)**: You desire nothing except good for your brother or sister. If there is even an atom of pride or desire for superiority, your speech is poisoned.
2. **Sirriyyah (Privacy)**: Send a direct message, speak privately, or pray for them in your sujud. Public rebukes harden hearts and push people away from Islam.
3. **Lutf (Gentleness)**: Allah commanded Musa and Harun to speak with gentle speech (*qawlan layyina*) even to Pharaoh, the greatest tyrant of his time. Is your sister in faith more rebellious than Pharaoh?

If we cannot deliver our advice with tears of concern and quiet dignity, the most Islamic action we can take is silence.`,
  },
  {
    id: "social-media-humility-in-era-of-ego",
    title: "Kibr in 280 Characters: Social Media and the Vanity of the Self",
    slug: "kibr-in-280-characters-social-media-and-the-vanity-of-the-self",
    excerpt:
      "The Prophet ﷺ warned that no one enters Paradise who has an atom's weight of pride. How do we navigate platforms whose very architecture is built to feed the ego?",
    category: "Contemporary Discourse",
    tags: ["kibr", "humility", "ego", "spirituality"],
    author_name: "Zayd Bilal",
    read_time_minutes: 4,
    likes_count: 27,
    status: "approved",
    created_at: "2026-09-01T18:15:00.000Z",
    updated_at: "2026-09-01T18:15:00.000Z",
    content: `## The Economy of Self-Promotion

Every metric on modern social networks—follower counts, impression metrics, retweet velocity—is a numeric valuation of the self. Without realizing it, we begin asking: *Did they see me? Did they agree with me? How many people validated my insight today?*

The Prophet Muhammad ﷺ warned:

> *"Pride is refusing the truth and looking down upon people."* (Sahih Muslim)

In online debates, how often do we refuse to concede a valid point made by someone else simply because our pride cannot tolerate losing an argument publicly? How often do we sneer at someone's question or lack of knowledge?

### Cultivating Khushu' in Digital Spaces

- **Take intentional pauses before hitting 'Post'**: Ask: *Am I posting this to serve truth, or to elevate my own status?*
- **Practice hidden good deeds**: For every public reflection or post you share, perform two silent acts of charity or worship that nobody on Earth knows about.
- **Normalize saying 'I do not know'**: When discussions exceed your knowledge, resist the urge to weigh in. Adab is knowing the limits of one's own speech.`,
  },
  {
    id: "sanctuary-of-sisters",
    title: "The Sisterhood We Owe Each Other Online",
    slug: "the-sisterhood-we-owe-each-other-online",
    excerpt:
      "Navigating social spaces as a Muslim woman requires emotional resilience. Here is how we build spaces of genuine refuge, gentle accountability, and mutual honor.",
    category: "Youth & Culture",
    tags: ["sisters", "community", "support", "boundaries"],
    author_name: "Fatima Noor",
    read_time_minutes: 5,
    likes_count: 45,
    status: "approved",
    created_at: "2026-09-03T09:00:00.000Z",
    updated_at: "2026-09-03T09:00:00.000Z",
    content: `## Building Safe Harbors

Being visible online carries a unique toll for Muslim women. We find ourselves caught between commercial pressures to commodify our identity on one hand, and vicious, judgmental scrutiny on the other.

Every sister is at a different station on her spiritual journey. Some are wearing the hijab for the first time; some are struggling with doubts; others are seeking knowledge in hostile environments.

When a sister reaches out online, she should find warmth, wisdom, and an oasis of calm.

> *"The believers, men and women, are protectors one of another: they enjoin what is just, and forbid what is evil: they observe regular prayers, practice regular charity, and obey Allah and His Messenger."* (Surah At-Tawbah 9:71)

### Ways to Support Your Sisters Online

1. **Defend without escalating**: When you see a sister being unfairly targeted or piled upon in comment sections, step in with dignified firmness or report the harassment.
2. **Private encouragement**: Send a short, sincere message of support to sisters doing good work or struggling with public pressure. A kind word (*kalimah tayyibah*) is charity.
3. **Model digital rest**: Do not feel obligated to be perpetually accessible. Disconnecting from screens to reconnect with your Creator is an act of spiritual preservation.`,
  },
];

function getStoredBlogs(): BlogPost[] {
  if (typeof window === "undefined") return INITIAL_BLOG_POSTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BLOG_POSTS));
      return INITIAL_BLOG_POSTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item: BlogPost) => ({
        ...item,
        status: item.status || "approved",
      }));
    }
    return INITIAL_BLOG_POSTS;
  } catch {
    return INITIAL_BLOG_POSTS;
  }
}

function setStoredBlogs(blogs: BlogPost[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
  } catch (err) {
    console.error("Failed to save to localStorage", err);
  }
}

export function getLikedPostIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LIKED_POSTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLikedPostId(id: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const current = getLikedPostIds();
    let updated: string[];
    let isNowLiked = false;
    if (current.includes(id)) {
      updated = current.filter((x) => x !== id);
      isNowLiked = false;
    } else {
      updated = [...current, id];
      isNowLiked = true;
    }
    localStorage.setItem(LIKED_POSTS_KEY, JSON.stringify(updated));
    return isNowLiked;
  } catch {
    return false;
  }
}

interface DynamicSupabaseClient {
  from: (table: string) => {
    select: (cols?: string) => {
      order: (col: string, opts?: { ascending: boolean }) => {
        eq: (col: string, val: unknown) => Promise<{ data: unknown; error: unknown }>;
      } & Promise<{ data: unknown; error: unknown }>;
      eq: (col: string, val: unknown) => {
        order: (col: string, opts?: { ascending: boolean }) => Promise<{ data: unknown; error: unknown }>;
      } & Promise<{ data: unknown; error: unknown }>;
      or: (condition: string) => {
        single: () => Promise<{ data: unknown; error: unknown }>;
      };
    };
    insert: (values: unknown) => {
      select: () => {
        single: () => Promise<{ data: unknown; error: unknown }>;
      };
    };
    update: (values: unknown) => {
      eq: (col: string, val: unknown) => {
        select: () => {
          single: () => Promise<{ data: unknown; error: unknown }>;
        };
      } & Promise<{ data: unknown; error: unknown }>;
    };
  };
  rpc: (fn: string, args?: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
}

const db = supabase as unknown as DynamicSupabaseClient;

/**
 * Fetch all published (approved) blog posts for public view.
 * Tries Supabase first; if table doesn't exist or errors, falls back seamlessly to local store.
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await db
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      const posts = data as unknown as BlogPost[];
      return posts.filter((p) => p.status === "approved");
    }
  } catch {
    // Supabase table not created yet; fallback to local storage
  }

  const posts = getStoredBlogs();
  return posts.filter((p) => p.status === "approved");
}

/**
 * Fetch all posts pending moderation.
 */
export async function getPendingPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await db
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      const posts = data as unknown as BlogPost[];
      return posts.filter((p) => p.status === "pending");
    }
  } catch {
    // Fallback to local storage
  }

  const posts = getStoredBlogs();
  return posts.filter((p) => p.status === "pending");
}

/**
 * Fetch all posts regardless of status for admin management.
 */
export async function getAllPostsForAdmin(): Promise<BlogPost[]> {
  try {
    const { data, error } = await db
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      return data as unknown as BlogPost[];
    }
  } catch {
    // Fallback to local storage
  }

  return getStoredBlogs();
}

/**
 * Update the moderation status of a post (approve or reject).
 */
export async function updatePostStatus(
  id: string,
  status: BlogPostStatus,
  adminNote?: string
): Promise<BlogPost | null> {
  const posts = getStoredBlogs();
  const index = posts.findIndex((p) => p.id === id || p.slug === id);

  let updatedPost: BlogPost | null = null;
  if (index !== -1) {
    posts[index] = {
      ...posts[index],
      status,
      admin_note: adminNote !== undefined ? adminNote : posts[index].admin_note,
      updated_at: new Date().toISOString(),
    };
    updatedPost = posts[index];
    setStoredBlogs(posts);
  }

  try {
    const { data, error } = await db
      .from("blogs")
      .update({
        status,
        admin_note: adminNote || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      return data as unknown as BlogPost;
    }
  } catch {
    // Ignore database error if using local storage fallback
  }

  return updatedPost;
}

/**
 * Fetch a single blog post by ID or slug.
 */
export async function getBlogPostById(idOrSlug: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await db
      .from("blogs")
      .select("*")
      .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
      .single();

    if (!error && data) {
      return data as unknown as BlogPost;
    }
  } catch {
    // Fallback to local store
  }

  const posts = getStoredBlogs();
  return posts.find((p) => p.id === idOrSlug || p.slug === idOrSlug) ?? null;
}

/**
 * Create a new blog post. Defaults to "pending" status for admin review.
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

  const newPost: BlogPost = {
    id: "blog_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
    title: params.title.trim(),
    slug,
    excerpt: params.excerpt.trim(),
    content: params.content.trim(),
    author_name: params.author_name.trim() || "Anonymous Contributor",
    category: params.category || "Adab & Etiquette",
    tags: params.tags || ["adab", "reflection"],
    cover_image: params.cover_image || null,
    read_time_minutes: estimatedReadTime,
    likes_count: 0,
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Attempt Supabase insert
  try {
    const { data, error } = await db
      .from("blogs")
      .insert(newPost)
      .select()
      .single();

    if (!error && data) {
      return data as unknown as BlogPost;
    }
  } catch {
    // Ignore and proceed to local persistence
  }

  // Local persistence guarantee
  const existing = getStoredBlogs();
  const updated = [newPost, ...existing];
  setStoredBlogs(updated);

  return newPost;
}

/**
 * Increment or decrement likes count for a post.
 */
export async function togglePostLike(id: string): Promise<{ isLiked: boolean; newCount: number }> {
  const isLiked = saveLikedPostId(id);
  const posts = getStoredBlogs();
  const index = posts.findIndex((p) => p.id === id || p.slug === id);

  let newCount = 0;
  if (index !== -1) {
    const current = posts[index].likes_count || 0;
    newCount = isLiked ? current + 1 : Math.max(0, current - 1);
    posts[index].likes_count = newCount;
    setStoredBlogs(posts);
  }

  try {
    await db.rpc("increment_blog_likes", { blog_id: id, amount: isLiked ? 1 : -1 });
  } catch {
    // Ignore RPC failure
  }

  return { isLiked, newCount };
}

