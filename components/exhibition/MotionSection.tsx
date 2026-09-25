import { memo, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Shuffle } from "lucide-react";
import { gsap, useGSAP, Flip, Draggable, SplitText, MOTION_OK } from "@/lib/gsap";
import SectionFrame from "./SectionFrame";
import ScrambleText from "./ScrambleText";
import { compileUp } from "./motion";

// 07 / MOTION — the creative side of front-end. Every demo here is a real
// GSAP technique used in award-winning sites: scroll-scrubbed text, SVG
// drawing, FLIP layout transitions, physics-based dragging and proximity
// effects. The one-line API behind each demo is printed underneath.

function Demo({
  title,
  code,
  children,
}: {
  title: string;
  code: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="font-mono-code text-[10px] tracking-widest text-muted-foreground">
        {title}
      </div>
      {children}
      <pre className="overflow-x-auto font-mono-code text-[10px] leading-relaxed text-muted-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// words light up one by one as the paragraph is scrolled through
const ScrollFillText = memo(function ScrollFillText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        SplitText.create(ref.current, {
          type: "words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(
              self.words,
              { opacity: 0.12 },
              {
                opacity: 1,
                stagger: 0.1,
                ease: "none",
                scrollTrigger: {
                  trigger: ref.current,
                  start: "top 80%",
                  end: "bottom 45%",
                  scrub: true,
                },
              }
            ),
        });
      });
    },
    { scope: ref }
  );

  return (
    <p
      ref={ref}
      className="max-w-4xl font-display text-3xl font-medium leading-[1.15] tracking-tight text-foreground md:text-5xl"
    >
      {text}
    </p>
  );
});

// an SVG stroke drawn by the scrollbar, with a dot riding the curve
const DrawPathDemo = memo(function DrawPathDemo() {
  const root = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const d =
    "M10 95 C 55 5, 95 5, 125 60 S 195 125, 225 55 S 275 5, 310 40";

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top 85%",
            end: "bottom 35%",
            scrub: 1,
            onUpdate: (self) => {
              if (readout.current)
                readout.current.textContent = `${Math.round(self.progress * 100)}%`;
            },
          },
        });
        tl.fromTo(".draw-path", { drawSVG: "0%" }, { drawSVG: "100%", ease: "none" }, 0).to(
          ".draw-dot",
          {
            ease: "none",
            motionPath: {
              path: ".draw-path",
              align: ".draw-path",
              alignOrigin: [0.5, 0.5],
            },
          },
          0
        );
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative border hairline bg-white p-4">
      <svg viewBox="0 0 320 130" className="h-40 w-full overflow-visible">
        <path d={d} fill="none" stroke="var(--hairline)" strokeWidth="1" strokeDasharray="3 4" />
        <path
          className="draw-path"
          d={d}
          fill="none"
          stroke="var(--function-blue)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle className="draw-dot" cx="10" cy="95" r="6" fill="var(--amber)" />
      </svg>
      <span
        ref={readout}
        className="absolute right-3 top-3 font-mono-code text-[10px] text-[var(--function-blue)]"
      >
        0%
      </span>
    </div>
  );
});

// FLIP: record positions, reorder the DOM, animate from the old layout
const tiles = [
  { id: 0, label: ".hero", bg: "var(--function-blue)", fg: "#fff" },
  { id: 1, label: ".card", bg: "var(--amber)", fg: "var(--obsidian)" },
  { id: 2, label: ".nav", bg: "var(--mint)", fg: "var(--obsidian)" },
  { id: 3, label: ".media", bg: "var(--obsidian)", fg: "#fff" },
  { id: 4, label: ".cta", bg: "#fff", fg: "var(--obsidian)" },
  { id: 5, label: ".footer", bg: "#e0e7ff", fg: "var(--obsidian)" },
];

function FlipDemo() {
  const root = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const [order, setOrder] = useState(tiles.map((t) => t.id));

  // runs after React commits the new order
  useGSAP(
    () => {
      if (!flipState.current) return;
      Flip.from(flipState.current, {
        duration: 0.8,
        ease: "power3.inOut",
        stagger: 0.03,
      });
      flipState.current = null;
    },
    { dependencies: [order], scope: root }
  );

  const shuffle = () => {
    flipState.current = Flip.getState(root.current!.querySelectorAll(".flip-tile"));
    setOrder((o) => gsap.utils.shuffle([...o]));
  };

  return (
    <div className="flex flex-col gap-3">
      <div ref={root} className="grid grid-cols-3 grid-rows-3 gap-2 border hairline bg-white p-3">
        {order.map((id, i) => {
          const t = tiles[id];
          return (
            <div
              key={t.id}
              className={`flip-tile flex items-end border border-foreground/10 p-2 font-mono-code text-[10px] ${
                i === 0 ? "col-span-2 row-span-2 min-h-32" : "min-h-14"
              }`}
              style={{ background: t.bg, color: t.fg }}
            >
              {t.label}
            </div>
          );
        })}
      </div>
      <button
        onClick={shuffle}
        className="flex items-center gap-2 self-start border border-foreground bg-foreground px-3 py-2 font-mono-code text-[11px] text-background transition-colors hover:border-[var(--function-blue)] hover:bg-[var(--function-blue)]"
      >
        <Shuffle className="h-3.5 w-3.5" /> embaralhar_layout()
      </button>
    </div>
  );
}

// Draggable + InertiaPlugin: throw the chips, they glide and bounce off walls
const ThrowDemo = memo(function ThrowDemo() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const draggables = Draggable.create(".throw-chip", {
        type: "x,y",
        bounds: root.current,
        inertia: true,
        edgeResistance: 0.7,
        zIndexBoost: true,
        onPress: function (this: Draggable) {
          gsap.to(this.target, { scale: 1.12, rotate: -6, duration: 0.2 });
        },
        onRelease: function (this: Draggable) {
          gsap.to(this.target, { scale: 1, rotate: 0, duration: 0.4, ease: "back.out(3)" });
        },
      });
      return () => draggables.forEach((d) => d.kill());
    },
    { scope: root }
  );

  const chips = [
    { label: "{ }", bg: "var(--function-blue)", fg: "#fff", left: "12%", top: "20%" },
    { label: "</>", bg: "var(--amber)", fg: "var(--obsidian)", left: "44%", top: "52%" },
    { label: "( )", bg: "var(--mint)", fg: "var(--obsidian)", left: "70%", top: "18%" },
  ];

  return (
    <div
      ref={root}
      className="relative h-48 overflow-hidden border hairline bg-white"
      style={{
        backgroundImage: "radial-gradient(var(--hairline) 0.5px, transparent 0.5px)",
        backgroundSize: "16px 16px",
      }}
    >
      {chips.map((c) => (
        <div
          key={c.label}
          className="throw-chip absolute flex h-14 w-14 touch-none select-none items-center justify-center rounded-full font-mono-code text-[13px] font-bold shadow-sm"
          style={{ background: c.bg, color: c.fg, left: c.left, top: c.top }}
        >
          {c.label}
        </div>
      ))}
      <span className="pointer-events-none absolute bottom-2 left-3 font-mono-code text-[9px] text-muted-foreground">
        arremesse ↗
      </span>
    </div>
  );
});

// letters swell as the pointer gets close — gsap.quickTo per character
const ProximityText = memo(function ProximityText({ word }: { word: string }) {
  const root = useRef<HTMLDivElement>(null);
  const chars = useRef<
    { el: HTMLElement; cx: number; cy: number; y: gsap.QuickToFunc; s: gsap.QuickToFunc }[]
  >([]);

  // quickTo setters are created inside the context, so plain handlers are safe
  useGSAP(
    () => {
      chars.current = gsap.utils.toArray<HTMLElement>(".prox-char", root.current).map((el) => ({
        el,
        cx: 0,
        cy: 0,
        y: gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" }),
        s: gsap.quickTo(el, "scale", { duration: 0.45, ease: "power3" }),
      }));
    },
    { scope: root }
  );

  // cache resting centers once, so transforms don't feed back into distance
  const measure = () => {
    chars.current.forEach((c) => {
      const r = c.el.getBoundingClientRect();
      c.cx = r.left + r.width / 2;
      c.cy = r.top + r.height / 2;
    });
  };

  const onMove = (e: PointerEvent) => {
    if (!window.matchMedia(MOTION_OK).matches) return;
    chars.current.forEach((c) => {
      const dist = Math.hypot(e.clientX - c.cx, e.clientY - c.cy);
      const p = gsap.utils.clamp(0, 1, 1 - dist / 130);
      c.y(-p * 26);
      c.s(1 + p * 0.7);
    });
  };

  const onLeave = () => {
    chars.current.forEach((c) => {
      c.y(0);
      c.s(1);
    });
  };

  return (
    <div
      ref={root}
      onPointerEnter={measure}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="flex h-48 items-center justify-center overflow-hidden border hairline bg-white"
    >
      <div className="flex font-display text-5xl font-bold tracking-tight md:text-6xl" aria-label={word}>
        {word.split("").map((ch, i) => (
          <span
            key={i}
            aria-hidden
            className="prox-char inline-block will-change-transform"
            style={{ color: i % 2 ? "var(--function-blue)" : "var(--obsidian)" }}
          >
            {ch}
          </span>
        ))}
      </div>
    </div>
  );
});

export default function MotionSection() {
  return (
    <SectionFrame
      id="motion"
      index={7}
      stage="motion"
      comment="/* o lado criativo — movimento com intenção */"
    >
      <motion.h2
        variants={compileUp}
        className="font-display text-5xl font-bold tracking-tight md:text-7xl"
      >
        <ScrambleText text="MOTION" />
      </motion.h2>
      <motion.p
        variants={compileUp}
        className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground"
      >
        Front-end também é arte. Com GSAP, o scroll vira linha do tempo, o SVG
        vira pincel e o layout dança. Cada efeito abaixo é código de verdade —
        brinque com eles.
      </motion.p>

      <motion.div variants={compileUp} className="mt-14">
        <ScrollFillText text="Um bom desenvolvedor front-end não só faz funcionar — faz a pessoa sentir. Movimento guia o olhar, conta uma história e transforma uma página numa experiência." />
        <div className="mt-3 font-mono-code text-[10px] text-muted-foreground">
          {"SplitText + scrollTrigger: { scrub: true }"}
        </div>
      </motion.div>

      <div className="mt-14 grid gap-8 md:grid-cols-2">
        <motion.div variants={compileUp}>
          <Demo title="SVG DESENHADO PELO SCROLL" code='drawSVG: "0% 100%" · motionPath: { path }'>
            <DrawPathDemo />
          </Demo>
        </motion.div>
        <motion.div variants={compileUp}>
          <Demo title="LAYOUT COM FLIP" code="Flip.getState() → setState() → Flip.from()">
            <FlipDemo />
          </Demo>
        </motion.div>
        <motion.div variants={compileUp}>
          <Demo title="FÍSICA E INÉRCIA" code="Draggable.create(el, { inertia: true, bounds })">
            <ThrowDemo />
          </Demo>
        </motion.div>
        <motion.div variants={compileUp}>
          <Demo title="PROXIMIDADE DO CURSOR" code='gsap.quickTo(char, "scale")'>
            <ProximityText word="CRIATIVO" />
          </Demo>
        </motion.div>
      </div>
    </SectionFrame>
  );
}
