import { Link } from "@tanstack/react-router";
import { SDS_RECORDS } from "../../lib/safety-data";

/**
 * The batch-card band: real website-displayed chemistry for the flagship
 * refinishing coating, set like a laboratory record. Oversized ghosted 1932
 * numeral is the page's second-read moment.
 */
export function DataBand() {
  const record = SDS_RECORDS[0];

  return (
    <section className="relative z-10 overflow-hidden border-y border-tc-gold/25 bg-tc-panel">
      <p
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 select-none font-tc-display text-[38vw] font-extrabold leading-none tracking-tighter text-transparent lg:text-[24rem]"
        style={{ WebkitTextStroke: "1px rgba(196, 154, 58, 0.14)" }}
      >
        1932
      </p>

      <div className="relative mx-auto max-w-[1200px] px-5 py-16 md:px-8 md:py-24">
        <p className="font-tc-mono text-[11px] uppercase tracking-[0.2em] text-tc-gold">
          Batch card
        </p>
        <h2 className="mt-4 max-w-[16ch] font-tc-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tighter text-tc-bone md:text-6xl">
          The chemistry, on record
        </h2>
        <p className="mt-5 max-w-[56ch] font-tc-mono text-[12px] leading-relaxed text-tc-mute">
          Compositional summary as displayed for {record.name} ({record.code}).
          Website summary only: the current official SDS controls.
        </p>

        <div className="mt-10 max-w-[760px]">
          <div className="flex items-baseline justify-between border-b border-tc-gold/40 pb-2 font-tc-mono text-[10px] uppercase tracking-[0.18em] text-tc-gold">
            <span>Ingredient</span>
            <span>Concentration</span>
          </div>
          {record.ingredients.map((ing) => (
            <div
              key={ing.name}
              className="flex items-baseline justify-between gap-6 border-b border-tc-line/60 py-3 font-tc-mono text-[13px]"
            >
              <span className="text-tc-bone">{ing.name}</span>
              <span className="shrink-0 text-tc-mute">{ing.concentration}</span>
            </div>
          ))}
          <div className="flex flex-wrap gap-x-8 gap-y-1 border-b border-tc-gold/40 py-3 font-tc-mono text-[11px] text-tc-mute">
            <span>TRANSPORT {record.transport.unNa}</span>
            <span>CLASS {record.transport.hazardClass}</span>
            <span>PG {record.transport.packagingGroup}</span>
          </div>
        </div>

        <Link
          to="/safety"
          className="group mt-10 inline-flex items-center gap-3 font-tc-mono text-[12px] uppercase tracking-[0.16em] text-tc-red transition-colors hover:text-tc-bone"
        >
          <span className="h-px w-10 bg-tc-red transition-all duration-300 group-hover:w-16 group-hover:bg-tc-bone" />
          Search safety and data sheets
        </Link>
      </div>
    </section>
  );
}
