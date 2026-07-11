import { SITE } from "../../lib/site";

const CAPABILITIES = [
  { label: "Custom chemistry development", ratio: "resin systems to spec" },
  { label: "Performance tailoring", ratio: "70/30 primer/reducer" },
  { label: "Refinishing glaze systems", ratio: "50/30/20 glaze/activator/reducer" },
  { label: "Regulatory and VOC alignment", ratio: "0-VOC reducer options" },
  { label: "Scale-up and production", ratio: "small and large batches" },
];

export function LabSplit() {
  return (
    <section id="formulation" className="relative z-10 bg-tc-ink">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="font-tc-mono text-[11px] uppercase tracking-[0.2em] text-tc-red">
            Custom formulation lab
          </p>
          <h2 className="mt-4 max-w-[16ch] font-tc-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tighter text-tc-bone md:text-6xl">
            When off-the-shelf is not enough
          </h2>
          <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-tc-mute">
            Our chemists develop coatings around substrate-specific
            requirements, performance targets, and color matching for OEM
            applications, government specifications, and any production
            quantity.
          </p>

          <ul className="mt-10 border-t border-tc-line/60">
            {CAPABILITIES.map((c) => (
              <li
                key={c.label}
                className="flex items-baseline justify-between gap-4 border-b border-tc-line/60 py-4"
              >
                <span className="text-sm font-medium uppercase tracking-wide text-tc-bone">
                  {c.label}
                </span>
                <span className="shrink-0 font-tc-mono text-[11px] text-tc-mute">{c.ratio}</span>
              </li>
            ))}
          </ul>

          <a
            href={`mailto:${SITE.salesEmail}?subject=${encodeURIComponent("Custom formulation inquiry")}`}
            className="group mt-10 inline-flex items-center gap-3 font-tc-mono text-[12px] uppercase tracking-[0.14em] text-tc-bone active:translate-y-px"
            style={{ perspective: "300px" }}
          >
            {/* material swatch chip: flips like a drawdown sample on hover */}
            <span className="relative block h-4 w-4 transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              <span className="absolute inset-0 bg-tc-red [backface-visibility:hidden]" />
              <span className="absolute inset-0 bg-tc-gold [backface-visibility:hidden] [transform:rotateY(180deg)]" />
            </span>
            Request a custom formulation
          </a>
        </div>

        <figure className="relative">
          <img
            src="/assets/lab.webp"
            alt="Formulation chemist examining a beaker of red pigment in the Triangle Coatings lab"
            className="w-full border border-tc-line/60 object-cover"
          />
          <figcaption className="mt-3 font-tc-mono text-[10px] uppercase tracking-[0.16em] text-tc-mute">
            Formulation lab, Livermore CA
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
