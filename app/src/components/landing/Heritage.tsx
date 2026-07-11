const CHAPTERS = [
  {
    era: "1932",
    place: "Berkeley, California",
    title: "Founded in a working paint factory",
    body: "Triangle Paint Company opened in March 1932 in a Berkeley paint factory built in 1914, offering quality coatings, quick service, and direct access to chemical advice.",
  },
  {
    era: "Growth",
    place: "Postwar to present",
    title: "From regional paint to specialty chemistry",
    body: "The company grew into a source for standard and specialty coatings: industrial maintenance, OEM finishes, and government-specification work in small and large quantities.",
  },
  {
    era: "Today",
    place: "Livermore, California",
    title: "Manufacturing, labs, and custom formulation",
    body: "Expanded facilities and modern laboratories support every product line, plus custom formulation and toll manufacturing for customers in the U.S. and internationally.",
  },
];

export function Heritage() {
  return (
    <section id="heritage" className="relative z-10 overflow-hidden bg-tc-ink">
      <img
        src="/assets/texture-macro.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-tc-ink via-tc-ink/70 to-tc-ink" />

      <div className="relative mx-auto max-w-[1200px] px-5 py-16 md:px-8 md:py-24">
        <h2 className="max-w-[18ch] font-tc-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tighter text-tc-bone md:text-6xl">
          More than 90 years of coatings expertise
        </h2>

        <div className="mt-14 space-y-px">
          {CHAPTERS.map((c) => (
            <article
              key={c.era}
              className="grid gap-4 border border-tc-line/60 bg-tc-ink/80 p-6 backdrop-blur-sm md:grid-cols-[220px_1fr] md:gap-10 md:p-10"
            >
              <div>
                <p className="font-tc-display text-4xl font-extrabold uppercase leading-none tracking-tighter text-tc-red md:text-5xl">
                  {c.era}
                </p>
                <p className="mt-2 font-tc-mono text-[10px] uppercase tracking-[0.16em] text-tc-mute">
                  {c.place}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold uppercase tracking-wide text-tc-bone">{c.title}</h3>
                <p className="mt-2 max-w-[70ch] text-sm leading-relaxed text-tc-mute">{c.body}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-12 max-w-[64ch] text-base leading-relaxed text-tc-bone/85">
          Triangle coatings have been applied to communications antennas,
          bridges, refineries, and utility equipment, wherever surfaces have to
          survive their environment.
        </p>
        <p className="mt-3 font-tc-mono text-[11px] text-tc-mute/80">
          Named project references are pending company verification.
        </p>
      </div>
    </section>
  );
}
