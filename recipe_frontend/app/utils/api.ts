/**
 * Lightweight API client for the Recipe Explorer app.
 * Reads base URL from VITE_API_BASE or VITE_BACKEND_URL.
 * Falls back to mock data if env not set or fetch fails.
 */

export type Recipe = {
  id: string;
  title: string;
  image?: string;
  description?: string;
  ingredients?: string[];
  instructions?: string[];
};

export type PagedRecipes = {
  items: Recipe[];
  total: number;
  page: number;
  pageSize: number;
};

const MOCK_RECIPES: Recipe[] = [
  {
    id: "1",
    title: "Lemon Garlic Salmon",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
    description:
      "Succulent salmon fillets with a bright lemon garlic butter sauce.",
    ingredients: [
      "2 salmon fillets",
      "2 tbsp butter",
      "2 cloves garlic, minced",
      "1 lemon (zest & juice)",
      "Salt & pepper",
      "Fresh parsley",
    ],
    instructions: [
      "Season salmon with salt and pepper.",
      "Sear salmon in butter until golden.",
      "Add garlic, cook briefly.",
      "Add lemon juice & zest, baste the salmon.",
      "Top with parsley and serve.",
    ],
  },
  {
    id: "2",
    title: "Creamy Mushroom Pasta",
    image:
      "https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?q=80&w=1200&auto=format&fit=crop",
    description:
      "Al dente pasta tossed in a creamy garlic mushroom sauce with parmesan.",
    ingredients: [
      "200g pasta",
      "250g mushrooms, sliced",
      "2 cloves garlic, minced",
      "1 cup cream",
      "1/2 cup parmesan, grated",
      "Olive oil, salt & pepper",
    ],
    instructions: [
      "Cook pasta until al dente.",
      "Sauté mushrooms in olive oil until golden.",
      "Add garlic, cook until fragrant.",
      "Stir in cream and simmer.",
      "Toss with pasta and parmesan.",
    ],
  },
  {
    id: "3",
    title: "Grilled Chicken Salad",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop",
    description:
      "Fresh greens topped with juicy grilled chicken and a tangy vinaigrette.",
    ingredients: [
      "2 chicken breasts",
      "Mixed greens",
      "Cherry tomatoes",
      "Cucumber",
      "Red onion",
      "Vinaigrette",
    ],
    instructions: [
      "Season and grill chicken, then slice.",
      "Assemble greens and vegetables.",
      "Top with chicken and drizzle vinaigrette.",
    ],
  },
];

function getBaseUrl() {
  // Read from client-safe vite env
  const base = import.meta.env.VITE_API_BASE || import.meta.env.VITE_BACKEND_URL || "";
  return typeof base === "string" ? base.trim() : "";
}

async function safeFetch<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/**
 * PUBLIC_INTERFACE
 * Fetch a paginated list of recipes with optional search.
 * Falls back to mock data if backend not configured or not reachable.
 */
export async function fetchRecipes({
  q = "",
  page = 1,
  pageSize = 9,
}: {
  q?: string;
  page?: number;
  pageSize?: number;
}): Promise<PagedRecipes> {
  const base = getBaseUrl();
  if (base) {
    const url = new URL(`${base.replace(/\/+$/, "")}/recipes`);
    if (q) url.searchParams.set("q", q);
    url.searchParams.set("page", String(page));
    url.searchParams.set("pageSize", String(pageSize));

    // Try real API
    const api = await safeFetch<PagedRecipes>(url.toString());
    if (api) return api;
  }

  // Fallback mock with simple filter + pagination
  const filtered = q
    ? MOCK_RECIPES.filter(
        (r) =>
          r.title.toLowerCase().includes(q.toLowerCase()) ||
          (r.description || "").toLowerCase().includes(q.toLowerCase())
      )
    : MOCK_RECIPES;

  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  return { items, total: filtered.length, page, pageSize };
}

/**
 * PUBLIC_INTERFACE
 * Fetch a recipe by id. Falls back to mock dataset.
 */
export async function fetchRecipeById(id: string): Promise<Recipe | null> {
  const base = getBaseUrl();
  if (base) {
    const url = `${base.replace(/\/+$/, "")}/recipes/${encodeURIComponent(id)}`;
    const api = await safeFetch<Recipe>(url);
    if (api) return api;
  }
  return MOCK_RECIPES.find((r) => r.id === id) || null;
}

/**
 * PUBLIC_INTERFACE
 * Expose mock recipes for initial favorites or demos.
 */
export function getMockRecipes(): Recipe[] {
  return MOCK_RECIPES;
}
