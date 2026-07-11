const METRICS = [
  { record: "BATCH 01 // ESTABLISHED", big: ["SINCE", "1932"], accent: true, note: "Manufacturing coatings for more than 90 years" },
  { record: "BATCH 02 // CAPABILITY", big: ["CUSTOM", "FORMULATION"], accent: false, note: "Coatings developed when off-the-shelf is not enough" },
  { record: "BATCH 03 // REACH", big: ["DOMESTIC +", "INTERNATIONAL"], accent: false, note: "Serving large and small customers worldwide" },
  { record: "BATCH 04 // SUPPORT", big: ["TECHNICAL", "GUIDANCE"], accent: false, note: "Product selection support from coatings specialists" },
];

export function MetricsStrip() {
  return (
    <section className="relative z-10 border-y border-tc-line/60 bg-tc-ink">
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8 md:py-24">
        <h2 className="mx-auto max-w-[24ch] text-center font-tc-display text-4xl font-extrabold uppercase leading-none tracking-tighter text-tc-bone md:text-6xl">
          Industrial coatings engineered to perform
        </h2>
        <p className="mx-auto mt-5 max-w-[52ch] text-center font-tc-mono text-[13px] leading-relaxed text-tc-mute">
          One manufacturer for architectural paints, oil colors, concrete
          sealers, maintenance coatings, OEM finishes, and government
          specification work.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-y-14 lg:grid-cols-4 lg:divide-x lg:divide-tc-line/50">
          {METRICS.map((m) => (
            <div key={m.record} className="lg:px-6 first:lg:pl-0 last:lg:pr-0">
              <p className="border-b border-tc-line/60 pb-2 font-tc-mono text-[10px] tracking-[0.14em] text-tc-mute">
                {m.record}
              </p>
              <p className="mt-5 font-tc-display text-4xl font-extrabold uppercase leading-[0.9] tracking-tighter text-tc-bone xl:text-5xl">
                {m.big.map((line, i) => (
                  <span key={line} className="block">
                    {m.accent && i === 1 ? (
                      <>
                        {line.slice(0, 2)}
                        <span className="text-tc-red">{line.slice(2)}</span>
                      </>
                    ) : (
                      line
                    )}
                  </span>
                ))}
              </p>
              <p className="mt-4 max-w-[30ch] text-sm leading-relaxed text-tc-mute">{m.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
