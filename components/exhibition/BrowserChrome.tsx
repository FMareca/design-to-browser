import { useEffect, useState } from "react";
import { Grid3x3, ArrowLeft, ArrowRight, RotateCw } from "lucide-react";

// The persistent Browser Chrome — a fixed frame that proves this is a browser.
// Live telemetry: the URL updates with the active stage, viewport dims track
// the real window, and a grid toggle reveals the underlying 12-col skeleton.
type BrowserChromeProps = {
  activeStage: string;
  scrollProgress: number;
  gridVisible: boolean;
  onToggleGrid: () => void;
};

export default function BrowserChrome({
  activeStage,
  scrollProgress,
  gridVisible,
  onToggleGrid,
}: BrowserChromeProps) {
  const [vp, setVp] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const update = () =>
      setVp({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b hairline bg-[var(--lab-white)]/85 backdrop-blur-[6px]">
      <div className="flex h-11 items-center gap-3 px-3 md:px-5">
        {/* traffic lights */}
        <div className="hidden items-center gap-1.5 sm:flex">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>

        {/* nav buttons */}
        <div className="hidden items-center gap-1 text-muted-foreground md:flex">
          <ArrowLeft className="h-3.5 w-3.5" />
          <ArrowRight className="h-3.5 w-3.5" />
          <RotateCw className="h-3.5 w-3.5" />
        </div>

        {/* url bar */}
        <div className="flex min-w-0 flex-1 items-center gap-2 border hairline bg-white px-3 py-1">
          <span className="font-mono-code text-[10px] text-[var(--mint)]">●</span>
          <span className="truncate font-mono-code text-[11px] text-foreground">
            do-design-ao-browser.dev
            <span className="text-muted-foreground">/#estagio-{activeStage}</span>
          </span>
        </div>

        {/* viewport telemetry */}
        <div className="hidden items-center gap-3 font-mono-code text-[10px] text-muted-foreground lg:flex">
          <span>
            {vp.w}×{vp.h}
          </span>
          <span className="text-foreground">{Math.round(scrollProgress)}%</span>
        </div>

        {/* grid toggle */}
        <button
          onClick={onToggleGrid}
          aria-label="Alternar grid de depuração"
          className={`flex items-center gap-1.5 border hairline px-2 py-1 font-mono-code text-[10px] transition-colors ${
            gridVisible
              ? "bg-foreground text-background"
              : "bg-transparent text-foreground hover:bg-muted"
          }`}
        >
          <Grid3x3 className="h-3 w-3" />
          grid
        </button>
      </div>

      {/* scroll progress hairline */}
      <div className="h-px w-full bg-border">
        <div
          className="h-px bg-[var(--function-blue)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </div>
  );
}