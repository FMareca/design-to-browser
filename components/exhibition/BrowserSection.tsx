import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import SectionFrame from "./SectionFrame";
import ScrambleText from "./ScrambleText";
import { compileUp } from "./motion";

// 07 / BROWSER — the render. Everything compiles to pixels on glass.
// A mini browser window shows the finished interface, the eight stages
// listed as a build log, and a "render complete" status.
const stages = [
  "design",
  "html",
  "css",
  "javascript",
  "react",
  "responsive",
  "interaction",
  "motion",
  "browser",
];

export default function BrowserSection() {
  return (
    <SectionFrame
      id="browser"
      index={8}
      stage="browser"
      comment="/* pixels na tela — o render */"
    >
      <motion.h2
        variants={compileUp}
        className="font-display text-5xl font-bold tracking-tight md:text-7xl"
      >
        <ScrambleText text="BROWSER" />
      </motion.h2>
      <motion.p
        variants={compileUp}
        className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground"
      >
        Toda camada se resolve aqui. O DOM vira uma árvore de render, a pintura
        chega ao compositor e os pixels pousam na tela. A jornada está
        completa.
      </motion.p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* compiled result in a browser window */}
        <motion.div variants={compileUp} className="border hairline bg-white">
          <div className="flex items-center gap-2 border-b hairline px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
            <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
            <span className="h-2 w-2 rounded-full bg-[#28c840]" />
            <span className="ml-2 font-mono-code text-[10px] text-muted-foreground">
              from-design-to-browser.dev
            </span>
          </div>
          <div className="p-6">
            <div className="font-display text-2xl font-bold tracking-tight">
              O Render
            </div>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Design, estrutura, estilo, lógica, composição, layout, gesto —
              tudo, agora vivo.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex h-16 items-end bg-[var(--function-blue)]/10 p-2 font-mono-code text-[9px] text-foreground"
                >
                  camada {i + 1}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 font-mono-code text-[11px] text-[var(--mint)]">
              <CheckCircle2 className="h-3.5 w-3.5" /> render completo
            </div>
          </div>
        </motion.div>

        {/* build log */}
        <motion.div variants={compileUp} className="border hairline bg-[#0f172a] p-5">
          <div className="mb-3 font-mono-code text-[10px] tracking-widest text-white/50">
            LOG DE BUILD
          </div>
          <div className="space-y-1.5 font-mono-code text-[11px] leading-relaxed text-white/80">
            {stages.map((s, i) => (
              <motion.div
                key={s}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-2"
              >
                <span className="text-[var(--mint)]">✓</span>
                <span className="text-white/40">
                  {String(i).padStart(2, "0")}
                </span>
                <span>{s}.stage</span>
                <span className="ml-auto text-white/30">compilado</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 border-t border-white/10 pt-3 font-mono-code text-[10px] text-white/40">
            9 estágios · 0 erros · saída 0
          </div>
        </motion.div>
      </div>
    </SectionFrame>
  );
}