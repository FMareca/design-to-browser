import { memo, useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from "@/lib/gsap";

// An endless ticker band that listens to scroll velocity: scroll faster and
// it accelerates and skews, scroll up and it flips direction.
function VelocityMarquee({
  items,
  reverse = false,
}: {
  items: string[];
  reverse?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const base = reverse ? -1 : 1;
        // the track holds two identical copies, so -50% is a seamless loop
        const loop = gsap.to(track.current, {
          xPercent: -50,
          duration: 28,
          ease: "none",
          repeat: -1,
        });
        // start deep into the repeat so a negative timeScale can run backwards
        loop.totalTime(loop.duration() * 100);
        loop.timeScale(base);

        const skewTo = gsap.quickTo(track.current, "skewX", {
          duration: 0.5,
          ease: "power3",
        });
        let idle: ReturnType<typeof setTimeout>;

        const onUpdate = contextSafe!((self: ScrollTrigger) => {
          const v = self.getVelocity();
          const boost = 1 + Math.min(Math.abs(v) / 250, 7);
          const dir = self.direction * base;
          gsap.to(loop, { timeScale: boost * dir, duration: 0.2, overwrite: true });
          skewTo(gsap.utils.clamp(-14, 14, v / -120));

          clearTimeout(idle);
          idle = setTimeout(() => {
            gsap.to(loop, { timeScale: dir, duration: 1.2, overwrite: true });
            skewTo(0);
          }, 120);
        });

        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate,
        });

        return () => clearTimeout(idle);
      });
    },
    { scope: root }
  );

  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((word, i) => (
        <span key={i} className="flex items-center">
          <span
            className={`px-6 font-display text-6xl font-bold tracking-tight md:text-8xl ${
              i % 2 ? "text-stroke-light" : "text-white"
            }`}
          >
            {word}
          </span>
          <span className="text-3xl text-[var(--function-blue)] md:text-5xl">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      ref={root}
      className="relative overflow-hidden border-y border-white/10 bg-[var(--obsidian)] py-6 md:py-8"
    >
      <div ref={track} className="flex w-max will-change-transform">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

export default memo(VelocityMarquee);
