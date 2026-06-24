import { test, expect } from "@playwright/test";

test.describe("Authentication Modal & Audio Settings Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should open the Sign In modal when clicking the auth button", async ({ page }) => {
    // Locate the Sign In button
    const signInButton = page.locator("button", { hasText: "Sign In" }).first();
    await expect(signInButton).toBeVisible();
    await signInButton.click();

    // Verify AuthModal is visible
    const modalHeader = page.locator("h3", { hasText: "Welcome, Trainer!" }).first();
    await expect(modalHeader).toBeVisible();

    // Verify input fields are present
    const emailInput = page.getByPlaceholder("ash@palette.town");
    await expect(emailInput).toBeVisible();

    // Close the AuthModal
    const closeButton = page.locator("button:has-text('Cancel'), button:has(svg.lucide-x)").first();
    if (await closeButton.isVisible()) {
      await closeButton.click();
    } else {
      await page.keyboard.press("Escape");
    }

    // Modal should close
    await expect(modalHeader).not.toBeVisible();
  });

  test("should toggle sound settings state", async ({ page }) => {
    // Click the sound settings button to toggle state
    // The AudioToggle button usually has a title of "Mute Cries" or "Unmute Cries"
    const audioButton = page.locator("button[title*='Cries']").first();
    await expect(audioButton).toBeVisible();

    const initialTitle = await audioButton.getAttribute("title");
    await audioButton.click();

    const toggledTitle = await audioButton.getAttribute("title");
    expect(toggledTitle).not.toBe(initialTitle);
  });
});
