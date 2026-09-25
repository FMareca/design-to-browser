import { memo, useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

// A JORNADA — the whole pipeline as a pinned horizontal track. Vertical
// scroll is converted into horizontal travel (ScrollTrigger pin + scrub),
// and each card reacts to its own position inside that horizontal motion.
const steps = [
  { n: "00", title: "DESIGN", tag: "figma · grid · tipografia", desc: "A ideia ganha forma: hierarquia, ritmo, cor. Tudo antes da primeira linha de código." },
  { n: "01", title: "HTML", tag: "<estrutura />", desc: "O esqueleto semântico. Cada tag diz o que a coisa é — título, lista, link, botão." },
  { n: "02", title: "CSS", tag: "cor · caixa · layout", desc: "O verniz. Grid, flexbox, tipografia e cor transformam estrutura em identidade." },
  { n: "03", title: "JAVASCRIPT", tag: "estado · eventos", desc: "O motor. Lógica e estado fazem a página reagir a quem está do outro lado." },
  { n: "04", title: "REACT", tag: "componentes", desc: "Composição. Peças pequenas e reutilizáveis que se encaixam numa interface inteira." },
  { n: "05", title: "RESPONSIVE", tag: "mobile → desktop", desc: "Um código, todas as telas. O layout reflui do celular ao monitor ultrawide." },
  { n: "06", title: "INTERACTION", tag: "hover · drag · click", desc: "Gestos viram handlers. A interface responde ao toque, ao mouse, ao teclado." },
  { n: "07", title: "MOTION", tag: "gsap · scroll · svg", desc: "O lado criativo. Movimento conta histórias, guia o olhar e dá personalidade." },
  { n: "08", title: "BROWSER", tag: "pixels na tela", desc: "Tudo compila aqui. DOM, pintura, composição — e a interface ganha vida." },
];

const accents = ["var(--function-blue)", "var(--amber)", "var(--mint)"];

function JourneySection() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // desktop only: on touch/small screens the track is a native swipe row
      mm.add(`(min-width: 768px) and ${MOTION_OK}`, () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;

        const scroll = gsap.to(el, {
          x: () => -distance(),
          ease: "none", // required for containerAnimation to map 1:1
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.set(bar.current, { scaleX: self.progress });
              const i = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
              if (counter.current) counter.current.textContent = steps[i].n;
            },
          },
        });

        gsap.utils.toArray<HTMLElement>(".journey-card").forEach((card) => {
          // big number slides up and the card tilts in as it enters from the right
          gsap.fromTo(
            card.querySelector(".journey-num"),
            { yPercent: 70, opacity: 0.15 },
            {
              yPercent: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: scroll,
                start: "left right",
                end: "left 45%",
                scrub: true,
              },
            }
          );
          gsap.fromTo(
            card,
            { rotateY: -18, scale: 0.92 },
            {
              rotateY: 0,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: scroll,
                start: "left right",
                end: "left 60%",
                scrub: true,
              },
            }
          );
          gsap.fromTo(
            card.querySelector(".journey-line"),
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: scroll,
                start: "left 80%",
                end: "left 30%",
                scrub: true,
              },
            }
          );
        });
      });
    },
    { scope: section }
  );

  return (
    <section
      id="jornada"
      ref={section}
      className="relative flex w-full flex-col justify-center overflow-hidden border-t hairline bg-[var(--lab-white)] py-20 md:h-screen md:py-0"
    >
      <div className="mb-8 flex items-end justify-between gap-6 px-5 md:mb-12 md:px-10">
        <div>
          <div className="mb-2 font-mono-code text-[10px] tracking-widest text-muted-foreground">
            MAPA / A JORNADA
          </div>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
            Do pixel ao <span className="text-[var(--function-blue)]">produto</span>
          </h2>
        </div>
        <div className="hidden text-right font-mono-code text-[11px] text-muted-foreground md:block">
          <div>
            estágio <span ref={counter} className="text-foreground">00</span> / 08
          </div>
          <div className="mt-1">role ↓ para atravessar →</div>
        </div>
      </div>

      <div className="no-scrollbar overflow-x-auto md:overflow-visible" style={{ perspective: 1200 }}>
        <div ref={track} className="flex w-max gap-5 px-5 md:gap-8 md:px-10">
          {steps.map((s, i) => (
            <article
              key={s.n}
              className="journey-card relative flex h-[380px] w-[78vw] shrink-0 flex-col justify-between overflow-hidden border hairline bg-white p-6 will-change-transform md:h-[58vh] md:w-[38vw] lg:w-[30vw]"
            >
              <div className="flex items-start justify-between font-mono-code text-[10px] tracking-widest text-muted-foreground">
                <span>{s.tag}</span>
                <span style={{ color: accents[i % 3] }}>●</span>
              </div>
              <div className="overflow-hidden">
                <div
                  className="journey-num font-display text-[120px] font-bold leading-none tracking-tighter md:text-[160px]"
                  style={{ color: accents[i % 3] }}
                >
                  {s.n}
                </div>
              </div>
              <div>
                <div
                  className="journey-line mb-4 h-px w-full origin-left"
                  style={{ background: accents[i % 3] }}
                />
                <h3 className="font-display text-3xl font-bold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* horizontal progress */}
      <div className="mx-5 mt-8 hidden h-px bg-border md:mx-10 md:block">
        <div ref={bar} className="h-px origin-left bg-[var(--function-blue)]"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </section>
  );
}

export default memo(JourneySection);
