import { defineConfig, devices } from "@playwright/test";

// A dedicated port keeps the suite from silently attaching to some other
// dev server that happens to be running on the default 8080.
const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 8099);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;
const isCI = !!process.env.CI;

/**
 * When PLAYWRIGHT_BASE_URL is set (e.g. against a deployed preview) the local
 * dev server is not started; otherwise `npm run dev` is booted for us.
 */
const launchLocalServer = !process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [["list"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: launchLocalServer
    ? {
        command: `npm run dev -- --port ${PORT} --strictPort`,
        url: baseURL,
        reuseExistingServer: false,
        timeout: 120_000,
        env: {
          // The landing page does not talk to Supabase, but the client module
          // still needs plausible values to boot without a real project.
          VITE_SUPABASE_URL:
            process.env.VITE_SUPABASE_URL ?? "https://example.supabase.co",
          VITE_SUPABASE_PUBLISHABLE_KEY:
            process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_dummy",
          SUPABASE_URL: process.env.SUPABASE_URL ?? "https://example.supabase.co",
          SUPABASE_PUBLISHABLE_KEY:
            process.env.SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_dummy",
        },
      }
    : undefined,
});
