import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";

const FRAME_COUNT = 100;
const framePath = (i: number) => `/frames/hero/f_${String(i + 1).padStart(3, "0")}.webp`;

/**
 * Tier-1 mechanic (A1, single-shot hero scrub): scrolling plays a generated
 * film of red coating pouring and self-levelling. CSS sticky pins the stage
 * (no GSAP pin, so no pin-spacer band); a ScrollTrigger scrubs the canvas
 * frame sequence. Reduced motion: static final frame, no scrub.
 */
export function HeroScrub() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Static composed fallback: show the film's final, levelled state.
      if (posterRef.current) posterRef.current.src = framePath(FRAME_COUNT - 1);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frames: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null);
    let current = 0;
    let killed = false;
    let trigger: { kill: () => void } | undefined;

    const draw = (index: number) => {
      // Nearest loaded frame at or below the requested index.
      let img: HTMLImageElement | null = null;
      for (let i = index; i >= 0; i--) {
        if (frames[i]) {
          img = frames[i];
          break;
        }
      }
      if (!img) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth * dpr;
      const h = canvas.clientHeight * dpr;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      // cover-fit
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    };

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          frames[i] = img;
          resolve();
        };
        img.onerror = () => resolve();
        img.src = framePath(i);
      });

    void (async () => {
      await load(0);
      if (killed) return;
      draw(0);
      if (posterRef.current) posterRef.current.style.opacity = "0";

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (killed) return;
      gsap.registerPlugin(ScrollTrigger);

      trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => {
          const index = Math.min(
            FRAME_COUNT - 1,
            Math.round(self.progress * (FRAME_COUNT - 1)),
          );
          if (index !== current) {
            current = index;
            draw(index);
          }
        },
      });

      // Stream the rest in the background (coarse first, then fill).
      for (let step = 8; step >= 1; step = Math.floor(step / 2)) {
        const batch: Promise<void>[] = [];
        for (let i = 0; i < FRAME_COUNT; i += step) {
          if (!frames[i]) batch.push(load(i));
        }
        await Promise.all(batch);
        if (killed) return;
        draw(current);
        if (step === 1) break;
      }

      const onResize = () => draw(current);
      window.addEventListener("resize", onResize);
      const prevCleanup = trigger;
      trigger = {
        kill: () => {
          prevCleanup?.kill();
          window.removeEventListener("resize", onResize);
        },
      };
    })();

    return () => {
      killed = true;
      trigger?.kill();
    };
  }, []);

  return (
    <div ref={sectionRef} className="relative h-[260vh] md:h-[300vh]">
      <div className="sticky top-0 h-dvh overflow-hidden bg-tc-ink">
        {/* Poster: frame 1 rendered server-side so first paint is complete. */}
        <img
          ref={posterRef}
          src={framePath(0)}
          alt="Glossy red coating pouring onto a steel tray and self-levelling"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
        />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        {/* Scrim for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-tc-ink/85 via-tc-ink/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-tc-ink/70 via-transparent to-transparent" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[1200px] px-5 pb-16 md:px-8 md:pb-20">
            <h1 className="tc-rise max-w-[13ch] font-tc-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tighter text-tc-bone md:text-7xl">
              Your total coatings solution since{" "}
              <span className="text-tc-red">1932</span>
            </h1>
            <p className="tc-rise tc-rise-1 mt-5 max-w-[46ch] text-base leading-relaxed text-tc-bone/85">
              High-performance coatings, technical guidance, and custom
              formulations for industrial, architectural, and specialty work.
            </p>
            <div className="tc-rise tc-rise-2 mt-8 flex flex-wrap items-center gap-6">
              <Link
                to="/catalog"
                className="group relative inline-flex items-center overflow-hidden bg-tc-red px-6 py-3.5 font-tc-mono text-[12px] uppercase tracking-[0.14em] text-tc-bone active:scale-[0.98]"
              >
                {/* liquid fill: deep red rises like poured coating */}
                <span className="absolute inset-0 translate-y-full bg-tc-red-deep transition-transform duration-500 ease-out group-hover:translate-y-0" />
                <span className="relative">Explore coating systems</span>
              </Link>
              <a
                href="#contact"
                className="group relative font-tc-mono text-[12px] uppercase tracking-[0.14em] text-tc-bone"
              >
                Talk with a specialist
                <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                <span className="absolute -bottom-1.5 left-0 h-px w-full bg-tc-bone/40 transition-colors group-hover:bg-tc-gold" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
