import { useRef, useState, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { Move } from "lucide-react";
import SectionFrame from "./SectionFrame";
import ScrambleText from "./ScrambleText";
import { compileUp } from "./motion";

// 06 / INTERACTION — the interface responds. Three small toys, each
// wired to a real event handler: a magnetic button, a hover-swap label,
// and a draggable chip. The handler code is shown beside each.
function MagneticButton() {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMove = (e: MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setOffset({
      x: (e.clientX - (r.left + r.width / 2)) * 0.3,
      y: (e.clientY - (r.top + r.height / 2)) * 0.3,
    });
  };
  const reset = () => setOffset({ x: 0, y: 0 });

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        className="flex h-28 items-center justify-center border hairline bg-white"
      >
        <motion.button
          animate={{ x: offset.x, y: offset.y }}
          transition={{ type: "spring", stiffness: 250, damping: 15 }}
          className="border border-foreground bg-foreground px-5 py-2.5 font-mono-code text-[12px] text-background"
        >
          passe o mouse
        </motion.button>
      </div>
      <pre className="font-mono-code text-[10px] leading-relaxed text-muted-foreground">
        <code>onMouseMove → translate(x,y)</code>
      </pre>
    </div>
  );
}

function HoverSwap() {
  const [on, setOn] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <div
        onMouseEnter={() => setOn(true)}
        onMouseLeave={() => setOn(false)}
        className="flex h-28 items-center justify-center border hairline bg-white"
      >
        <motion.span
          animate={{ opacity: on ? 0 : 1, y: on ? -10 : 0 }}
          className="absolute font-display text-2xl font-bold"
        >
          mouse
        </motion.span>
        <motion.span
          animate={{ opacity: on ? 1 : 0, y: on ? 0 : 10 }}
          className="absolute font-display text-2xl font-bold text-[var(--function-blue)]"
        >
          troca
        </motion.span>
      </div>
      <pre className="font-mono-code text-[10px] leading-relaxed text-muted-foreground">
        <code>onMouseEnter → swap state</code>
      </pre>
    </div>
  );
}

function DraggableChip() {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex h-28 items-center justify-center overflow-hidden border hairline bg-white">
        <motion.div
          drag
          dragMomentum={false}
          whileDrag={{ scale: 1.1 }}
          className="flex cursor-grab items-center gap-1.5 border border-foreground bg-white px-3 py-2 font-mono-code text-[11px] active:cursor-grabbing"
        >
          <Move className="h-3 w-3" /> arraste-me
        </motion.div>
      </div>
      <pre className="font-mono-code text-[10px] leading-relaxed text-muted-foreground">
        <code>{"<motion.div drag />"}</code>
      </pre>
    </div>
  );
}

export default function InteractionSection() {
  return (
    <SectionFrame
      id="interaction"
      index={6}
      stage="interaction"
      comment="/* a interface responde */"
    >
      <motion.h2
        variants={compileUp}
        className="font-display text-5xl font-bold tracking-tight md:text-7xl"
      >
        <ScrambleText text="INTERACTION" />
      </motion.h2>
      <motion.p
        variants={compileUp}
        className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground"
      >
        Eventos são a ponte entre uma pessoa e a página. Cada gesto mapeia para
        um handler — experimente cada um.
      </motion.p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <motion.div variants={compileUp}>
          <MagneticButton />
        </motion.div>
        <motion.div variants={compileUp}>
          <HoverSwap />
        </motion.div>
        <motion.div variants={compileUp}>
          <DraggableChip />
        </motion.div>
      </div>
    </SectionFrame>
  );
}