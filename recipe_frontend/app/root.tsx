import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
  useLocation,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

function TopNav() {
  const location = useLocation();
  const active = (path: string) =>
    location.pathname === path
      ? "text-blue-700"
      : "text-gray-700 hover:text-blue-700";
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-gray-50 ring-1 ring-blue-200" />
            <span className="text-lg font-semibold text-gray-900">Recipe Explorer</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" prefetch="intent" className={`text-sm font-medium transition ${active("/")}`}>
              Home
            </Link>
            <Link
              to="/favorites"
              prefetch="intent"
              className={`text-sm font-medium transition ${active("/favorites")}`}
            >
              Favorites
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-full bg-[#f9fafb] text-[#111827] antialiased">
        <TopNav />
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
