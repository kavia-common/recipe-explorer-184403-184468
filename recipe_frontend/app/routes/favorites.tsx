import type { MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import type { Recipe } from "~/utils/api";
import { getFavorites, removeFavorite } from "~/utils/favorites";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Favorites · Recipe Explorer" },
    { name: "description", content: "Your saved recipes." },
  ];
};

export default function FavoritesRoute() {
  const [list, setList] = useState<Recipe[]>([]);

  useEffect(() => {
    setList(getFavorites());
  }, []);

  const remove = (id: string) => {
    removeFavorite(id);
    setList((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-gray-50 p-6 ring-1 ring-blue-100">
        <h1 className="text-2xl font-semibold text-gray-900">Favorites</h1>
        <p className="mt-1 text-sm text-gray-600">
          Saved recipes are stored locally in your browser for now.
        </p>
      </div>

      {list.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-700 shadow-sm">
          You don&apos;t have any favorites yet. Browse the{" "}
          <Link to="/" className="font-medium text-blue-700 hover:underline">
            Home
          </Link>{" "}
          page and save some recipes you like.
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((r) => (
            <li
              key={r.id}
              className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100"
            >
              {r.image ? (
                <img
                  src={r.image}
                  alt={r.title}
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div className="h-40 w-full bg-gradient-to-br from-blue-500/10 to-gray-50" />
              )}
              <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="line-clamp-1 text-lg font-semibold text-gray-900">
                  {r.title}
                </h3>
                {r.description && (
                  <p className="line-clamp-2 text-sm text-gray-600">{r.description}</p>
                )}
                <div className="mt-auto flex items-center justify-between pt-2">
                  <Link
                    to={`/recipe/${encodeURIComponent(r.id)}`}
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => remove(r.id)}
                    className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-800 ring-1 ring-gray-200 transition hover:bg-gray-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
