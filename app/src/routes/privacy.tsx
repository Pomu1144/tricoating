import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "../components/site/SiteHeader";
import { SiteFooter } from "../components/site/SiteFooter";
import { SITE } from "../lib/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Triangle Coatings Inc." },
      {
        name: "description",
        content:
          "How Triangle Coatings Inc. collects, uses, and protects information submitted through this website, including accounts, forms, cookies, and your privacy rights under U.S. law.",
      },
    ],
  }),
  component: PrivacyPage,
});

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-12 border-b border-tc-line/60 pb-2 font-tc-display text-xl font-extrabold uppercase tracking-tighter text-tc-bone md:text-2xl">
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 max-w-[75ch] text-[15px] leading-relaxed text-tc-mute">{children}</p>;
}

function UL({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mt-4 max-w-[75ch] list-inside list-disc space-y-2 text-[15px] leading-relaxed text-tc-mute">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function PrivacyPage() {
  return (
    <div className="tc-site min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-[900px] px-5 pb-24 pt-28 md:px-8">
        <h1 className="font-tc-display text-4xl font-extrabold uppercase leading-none tracking-tighter text-tc-bone md:text-5xl">
          Privacy policy
        </h1>
        <p className="mt-3 font-tc-mono text-[11px] uppercase tracking-[0.14em] text-tc-mute">
          Effective date: July 11, 2026
        </p>

        <H2>Who we are</H2>
        <P>
          Triangle Coatings Inc. ("Triangle Coatings," "we," "us") operates
          this website. We are located at {SITE.address}. Phone:{" "}
          {SITE.phoneDisplay}. Email: {SITE.salesEmail}. This policy describes
          what information we collect through this website, how we use it, and
          the choices and rights you have under United States law, including
          the California Consumer Privacy Act as amended by the California
          Privacy Rights Act (CCPA/CPRA).
        </P>

        <H2>Information we collect</H2>
        <UL
          items={[
            <>
              <strong className="text-tc-bone">Account information.</strong> If
              you create an account, we collect your first and last name, email
              address, and a password. Passwords are stored only in salted,
              hashed form; we cannot read your password. Account data is stored
              on our website database hosted on Cloudflare infrastructure in
              the United States.
            </>,
            <>
              <strong className="text-tc-bone">Order requests and inquiries.</strong>{" "}
              The order request, recommendation, and contact features on this
              site compose an email in your own email application addressed to
              us. The website itself does not transmit or store that message;
              we receive it only if you choose to send it, and we then retain
              it as ordinary business correspondence.
            </>,
            <>
              <strong className="text-tc-bone">Request list (local storage).</strong>{" "}
              Products you add to your request list are saved in your browser's
              local storage on your own device so your list survives page
              reloads. This data is not sent to our servers.
            </>,
            <>
              <strong className="text-tc-bone">Technical information.</strong>{" "}
              Our hosting infrastructure automatically processes standard
              technical data such as IP addresses, browser type, and request
              logs for security and operation of the service.
            </>,
          ]}
        />
        <P>
          We do not knowingly collect sensitive personal information, and we do
          not collect payment card information: no payment is processed on this
          website.
        </P>

        <H2>Cookies</H2>
        <P>
          We use a single strictly necessary session cookie ("tc_session") to
          keep you signed in to your account. It contains a random identifier,
          is marked HttpOnly and Secure, and expires after 30 days or when you
          sign out. We do not use advertising, analytics, or cross-site
          tracking cookies, and we do not sell or share personal information
          for cross-context behavioral advertising. Because we use only
          strictly necessary cookies, no cookie consent banner is required;
          you can block or delete cookies in your browser, though signing in
          will not work without the session cookie.
        </P>

        <H2>How we use information</H2>
        <UL
          items={[
            "To provide the website, your account, and signed-in features such as applicable discounts.",
            "To respond to order requests, quotes, recommendations, and other inquiries you send us.",
            "To operate, secure, and debug the website, and to prevent fraud or abuse.",
            "To comply with legal obligations, including tax, transport, and safety regulations applicable to coatings.",
          ]}
        />
        <P>
          We do not use your information for automated decision-making that
          produces legal or similarly significant effects, and we do not send
          marketing email unless you ask us to.
        </P>

        <H2>How we share information</H2>
        <UL
          items={[
            <>
              <strong className="text-tc-bone">Service providers.</strong> Our
              website is hosted on Cloudflare. Hosting providers process
              technical data and stored account data on our behalf under their
              service terms.
            </>,
            <>
              <strong className="text-tc-bone">Order fulfillment.</strong> If
              you place an order with us directly, shipping carriers and any
              payment providers we arrange with you receive the information
              necessary to fulfill it.
            </>,
            <>
              <strong className="text-tc-bone">Legal requirements.</strong> We
              may disclose information when required by law, subpoena, or to
              protect our rights, safety, or property.
            </>,
            <>
              <strong className="text-tc-bone">Business transfers.</strong> If
              our business is sold or merged, information may transfer to the
              successor subject to this policy.
            </>,
          ]}
        />
        <P>
          We do not sell personal information, and we have not sold personal
          information in the preceding 12 months.
        </P>

        <H2>Your privacy rights</H2>
        <P>
          Depending on your state of residence (including California, Virginia,
          Colorado, Connecticut, Utah, Texas, and other states with
          comprehensive privacy laws), you may have the right to:
        </P>
        <UL
          items={[
            "Know and access the personal information we hold about you, including a portable copy.",
            "Correct inaccurate personal information.",
            "Delete personal information we hold about you, subject to legal retention requirements.",
            "Opt out of the sale or sharing of personal information (we do not sell or share personal information).",
            "Non-discrimination: we will not deny service or charge different prices because you exercised a privacy right.",
          ]}
        />
        <P>
          To exercise any of these rights, email{" "}
          <a href={`mailto:${SITE.salesEmail}?subject=${encodeURIComponent("Privacy request")}`} className="text-tc-bone underline hover:text-tc-gold">
            {SITE.salesEmail}
          </a>{" "}
          or call {SITE.phoneDisplay}. We will verify your request using the
          email address associated with your account or correspondence and
          respond within the time required by applicable law (45 days in
          California, extendable once by 45 days). You may use an authorized
          agent to submit a request on your behalf; we will require proof of
          authorization.
        </P>

        <H2>Data retention</H2>
        <P>
          Account data is retained while your account is active and deleted on
          verified request. Session records expire automatically after 30
          days. Business correspondence, quotes, and order records are
          retained as long as needed for the business relationship and for
          periods required by tax, transport, and product-safety law.
        </P>

        <H2>Data security</H2>
        <P>
          The website is served over HTTPS. Passwords are hashed with
          industry-standard key derivation (PBKDF2), session tokens are stored
          only in hashed form, and account data is held in access-controlled
          infrastructure. No method of transmission or storage is completely
          secure; if we learn of a breach affecting your personal information,
          we will notify you as required by applicable state breach
          notification laws.
        </P>

        <H2>Children's privacy</H2>
        <P>
          This website is intended for business and professional use and is
          not directed to children under 13. We do not knowingly collect
          personal information from children under 13, consistent with the
          Children's Online Privacy Protection Act (COPPA). If you believe a
          child has provided us personal information, contact us and we will
          delete it.
        </P>

        <H2>International visitors</H2>
        <P>
          This website is operated from the United States. If you visit from
          outside the United States, your information is processed and stored
          in the United States.
        </P>

        <H2>Changes to this policy</H2>
        <P>
          We may update this policy from time to time. The effective date
          above reflects the latest version, and material changes will be
          posted on this page.
        </P>

        <H2>Contact</H2>
        <P>
          Questions about this policy or your information: {SITE.salesEmail},{" "}
          {SITE.phoneDisplay}, or write to us at {SITE.address}.
        </P>
      </main>
      <SiteFooter />
    </div>
  );
}
