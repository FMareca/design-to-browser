import { useEffect, useRef, useState } from "react";

// The Measurement Cursor — a crosshair with live X/Y coordinates
// in 10px monospace, following the pointer. Touch devices keep the
// native cursor and never see this overlay.
export default function CursorCrosshair() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        setPos({ x: e.clientX, y: e.clientY });
        setVisible(true);
      });
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed z-[60] font-mono-code text-[10px] leading-none text-foreground"
      style={{ left: pos.x, top: pos.y, transform: "translate(10px, 10px)" }}
    >
      {/* crosshair lines */}
      <div
        className="absolute left-0 top-0 h-3 w-px bg-foreground"
        style={{ transform: "translate(-0.5px, -12px)" }}
      />
      <div
        className="absolute left-0 top-0 h-px w-3 bg-foreground"
        style={{ transform: "translate(-12px, -0.5px)" }}
      />
      <span className="ml-3 mt-1 inline-block whitespace-nowrap text-muted-foreground">
        x:{pos.x} y:{pos.y}
      </span>
    </div>
  );
}