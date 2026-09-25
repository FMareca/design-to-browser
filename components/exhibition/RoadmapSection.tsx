import { memo, useRef } from "react";
import { motion } from "framer-motion";
import { gsap, useGSAP, SplitText, MOTION_OK } from "@/lib/gsap";
import SectionFrame from "./SectionFrame";
import ScrambleText from "./ScrambleText";
import { compileUp } from "./motion";

// E AGORA? — the career bridge. What a front-end developer actually does
// day to day, and a five-step study path whose rail is drawn by the scroll.
const daily = [
  "Transformar layouts do Figma em código",
  "Criar componentes reutilizáveis",
  "Garantir que tudo funcione no celular",
  "Cuidar da acessibilidade",
  "Deixar a página rápida",
  "Animar e dar personalidade",
  "Conversar com design e back-end",
  "Caçar bugs no DevTools",
];

const path = [
  { n: "01", title: "Fundamentos", tools: "HTML · CSS · Flexbox · Grid", goal: "Construa 3 páginas simples do zero." },
  { n: "02", title: "JavaScript", tools: "lógica · DOM · eventos · fetch", goal: "Deixe essas páginas interativas." },
  { n: "03", title: "Ferramentas", tools: "Git · GitHub · terminal · DevTools", goal: "Versione tudo desde o primeiro dia." },
  { n: "04", title: "Um framework", tools: "React · Next.js · componentes", goal: "Recrie um projeto antigo com componentes." },
  { n: "05", title: "Portfólio", tools: "projetos publicados · GitHub", goal: "Mostre, não conte — como este site." },
];

const StudyPath = memo(function StudyPath() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top 75%",
            end: "bottom 55%",
            scrub: 0.6,
          },
        });
        tl.fromTo(".path-rail", { scaleY: 0 }, { scaleY: 1, ease: "none", duration: path.length }, 0);
        gsap.utils.toArray<HTMLElement>(".path-step").forEach((step, i) => {
          tl.fromTo(step, { opacity: 0.2, x: -14 }, { opacity: 1, x: 0, ease: "none", duration: 0.6 }, i)
            .fromTo(
              step.querySelector(".path-dot"),
              { scale: 0.4, backgroundColor: "#d1d5db" },
              { scale: 1, backgroundColor: "#0055ff", ease: "back.out(3)", duration: 0.4 },
              i
            );
        });
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative pl-8">
      <div className="absolute bottom-2 left-[7px] top-2 w-px bg-border" />
      <div className="path-rail absolute bottom-2 left-[7px] top-2 w-px origin-top bg-[var(--function-blue)]" />
      <ol className="space-y-6">
      {path.map((p) => (
        <li key={p.n} className="path-step relative">
          <span className="path-dot absolute -left-8 top-1 h-[15px] w-[15px] rounded-full border-2 border-white bg-[var(--function-blue)]" />
          <div className="flex items-baseline gap-3">
            <span className="font-mono-code text-[11px] text-[var(--function-blue)]">{p.n}</span>
            <h3 className="font-display text-2xl font-bold tracking-tight">{p.title}</h3>
          </div>
          <div className="mt-1 font-mono-code text-[11px] text-muted-foreground">{p.tools}</div>
          <p className="mt-1 text-[14px] text-foreground">{p.goal}</p>
        </li>
      ))}
      </ol>
    </div>
  );
});

// closing line: words rise out of a mask when it enters the viewport
const Closing = memo(function Closing() {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        SplitText.create(ref.current, {
          type: "words",
          mask: "words",
          onSplit: (self) =>
            gsap.from(self.words, {
              yPercent: 110,
              duration: 0.9,
              ease: "power4.out",
              stagger: 0.08,
              scrollTrigger: { trigger: ref.current, start: "top 85%" },
            }),
        });
      });
    },
    { scope: ref }
  );

  return (
    <p
      ref={ref}
      className="font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-8xl"
    >
      Você já <span className="text-[var(--function-blue)]">começou.</span>
    </p>
  );
});

export default function RoadmapSection() {
  return (
    <SectionFrame
      id="roadmap"
      index="?"
      stage="e agora"
      comment="/* a profissão — e o caminho até ela */"
    >
      <motion.h2
        variants={compileUp}
        className="font-display text-5xl font-bold tracking-tight md:text-7xl"
      >
        <ScrambleText text="E AGORA?" />
      </motion.h2>
      <motion.p
        variants={compileUp}
        className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground"
      >
        Front-end é a ponte entre a ideia e a pessoa que usa. É uma profissão
        que mistura lógica e estética — e dá para começar hoje, com um editor
        de texto e um browser.
      </motion.p>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <motion.div variants={compileUp}>
          <div className="mb-4 font-mono-code text-[10px] tracking-widest text-muted-foreground">
            NO DIA A DIA, UM DEV FRONT-END…
          </div>
          <div className="flex flex-wrap gap-2">
            {daily.map((d) => (
              <span
                key={d}
                className="border hairline bg-white px-3 py-2 text-[13px] text-foreground transition-colors hover:border-[var(--function-blue)] hover:bg-[var(--function-blue)] hover:text-white"
              >
                {d}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div variants={compileUp}>
          <div className="mb-4 font-mono-code text-[10px] tracking-widest text-muted-foreground">
            UM CAMINHO PARA COMEÇAR
          </div>
          <StudyPath />
        </motion.div>
      </div>

      <motion.div variants={compileUp} className="mt-20 border-t hairline pt-10">
        <Closing />
        <p className="mt-6 max-w-lg text-[14px] leading-relaxed text-muted-foreground">
          Se você mexeu no editor lá em cima, já escreveu HTML e CSS de
          verdade. Quer ir além? Aperte{" "}
          <kbd className="border hairline bg-white px-1.5 py-0.5 font-mono-code text-[11px]">Ctrl</kbd>{" "}
          +{" "}
          <kbd className="border hairline bg-white px-1.5 py-0.5 font-mono-code text-[11px]">U</kbd>{" "}
          para ver o código desta página, ou{" "}
          <kbd className="border hairline bg-white px-1.5 py-0.5 font-mono-code text-[11px]">F12</kbd>{" "}
          para abrir as ferramentas de desenvolvedor.
        </p>
      </motion.div>
    </SectionFrame>
  );
}
