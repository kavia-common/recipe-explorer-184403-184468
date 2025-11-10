import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { fetchRecipeById } from "~/utils/api";
import { isFavorite, saveFavorite, removeFavorite } from "~/utils/favorites";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.recipe ? `${data.recipe.title} · Recipe Explorer` : "Recipe · Recipe Explorer" },
  ];
};

// PUBLIC_INTERFACE
export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id!;
  const recipe = await fetchRecipeById(id);
  if (!recipe) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ recipe });
}

export default function RecipeDetail() {
  const { recipe } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setFav(isFavorite(recipe.id));
  }, [recipe.id]);

  const toggle = () => {
    if (fav) {
      removeFavorite(recipe.id);
      setFav(false);
    } else {
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
    <article className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-gray-50 p-6 ring-1 ring-blue-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{recipe.title}</h1>
            {recipe.description && (
              <p className="mt-1 text-sm text-gray-600">{recipe.description}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium shadow-sm transition focus:outline-none focus-visible:ring-2 ${
                fav
                  ? "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500"
                  : "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500"
              }`}
            >
              {fav ? "Saved" : "Save"}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-800 ring-1 ring-gray-200 transition hover:bg-gray-50"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {recipe.image && (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
          <img
            alt={recipe.title}
            src={recipe.image}
            className="h-80 w-full object-cover"
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Ingredients</h2>
          {recipe.ingredients && recipe.ingredients.length > 0 ? (
            <ul className="list-inside list-disc space-y-1 text-gray-700">
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">No ingredients listed.</p>
          )}
        </section>

        <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Instructions</h2>
          {recipe.instructions && recipe.instructions.length > 0 ? (
            <ol className="list-inside list-decimal space-y-2 text-gray-700">
              {recipe.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-gray-600">No instructions provided.</p>
          )}
        </section>
      </div>

      <div>
        <Link
          to="/"
          prefetch="intent"
          className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-800 ring-1 ring-gray-200 transition hover:bg-gray-50"
        >
          ← Back to Home
        </Link>
      </div>
    </article>
  );
}
