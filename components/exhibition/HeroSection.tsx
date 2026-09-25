import { memo, useRef, useState, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { Terminal, ArrowDown } from "lucide-react";
import { gsap, useGSAP, SplitText, MOTION_OK } from "@/lib/gsap";
import { compileUp } from "./motion";

// "→ AO BROWSER" rises character by character out of a clipping mask.
// Memoized: the hero re-renders on every mouse move, this text must not.
const SplitRise = memo(function SplitRise({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        SplitText.create(ref.current, {
          type: "chars",
          mask: "chars",
          onSplit: (self) =>
            gsap.from(self.chars, {
              yPercent: 110,
              duration: 0.9,
              ease: "power4.out",
              stagger: 0.04,
              delay: 0.7,
            }),
        });
      });
    },
    { scope: ref }
  );
  return (
    <span ref={ref} className="inline-block">
      {text}
    </span>
  );
});

// 00 / DESIGN — the blank canvas. The headline is an outline that fills
// with solid ink wherever the cursor travels, symbolizing concept → reality.
export default function HeroSection() {
  const [fill, setFill] = useState({ x: 50, y: 50 });
  const ref = useRef<HTMLElement>(null);
  const dots = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const headline = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // the headline is "painted" left to right on load
        gsap.fromTo(
          headline.current,
          { clipPath: "inset(0% 100% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.4,
            ease: "power4.inOut",
            delay: 0.15,
            clearProps: "clipPath",
          }
        );

        // scrolling away: content lifts and shrinks, the grid drifts slower
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        tl.to(content.current, { yPercent: -18, scale: 0.94, opacity: 0.25, ease: "none" }, 0)
          .to(headline.current, { xPercent: -6, ease: "none" }, 0)
          .to(dots.current, { yPercent: 25, ease: "none" }, 0);
      });
    },
    { scope: ref }
  );

  const onMove = (e: MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setFill({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  const startCompile = () => {
    document.getElementById("html")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="design"
      ref={ref}
      onMouseMove={onMove}
      className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden px-5 pt-16 md:px-10"
    >
      {/* faint blueprint dots */}
      <div
        ref={dots}
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(var(--hairline) 0.5px, transparent 0.5px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div ref={content} className="relative mx-auto w-full max-w-6xl origin-top">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6 flex items-center gap-2 font-mono-code text-[11px] tracking-widest text-muted-foreground"
        >
          <Terminal className="h-3.5 w-3.5 text-[var(--function-blue)]" />
          <span>00 / DESIGN</span>
          <span className="text-border">—</span>
          <span className="truncate">a tela em branco, antes da primeira tag</span>
        </motion.div>

        {/* outlined headline that fills near cursor */}
        <div ref={headline} className="relative select-none">
          <h1 className="text-stroke font-display text-[18vw] font-bold leading-[0.85] tracking-tight md:text-[15vw]">
            DO DESIGN
          </h1>
          <h1
            className="absolute inset-0 font-display text-[18vw] font-bold leading-[0.85] tracking-tight text-foreground md:text-[15vw]"
            style={{
              color: "var(--obsidian)",
              WebkitMaskImage: `radial-gradient(circle 180px at ${fill.x}% ${fill.y}%, #000 0%, transparent 100%)`,
              maskImage: `radial-gradient(circle 180px at ${fill.x}% ${fill.y}%, #000 0%, transparent 100%)`,
            }}
          >
            DO DESIGN
          </h1>
        </div>

        <motion.h2
          variants={compileUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.2 }}
          className="mt-2 font-display text-[10vw] font-medium leading-none tracking-tight text-muted-foreground md:text-[7vw]"
        >
          <SplitRise text="→ AO BROWSER" />
        </motion.h2>

        <motion.div
          variants={compileUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.4 }}
          className="mt-10 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between"
        >
          <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground">
            Uma anatomia interativa do render. Nove estágios, da tela em branco
            a uma interface viva. Role para compilar cada um — ou pressione
            iniciar.
          </p>

          <button
            onClick={startCompile}
            className="group flex items-center gap-3 border border-foreground bg-foreground px-5 py-3 font-mono-code text-[12px] text-background transition-colors hover:bg-[var(--function-blue)] hover:border-[var(--function-blue)]"
          >
            <span className="h-2 w-2 animate-pulse bg-[var(--mint)]" />
            start_compiling()
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </button>
        </motion.div>

        {/* redline annotation */}
        <div className="pointer-events-none absolute -right-1 top-2 hidden flex-col items-end font-mono-code text-[9px] text-[var(--function-blue)] md:flex">
          <span>↕ 100vh</span>
          <span className="mt-1 text-muted-foreground">estágio: design</span>
        </div>
      </div>
    </section>
  );
}