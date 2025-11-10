import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import type { Recipe } from "~/utils/api";
import { isFavorite, removeFavorite, saveFavorite } from "~/utils/favorites";

type Props = {
  recipe: Recipe;
};

export default function RecipeCard({ recipe }: Props) {
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setFav(isFavorite(recipe.id));
  }, [recipe.id]);

  const toggle = () => {
    if (fav) {
      removeFavorite(recipe.id);
      setFav(false);
    } else {
      // Save minimal fields to keep favorites light
      saveFavorite({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        description: recipe.description,
      });
      setFav(true);
    }
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
      {recipe.image ? (
        <img
          alt={recipe.title}
          src={recipe.image}
          className="h-44 w-full object-cover transition group-hover:scale-[1.01]"
        />
      ) : (
        <div className="h-44 w-full bg-gradient-to-br from-blue-500/10 to-gray-50" />
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 text-lg font-semibold text-gray-900">{recipe.title}</h3>
        {recipe.description && (
          <p className="line-clamp-2 text-sm text-gray-600">{recipe.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <Link
            prefetch="intent"
            to={`/recipe/${encodeURIComponent(recipe.id)}`}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            View
          </Link>
          <button
            onClick={toggle}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium shadow-sm transition focus:outline-none focus-visible:ring-2 ${
              fav
                ? "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500"
                : "bg-white text-gray-800 ring-1 ring-gray-200 hover:bg-gray-50 focus-visible:ring-blue-500"
            }`}
            aria-pressed={fav}
          >
            {fav ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
