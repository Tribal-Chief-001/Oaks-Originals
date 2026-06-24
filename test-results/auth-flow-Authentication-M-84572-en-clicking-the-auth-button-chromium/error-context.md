# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-flow.spec.ts >> Authentication Modal & Audio Settings Flow >> should open the Sign In modal when clicking the auth button
- Location: src/__tests__/e2e/auth-flow.spec.ts:8:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('button').filter({ hasText: 'Sign In' }).first()
Expected: visible
Timeout: 8000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 8000ms
  - waiting for locator('button').filter({ hasText: 'Sign In' }).first()

```

```yaml
- region "Notifications (F8)":
  - list
- alert
- button "Open Next.js Dev Tools":
  - img
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Authentication Modal & Audio Settings Flow", () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto("/");
  6  |   });
  7  | 
  8  |   test("should open the Sign In modal when clicking the auth button", async ({ page }) => {
  9  |     // Locate the Sign In button
  10 |     const signInButton = page.locator("button", { hasText: "Sign In" }).first();
> 11 |     await expect(signInButton).toBeVisible();
     |                                ^ Error: expect(locator).toBeVisible() failed
  12 |     await signInButton.click();
  13 | 
  14 |     // Verify AuthModal is visible
  15 |     const modalHeader = page.locator("h3", { hasText: "Welcome, Trainer!" }).first();
  16 |     await expect(modalHeader).toBeVisible();
  17 | 
  18 |     // Verify input fields are present
  19 |     const emailInput = page.getByPlaceholder("ash@palette.town");
  20 |     await expect(emailInput).toBeVisible();
  21 | 
  22 |     // Close the AuthModal
  23 |     const closeButton = page.locator("button:has-text('Cancel'), button:has(svg.lucide-x)").first();
  24 |     if (await closeButton.isVisible()) {
  25 |       await closeButton.click();
  26 |     } else {
  27 |       await page.keyboard.press("Escape");
  28 |     }
  29 | 
  30 |     // Modal should close
  31 |     await expect(modalHeader).not.toBeVisible();
  32 |   });
  33 | 
  34 |   test("should toggle sound settings state", async ({ page }) => {
  35 |     // Click the sound settings button to toggle state
  36 |     // The AudioToggle button usually has a title of "Mute Cries" or "Unmute Cries"
  37 |     const audioButton = page.locator("button[title*='Cries']").first();
  38 |     await expect(audioButton).toBeVisible();
  39 | 
  40 |     const initialTitle = await audioButton.getAttribute("title");
  41 |     await audioButton.click();
  42 | 
  43 |     const toggledTitle = await audioButton.getAttribute("title");
  44 |     expect(toggledTitle).not.toBe(initialTitle);
  45 |   });
  46 | });
  47 | 
```