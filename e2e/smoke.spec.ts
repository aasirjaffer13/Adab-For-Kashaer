import { test, expect } from "../playwright-fixture";

/** SSR renders the markup first; this waits until React has taken over. */
async function waitForHydration(page: import("@playwright/test").Page) {
  await page.waitForLoadState("networkidle");
}

test.describe("landing page", () => {
  test("serves the hero and primary navigation", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await waitForHydration(page);

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Lower the gaze.",
    );
    await expect(
      page.getByRole("banner").getByRole("link", { name: "Open Inspo" }),
    ).toBeVisible();
    await expect(page.locator("#main")).toBeVisible();
  });

  test("has a document title and meta description", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Adab/);
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description).toBeTruthy();
  });
});

test.describe("sign-in page", () => {
  test("renders the credential form with labelled fields", async ({ page }) => {
    const response = await page.goto("/login");
    expect(response?.status()).toBe(200);
    await waitForHydration(page);

    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
  });

  test("blocks submission until the form is filled in", async ({ page }) => {
    await page.goto("/login");
    await waitForHydration(page);

    // The click is retried until hydration has attached the submit handler.
    await expect(async () => {
      await page.getByRole("button", { name: "Sign In" }).click();
      await expect(page.getByRole("alert").first()).toBeVisible({
        timeout: 1500,
      });
    }).toPass({ timeout: 30_000 });

    // Inline validation, not a server round trip.
    await expect(page.getByLabel("Email")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  test("google sign-in goes through Supabase, not the Lovable broker", async ({
    page,
  }) => {
    // Never hit the network: the point is which URL the button navigates to.
    const authorize = page.waitForRequest((request) =>
      request.url().includes("/auth/v1/authorize"),
    );
    await page.route("**/auth/v1/authorize**", (route) => route.abort());

    await page.goto("/login");
    await waitForHydration(page);
    await page.getByRole("button", { name: "Continue with Google" }).click();

    const request = await authorize;
    expect(request.url()).toContain("provider=google");
    expect(request.url()).toContain("redirect_to=");
    expect(request.url()).toContain("prompt=select_account");
  });
});
