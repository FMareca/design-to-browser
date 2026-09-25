import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Eye } from "lucide-react";
import SectionFrame from "./SectionFrame";
import ScrambleText from "./ScrambleText";
import { compileUp } from "./motion";

// 01 / HTML — the skeleton. Stripped of all style: browser defaults,
// Times New Roman, blue underlined links. A [view_source] toggle slides
// the rendered view aside to reveal the semantic markup beneath it.
const source = `<article>
  <h1>O Esqueleto</h1>
  <p>
    Antes de qualquer cor, antes de qualquer
    layout, uma página é apenas <em>estrutura</em>.
    As tags descrevem o que as coisas <strong>são</strong>,
    não como elas parecem.
  </p>
  <ul>
    <li>títulos dão contorno</li>
    <li>listas dão ordem</li>
    <li>links dão direção</li>
  </ul>
  <a href="#css">seguir para o verniz →</a>
</article>`;

function RenderedView() {
  return (
    <div className="font-serif text-foreground">
      <h1 className="text-3xl font-bold">O Esqueleto</h1>
      <p className="mt-4 text-lg leading-relaxed">
        Antes de qualquer cor, antes de qualquer layout, uma página é apenas{" "}
        <em>estrutura</em>. As tags descrevem o que as coisas <strong>são</strong>,
        não como elas parecem.
      </p>
      <ul className="mt-4 list-disc pl-6 text-lg leading-relaxed">
        <li>títulos dão contorno</li>
        <li>listas dão ordem</li>
        <li>links dão direção</li>
      </ul>
      <a
        href="#css"
        className="mt-4 inline-block text-[var(--function-blue)] underline"
      >
        seguir para o verniz →
      </a>
    </div>
  );
}

function SourceView() {
  return (
    <pre className="overflow-x-auto whitespace-pre font-mono-code text-[13px] leading-relaxed text-foreground">
      <code>{source}</code>
    </pre>
  );
}

export default function HtmlSection() {
  const [view, setView] = useState("render");

  return (
    <SectionFrame
      id="html"
      index={1}
      stage="html"
      comment="/* o esqueleto — estrutura semântica, sem estilo ainda */"
    >
      <motion.h2
        variants={compileUp}
        className="font-display text-5xl font-bold tracking-tight md:text-7xl"
      >
        <ScrambleText text="HTML" />
      </motion.h2>
      <motion.p
        variants={compileUp}
        className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground"
      >
        A primeira camada é o significado. Sem fontes, sem cor, sem grid —
        apenas os ossos. Acione o interruptor para ver a marcação que sustenta
        esta visão.
      </motion.p>

      {/* view toggle */}
      <motion.div
        variants={compileUp}
        className="mt-8 inline-flex border hairline bg-white p-0.5 font-mono-code text-[11px]"
      >
        <button
          onClick={() => setView("render")}
          className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${
            view === "render" ? "bg-foreground text-background" : "text-foreground"
          }`}
        >
          <Eye className="h-3 w-3" /> renderizar
        </button>
        <button
          onClick={() => setView("source")}
          className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${
            view === "source" ? "bg-foreground text-background" : "text-foreground"
          }`}
        >
          <Code2 className="h-3 w-3" /> ver_source
        </button>
      </motion.div>

      {/* stage */}
      <motion.div
        variants={compileUp}
        className="relative mt-6 min-h-[320px] border hairline bg-white p-6 md:p-10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: view === "source" ? 24 : -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: view === "source" ? -24 : 24 }}
            transition={{ duration: 0.3 }}
          >
            {view === "render" ? <RenderedView /> : <SourceView />}
          </motion.div>
        </AnimatePresence>

        {/* corner annotation */}
        <span className="absolute bottom-3 right-4 font-mono-code text-[9px] text-muted-foreground/60">
          {view === "render" ? "<article> · semântico" : "indentado · 2 espaços"}
        </span>
      </motion.div>
    </SectionFrame>
  );
}