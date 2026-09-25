import { useEffect, useState } from "react";
import { Terminal } from "lucide-react";

// The Front-end Proof — the footer is not links, it's a live performance
// monitor: real DOM node count, a time-to-interactive readout, and a
// console.log() button that prints an easter egg to the real devtools.
export default function PerformanceFooter() {
  const [nodes, setNodes] = useState(0);
  const [tti, setTti] = useState<number | null>(null);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const count = () =>
      setNodes(document.getElementsByTagName("*").length);
    count();
    const id = setInterval(count, 2000);

    // crude TTI: time from navigation start to load
    const t = performance.now();
    const onLoad = () => setTti(Math.round(t));
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);

    return () => {
      clearInterval(id);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  const egg = () => {
    setLogged(true);
    console.log(
      "%cDO DESIGN AO BROWSER",
      "font-size:28px;font-weight:700;color:#0055ff;"
    );
    console.log(
      "%cSe você está lendo isto, é exatamente para quem esta exposição foi construída. — um dev front-end",
      "font-size:13px;color:#0f172a;"
    );
    console.log(
      "%c→ inspecione o grid, leia o código-fonte, rastreie o render.",
      "font-size:12px;color:#10b981;"
    );
  };

  const stats = [
    { label: "nós do DOM", value: nodes.toLocaleString() },
    { label: "tempo p/ interativo", value: tti ? `${tti}ms` : "—" },
    { label: "estágios", value: "9" },
    { label: "stack", value: "react · gsap" },
  ];

  return (
    <footer className="border-t hairline bg-[var(--lab-white)] px-5 py-12 md:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 flex items-center gap-2 font-mono-code text-[11px] tracking-widest text-muted-foreground">
          <Terminal className="h-3.5 w-3.5 text-[var(--function-blue)]" />
          monitor de performance
        </div>

        <div className="grid grid-cols-2 gap-px border hairline bg-border md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white p-4">
              <div className="font-mono-code text-[10px] uppercase tracking-widest text-muted-foreground">
                {s.label}
              </div>
              <div className="mt-1 font-display text-2xl font-bold tabular-nums text-foreground">
                {s.value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <p className="max-w-md text-[13px] leading-relaxed text-muted-foreground">
            Construído ao vivo, à mão, como um dev front-end faria. Abra suas
            devtools — há uma mensagem te esperando no console.
          </p>
          <button
            onClick={egg}
            className="flex items-center gap-2 border border-foreground bg-foreground px-4 py-2.5 font-mono-code text-[12px] text-background transition-colors hover:bg-[var(--function-blue)] hover:border-[var(--function-blue)]"
          >
            <Terminal className="h-3.5 w-3.5" />
            {logged ? "registrado ✓ — veja o console" : "console.log()"}
          </button>
        </div>

        <div className="mt-10 flex items-center justify-between border-t hairline pt-4 font-mono-code text-[10px] text-muted-foreground">
          <span>DO DESIGN AO BROWSER</span>
          <span>uma anatomia do render</span>
        </div>
      </div>
    </footer>
  );
}