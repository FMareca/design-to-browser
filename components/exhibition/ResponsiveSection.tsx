import { useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, Tablet, Monitor } from "lucide-react";
import SectionFrame from "./SectionFrame";
import ScrambleText from "./ScrambleText";
import { compileUp } from "./motion";

// 05 / RESPONSIVE — one codebase, every viewport. A device frame that
// resizes between mobile, tablet and desktop, with the same content
// reflowing live and the matching media query shown beside it.
const breakpoints = [
  { key: "mobile", label: "mobile", w: 320, icon: Smartphone, mq: "@media (max-width: 640px)" },
  { key: "tablet", label: "tablet", w: 560, icon: Tablet, mq: "@media (max-width: 1024px)" },
  { key: "desktop", label: "desktop", w: 720, icon: Monitor, mq: "@media (min-width: 1025px)" },
];

export default function ResponsiveSection() {
  const [bp, setBp] = useState(breakpoints[2]);

  return (
    <SectionFrame
      id="responsive"
      index={5}
      stage="responsive"
      comment="/* um código-base, cada viewport */"
    >
      <motion.h2
        variants={compileUp}
        className="font-display text-5xl font-bold tracking-tight md:text-7xl"
      >
        <ScrambleText text="RESPONSIVE" />
      </motion.h2>
      <motion.p
        variants={compileUp}
        className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground"
      >
        A mesma marcação, os mesmos componentes — refluindo para caber em
        qualquer tela. Troque o viewport e veja o grid colapsar e a tipografia
        redimensionar.
      </motion.p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <motion.div variants={compileUp}>
          {/* breakpoint switch */}
          <div className="mb-4 inline-flex border hairline bg-white p-0.5 font-mono-code text-[11px]">
            {breakpoints.map((b) => {
              const Icon = b.icon;
              return (
                <button
                  key={b.key}
                  onClick={() => setBp(b)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${
                    bp.key === b.key
                      ? "bg-foreground text-background"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-3 w-3" /> {b.label}
                </button>
              );
            })}
          </div>

          {/* device frame */}
          <div className="flex justify-center border hairline bg-white p-6">
            <motion.div
              animate={{ width: bp.w }}
              transition={{ type: "spring", stiffness: 200, damping: 26 }}
              className="overflow-hidden border border-foreground"
              style={{ maxWidth: "100%" }}
            >
              <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center bg-[var(--function-blue)]/10 p-3 font-mono-code text-[10px] text-foreground"
                  >
                    block {i + 1}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div variants={compileUp} className="border hairline bg-white p-5">
          <div className="mb-2 font-mono-code text-[10px] tracking-widest text-muted-foreground">
            MEDIA QUERY
          </div>
          <pre className="overflow-x-auto whitespace-pre font-mono-code text-[12px] leading-relaxed text-foreground">
            <code>
              <span className="text-[var(--function-blue)]">{bp.mq}</span> {"{"}
              {"\n"}  .grid {"{"}
              {"\n"}    grid-template-columns:{"\n"}      repeat(
              {bp.key === "desktop" ? "2" : "1"}, 1fr);{"\n"}  {"}"}
              {"\n"}
              {"}"}
            </code>
          </pre>
          <div className="mt-4 font-mono-code text-[11px] text-muted-foreground">
            viewport: <span className="text-foreground">{bp.w}px</span>
          </div>
        </motion.div>
      </div>
    </SectionFrame>
  );
}