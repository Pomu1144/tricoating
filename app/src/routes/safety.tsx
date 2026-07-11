import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "../components/site/SiteHeader";
import { SiteFooter } from "../components/site/SiteFooter";
import { SDS_RECORDS } from "../lib/safety-data";
import { SITE } from "../lib/site";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Safety & Data Sheets | Triangle Coatings Inc." },
      {
        name: "description",
        content:
          "Search Triangle Coatings safety data summaries by product name or code. The current official SDS document controls.",
      },
      { property: "og:image", content: "/assets/og-card.jpg" },
    ],
  }),
  component: SafetyPage,
});

function SafetyPage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const results = q
    ? SDS_RECORDS.filter(
        (r) => r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q),
      )
    : SDS_RECORDS;

  return (
    <div className="tc-site min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-[1200px] px-5 pb-20 pt-28 md:px-8">
        <h1 className="font-tc-display text-4xl font-extrabold uppercase leading-none tracking-tighter text-tc-bone md:text-6xl">
          Safety and data sheets
        </h1>
        <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-tc-mute">
          Website-displayed safety summaries, searchable by product name or
          code. These summaries do not replace the official documents.
        </p>

        <div className="mt-6 border border-tc-gold/40 bg-tc-panel px-4 py-3">
          <p className="font-tc-mono text-[11px] leading-relaxed text-tc-gold">
            The current official SDS and product label control. For controlled
            documents, contact{" "}
            <a href={`mailto:${SITE.salesEmail}?subject=${encodeURIComponent("SDS document request")}`} className="underline hover:text-tc-bone">
              {SITE.salesEmail}
            </a>{" "}
            or call {SITE.phoneDisplay}.
          </p>
        </div>

        <label className="mt-8 block max-w-md">
          <span className="mb-1 block font-tc-mono text-[10px] uppercase tracking-[0.16em] text-tc-mute">
            Search by product name or code
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Trilon or 249B"
            className="w-full border border-tc-line bg-tc-panel px-4 py-3 font-tc-mono text-sm text-tc-bone outline-none transition-colors placeholder:text-tc-mute/60 focus:border-tc-red"
          />
        </label>

        {results.length === 0 ? (
          <div className="mt-10 border border-dashed border-tc-line px-6 py-14 text-center">
            <p className="font-tc-mono text-[13px] text-tc-mute">
              No products match "{query}". Try a shorter term, or ask us
              directly at {SITE.salesEmail}.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-6">
            {results.map((r) => (
              <article key={r.code} className="border border-tc-line/60 bg-tc-panel">
                <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-tc-line/60 px-5 py-4 md:px-7">
                  <h2 className="font-tc-display text-xl font-extrabold uppercase tracking-tight text-tc-bone md:text-2xl">
                    {r.name}
                  </h2>
                  <span className="font-tc-mono text-[12px] text-tc-gold">{r.code}</span>
                </header>
                <div className="grid gap-8 px-5 py-6 md:grid-cols-2 md:px-7">
                  <div>
                    <p className="font-tc-mono text-[10px] uppercase tracking-[0.16em] text-tc-mute">Product use</p>
                    <p className="mt-1 text-sm text-tc-bone">{r.use}</p>

                    <p className="mt-5 font-tc-mono text-[10px] uppercase tracking-[0.16em] text-tc-mute">
                      Hazard classifications
                    </p>
                    <ul className="mt-1 list-inside list-disc space-y-1 text-sm leading-relaxed text-tc-bone/90">
                      {r.hazards.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>

                    <p className="mt-5 font-tc-mono text-[10px] uppercase tracking-[0.16em] text-tc-mute">
                      Hazard statements
                    </p>
                    <ul className="mt-1 space-y-1 text-sm leading-relaxed text-tc-mute">
                      {r.statements.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="font-tc-mono text-[10px] uppercase tracking-[0.16em] text-tc-mute">
                      Composition summary
                    </p>
                    <div className="mt-2">
                      {r.ingredients.map((ing) => (
                        <div
                          key={ing.name}
                          className="flex items-baseline justify-between gap-4 border-b border-tc-line/50 py-1.5 font-tc-mono text-[12px]"
                        >
                          <span className="text-tc-bone/90">{ing.name}</span>
                          <span className="shrink-0 text-tc-mute">{ing.concentration}</span>
                        </div>
                      ))}
                    </div>

                    <p className="mt-5 font-tc-mono text-[10px] uppercase tracking-[0.16em] text-tc-mute">Transport</p>
                    <p className="mt-1 font-tc-mono text-[12px] leading-relaxed text-tc-bone/90">
                      {r.transport.unNa} · {r.transport.shippingName} · Class {r.transport.hazardClass}
                      {r.transport.packagingGroup ? ` · PG ${r.transport.packagingGroup}` : ""}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <p className="mt-10 max-w-[90ch] font-tc-mono text-[11px] leading-relaxed text-tc-mute/80">
          All chemical data on this page is a website-displayed summary
          transcribed for convenience and is pending verification against
          controlled company documents. Always review the current official SDS
          before handling any product.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
