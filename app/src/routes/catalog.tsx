import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "../components/site/SiteHeader";
import { SiteFooter } from "../components/site/SiteFooter";
import {
  CATEGORIES,
  PRODUCTS,
  formatUsd,
  type CategorySlug,
} from "../lib/products";
import { artistOilDiscount, buildOrderMailto, useRequestList } from "../lib/request-list";
import { useAuth } from "../lib/use-auth";
import { SITE } from "../lib/site";

type CatalogSearch = { category?: CategorySlug };

export const Route = createFileRoute("/catalog")({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => {
    const category = CATEGORIES.find((c) => c.slug === search.category)?.slug;
    return category ? { category } : {};
  },
  head: () => ({
    meta: [
      { title: "Product Catalog | Triangle Coatings Inc." },
      {
        name: "description",
        content:
          "Browse Triangle Coatings industrial, concrete, decorative, tub and tile, artist oil, and architectural products, and submit an order request.",
      },
      { property: "og:image", content: "/assets/og-card.jpg" },
    ],
  }),
  component: CatalogPage,
});

function AddButton({ productId }: { productId: string }) {
  const { add } = useRequestList();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        add(productId);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
      className={`border px-4 py-2 font-tc-mono text-[11px] uppercase tracking-[0.14em] transition-colors active:scale-[0.97] ${
        added
          ? "border-tc-gold text-tc-gold"
          : "border-tc-line text-tc-bone hover:border-tc-red hover:text-tc-red"
      }`}
    >
      {added ? "Added to list" : "Add to request"}
    </button>
  );
}

function RequestPanel() {
  const { items, setQty, clear, subtotal } = useRequestList();
  const { user } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState<string | null>(null);

  // Prefill contact fields from the signed-in account.
  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      firstName: f.firstName || user.firstName,
      lastName: f.lastName || user.lastName,
      email: f.email || user.email,
    }));
  }, [user]);

  const discount = artistOilDiscount(items);
  const signedInDiscount = user && discount.pct > 0 ? discount : undefined;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    if (items.length === 0) {
      setError("Your request list is empty. Add products first.");
      return;
    }
    if (!form.firstName || !form.lastName || !form.email) {
      setError("First name, last name, and email are required.");
      return;
    }
    setError(null);
    window.location.href = buildOrderMailto({
      items,
      subtotal,
      ...form,
      accountEmail: user?.email,
      discount: signedInDiscount
        ? { pct: signedInDiscount.pct, amount: signedInDiscount.amount }
        : undefined,
    });
  };

  const field = (label: string, key: keyof typeof form, type = "text", required = false) => (
    <label className="block">
      <span className="mb-1 block font-tc-mono text-[10px] uppercase tracking-[0.16em] text-tc-mute">
        {label}
        {required ? <span className="text-tc-red"> *</span> : null}
      </span>
      <input
        type={type}
        value={form[key]}
        onChange={set(key)}
        className="w-full border border-tc-line bg-tc-ink px-3 py-2.5 text-sm text-tc-bone outline-none transition-colors focus:border-tc-red"
      />
    </label>
  );

  return (
    <aside id="request" className="border border-tc-line/60 bg-tc-panel p-6 md:p-8">
      <h2 className="font-tc-display text-2xl font-extrabold uppercase tracking-tighter text-tc-bone">
        Order request list
      </h2>
      <p className="mt-2 font-tc-mono text-[11px] leading-relaxed text-tc-mute">
        A request for pricing and availability, not a purchase. Submitting
        opens your email application addressed to {SITE.ordersEmail}. No
        payment is collected online.
      </p>

      {items.length === 0 ? (
        <div className="mt-6 border border-dashed border-tc-line px-4 py-8 text-center">
          <p className="font-tc-mono text-[12px] text-tc-mute">
            No items yet. Add products from the catalog.
          </p>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-tc-line/60 border-y border-tc-line/60">
          {items.map((i) => (
            <li key={i.productId} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-tc-bone">{i.product.name}</p>
                <p className="font-tc-mono text-[11px] text-tc-mute">
                  {i.product.code ? `${i.product.code} · ` : ""}
                  {formatUsd(i.product.price)} reference
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  aria-label={`Remove one ${i.product.name}`}
                  onClick={() => setQty(i.productId, i.qty - 1)}
                  className="h-7 w-7 border border-tc-line font-tc-mono text-tc-mute hover:border-tc-red hover:text-tc-red"
                >
                  -
                </button>
                <span className="w-6 text-center font-tc-mono text-[12px] text-tc-bone">{i.qty}</span>
                <button
                  type="button"
                  aria-label={`Add one ${i.product.name}`}
                  onClick={() => setQty(i.productId, i.qty + 1)}
                  className="h-7 w-7 border border-tc-line font-tc-mono text-tc-mute hover:border-tc-gold hover:text-tc-gold"
                >
                  +
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-baseline justify-between">
        <span className="font-tc-mono text-[11px] uppercase tracking-[0.16em] text-tc-mute">
          Estimated list subtotal
        </span>
        <span className="font-tc-display text-xl font-extrabold text-tc-bone">{formatUsd(subtotal)}</span>
      </div>
      {signedInDiscount ? (
        <div className="mt-1 flex items-baseline justify-between">
          <span className="font-tc-mono text-[11px] uppercase tracking-[0.14em] text-tc-gold">
            Artist Oils discount ({signedInDiscount.pct}%)
          </span>
          <span className="font-tc-display text-lg font-extrabold text-tc-gold">
            -{formatUsd(signedInDiscount.amount)}
          </span>
        </div>
      ) : !user && discount.pct > 0 ? (
        <p className="mt-2 border border-tc-gold/40 bg-tc-gold/10 px-3 py-2 font-tc-mono text-[11px] text-tc-gold">
          This list qualifies for an Artist Oils volume discount.{" "}
          <Link to="/signin" className="underline">
            Sign in
          </Link>{" "}
          to apply it.
        </p>
      ) : null}
      <p className="mt-1 font-tc-mono text-[10px] text-tc-mute/80">
        Reference pricing, confirmed by our team at order time.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {field("First name", "firstName", "text", true)}
        {field("Last name", "lastName", "text", true)}
        {field("Email", "email", "email", true)}
        {field("Phone", "phone", "tel")}
      </div>
      <div className="mt-3">{field("Shipping address", "address")}</div>

      {error ? (
        <p className="mt-3 border border-tc-red/50 bg-tc-red/10 px-3 py-2 font-tc-mono text-[11px] text-tc-red">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={submit}
        className="group relative mt-5 w-full overflow-hidden bg-tc-red py-3.5 font-tc-mono text-[12px] uppercase tracking-[0.18em] text-tc-bone transition-transform active:scale-[0.99]"
      >
        <span className="absolute inset-0 -skew-x-12 -translate-x-full bg-tc-red-deep transition-transform duration-500 group-hover:translate-x-0" />
        <span className="relative">Email order request</span>
      </button>
      {items.length > 0 ? (
        <button
          type="button"
          onClick={clear}
          className="mt-3 w-full py-1 text-center font-tc-mono text-[11px] uppercase tracking-[0.14em] text-tc-mute hover:text-tc-red"
        >
          Clear list
        </button>
      ) : null}
    </aside>
  );
}

function CatalogPage() {
  const { category } = Route.useSearch();
  const filtered = category ? PRODUCTS.filter((p) => p.category === category) : PRODUCTS;

  return (
    <div className="tc-site min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-[1200px] px-5 pb-20 pt-28 md:px-8">
        <h1 className="font-tc-display text-4xl font-extrabold uppercase leading-none tracking-tighter text-tc-bone md:text-6xl">
          Product catalog
        </h1>
        <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-tc-mute">
          Build a request list and email it to our order desk. We reply with
          current pricing, availability, and shipping details.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            to="/catalog"
            className={`border px-3 py-1.5 font-tc-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
              !category ? "border-tc-red bg-tc-red text-tc-bone" : "border-tc-line text-tc-mute hover:text-tc-bone"
            }`}
          >
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/catalog"
              search={{ category: c.slug }}
              className={`border px-3 py-1.5 font-tc-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
                category === c.slug
                  ? "border-tc-red bg-tc-red text-tc-bone"
                  : "border-tc-line text-tc-mute hover:text-tc-bone"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
          <div>
            <ul className="divide-y divide-tc-line/60 border-y border-tc-line/60">
              {filtered.map((p) => (
                <li key={p.id} className="grid gap-3 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <h3 className="text-base font-bold uppercase tracking-wide text-tc-bone">{p.name}</h3>
                      <span className="font-tc-mono text-[11px] text-tc-mute">
                        {[p.code, p.size].filter(Boolean).join(" · ")}
                      </span>
                    </div>
                    <p className="mt-1 max-w-[60ch] text-sm leading-relaxed text-tc-mute">{p.description}</p>
                  </div>
                  <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                    <p className="font-tc-display text-lg font-extrabold text-tc-bone">
                      {formatUsd(p.price)}
                      <span className="ml-1 align-middle font-tc-mono text-[9px] uppercase tracking-[0.12em] text-tc-mute">
                        ref
                      </span>
                    </p>
                    <AddButton productId={p.id} />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 font-tc-mono text-[11px] leading-relaxed text-tc-mute/80">
              Pricing shown is reference list pricing pending company
              verification. Availability, sizes, and product details are
              confirmed when we respond to your request.
            </p>
          </div>

          <RequestPanel />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
