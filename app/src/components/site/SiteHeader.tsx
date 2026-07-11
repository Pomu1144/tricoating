import { Link } from "@tanstack/react-router";
import { useRequestList } from "../../lib/request-list";
import { useAuth } from "../../lib/use-auth";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About us" },
  { to: "/catalog", label: "Catalog" },
  { to: "/safety", label: "Safety data" },
] as const;

export function SiteHeader() {
  const { count } = useRequestList();
  const { user, loading } = useAuth();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-tc-line/60 bg-tc-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-5 md:px-8">
        <Link to="/" className="flex shrink-0 items-center" aria-label="Triangle Coatings home">
          <img
            src="/assets/logo-wordmark.png"
            alt="Triangle Coatings"
            className="h-[16px] w-auto md:h-[19px]"
          />
        </Link>

        <nav className="flex items-center gap-5 md:gap-6">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group relative hidden font-tc-mono text-[11px] uppercase tracking-[0.14em] text-tc-mute transition-colors hover:text-tc-bone md:block"
              activeProps={{ className: "text-tc-bone" }}
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-tc-red transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          {loading ? (
            <span className="hidden h-4 w-14 animate-pulse bg-tc-panel2 sm:block" />
          ) : user ? (
            <Link
              to="/account"
              className="hidden font-tc-mono text-[11px] uppercase tracking-[0.14em] text-tc-gold transition-colors hover:text-tc-bone sm:block"
            >
              {user.firstName || "Account"}
            </Link>
          ) : (
            <Link
              to="/signin"
              className="hidden font-tc-mono text-[11px] uppercase tracking-[0.14em] text-tc-mute transition-colors hover:text-tc-bone sm:block"
            >
              Sign in
            </Link>
          )}
          <Link
            to="/catalog"
            hash="request"
            className="flex items-center gap-2 border border-tc-line px-3 py-1.5 font-tc-mono text-[11px] uppercase tracking-[0.12em] text-tc-bone transition-colors hover:border-tc-red"
          >
            Request list
            <span
              className={`inline-flex h-5 min-w-5 items-center justify-center px-1 font-tc-mono text-[11px] ${
                count > 0 ? "bg-tc-red text-tc-bone" : "bg-tc-panel2 text-tc-mute"
              }`}
            >
              {count}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
