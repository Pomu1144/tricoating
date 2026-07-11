import { Link } from "@tanstack/react-router";
import { CATEGORIES, type CategorySlug } from "../../lib/products";

const ICONS: Record<CategorySlug, string> = {
  industrial: "/assets/icons/drum.png",
  concrete: "/assets/icons/shield.png",
  tubtile: "/assets/icons/layers.png",
  decorative: "/assets/icons/triangle.png",
  artist: "/assets/icons/flask.png",
  architectural: "/assets/icons/globe.png",
};

function byId(slug: CategorySlug) {
  return CATEGORIES.find((c) => c.slug === slug)!;
}

function Cell({
  slug,
  className,
  accent = false,
  big = false,
}: {
  slug: CategorySlug;
  className?: string;
  accent?: boolean;
  big?: boolean;
}) {
  const cat = byId(slug);
  return (
    <Link
      to="/catalog"
      search={{ category: slug }}
      className={`group relative flex flex-col justify-between p-6 transition-colors duration-300 md:p-8 ${
        accent ? "bg-tc-red hover:bg-tc-red-deep" : "bg-tc-ink hover:bg-tc-panel2"
      } ${className ?? ""}`}
    >
      <div className="flex items-center justify-between">
        <p className={`font-tc-mono text-[10px] tracking-[0.16em] ${accent ? "text-tc-bone/80" : "text-tc-mute"}`}>
          {cat.code}
        </p>
        <img src={ICONS[slug]} alt="" aria-hidden="true" className="h-6 w-6 opacity-80" />
      </div>
      <div className="mt-10">
        <h3
          className={`font-tc-display font-extrabold uppercase leading-[0.95] tracking-tighter text-tc-bone ${
            big ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl"
          }`}
        >
          {cat.name}
        </h3>
        <p className={`mt-3 max-w-[38ch] font-tc-mono text-[12px] leading-relaxed ${accent ? "text-tc-bone/85" : "text-tc-mute"}`}>
          {cat.description}
        </p>
        <p className={`mt-5 font-tc-mono text-[11px] uppercase tracking-[0.14em] ${accent ? "text-tc-bone" : "text-tc-bone/70"}`}>
          View products
          <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
        </p>
      </div>
    </Link>
  );
}

export function SystemsBento() {
  return (
    <section id="solutions" className="relative z-10 bg-tc-line/60">
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8 md:py-24">
        <h2 className="max-w-[20ch] font-tc-display text-4xl font-extrabold uppercase leading-none tracking-tighter text-tc-bone md:text-6xl">
          Six coating systems, one manufacturer
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-px border border-tc-line/60 bg-tc-line/60 sm:grid-cols-2 lg:grid-cols-12">
          <Cell slug="industrial" big className="lg:col-span-6 lg:row-span-2 lg:min-h-[380px]" />
          <div className="relative hidden overflow-hidden lg:col-span-3 lg:row-span-2 lg:block">
            <img
              src="/assets/hero-pour.webp"
              alt="Glossy red coating self-levelling on brushed steel"
              className="absolute inset-0 h-full w-full object-cover object-right transition-transform duration-700 hover:scale-105"
            />
          </div>
          <Cell slug="concrete" className="lg:col-span-3" />
          <Cell slug="artist" className="lg:col-span-3" />
          <Cell slug="tubtile" className="lg:col-span-4" />
          <Cell slug="decorative" accent className="lg:col-span-4" />
          <Cell slug="architectural" className="lg:col-span-4" />
        </div>
      </div>
    </section>
  );
}
