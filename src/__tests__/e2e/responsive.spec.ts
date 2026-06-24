import { test, expect } from "@playwright/test";

test.describe("Pokédex Responsive Design & Search Filters", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to local server
    await page.goto("/");
  });

  test("should load the Pokédex home page and render the header", async ({ page }) => {
    // Check that title heading exists
    const heading = page.locator("h1", { hasText: "Oak's Originals" });
    await expect(heading).toBeVisible();

    // Check that the search box exists
    const searchInput = page.getByPlaceholder("Search Pokémon by name or ID...");
    await expect(searchInput).toBeVisible();
  });

  test("should search for a Pokemon and filter the list", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search Pokémon by name or ID...");
    await searchInput.fill("Bulbasaur");

    // Check that only Bulbasaur is rendered in the list
    const pokemonCard = page.locator("div.capitalize", { hasText: "bulbasaur" }).first();
    await expect(pokemonCard).toBeVisible();

    // Verify other Pokemon like Charmander are not visible
    const charmanderCard = page.locator("div.capitalize", { hasText: "charmander" }).first();
    await expect(charmanderCard).not.toBeVisible();
  });

  test("should open the detail modal and navigate tabs", async ({ page }) => {
    // Search and click Bulbasaur card
    const searchInput = page.getByPlaceholder("Search Pokémon by name or ID...");
    await searchInput.fill("Bulbasaur");
    
    // Click on the first card
    const cardTitle = page.locator("h3", { hasText: "bulbasaur" }).first();
    await cardTitle.click();

    // Detail Modal should be open
    const modalHeader = page.locator("h2", { hasText: "bulbasaur" }).first();
    await expect(modalHeader).toBeVisible();

    // Check navigation to Competitive tab
    const compTabButton = page.locator("button[role='tab']", { hasText: "Competitive" }).first();
    await expect(compTabButton).toBeVisible();
    await compTabButton.click();

    // Verify competitive content is shown
    const competitiveHeading = page.locator("h3", { hasText: "Competitive Analysis" }).first();
    await expect(competitiveHeading).toBeVisible();

    // Check Smogon Tier is loaded
    const smogonTierBadge = page.locator("span", { hasText: "Smogon Tier:" }).first();
    await expect(smogonTierBadge).toBeVisible();

    // Close Modal
    const closeModalButton = page.locator("button", { has: page.locator("svg.lucide-x") }).first();
    if (await closeModalButton.isVisible()) {
      await closeModalButton.click();
    } else {
      // Escape key fallback
      await page.keyboard.press("Escape");
    }

    // Modal should be closed
    await expect(modalHeader).not.toBeVisible();
  });
});
