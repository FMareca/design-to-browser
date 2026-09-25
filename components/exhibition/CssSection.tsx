import { useState } from "react";
import { motion } from "framer-motion";
import SectionFrame from "./SectionFrame";
import ScrambleText from "./ScrambleText";
import { compileUp } from "./motion";

// 02 / CSS — the veneer. The box model, color-coded exactly like the
// Chrome inspector: orange margin, yellow border, green padding, blue
// content. A live slider drives border-radius and grid-gap on a real grid.
export default function CssSection() {
  const [radius, setRadius] = useState(4);
  const [gap, setGap] = useState(16);

  return (
    <SectionFrame
      id="css"
      index={2}
      stage="css"
      comment="/* o verniz — modelo de caixa, pintura, layout */"
    >
      <motion.h2
        variants={compileUp}
        className="font-display text-5xl font-bold tracking-tight md:text-7xl"
      >
        <ScrambleText text="CSS" />
      </motion.h2>
      <motion.p
        variants={compileUp}
        className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground"
      >
        Estilo é uma pilha de caixas. Todo elemento é margem, borda, padding,
        conteúdo — as quatro cores do inspetor. Arraste os controles e veja a
        pintura se atualizar em tempo real.
      </motion.p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* box model diagram */}
        <motion.div variants={compileUp}>
          <div className="mb-3 font-mono-code text-[10px] tracking-widest text-muted-foreground">
            MODELO DE CAIXA
          </div>
          <div className="bg-[#fff7ed] p-4" style={{ borderRadius: radius }}>
            <div className="bg-[#fef9c3] p-4" style={{ borderRadius: radius }}>
              <div className="bg-[#dcfce7] p-4" style={{ borderRadius: radius }}>
                <div
                  className="flex items-center justify-center bg-[var(--function-blue)] p-6 text-white"
                  style={{ borderRadius: radius }}
                >
                  <span className="font-mono-code text-[11px]">conteúdo</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono-code text-[10px]">
            <span className="text-[#ea580c]">■ margin</span>
            <span className="text-[#ca8a04]">■ border</span>
            <span className="text-[#16a34a]">■ padding</span>
            <span className="text-[var(--function-blue)]">■ content</span>
          </div>
        </motion.div>

        {/* live controls + grid */}
        <motion.div variants={compileUp} className="flex flex-col">
          <div className="mb-3 font-mono-code text-[10px] tracking-widest text-muted-foreground">
            PINTURA AO VIVO
          </div>
          <div
            className="grid flex-1 grid-cols-3"
            style={{ gap: `${gap}px` }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-center border border-foreground bg-white font-mono-code text-[10px] text-foreground"
                style={{ borderRadius: radius, minHeight: 64 }}
              >
                .box{i + 1}
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <label className="block">
              <div className="mb-1 flex justify-between font-mono-code text-[11px]">
                <span>border-radius</span>
                <span className="text-[var(--function-blue)]">{radius}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={32}
                value={radius}
                onChange={(e) => setRadius(+e.target.value)}
                className="w-full accent-[var(--function-blue)]"
              />
            </label>
            <label className="block">
              <div className="mb-1 flex justify-between font-mono-code text-[11px]">
                <span>grid-gap</span>
                <span className="text-[var(--function-blue)]">{gap}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={gap}
                onChange={(e) => setGap(+e.target.value)}
                className="w-full accent-[var(--function-blue)]"
              />
            </label>
          </div>
        </motion.div>
      </div>
    </SectionFrame>
  );
}