# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive.spec.ts >> Pokédex Responsive Design & Search Filters >> should open the detail modal and navigate tabs
- Location: src/__tests__/e2e/responsive.spec.ts:32:7

# Error details

```
TimeoutError: locator.click: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('h3').filter({ hasText: 'bulbasaur' }).first()

```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Pokédex Responsive Design & Search Filters", () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Navigate to local server
  6  |     await page.goto("/");
  7  |   });
  8  | 
  9  |   test("should load the Pokédex home page and render the header", async ({ page }) => {
  10 |     // Check that title heading exists
  11 |     const heading = page.locator("h1", { hasText: "Oak's Originals" });
  12 |     await expect(heading).toBeVisible();
  13 | 
  14 |     // Check that the search box exists
  15 |     const searchInput = page.getByPlaceholder("Search Pokémon by name or ID...");
  16 |     await expect(searchInput).toBeVisible();
  17 |   });
  18 | 
  19 |   test("should search for a Pokemon and filter the list", async ({ page }) => {
  20 |     const searchInput = page.getByPlaceholder("Search Pokémon by name or ID...");
  21 |     await searchInput.fill("Bulbasaur");
  22 | 
  23 |     // Check that only Bulbasaur is rendered in the list
  24 |     const pokemonCard = page.locator("div.capitalize", { hasText: "bulbasaur" }).first();
  25 |     await expect(pokemonCard).toBeVisible();
  26 | 
  27 |     // Verify other Pokemon like Charmander are not visible
  28 |     const charmanderCard = page.locator("div.capitalize", { hasText: "charmander" }).first();
  29 |     await expect(charmanderCard).not.toBeVisible();
  30 |   });
  31 | 
  32 |   test("should open the detail modal and navigate tabs", async ({ page }) => {
  33 |     // Search and click Bulbasaur card
  34 |     const searchInput = page.getByPlaceholder("Search Pokémon by name or ID...");
  35 |     await searchInput.fill("Bulbasaur");
  36 |     
  37 |     // Click on the first card
  38 |     const cardTitle = page.locator("h3", { hasText: "bulbasaur" }).first();
> 39 |     await cardTitle.click();
     |                     ^ TimeoutError: locator.click: Timeout 10000ms exceeded.
  40 | 
  41 |     // Detail Modal should be open
  42 |     const modalHeader = page.locator("h2", { hasText: "bulbasaur" }).first();
  43 |     await expect(modalHeader).toBeVisible();
  44 | 
  45 |     // Check navigation to Competitive tab
  46 |     const compTabButton = page.locator("button[role='tab']", { hasText: "Competitive" }).first();
  47 |     await expect(compTabButton).toBeVisible();
  48 |     await compTabButton.click();
  49 | 
  50 |     // Verify competitive content is shown
  51 |     const competitiveHeading = page.locator("h3", { hasText: "Competitive Analysis" }).first();
  52 |     await expect(competitiveHeading).toBeVisible();
  53 | 
  54 |     // Check Smogon Tier is loaded
  55 |     const smogonTierBadge = page.locator("span", { hasText: "Smogon Tier:" }).first();
  56 |     await expect(smogonTierBadge).toBeVisible();
  57 | 
  58 |     // Close Modal
  59 |     const closeModalButton = page.locator("button", { has: page.locator("svg.lucide-x") }).first();
  60 |     if (await closeModalButton.isVisible()) {
  61 |       await closeModalButton.click();
  62 |     } else {
  63 |       // Escape key fallback
  64 |       await page.keyboard.press("Escape");
  65 |     }
  66 | 
  67 |     // Modal should be closed
  68 |     await expect(modalHeader).not.toBeVisible();
  69 |   });
  70 | });
  71 | 
```