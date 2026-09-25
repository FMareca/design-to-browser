import { useRef, useState, type ReactNode } from "react";
import { Copy, Check } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

// Visual CSS playground: every control on the left writes one CSS
// declaration. The generated stylesheet updates live in the middle (the
// line that just changed flashes) and the element renders on the right.
type Anim = "none" | "pulsar" | "girar" | "flutuar" | "balancar" | "quicar";

type Box = {
  text: string;
  width: number;
  height: number;
  radius: number;
  bg: string;
  color: string;
  fontSize: number;
  shadow: number;
  rotate: number;
  anim: Anim;
  duration: number;
};

const START: Box = {
  text: "Olá!",
  width: 180,
  height: 180,
  radius: 12,
  bg: "#0055ff",
  color: "#ffffff",
  fontSize: 28,
  shadow: 0,
  rotate: 0,
  anim: "none",
  duration: 1,
};

const examples: { label: string; box: Box }[] = [
  { label: "botão", box: { text: "Clique aqui", width: 220, height: 64, radius: 32, bg: "#0055ff", color: "#ffffff", fontSize: 20, shadow: 24, rotate: 0, anim: "pulsar", duration: 1.2 } },
  { label: "card", box: { text: "Meu card", width: 260, height: 170, radius: 16, bg: "#ffffff", color: "#0f172a", fontSize: 26, shadow: 40, rotate: 0, anim: "flutuar", duration: 3 } },
  { label: "bola", box: { text: "", width: 90, height: 90, radius: 45, bg: "#f59e0b", color: "#0f172a", fontSize: 16, shadow: 12, rotate: 0, anim: "quicar", duration: 0.8 } },
  { label: "sticker", box: { text: "UAU!", width: 160, height: 160, radius: 28, bg: "#10b981", color: "#0f172a", fontSize: 40, rotate: -8, shadow: 16, anim: "balancar", duration: 1 } },
  { label: "loading", box: { text: "", width: 70, height: 70, radius: 35, bg: "#0f172a", color: "#ffffff", fontSize: 16, shadow: 0, rotate: 0, anim: "girar", duration: 0.9 } },
];

const swatches = ["#0055ff", "#10b981", "#f59e0b", "#ef4444", "#a855f7", "#0f172a", "#ffffff"];

const anims: { key: Anim; label: string }[] = [
  { key: "none", label: "nenhuma" },
  { key: "pulsar", label: "pulsar" },
  { key: "girar", label: "girar" },
  { key: "flutuar", label: "flutuar" },
  { key: "balancar", label: "balançar" },
  { key: "quicar", label: "quicar" },
];

// the same keyframes defined in globals.css, printed for the student
const keyframes: Record<Exclude<Anim, "none">, string[]> = {
  pulsar: ["  50% { transform: scale(1.12); }"],
  girar: ["  to { transform: rotate(360deg); }"],
  flutuar: ["  50% { transform: translateY(-24px); }"],
  balancar: ["  25% { transform: rotate(-8deg); }", "  75% { transform: rotate(8deg); }"],
  quicar: ["  50% { transform: translateY(-60px); }"],
};

const shadowCss = (s: number) => (s ? `0 ${Math.round(s / 2)}px ${s}px rgba(0, 0, 0, 0.25)` : "none");
const animCss = (b: Box) => (b.anim === "none" ? "none" : `${b.anim} ${b.duration}s ease-in-out infinite`);

// declaration list, keyed by the control that owns each line
const declarations = (b: Box): [keyof Box, string, string][] => [
  ["width", "width", `${b.width}px`],
  ["height", "height", `${b.height}px`],
  ["bg", "background", b.bg],
  ["color", "color", b.color],
  ["radius", "border-radius", `${b.radius}px`],
  ["fontSize", "font-size", `${b.fontSize}px`],
  ["rotate", "rotate", `${b.rotate}deg`],
  ["shadow", "box-shadow", shadowCss(b.shadow)],
  ["anim", "animation", animCss(b)],
];

const toText = (b: Box) =>
  [
    `<div class="minha-caixa">${b.text}</div>`,
    "",
    ".minha-caixa {",
    ...declarations(b).map(([, p, v]) => `  ${p}: ${v};`),
    "}",
    ...(b.anim === "none" ? [] : ["", `@keyframes ${b.anim} {`, ...keyframes[b.anim], "}"]),
  ].join("\n");

function Control({ prop, value, children }: { prop: string; value: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={prop}>
      <div className="mb-1 flex justify-between font-mono-code text-[11px]">
        <span>{prop}</span>
        <span className="text-[var(--function-blue)]">{value}</span>
      </div>
      {children}
    </div>
  );
}

function Range(props: { label: string; min: number; max: number; step?: number; value: number; onChange: (v: number) => void }) {
  return (
    <input
      type="range"
      aria-label={props.label}
      min={props.min}
      max={props.max}
      step={props.step ?? 1}
      value={props.value}
      onChange={(e) => props.onChange(+e.target.value)}
      className="w-full accent-[var(--function-blue)]"
    />
  );
}

export default function VisualPlayground({ onEdit }: { onEdit: () => void }) {
  const [box, setBox] = useState<Box>(START);
  const [changed, setChanged] = useState<{ key: keyof Box | null; n: number }>({ key: null, n: 0 });
  const [copied, setCopied] = useState(false);
  const code = useRef<HTMLPreElement>(null);

  const set = <K extends keyof Box>(key: K, value: Box[K]) => {
    setBox((b) => ({ ...b, [key]: value }));
    // duration lives on the animation line
    setChanged((c) => ({ key: key === "duration" ? "anim" : key, n: c.n + 1 }));
    onEdit();
  };

  const loadExample = (b: Box) => {
    setBox(b);
    setChanged((c) => ({ key: null, n: c.n + 1 }));
  };

  // flash the declaration that the last control touched
  useGSAP(
    () => {
      if (!changed.key || !window.matchMedia(MOTION_OK).matches) return;
      gsap.fromTo(
        `[data-prop="${changed.key}"]`,
        { backgroundColor: "rgba(16,185,129,0.45)" },
        { backgroundColor: "rgba(16,185,129,0.08)", duration: 0.9, ease: "power2.out", overwrite: true }
      );
    },
    { dependencies: [changed.n], scope: code }
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(toText(box));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard can be blocked (e.g. insecure context) — nothing to do
    }
  };

  return (
    <div className="space-y-4">
      {/* ready-made examples */}
      <div className="flex flex-wrap items-center gap-2 font-mono-code text-[11px]">
        <span className="text-muted-foreground">exemplos prontos:</span>
        {examples.map((e) => (
          <button
            key={e.label}
            onClick={() => loadExample(e.box)}
            className="border hairline bg-white px-3 py-1.5 transition-colors hover:border-[var(--function-blue)] hover:bg-[var(--function-blue)] hover:text-white"
          >
            {e.label}
          </button>
        ))}
        <button
          onClick={() => loadExample(START)}
          className="px-2 py-1.5 text-muted-foreground underline-offset-2 hover:underline"
        >
          resetar
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr_1fr]">
        {/* controls */}
        <div className="space-y-4 border hairline bg-white p-5">
          <Control prop="texto" value={`"${box.text}"`}>
            <input
              aria-label="texto"
              value={box.text}
              maxLength={24}
              onChange={(e) => set("text", e.target.value)}
              className="w-full border hairline px-2 py-1.5 text-[13px] outline-none focus:border-[var(--function-blue)]"
            />
          </Control>
          <Control prop="width" value={`${box.width}px`}>
            <Range label="width" min={40} max={300} value={box.width} onChange={(v) => set("width", v)} />
          </Control>
          <Control prop="height" value={`${box.height}px`}>
            <Range label="height" min={40} max={260} value={box.height} onChange={(v) => set("height", v)} />
          </Control>
          <Control prop="border-radius" value={`${box.radius}px`}>
            <Range label="border-radius" min={0} max={150} value={box.radius} onChange={(v) => set("radius", v)} />
          </Control>
          <Control prop="background" value={box.bg}>
            <div className="flex flex-wrap items-center gap-1.5">
              {swatches.map((c) => (
                <button
                  key={c}
                  onClick={() => set("bg", c)}
                  aria-label={`fundo ${c}`}
                  className={`h-6 w-6 rounded-full border ${box.bg === c ? "ring-2 ring-[var(--function-blue)] ring-offset-2" : "border-foreground/20"}`}
                  style={{ background: c }}
                />
              ))}
              <input
                type="color"
                value={box.bg}
                onChange={(e) => set("bg", e.target.value)}
                aria-label="escolher outra cor de fundo"
                className="h-6 w-8 cursor-pointer border-0 bg-transparent p-0"
              />
            </div>
          </Control>
          <Control prop="color" value={box.color}>
            <input
              type="color"
              value={box.color}
              onChange={(e) => set("color", e.target.value)}
              aria-label="cor do texto"
              className="h-6 w-full cursor-pointer border-0 bg-transparent p-0"
            />
          </Control>
          <Control prop="font-size" value={`${box.fontSize}px`}>
            <Range label="font-size" min={10} max={64} value={box.fontSize} onChange={(v) => set("fontSize", v)} />
          </Control>
          <Control prop="rotate" value={`${box.rotate}deg`}>
            <Range label="rotate" min={-45} max={45} value={box.rotate} onChange={(v) => set("rotate", v)} />
          </Control>
          <Control prop="box-shadow" value={box.shadow ? `${box.shadow}px` : "none"}>
            <Range label="box-shadow" min={0} max={60} value={box.shadow} onChange={(v) => set("shadow", v)} />
          </Control>
          <Control prop="animation" value={box.anim}>
            <div className="flex flex-wrap gap-1">
              {anims.map((a) => (
                <button
                  key={a.key}
                  onClick={() => set("anim", a.key)}
                  className={`border px-2 py-1 font-mono-code text-[10px] transition-colors ${
                    box.anim === a.key ? "border-foreground bg-foreground text-background" : "hairline hover:bg-muted"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </Control>
          {box.anim !== "none" && (
            <Control prop="duração" value={`${box.duration}s`}>
              <Range label="duração" min={0.2} max={4} step={0.1} value={box.duration} onChange={(v) => set("duration", v)} />
            </Control>
          )}
        </div>

        {/* generated CSS */}
        <div className="flex flex-col border border-[var(--obsidian)] bg-[var(--obsidian)] lg:order-none">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 font-mono-code text-[11px] text-white/50">
            <span>código gerado ao vivo</span>
            <button onClick={copy} className="flex items-center gap-1 text-white/70 hover:text-white">
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "copiado" : "copiar"}
            </button>
          </div>
          <pre ref={code} className="flex-1 overflow-x-auto p-4 font-mono-code text-[12.5px] leading-[1.9] text-white/80">
            <code>
              <span data-prop="text" className="-mx-4 block px-4 text-white/40">
                {"<!-- index.html -->"}
              </span>
              <span
                data-prop="text"
                className={`-mx-4 block border-l-2 px-4 ${changed.key === "text" ? "border-[var(--mint)]" : "border-transparent"}`}
              >
                <span className="text-[#7dd3fc]">{'<div class="minha-caixa">'}</span>
                <span className="text-white">{box.text}</span>
                <span className="text-[#7dd3fc]">{"</div>"}</span>
              </span>
              {"\n"}
              <span className="text-white/40">{"/* style.css */"}</span>
              {"\n"}
              <span className="text-[var(--amber)]">.minha-caixa</span> {"{"}
              {"\n"}
              {declarations(box).map(([key, prop, value]) => (
                <span
                  key={key}
                  data-prop={key}
                  className={`-mx-4 block px-4 ${changed.key === key ? "border-l-2 border-[var(--mint)]" : "border-l-2 border-transparent"}`}
                >
                  {"  "}
                  <span className="text-[#7dd3fc]">{prop}</span>: <span className="text-[var(--mint)]">{value}</span>;
                </span>
              ))}
              {"}"}
              {box.anim !== "none" && (
                <>
                  {"\n\n"}
                  <span className="text-[#c084fc]">@keyframes</span>{" "}
                  <span className="text-[var(--amber)]">{box.anim}</span> {"{"}
                  {"\n"}
                  {keyframes[box.anim].join("\n")}
                  {"\n}"}
                </>
              )}
            </code>
          </pre>
        </div>

        {/* live render */}
        <div className="order-first flex flex-col border hairline bg-white lg:order-none">
          <div className="flex items-center gap-2 border-b hairline px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
            <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
            <span className="h-2 w-2 rounded-full bg-[#28c840]" />
            <span className="ml-2 font-mono-code text-[10px] text-muted-foreground">resultado</span>
          </div>
          <div
            className="flex min-h-[340px] flex-1 items-center justify-center overflow-hidden p-6"
            style={{
              backgroundImage: "radial-gradient(var(--hairline) 0.5px, transparent 0.5px)",
              backgroundSize: "16px 16px",
            }}
          >
            <div
              className="flex max-w-full items-center justify-center text-center font-display font-bold"
              style={{
                width: box.width,
                height: box.height,
                background: box.bg,
                color: box.color,
                borderRadius: box.radius,
                fontSize: box.fontSize,
                rotate: `${box.rotate}deg`,
                boxShadow: shadowCss(box.shadow),
                animation: animCss(box),
              }}
            >
              {box.text}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
