import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "../components/site/SiteHeader";
import { SiteFooter } from "../components/site/SiteFooter";
import { useAuth } from "../lib/use-auth";
import { SITE } from "../lib/site";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account | Triangle Coatings Inc." },
      {
        name: "description",
        content: "Your Triangle Coatings account: profile, discounts, and how to order.",
      },
    ],
  }),
  component: AccountPage,
});

const DISCOUNTS = [
  { threshold: "Orders over $499", off: "5% off" },
  { threshold: "Orders over $999", off: "10% off" },
  { threshold: "Orders over $1,499", off: "15% off" },
];

function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="tc-site min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-[900px] px-5 pb-24 pt-32 md:px-8">
        {loading ? (
          <div className="space-y-4">
            <div className="h-10 w-2/3 animate-pulse bg-tc-panel" />
            <div className="h-4 w-1/2 animate-pulse bg-tc-panel" />
            <div className="h-40 animate-pulse bg-tc-panel" />
          </div>
        ) : !user ? (
          <div className="border border-tc-line/60 bg-tc-panel px-6 py-14 text-center">
            <h1 className="font-tc-display text-3xl font-extrabold uppercase tracking-tighter text-tc-bone">
              You are signed out
            </h1>
            <p className="mx-auto mt-3 max-w-[44ch] text-sm leading-relaxed text-tc-mute">
              Sign in to see your account details and have qualified discounts
              applied to your order requests.
            </p>
            <Link
              to="/signin"
              className="mt-6 inline-block bg-tc-red px-6 py-3 font-tc-mono text-[12px] uppercase tracking-[0.16em] text-tc-bone hover:bg-tc-red-deep"
            >
              Go to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-tc-display text-4xl font-extrabold uppercase leading-none tracking-tighter text-tc-bone md:text-5xl">
              {user.firstName} {user.lastName}
            </h1>
            <p className="mt-2 font-tc-mono text-[12px] text-tc-mute">{user.email}</p>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <section className="border border-tc-line/60 bg-tc-panel p-6">
                <h2 className="font-tc-mono text-[11px] uppercase tracking-[0.18em] text-tc-gold">
                  Artist Oils volume discounts
                </h2>
                <ul className="mt-4 divide-y divide-tc-line/60">
                  {DISCOUNTS.map((d) => (
                    <li key={d.off} className="flex items-baseline justify-between py-2.5">
                      <span className="text-sm text-tc-bone">{d.threshold}</span>
                      <span className="font-tc-display text-lg font-extrabold text-tc-red">{d.off}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 font-tc-mono text-[11px] leading-relaxed text-tc-mute">
                  Estimated in your request list while signed in and confirmed
                  by our team at order time.
                </p>
              </section>

              <section className="border border-tc-line/60 bg-tc-panel p-6">
                <h2 className="font-tc-mono text-[11px] uppercase tracking-[0.18em] text-tc-gold">
                  How to order
                </h2>
                <div className="mt-4 space-y-2 font-tc-mono text-[12px] leading-relaxed text-tc-mute">
                  <p>Phone: <a href={SITE.phoneHref} className="text-tc-bone hover:text-tc-gold">{SITE.phoneDisplay}</a></p>
                  <p>International: {SITE.intlPhoneDisplay}</p>
                  <p>Fax: {SITE.fax}</p>
                  <p>
                    Email:{" "}
                    <a href={`mailto:${SITE.ordersEmail}`} className="text-tc-bone hover:text-tc-gold">
                      {SITE.ordersEmail}
                    </a>
                  </p>
                </div>
                <Link
                  to="/catalog"
                  className="mt-5 inline-block border border-tc-line px-4 py-2 font-tc-mono text-[11px] uppercase tracking-[0.14em] text-tc-bone hover:border-tc-red"
                >
                  Explore coating systems →
                </Link>
              </section>
            </div>

            <button
              type="button"
              onClick={() => {
                void signOut().then(() => navigate({ to: "/" }));
              }}
              className="mt-10 border border-tc-line px-5 py-2.5 font-tc-mono text-[11px] uppercase tracking-[0.14em] text-tc-mute transition-colors hover:border-tc-red hover:text-tc-red"
            >
              Sign out
            </button>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
