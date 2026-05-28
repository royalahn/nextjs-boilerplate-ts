export function AmbientGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute left-[-8rem] top-[-6rem] h-80 w-80 rounded-full bg-[#f7d842]/20 blur-3xl animate-[glow-drift_18s_ease-in-out_infinite]" />
      <div className="absolute right-[-5rem] top-[12rem] h-96 w-96 rounded-full bg-[#5dd8c7]/15 blur-3xl animate-[glow-drift-slower_22s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-7rem] left-[20%] h-72 w-72 rounded-full bg-[#ffe5de]/20 blur-3xl animate-[glow-drift_20s_ease-in-out_infinite]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.92),rgba(255,255,255,0.78)_55%,rgba(255,255,255,0.98)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.45)_32%,rgba(255,255,255,0.92)_100%)]" />
    </div>
  )
}
