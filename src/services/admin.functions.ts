import { createServerFn } from "@tanstack/react-start";
import type { BlogPost, BlogPostStatus } from "@/types/blog";

/**
 * Moderation API.
 *
 * Every privileged operation happens on the server:
 *  - the moderator password is checked against `process.env.ADMIN_PASSWORD`
 *    (never a `VITE_` var, which would be inlined into the client bundle),
 *  - a successful sign-in returns an HMAC-signed expiring token,
 *  - reads and writes use the service-role key, which is the only way to reach
 *    rows once RLS restricts `status` changes (see 20260908_harden_policies.sql).
 */

const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;
const encoder = new TextEncoder();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing server environment variable: ${name}. See .env.example.`,
    );
  }
  return value;
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(requireEnv("ADMIN_SESSION_SECRET")),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

async function hmac(value: string): Promise<Uint8Array> {
  const key = await hmacKey();
  const digest = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return new Uint8Array(digest);
}

/** Compares two byte arrays without leaking their contents through timing. */
function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function issueToken(): Promise<string> {
  const payload = toBase64Url(
    encoder.encode(JSON.stringify({ exp: Date.now() + TOKEN_TTL_MS })),
  );
  const signature = toBase64Url(await hmac(payload));
  return `${payload}.${signature}`;
}

async function isValidToken(token: unknown): Promise<boolean> {
  if (typeof token !== "string") return false;
  const separator = token.indexOf(".");
  if (separator <= 0 || separator === token.length - 1) return false;

  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);

  let expected: Uint8Array;
  let provided: Uint8Array;
  try {
    expected = await hmac(payload);
    provided = fromBase64Url(signature);
  } catch {
    return false;
  }

  if (!constantTimeEqual(provided, expected)) return false;

  try {
    const claims = JSON.parse(
      new TextDecoder().decode(fromBase64Url(payload)),
    ) as { exp?: unknown };
    return typeof claims.exp === "number" && claims.exp > Date.now();
  } catch {
    return false;
  }
}

async function assertAdmin(token: unknown): Promise<void> {
  if (!(await isValidToken(token))) {
    throw new Error("Your moderator session has expired. Please sign in again.");
  }
}

async function requireServiceRoleClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((input: { password: string }) => {
    if (typeof input.password !== "string" || input.password.length === 0) {
      throw new Error("Moderator password is required.");
    }
    return { password: input.password };
  })
  .handler(async ({ data }) => {
    const expected = requireEnv("ADMIN_PASSWORD");
    const matches = constantTimeEqual(await hmac(data.password), await hmac(expected));
    if (!matches) {
      throw new Error("Incorrect moderator password. Please try again.");
    }
    return { token: await issueToken() };
  });

export const adminVerifySession = createServerFn({ method: "POST" })
  .inputValidator((input: { token?: string }) => ({ token: input?.token }))
  .handler(async ({ data }) => {
    return { ok: await isValidToken(data.token) };
  });

export const adminListPosts = createServerFn({ method: "POST" })
  .inputValidator((input: { token: string }) => ({ token: input?.token ?? "" }))
  .handler(async ({ data }): Promise<BlogPost[]> => {
    await assertAdmin(data.token);
    const supabaseAdmin = await requireServiceRoleClient();
    const { data: posts, error } = await supabaseAdmin
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Could not load submissions: ${error.message}`);
    }
    return (posts ?? []) as unknown as BlogPost[];
  });

export const adminUpdatePostStatus = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { token: string; id: string; status: BlogPostStatus; note?: string }) => {
      if (!input?.id) throw new Error("A post id is required.");
      if (!["pending", "approved", "rejected"].includes(input.status)) {
        throw new Error("Unknown moderation status.");
      }
      return {
        token: input.token ?? "",
        id: input.id,
        status: input.status,
        note: typeof input.note === "string" ? input.note : "",
      };
    },
  )
  .handler(async ({ data }): Promise<BlogPost> => {
    await assertAdmin(data.token);
    const supabaseAdmin = await requireServiceRoleClient();

    const { data: updated, error } = await supabaseAdmin
      .from("blogs")
      .update({
        status: data.status,
        admin_note: data.note ? data.note : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id)
      .select()
      .single();

    if (error || !updated) {
      throw new Error(`Could not update the submission: ${error?.message ?? "not found"}`);
    }
    return updated as unknown as BlogPost;
  });
