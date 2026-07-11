import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "../components/site/SiteHeader";
import { SiteFooter } from "../components/site/SiteFooter";
import { SITE } from "../lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | Triangle Coatings Inc." },
      {
        name: "description",
        content:
          "About Triangle Coatings Inc.: manufacturing coatings since 1932, company history, custom formulation, international operations, ordering, and sales terms.",
      },
      { property: "og:image", content: "/assets/og-card.jpg" },
    ],
  }),
  component: AboutPage,
});

const SECTIONS = [
  { id: "company-info", label: "Company info" },
  { id: "history", label: "Our history" },
  { id: "paint-manufacturer", label: "Paint manufacturer" },
  { id: "faq", label: "FAQ" },
  { id: "international", label: "International" },
  { id: "new-products", label: "New products" },
  { id: "accounts", label: "Accounts & discounts" },
  { id: "order-info", label: "Order & shipping info" },
  { id: "sales-terms", label: "Sales terms" },
  { id: "contact-us", label: "Contact us" },
] as const;

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-24 border-b border-tc-line/60 pb-3 font-tc-display text-2xl font-extrabold uppercase tracking-tighter text-tc-bone md:text-3xl"
    >
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 max-w-[72ch] text-[15px] leading-relaxed text-tc-mute">{children}</p>;
}

function AboutPage() {
  return (
    <div className="tc-site min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-[1200px] px-5 pb-24 pt-28 md:px-8">
        <h1 className="max-w-[16ch] font-tc-display text-4xl font-extrabold uppercase leading-none tracking-tighter text-tc-bone md:text-6xl">
          About Triangle Coatings
        </h1>
        <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-tc-mute">
          A family-run paint and coatings manufacturer, working with customers
          around the world since 1932.
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-[240px_1fr]">
          <nav className="top-24 hidden self-start lg:sticky lg:block">
            <p className="font-tc-mono text-[10px] uppercase tracking-[0.18em] text-tc-gold">
              On this page
            </p>
            <ul className="mt-3 space-y-1 border-l border-tc-line/60">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block border-l-2 border-transparent py-1 pl-4 font-tc-mono text-[11px] uppercase tracking-[0.12em] text-tc-mute transition-colors hover:border-tc-red hover:text-tc-bone"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-16">
            <section>
              <H2 id="company-info">Company info</H2>
              <P>
                Triangle Coatings' business began in 1932 as a small, regional
                paint manufacturer. We offered users quality coatings, quick
                service, and immediate access to chemical information and
                technical advice. As we grew, we established ourselves as a
                reliable and knowledgeable source for standard and specialty
                paints and coatings made available in small and large
                quantities.
              </P>
              <P>
                Today, through our expanded manufacturing facilities and modern
                laboratories, Triangle Coatings Inc. offers a full line of
                architectural and decorative paints, oil paints, concrete
                sealers, industrial maintenance coatings, OEM product finishes,
                and government specification coatings. In addition, we offer
                custom formulation and toll manufacturing for customers with
                specific demands.
              </P>
              <P>
                An environmentally conscientious company, Triangle Coatings is
                also responsible for developing an environmentally friendly
                line of coatings, including High Reflective and Smart Coatings,
                which help increase the energy efficiency of buildings and
                other manufacturing and construction projects. We continue to
                research and develop sound practices that mitigate our impact
                on the environment.
              </P>
              <P>
                You'll find our coatings on NASA, NATO, and National Radio
                Observatory large antennas; bridges, including the Golden Gate
                Bridge; refineries, including Chevron refineries; utility
                equipment for PG&E; and on thousands of other surfaces for
                customers around the world. Our coatings cover a wide
                assortment of substrates and meet global specifications for a
                variety of customers.
              </P>
              <P>
                Our broad-reaching and valued clientele is due in large part to
                Triangle's responsive and friendly customer service. Working
                together in a relaxed family atmosphere, we encourage our
                employees to go the extra mile for our customers. Our staff is
                composed of hard-working and talented individuals who pride
                themselves on manufacturing and shipping only the finest
                quality paints and coatings.
              </P>
              <p className="mt-6 font-tc-display text-xl font-extrabold uppercase tracking-tight text-tc-red">
                Triangle Coatings, your total coatings solution.
              </p>
            </section>

            <section>
              <H2 id="history">Our history</H2>
              <P>
                In March 1932, Triangle Paint Company was founded in Berkeley,
                California, in a paint factory built in 1914 by General Paint.
                From those beginnings the company grew from a regional paint
                manufacturer into a specialty coatings source for demanding
                industrial, architectural, and artistic applications, and
                today operates from Livermore, California.
              </P>
            </section>

            <section>
              <H2 id="paint-manufacturer">Paint manufacturer</H2>
              <P>
                Triangle Coatings is a paint and coatings manufacturer located
                in Livermore, California. We carefully formulate products to
                coat or protect industrial, artistic, architectural, and
                decorative surfaces, in quantities from single cases to full
                production runs.
              </P>
            </section>

            <section>
              <H2 id="faq">Triangle Coatings FAQ</H2>
              <div className="mt-4 border border-tc-line/60 bg-tc-panel p-6">
                <p className="font-tc-mono text-[12px] uppercase tracking-[0.14em] text-tc-gold">
                  Q: How do I write a specification for Triangle products?
                </p>
                <P>
                  You may contact us directly with your substrate, environment,
                  and performance needs, or if you are familiar with ARCAT you
                  can reference our products there. Our technical team will
                  provide guidance either way.
                </P>
              </div>
            </section>

            <section>
              <H2 id="international">International</H2>
              <P>
                In November 2007, Triangle Coatings Asia was founded to support
                the growing Asian market for Triangle's specialty and OEM
                coatings. We support international customers with global
                specifications, export ordering, and specialty OEM coating
                needs. For international orders, call {SITE.intlPhoneDisplay}.
              </P>
            </section>

            <section>
              <H2 id="new-products">New products</H2>
              <P>
                New industrial, concrete, masonry, preservation, and
                maintenance products are developed for customers who need
                labor-saving, high-performance coatings, including the Job
                Defender preservation and maintenance kit for concrete and
                masonry job owners. Check back for product launches, industry
                updates, coating guides, and company news.
              </P>
            </section>

            <section>
              <H2 id="accounts">Accounts and discounts</H2>
              <P>
                Create your account to have any discounts you qualify for
                applied to your order requests after signing in.
              </P>
              <ul className="mt-5 max-w-md divide-y divide-tc-line/60 border-y border-tc-line/60">
                {[
                  ["Artist Oil orders over $499", "5% off"],
                  ["Artist Oil orders over $999", "10% off"],
                  ["Artist Oil orders over $1,499", "15% off"],
                ].map(([tier, off]) => (
                  <li key={off} className="flex items-baseline justify-between py-2.5">
                    <span className="text-sm text-tc-bone">{tier}</span>
                    <span className="font-tc-display text-lg font-extrabold text-tc-red">{off}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  to="/signin"
                  className="bg-tc-red px-5 py-2.5 font-tc-mono text-[11px] uppercase tracking-[0.14em] text-tc-bone hover:bg-tc-red-deep"
                >
                  Create your account
                </Link>
                <Link
                  to="/catalog"
                  className="border border-tc-line px-5 py-2.5 font-tc-mono text-[11px] uppercase tracking-[0.14em] text-tc-bone hover:border-tc-red"
                >
                  Explore coating systems →
                </Link>
              </div>
            </section>

            <section>
              <H2 id="order-info">Order and shipping info</H2>
              <P>
                Thank you for your interest in Triangle Coatings products. We
                welcome orders by phone, fax, or email.
              </P>
              <div className="mt-4 max-w-md space-y-1.5 font-tc-mono text-[12px] leading-relaxed text-tc-mute">
                <p>Order by phone: <a href={SITE.phoneHref} className="text-tc-bone hover:text-tc-gold">925-583-0800</a></p>
                <p>International orders: {SITE.intlPhoneDisplay}</p>
                <p>Order by fax: 925-583-0880</p>
                <p>
                  Order by email:{" "}
                  <a href={`mailto:${SITE.ordersEmail}`} className="text-tc-bone hover:text-tc-gold">
                    {SITE.ordersEmail}
                  </a>
                </p>
              </div>
            </section>

            <section>
              <H2 id="sales-terms">Sales terms</H2>
              <P>
                The information published on Triangle's website is provided
                without charge as a convenience to visitors. Product
                descriptions, coverage figures, and planning guidance may
                change: the current product label, product data sheet, and
                safety data sheet control. Customers are responsible for
                verifying suitability, technical details, lead times, and
                shipping requirements before placing orders. Website order
                requests are requests for pricing and availability; orders form
                only when confirmed directly by Triangle Coatings.
              </P>
            </section>

            <section>
              <H2 id="contact-us">Contact us</H2>
              <div className="mt-4 max-w-md space-y-1.5 font-tc-mono text-[12px] leading-relaxed text-tc-mute">
                <p>Phone: <a href={SITE.phoneHref} className="text-tc-bone hover:text-tc-gold">{SITE.phoneDisplay}</a></p>
                <p>Fax: {SITE.fax}</p>
                <p>
                  Email:{" "}
                  <a href={`mailto:${SITE.salesEmail}`} className="text-tc-bone hover:text-tc-gold">
                    {SITE.salesEmail}
                  </a>
                </p>
                <p>Address: {SITE.address}</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
