import { useState, type MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, RotateCcw } from "lucide-react";
import SectionFrame from "./SectionFrame";
import ScrambleText from "./ScrambleText";
import { compileUp } from "./motion";

// 03 / JAVASCRIPT — the engine. A live state machine: a counter driven by
// useState. On every increment, "data particles" fly from the code snippet
// into the component, making the flow of logic visible.
export default function JavaScriptSection() {
  const [count, setCount] = useState(0);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  const fire = (fromX: number, fromY: number) => {
    const id = Date.now() + Math.random();
    setParticles((p) => [...p, { id, x: fromX, y: fromY }]);
    setTimeout(() => {
      setParticles((p) => p.filter((pt) => pt.id !== id));
    }, 700);
  };

  const inc = (e: MouseEvent) => {
    setCount((c) => c + 1);
    fire(e.clientX, e.clientY);
  };
  const dec = (e: MouseEvent) => {
    setCount((c) => c - 1);
    fire(e.clientX, e.clientY);
  };
  const reset = () => setCount(0);

  return (
    <SectionFrame
      id="javascript"
      index={3}
      stage="javascript"
      comment="/* o motor — lógica, estado, comportamento */"
    >
      <motion.h2
        variants={compileUp}
        className="font-display text-5xl font-bold tracking-tight md:text-7xl"
      >
        <ScrambleText text="JAVASCRIPT" />
      </motion.h2>
      <motion.p
        variants={compileUp}
        className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground"
      >
        Estrutura e pintura são inertes sem lógica. O estado é o motor: um
        valor, um setter e os eventos que fluem entre eles. Pressione um botão
        e veja os dados viajarem.
      </motion.p>

      <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
        {/* code snippet */}
        <motion.div variants={compileUp} className="border hairline bg-white p-5">
          <div className="mb-3 flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
            <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
            <span className="h-2 w-2 rounded-full bg-[#28c840]" />
            <span className="ml-2 font-mono-code text-[10px] text-muted-foreground">
              state.js
            </span>
          </div>
          <pre className="overflow-x-auto whitespace-pre font-mono-code text-[13px] leading-relaxed">
            <code>
              <span className="text-[var(--function-blue)]">const</span> [count,
              setCount] ={" "}
              <span className="text-[var(--amber)]">useState</span>({" "}
              <span className="text-[var(--mint)]">0</span> );{"\n\n"}
              <span className="text-muted-foreground">{"//"} count = </span>
              <span className="text-[var(--mint)]">{count}</span>
            </code>
          </pre>
        </motion.div>

        {/* live component */}
        <motion.div
          variants={compileUp}
          className="relative flex flex-col items-center border hairline bg-white p-8"
        >
          <div className="mb-2 font-mono-code text-[10px] tracking-widest text-muted-foreground">
            &lt;Counter /&gt;
          </div>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={count}
              initial={{ opacity: 0, y: -8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="font-display text-7xl font-bold tabular-nums text-foreground"
            >
              {count}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center gap-2">
            <button
              onClick={dec}
              className="flex h-10 w-10 items-center justify-center border border-foreground bg-white transition-colors hover:bg-foreground hover:text-background"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              onClick={reset}
              className="flex h-10 items-center gap-1.5 border hairline bg-white px-3 font-mono-code text-[11px] transition-colors hover:bg-muted"
            >
              <RotateCcw className="h-3.5 w-3.5" /> zerar
            </button>
            <button
              onClick={inc}
              className="flex h-10 w-10 items-center justify-center border border-foreground bg-foreground text-background transition-colors hover:bg-[var(--function-blue)] hover:border-[var(--function-blue)]"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* data particles flying toward the number */}
          <AnimatePresence>
            {particles.map((pt) => (
              <motion.span
                key={pt.id}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: 0,
                  y: -40,
                  opacity: 0,
                  scale: 0.3,
                }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-[var(--function-blue)]"
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </SectionFrame>
  );
}