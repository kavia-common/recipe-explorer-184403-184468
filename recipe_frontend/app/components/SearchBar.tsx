import { useEffect, useState } from "react";

type Props = {
  defaultValue?: string;
  onSearch: (query: string) => void;
  placeholder?: string;
};

export default function SearchBar({ defaultValue = "", onSearch, placeholder }: Props) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(value.trim());
      }}
      className="relative w-full max-w-2xl"
      role="search"
      aria-label="Recipe search"
    >
      <input
        type="search"
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-28 text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
        placeholder={placeholder ?? "Search recipes (e.g., salmon, pasta, salad)..."}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <div className="pointer-events-auto">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
