import { useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { stagger, drawLine, viewportOnce } from "./motion";

// The shared frame around every narrative stage:
// a hairline top rule, a stage index, a CSS-comment label,
// and a staggered "compilation" reveal of its children.
// Behind it all, a giant outlined stage number drifts at its own
// scroll speed (GSAP parallax) to give the page depth.
type SectionFrameProps = {
  id: string;
  // a number renders as "01"; a string (e.g. "</>") is shown as-is
  index: number | string;
  stage: string;
  comment: string;
  children: ReactNode;
  className?: string;
};

export default function SectionFrame({
  id,
  index,
  stage,
  comment,
  children,
  className = "",
}: SectionFrameProps) {
  const section = useRef<HTMLElement>(null);
  const label = typeof index === "number" ? String(index).padStart(2, "0") : index;
  const bigIndex = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          bigIndex.current,
          { yPercent: 40, rotate: -4 },
          {
            yPercent: -40,
            rotate: 4,
            ease: "none",
            scrollTrigger: {
              trigger: section.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    },
    { scope: section }
  );

  return (
    <section
      id={id}
      ref={section}
      className={`relative min-h-screen w-full overflow-hidden border-t hairline px-5 py-20 md:px-10 md:py-28 ${className}`}
    >
      {/* parallax stage number */}
      <div
        ref={bigIndex}
        aria-hidden
        className="text-stroke-thin pointer-events-none absolute right-2 top-24 select-none font-display text-[38vw] font-bold leading-none tracking-tighter opacity-[0.07] md:right-8 md:text-[22vw]"
      >
        {label}
      </div>

      {/* stage rail */}
      <div className="pointer-events-none absolute left-0 top-0 flex h-10 items-center gap-3 pl-5 md:pl-10">
        <span className="font-mono-code text-[10px] tracking-widest text-muted-foreground">
          {label}
        </span>
        <span className="font-mono-code text-[10px] tracking-widest text-foreground">
          / {stage.toUpperCase()}
        </span>
      </div>

      {/* CSS comment label, right rail */}
      <div className="pointer-events-none absolute right-0 top-0 flex h-10 items-center pr-5 md:pr-10">
        <span className="font-mono-code text-[10px] tracking-tight text-muted-foreground/70">
          {comment}
        </span>
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="relative mx-auto w-full max-w-6xl"
      >
        {/* hairline that "draws" across on enter */}
        <motion.div
          variants={drawLine}
          className="mb-10 h-px w-full origin-left bg-border md:mb-14"
        />
        {children}
      </motion.div>
    </section>
  );
}
