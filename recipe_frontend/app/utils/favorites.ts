/**
 * Local favorites persistence using localStorage as a placeholder.
 * This is a UI-only persistence to satisfy the Favorites feature until backend exists.
 */

import type { Recipe } from "~/utils/api";

const KEY = "recipe-explorer:favorites";

function safeRead(): Recipe[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Recipe[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeWrite(recipes: Recipe[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(recipes));
  } catch {
    // ignore
  }
}

/**
 * PUBLIC_INTERFACE
 * Get all saved favorite recipes.
 */
export function getFavorites(): Recipe[] {
  return safeRead();
}

/**
 * PUBLIC_INTERFACE
 * Save a recipe to favorites (de-duplicates by id).
 */
export function saveFavorite(recipe: Recipe) {
  const list = safeRead();
  if (!list.find((r) => r.id === recipe.id)) {
    list.push(recipe);
    safeWrite(list);
  }
}

/**
 * PUBLIC_INTERFACE
 * Remove a recipe by id from favorites.
 */
export function removeFavorite(id: string) {
  const list = safeRead().filter((r) => r.id !== id);
  safeWrite(list);
}

/**
 * PUBLIC_INTERFACE
 * Check if a recipe id is in favorites.
 */
export function isFavorite(id: string): boolean {
  return safeRead().some((r) => r.id === id);
}
