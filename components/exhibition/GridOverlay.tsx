// The Debug Grid — a visible 12-column skeleton overlaid on the whole
// page when toggled. Hairline rules, no interaction, pure proof that
// the layout is mathematically placed.
export default function GridOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-40 mx-auto max-w-[1400px] px-5 md:px-10">
      <div className="grid h-full grid-cols-2 gap-0 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="border-l border-r border-[var(--function-blue)]/15"
          >
            <span className="block pt-12 text-center font-mono-code text-[8px] text-[var(--function-blue)]/40">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}