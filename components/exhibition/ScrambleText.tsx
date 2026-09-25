import { memo, useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

// A title that "decodes" itself when it scrolls into view — random glyphs
// resolve into the real word, like source code compiling into a label.
// Memoized so parent re-renders never touch the text GSAP is driving.
function ScrambleText({
  text,
  chars = "01<>/{}[];=+*",
}: {
  text: string;
  chars?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.to(ref.current, {
          duration: 1.2,
          ease: "none",
          scrambleText: { text, chars, revealDelay: 0.35, speed: 0.6 },
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play none none reset",
          },
        });
      });
    },
    { scope: ref }
  );

  return <span ref={ref}>{text}</span>;
}

export default memo(ScrambleText);
