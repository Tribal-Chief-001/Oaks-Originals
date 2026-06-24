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

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - link "View on GitHub" [ref=e6] [cursor=pointer]:
          - /url: https://github.com/Tribal-Chief-001/Oaks-Originals
          - img [ref=e7]
        - link "Follow on X (Twitter)" [ref=e10] [cursor=pointer]:
          - /url: https://x.com/Nighlok__King
          - img [ref=e11]
      - generic [ref=e13]:
        - generic [ref=e14]:
          - img [ref=e15]
          - switch [ref=e25]
          - img [ref=e26]
        - generic [ref=e28]:
          - generic [ref=e29]: Normal
          - switch [ref=e30]
          - generic [ref=e31]: ✨ Shiny
        - button "Unmute Cries" [ref=e33]:
          - img
        - button "Favorites (0)" [ref=e34]:
          - img
          - generic [ref=e35]: Favorites
          - generic [ref=e36]: (0)
        - button "Compare (0/2)" [ref=e37]:
          - img
          - generic [ref=e38]: Compare
          - generic [ref=e39]: (0/2)
        - button "Tools" [ref=e41]:
          - img
          - generic [ref=e42]: Tools
          - img
        - generic [ref=e43]:
          - button "Breeding" [ref=e44]:
            - img
            - generic [ref=e45]: Breeding
          - button "Tracker" [ref=e46]:
            - img
            - generic [ref=e47]: Tracker
        - button "Sign In" [ref=e48]:
          - img
          - generic [ref=e49]: Sign In
    - generic [ref=e50]:
      - heading "Oak's Originals" [level=1] [ref=e51]
      - paragraph [ref=e52]: Professor Oak's personal collection of the original 151 Pokémon
    - generic [ref=e53]:
      - generic [ref=e54]:
        - img [ref=e55]
        - textbox "Search Pokémon by name or ID..." [active] [ref=e58]: Bulbasaur
      - paragraph [ref=e60]: Showing 1 of 151 Pokémon
      - generic [ref=e61]:
        - button "All Types" [ref=e62]
        - button "🌿 grass" [ref=e63]:
          - generic [ref=e64]: 🌿
          - text: grass
        - button "☠️ poison" [ref=e65]:
          - generic [ref=e66]: ☠️
          - text: poison
        - button "🔥 fire" [ref=e67]:
          - generic [ref=e68]: 🔥
          - text: fire
        - button "🦅 flying" [ref=e69]:
          - generic [ref=e70]: 🦅
          - text: flying
        - button "💧 water" [ref=e71]:
          - generic [ref=e72]: 💧
          - text: water
        - button "🐛 bug" [ref=e73]:
          - generic [ref=e74]: 🐛
          - text: bug
        - button "⚪ normal" [ref=e75]:
          - generic [ref=e76]: ⚪
          - text: normal
        - button "⚡ electric" [ref=e77]:
          - generic [ref=e78]: ⚡
          - text: electric
        - button "🌍 ground" [ref=e79]:
          - generic [ref=e80]: 🌍
          - text: ground
        - button "🧚 fairy" [ref=e81]:
          - generic [ref=e82]: 🧚
          - text: fairy
        - button "👊 fighting" [ref=e83]:
          - generic [ref=e84]: 👊
          - text: fighting
        - button "🔮 psychic" [ref=e85]:
          - generic [ref=e86]: 🔮
          - text: psychic
        - button "🪨 rock" [ref=e87]:
          - generic [ref=e88]: 🪨
          - text: rock
        - button "⚙️ steel" [ref=e89]:
          - generic [ref=e90]: ⚙️
          - text: steel
        - button "❄️ ice" [ref=e91]:
          - generic [ref=e92]: ❄️
          - text: ice
        - button "👻 ghost" [ref=e93]:
          - generic [ref=e94]: 👻
          - text: ghost
        - button "🐉 dragon" [ref=e95]:
          - generic [ref=e96]: 🐉
          - text: dragon
      - button "Advanced Filters" [ref=e98]:
        - img
        - text: Advanced Filters
      - generic [ref=e99]:
        - generic [ref=e100]:
          - generic [ref=e101]: "Sort by:"
          - combobox [ref=e102]:
            - option "ID" [selected]
            - option "Name"
            - option "Height"
            - option "Weight"
            - option "HP"
            - option "Attack"
            - option "Defense"
            - option "Sp. Attack"
            - option "Sp. Defense"
            - option "Speed"
        - button "Ascending" [ref=e103]:
          - img
          - text: Ascending
    - generic [ref=e106] [cursor=pointer]:
      - generic [ref=e107]:
        - generic [ref=e109]:
          - img "Bulbasaur" [ref=e110]
          - img "Bulbasaur animation" [ref=e111]
        - generic [ref=e112]: "#001"
        - button [ref=e114]:
          - img [ref=e115]
      - generic [ref=e117]: Bulbasaur
      - generic [ref=e118]:
        - generic [ref=e119]:
          - generic [ref=e120]: 🌿
          - text: grass
        - generic [ref=e121]:
          - generic [ref=e122]: ☠️
          - text: poison
      - generic [ref=e123]:
        - generic [ref=e124]: 📏 0.7m (2'4")
        - generic [ref=e125]: ⚖️ 6.9kg (15lbs)
      - generic [ref=e127]:
        - generic [ref=e128]: "Total: 318"
        - generic [ref=e129]: Below Average
    - button "Start Lab Tour" [ref=e130]:
      - img
    - generic [ref=e133]:
      - generic [ref=e134]:
        - generic [ref=e135]:
          - img [ref=e136]
          - generic [ref=e145]: Lab Assistant
        - button [ref=e146]:
          - img
      - generic [ref=e148]:
        - generic [ref=e149]: Welcome to Oak's Originals V5! 🎓
        - paragraph [ref=e150]: Welcome, Trainer! This is Professor Oak's personal lab dashboard. Let's take a quick 4-step tour to discover the avant-garde tools available to you.
      - generic [ref=e156]:
        - button "Back" [disabled]:
          - img
          - text: Back
        - button "Next" [ref=e157]:
          - generic [ref=e158]:
            - text: Next
            - img
    - generic [ref=e160]:
      - heading "Made with ❤️ by Xandred" [level=3] [ref=e161]
      - paragraph [ref=e162]: Built with Next.js 15, TypeScript, Tailwind CSS, and Supabase
      - generic [ref=e163]:
        - link "View Source" [ref=e164] [cursor=pointer]:
          - /url: https://github.com/Tribal-Chief-001/Oaks-Originals
        - generic [ref=e165]: •
        - link "Data by PokéAPI" [ref=e166] [cursor=pointer]:
          - /url: https://pokeapi.co/
  - region "Notifications (F8)":
    - list
  - alert [ref=e167]
  - button "Open Next.js Dev Tools" [ref=e173] [cursor=pointer]:
    - img [ref=e174]
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