/**
 * Site-wide animated gradient backdrop. Purely decorative: it stays fixed
 * behind the application shell and never captures pointer input.
 */
export function GradientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ backgroundColor: "var(--app-bg)" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(37,99,235,0.18),transparent_38%),radial-gradient(circle_at_85%_5%,rgba(96,165,250,0.12),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(14,116,144,0.14),transparent_45%)]" />

      <div
        className="animate-gradient-drift absolute -top-40 -left-32 h-[36rem] w-[36rem] rounded-full blur-[90px] motion-reduce:animate-none"
        style={{ backgroundColor: "var(--app-orb-blue)" }}
      />
      <div
        className="animate-gradient-drift-reverse absolute top-1/4 -right-48 h-[42rem] w-[42rem] rounded-full blur-[100px] motion-reduce:animate-none"
        style={{ backgroundColor: "var(--app-orb-violet)" }}
      />
      <div
        className="animate-gradient-drift-slow absolute -bottom-56 left-1/3 h-[38rem] w-[38rem] rounded-full blur-[95px] motion-reduce:animate-none"
        style={{ backgroundColor: "var(--app-orb-cyan)" }}
      />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg, var(--app-overlay-start), var(--app-overlay-mid) 55%, var(--app-overlay-end))",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(var(--app-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--app-grid-line) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(circle at 50% 30%, black, transparent 72%)",
        }}
      />
    </div>
  );
}
