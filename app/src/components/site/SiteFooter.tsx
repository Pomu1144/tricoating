import { Link } from "@tanstack/react-router";
import { SITE, VERIFICATION_NOTE } from "../../lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-tc-line/60 bg-tc-ink">
      <div className="mx-auto max-w-[1200px] px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <img src="/assets/logo-wordmark.png" alt="Triangle Coatings" className="h-[15px] w-auto" />
            <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-tc-mute">
              Paint and coatings manufacturer in Livermore, California.
              Formulating products that coat and protect industrial, artistic,
              architectural, and decorative surfaces since 1932.
            </p>
          </div>

          <div className="font-tc-mono text-[12px] leading-loose text-tc-mute">
            <p className="mb-2 uppercase tracking-[0.16em] text-tc-bone">Contact</p>
            <p>{SITE.address}</p>
            <p>
              Phone: <a href={SITE.phoneHref} className="text-tc-bone hover:text-tc-gold">{SITE.phoneDisplay}</a>
            </p>
            <p>Fax: {SITE.fax}</p>
            <p>
              Sales: <a href={`mailto:${SITE.salesEmail}`} className="text-tc-bone hover:text-tc-gold">{SITE.salesEmail}</a>
            </p>
            <p>
              Orders: <a href={`mailto:${SITE.ordersEmail}`} className="text-tc-bone hover:text-tc-gold">{SITE.ordersEmail}</a>
            </p>
          </div>

          <div className="font-tc-mono text-[12px] leading-loose">
            <p className="mb-2 uppercase tracking-[0.16em] text-tc-bone">Browse</p>
            <Link to="/about" className="block text-tc-mute hover:text-tc-bone">About us</Link>
            <Link to="/catalog" className="block text-tc-mute hover:text-tc-bone">Product catalog</Link>
            <Link to="/safety" className="block text-tc-mute hover:text-tc-bone">Safety and data sheets</Link>
            <Link to="/signin" className="block text-tc-mute hover:text-tc-bone">My account</Link>
            <Link to="/privacy" className="block text-tc-mute hover:text-tc-bone">Privacy policy</Link>
            <a href={`mailto:${SITE.salesEmail}?subject=${encodeURIComponent("Product recommendation request")}`} className="block text-tc-mute hover:text-tc-bone">
              Ask for a recommendation
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-tc-line/60 pt-6">
          <p className="max-w-[90ch] font-tc-mono text-[11px] leading-relaxed text-tc-mute/80">
            {VERIFICATION_NOTE} Order requests submitted through this site open
            your email application and are requests for pricing and
            availability, not completed purchases. No payment is collected
            online.
          </p>
          <p className="mt-4 font-tc-mono text-[11px] text-tc-mute/60">
            © {new Date().getFullYear()} Triangle Coatings Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
