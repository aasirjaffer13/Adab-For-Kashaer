import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address");

export const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters");

export const credentialsSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/** Sign-in only checks presence — existing accounts may predate the 8-char rule. */
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

const MAX_TAGS = 10;

export const blogDraftSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Give your reflection a title of at least 3 characters")
    .max(140, "Keep the title under 140 characters"),
  authorName: z
    .string()
    .trim()
    .max(60, "Author name is too long"),
  category: z.string().min(1, "Pick a category"),
  excerpt: z
    .string()
    .trim()
    .max(240, "Keep the summary under 240 characters"),
  content: z
    .string()
    .trim()
    .min(40, "Write at least 40 characters before submitting"),
  tagsInput: z.string(),
});

export type BlogDraftInput = z.infer<typeof blogDraftSchema>;

/** "adab, humility , youth" -> ["adab", "humility", "youth"] */
export function parseTags(tagsInput: string): string[] {
  return tagsInput
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, MAX_TAGS);
}

/** Derives a shareable summary when the author leaves the excerpt blank. */
export function deriveExcerpt(content: string): string {
  const flattened = content
    .replace(/^[#>*\d.-]+\s*/gm, "")
    .replace(/\s+/g, " ")
    .trim();
  if (flattened.length <= 160) return flattened;
  return `${flattened.slice(0, 160).trimEnd()}…`;
}
