import { Link } from "@tanstack/react-router";
import { SITE } from "../../lib/site";

export function FinalCta() {
  return (
    <section id="contact" className="relative z-10 bg-tc-ink">
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 className="max-w-[16ch] font-tc-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tighter text-tc-bone md:text-6xl">
              Talk with a coatings <span className="text-tc-red">specialist</span>
            </h2>
            <p className="mt-5 max-w-[48ch] text-base leading-relaxed text-tc-mute">
              Tell us the surface, the environment, and the finish you need.
              We will point you at the right system and confirm the details.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a
                href={`mailto:${SITE.salesEmail}`}
                className="group relative inline-flex items-center gap-2 font-tc-mono text-[12px] uppercase tracking-[0.16em] text-tc-bone"
              >
                {/* label slides apart, revealing the address underneath */}
                <span className="relative block overflow-hidden">
                  <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                    Email sales
                  </span>
                  <span className="absolute inset-0 block translate-y-full text-tc-gold transition-transform duration-300 group-hover:translate-y-0">
                    {SITE.salesEmail}
                  </span>
                </span>
              </a>
              <Link
                to="/catalog"
                className="font-tc-mono text-[12px] uppercase tracking-[0.16em] text-tc-mute transition-colors hover:text-tc-bone"
              >
                Explore coating systems →
              </Link>
            </div>
          </div>

          <a
            href={SITE.phoneHref}
            className="group relative block px-8 py-7 text-center transition-transform active:scale-[0.99] md:px-12 md:py-9"
          >
            <span className="absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-tc-red transition-all duration-300 group-hover:h-7 group-hover:w-7" />
            <span className="absolute right-0 top-0 h-5 w-5 border-r-2 border-t-2 border-tc-red transition-all duration-300 group-hover:h-7 group-hover:w-7" />
            <span className="absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-tc-red transition-all duration-300 group-hover:h-7 group-hover:w-7" />
            <span className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-tc-red transition-all duration-300 group-hover:h-7 group-hover:w-7" />
            <span className="block font-tc-mono text-[11px] uppercase tracking-[0.2em] text-tc-red">
              Call now
            </span>
            <span className="mt-2 block font-tc-display text-4xl font-extrabold tracking-tighter text-tc-bone md:text-6xl">
              {SITE.phoneDisplay}
            </span>
            <span className="mt-2 block font-tc-mono text-[11px] tracking-[0.1em] text-tc-mute">
              International: {SITE.intlPhoneDisplay}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
