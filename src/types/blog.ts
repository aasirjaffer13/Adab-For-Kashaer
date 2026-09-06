export type BlogPostStatus = "pending" | "approved" | "rejected";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author_name: string;
  author_id?: string | null;
  category: string;
  tags: string[];
  cover_image?: string | null;
  read_time_minutes: number;
  likes_count: number;
  status: BlogPostStatus;
  admin_note?: string | null;
  created_at: string;
  updated_at: string;
}

export const BLOG_CATEGORIES = [
  "All",
  "Adab & Etiquette",
  "The Digital Gaze",
  "Youth & Culture",
  "Personal Reflections",
  "Contemporary Discourse",
] as const;

export type BlogCategory = typeof BLOG_CATEGORIES[number];

