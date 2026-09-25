import { useState } from "react";
import { motion } from "framer-motion";
import SectionFrame from "./SectionFrame";
import ScrambleText from "./ScrambleText";
import { compileUp } from "./motion";

// 04 / REACT — composition. Components all the way down. A clickable tree
// of <App> → branches, each node a small rendered unit, showing how JSX
// composes the page from reusable pieces.
type TreeNode = {
  name: string;
  leaf?: boolean;
  children?: TreeNode[];
};

const tree: TreeNode = {
  name: "<App>",
  children: [
    {
      name: "<Header>",
      children: [{ name: "<Logo />" }, { name: "<Nav />" }],
    },
    {
      name: "<Main>",
      children: [
        { name: "<Hero />" },
        { name: "<Card />", leaf: true },
        { name: "<Card />", leaf: true },
      ],
    },
    { name: "<Footer />", leaf: true },
  ],
};

type NodeProps = {
  node: TreeNode;
  depth?: number;
  active: string;
  setActive: (name: string) => void;
};

function Node({ node, depth = 0, active, setActive }: NodeProps) {
  const isActive = active === node.name;
  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => setActive(node.name)}
        style={{ marginLeft: depth * 18 }}
        className={`self-start border px-2.5 py-1 font-mono-code text-[11px] transition-colors ${
          isActive
            ? "border-[var(--function-blue)] bg-[var(--function-blue)] text-white"
            : "border-foreground bg-white text-foreground hover:bg-muted"
        }`}
      >
        {node.name}
      </button>
      {node.children && (
        <div className="flex flex-col gap-2 border-l hairline pl-3">
          {node.children.map((c, i) => (
            <Node key={i} node={c} depth={depth + 1} active={active} setActive={setActive} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReactSection() {
  const [active, setActive] = useState("<App>");

  return (
    <SectionFrame
      id="react"
      index={4}
      stage="react"
      comment="/* composição — componentes até o fim */"
    >
      <motion.h2
        variants={compileUp}
        className="font-display text-5xl font-bold tracking-tight md:text-7xl"
      >
        <ScrambleText text="REACT" />
      </motion.h2>
      <motion.p
        variants={compileUp}
        className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground"
      >
        Uma página é uma árvore. O React permite construí-la de peças pequenas
        e reutilizáveis que se compõem num todo. Clique num nó para rastreá-lo.
      </motion.p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <motion.div variants={compileUp} className="border hairline bg-white p-6">
          <div className="mb-4 font-mono-code text-[10px] tracking-widest text-muted-foreground">
            ÁRVORE DE COMPONENTES
          </div>
          <Node node={tree} active={active} setActive={setActive} />
        </motion.div>

        <motion.div variants={compileUp} className="flex flex-col gap-4">
          <div className="border hairline bg-white p-5">
            <div className="mb-2 font-mono-code text-[10px] tracking-widest text-muted-foreground">
              JSX
            </div>
            <pre className="overflow-x-auto whitespace-pre font-mono-code text-[12px] leading-relaxed">
              <code>
                <span className="text-[var(--function-blue)]">function</span>{" "}
                App() {"{"}
                {"\n"}  <span className="text-[var(--amber)]">return</span> ({"\n"}
                {"    <"}<span className="text-[var(--mint)]">div</span>{">"}
                {"\n"}      &lt;Header /&gt;{"\n"}      &lt;Main /&gt;{"\n"}
                {"      <"}<span className="text-[var(--mint)]">Footer</span>{" />"}
                {"\n"}    &lt;/div&gt;{"\n"}  );{"\n"}
                {"}"}
              </code>
            </pre>
          </div>
          <div className="border hairline bg-white p-5">
            <div className="mb-2 font-mono-code text-[10px] tracking-widest text-muted-foreground">
              NÓ ATIVO
            </div>
            <div className="font-mono-code text-[13px] text-foreground">
              {active}
            </div>
            <div className="mt-1 font-mono-code text-[10px] text-muted-foreground">
              {active === "<App>"
                ? "raiz — sustenta a árvore inteira"
                : active.includes("Card")
                ? "reusado duas vezes — um componente, duas instâncias"
                : "ramo — compõe unidades menores"}
            </div>
          </div>
        </motion.div>
      </div>
    </SectionFrame>
  );
}