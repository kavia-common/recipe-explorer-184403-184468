import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import SearchBar from "~/components/SearchBar";
import RecipeCard from "~/components/RecipeCard";
import Pagination from "~/components/Pagination";
import { fetchRecipes } from "~/utils/api";

export const meta: MetaFunction = () => {
  return [
    { title: "Recipe Explorer" },
    { name: "description", content: "Browse, search, and save delicious recipes." },
  ];
};

// PUBLIC_INTERFACE
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";
  const page = parseInt(url.searchParams.get("page") || "1", 10) || 1;
  const pageSize = 9;

  const data = await fetchRecipes({ q, page, pageSize });
  return json({ q, ...data });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const buildHref = (page: number) => {
    const next = new URLSearchParams(params);
    next.set("page", String(page));
    return `/?${next.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-gray-50 p-6 ring-1 ring-blue-100">
        <h1 className="text-2xl font-semibold text-gray-900">Find Your Next Recipe</h1>
        <p className="mt-1 text-sm text-gray-600">
          Search by ingredient, dish, or cuisine. Save your favorites for later.
        </p>
        <div className="mt-4">
          <SearchBar
            defaultValue={data.q}
            onSearch={(q) => {
              const sp = new URLSearchParams(params);
              if (q) sp.set("q", q);
              else sp.delete("q");
              sp.set("page", "1");
              navigate(`/?${sp.toString()}`);
            }}
          />
        </div>
      </div>

      <section>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
        <Pagination
          page={data.page}
          pageSize={data.pageSize}
          total={data.total}
          buildHref={buildHref}
        />
      </section>

      {!import.meta.env.VITE_API_BASE && !import.meta.env.VITE_BACKEND_URL && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Using mock data. TODO: Configure VITE_API_BASE or VITE_BACKEND_URL to enable live API.
        </div>
      )}
    </div>
  );
}
