import { Link } from "@remix-run/react";

type Props = {
  page: number;
  pageSize: number;
  total: number;
  buildHref: (page: number) => string;
};

export default function Pagination({ page, pageSize, total, buildHref }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const prev = Math.max(1, page - 1);
  const next = Math.min(totalPages, page + 1);

  return (
    <nav className="mt-6 flex items-center justify-between" aria-label="Pagination">
      <Link
        to={buildHref(prev)}
        prefetch="intent"
        className={`rounded-lg px-3 py-1.5 text-sm font-medium ring-1 ring-gray-200 transition hover:bg-gray-50 ${
          page === 1 ? "pointer-events-none opacity-50" : "bg-white text-gray-800"
        }`}
      >
        Previous
      </Link>
      <div className="text-sm text-gray-600">
        Page <span className="font-semibold text-gray-900">{page}</span> of{" "}
        <span className="font-semibold text-gray-900">{totalPages}</span>
      </div>
      <Link
        to={buildHref(next)}
        prefetch="intent"
        className={`rounded-lg px-3 py-1.5 text-sm font-medium ring-1 ring-gray-200 transition hover:bg-gray-50 ${
          page === totalPages ? "pointer-events-none opacity-50" : "bg-white text-gray-800"
        }`}
      >
        Next
      </Link>
    </nav>
  );
}
