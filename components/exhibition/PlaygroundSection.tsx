import { useDeferredValue, useRef, useState, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Sparkles, SlidersHorizontal, Code2 } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import SectionFrame from "./SectionFrame";
import ScrambleText from "./ScrambleText";
import { compileUp } from "./motion";
import VisualPlayground from "./VisualPlayground";

// SUA VEZ — the visitor stops watching and starts coding. Two modes:
// "controles" maps sliders/pickers to generated CSS (VisualPlayground);
// "código livre" is a tiny HTML/CSS editor rendered into a sandboxed iframe
// (no scripts, no network) with challenges. First edit = "you just coded".
type Preset = { key: string; label: string; html: string; css: string; challenges: string[] };

const presets: Preset[] = [
  {
    key: "card",
    label: "cartão",
    html: `<div class="card">
  <h1>Olá, mundo!</h1>
  <p>Meu primeiro componente.</p>
  <button>clique aqui</button>
</div>`,
    css: `.card {
  background: #0055ff;
  color: white;
  padding: 32px;
  border-radius: 16px;
  text-align: center;
}

button {
  margin-top: 12px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: white;
  color: #0055ff;
  font-weight: bold;
  transition: transform 0.2s;
}

button:hover {
  transform: scale(1.1);
}`,
    challenges: [
      "Escreva seu nome no lugar de “Olá, mundo!”",
      "Troque #0055ff por #10b981",
      "Mude border-radius para 0 ou 40px",
    ],
  },
  {
    key: "ball",
    label: "animação",
    html: `<div class="bola"></div>`,
    css: `.bola {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f59e0b;
  animation: pular 1s ease-in-out infinite alternate;
}

@keyframes pular {
  from { transform: translateY(60px); }
  to   { transform: translateY(-60px) scale(1.2); }
}`,
    challenges: [
      "Troque 1s por 0.3s — mais rápido!",
      "Mude border-radius para 0: vira um quadrado",
      "Adicione rotate(180deg) dentro do “to”",
    ],
  },
  {
    key: "gradient",
    label: "gradiente",
    html: `<h1 class="titulo">FRONT-END</h1>`,
    css: `.titulo {
  font-size: 64px;
  font-weight: 900;
  background: linear-gradient(90deg, #0055ff, #10b981, #f59e0b);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: arco-iris 4s linear infinite;
}

@keyframes arco-iris {
  to { filter: hue-rotate(360deg); }
}`,
    challenges: [
      "Troque FRONT-END pelo seu nome",
      "Adicione uma quarta cor ao gradiente",
      "Mude 90deg para 180deg",
    ],
  },
];

// blocks every external request; only inline styles and data: images
const CSP =
  "default-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src data:";

const buildDoc = (html: string, css: string) => `<!doctype html>
<html><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="${CSP}">
<style>
  body { margin: 0; min-height: 100vh; display: grid; place-items: center;
         font-family: system-ui, sans-serif; background: #fbfbfb; box-sizing: border-box; padding: 16px; }
  ${css}
</style></head><body>${html}</body></html>`;

export default function PlaygroundSection() {
  const [preset, setPreset] = useState(presets[0]);
  const [html, setHtml] = useState(preset.html);
  const [css, setCss] = useState(preset.css);
  const [tab, setTab] = useState<"html" | "css">("css");
  const [edited, setEdited] = useState(false);
  const [mode, setMode] = useState<"visual" | "free">("visual");

  const frame = useRef<HTMLDivElement>(null);
  const badge = useRef<HTMLDivElement>(null);

  // defer so fast typing doesn't reload the iframe on every keystroke
  const doc = useDeferredValue(buildDoc(html, css));

  // flash the preview border each time the render updates
  useGSAP(
    () => {
      if (!window.matchMedia(MOTION_OK).matches) return;
      gsap.fromTo(
        frame.current,
        { boxShadow: "0 0 0 3px rgba(0,85,255,0.55)" },
        { boxShadow: "0 0 0 0px rgba(0,85,255,0)", duration: 0.7, ease: "power2.out" }
      );
    },
    { dependencies: [doc] }
  );

  // celebrate the very first edit
  useGSAP(
    () => {
      if (!edited || !badge.current) return;
      gsap.fromTo(
        badge.current,
        { scale: 0.4, opacity: 0, rotate: -8 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.6, ease: "back.out(2.5)" }
      );
    },
    { dependencies: [edited] }
  );

  const load = (p: Preset) => {
    setPreset(p);
    setHtml(p.html);
    setCss(p.css);
  };

  const onChange = (value: string) => {
    if (tab === "html") setHtml(value);
    else setCss(value);
    setEdited(true);
  };

  // Tab inserts two spaces instead of leaving the editor
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const el = e.currentTarget;
    const { selectionStart: a, selectionEnd: b, value } = el;
    onChange(value.slice(0, a) + "  " + value.slice(b));
    requestAnimationFrame(() => el.setSelectionRange(a + 2, a + 2));
  };

  return (
    <SectionFrame
      id="playground"
      index="</>"
      stage="sua vez"
      comment="/* pare de assistir — comece a escrever */"
    >
      <motion.h2
        variants={compileUp}
        className="font-display text-5xl font-bold tracking-tight md:text-7xl"
      >
        <ScrambleText text="SUA VEZ" />
      </motion.h2>
      <motion.p
        variants={compileUp}
        className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground"
      >
        Tudo o que você viu até aqui é texto num editor. Comece pelos
        controles e veja o CSS se escrevendo sozinho — depois, passe para o
        código livre e escreva você mesmo.
      </motion.p>

      {/* mode switch */}
      <motion.div
        variants={compileUp}
        className="mt-8 flex flex-wrap items-center gap-3 font-mono-code text-[11px]"
      >
        <div className="inline-flex border hairline bg-white p-0.5">
          <button
            onClick={() => setMode("visual")}
            className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${
              mode === "visual" ? "bg-foreground text-background" : "text-foreground hover:bg-muted"
            }`}
          >
            <SlidersHorizontal className="h-3 w-3" /> 1. controles
          </button>
          <button
            onClick={() => setMode("free")}
            className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${
              mode === "free" ? "bg-foreground text-background" : "text-foreground hover:bg-muted"
            }`}
          >
            <Code2 className="h-3 w-3" /> 2. código livre
          </button>
        </div>
        <div ref={badge} className={edited ? "" : "hidden"}>
          <span className="flex items-center gap-1.5 bg-[var(--mint)] px-3 py-1.5 font-bold text-[var(--obsidian)]">
            <Sparkles className="h-3 w-3" /> você acabou de programar ✓
          </span>
        </div>
      </motion.div>

      <motion.div variants={compileUp} className="mt-4">
        {mode === "visual" ? (
          <VisualPlayground onEdit={() => setEdited(true)} />
        ) : (
          freeEditor()
        )}
      </motion.div>
    </SectionFrame>
  );

  // plain render helper (not a component) so the textarea keeps focus
  function freeEditor() {
    return (
      <>
      {/* presets */}
      <div className="flex flex-wrap items-center gap-3 font-mono-code text-[11px]">
        <div className="inline-flex border hairline bg-white p-0.5">
          {presets.map((p) => (
            <button
              key={p.key}
              onClick={() => load(p)}
              className={`px-3 py-1.5 transition-colors ${
                preset.key === p.key ? "bg-foreground text-background" : "text-foreground hover:bg-muted"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => load(preset)}
          className="flex items-center gap-1.5 border hairline bg-white px-3 py-1.5 transition-colors hover:bg-muted"
        >
          <RotateCcw className="h-3 w-3" /> desfazer tudo
        </button>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* editor */}
        <div className="flex min-h-[360px] flex-col border border-[var(--obsidian)] bg-[var(--obsidian)]">
          <div className="flex items-center gap-1 border-b border-white/10 px-2 pt-2 font-mono-code text-[11px]">
            {(["html", "css"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 transition-colors ${
                  tab === t ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                index.{t}
              </button>
            ))}
          </div>
          <textarea
            value={tab === "html" ? html : css}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            aria-label={`Editor ${tab.toUpperCase()}`}
            className="flex-1 resize-none bg-transparent p-4 font-mono-code text-[13px] leading-relaxed text-[#e2e8f0] caret-[var(--mint)] outline-none"
          />
        </div>

        {/* live preview */}
        <div className="flex flex-col gap-3">
          <div ref={frame} className="flex min-h-[340px] flex-1 flex-col border hairline bg-white">
            <div className="flex items-center gap-2 border-b hairline px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
              <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
              <span className="h-2 w-2 rounded-full bg-[#28c840]" />
              <span className="ml-2 font-mono-code text-[10px] text-muted-foreground">
                preview ao vivo
              </span>
            </div>
            <iframe
              title="Preview do seu código"
              srcDoc={doc}
              sandbox=""
              className="w-full flex-1 border-0"
            />
          </div>

          <div className="border hairline bg-white p-4">
            <div className="mb-2 font-mono-code text-[10px] tracking-widest text-muted-foreground">
              DESAFIOS
            </div>
            <ol className="space-y-1.5 text-[13px] text-foreground">
              {preset.challenges.map((c, i) => (
                <li key={c} className="flex gap-2">
                  <span className="font-mono-code text-[var(--function-blue)]">{i + 1}.</span>
                  {c}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      </>
    );
  }
}
