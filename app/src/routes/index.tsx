import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "../components/site/SmoothScroll";
import { SiteHeader } from "../components/site/SiteHeader";
import { SiteFooter } from "../components/site/SiteFooter";
import { HeroScrub } from "../components/landing/HeroScrub";
import { MetricsStrip } from "../components/landing/MetricsStrip";
import { SystemsBento } from "../components/landing/SystemsBento";
import { LabSplit } from "../components/landing/LabSplit";
import { DataBand } from "../components/landing/DataBand";
import { Heritage } from "../components/landing/Heritage";
import { FinalCta } from "../components/landing/FinalCta";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="tc-site min-h-dvh">
      <SmoothScroll />
      <SiteHeader />
      <main>
        <HeroScrub />
        <MetricsStrip />
        <SystemsBento />
        <LabSplit />
        <DataBand />
        <Heritage />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
