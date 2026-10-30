import type { LucideIcon } from "lucide-react";

export default function MetricCard({
  icon: Icon,
  label,
  value,
  helper
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="hud-box p-5 relative overflow-hidden group">
      {/* Corner brackets */}
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400 pointer-events-none"></div>

      <div className="relative z-[1] flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-widest text-cyan-400/80 uppercase">
            <span className="w-1.5 h-1.5 bg-cyan-400"></span>
            {label}
          </div>
          <p className="font-display mt-2 text-3xl sm:text-4xl font-black text-cyan-300 neon-text-glow tracking-wider">
            {value}
          </p>
          <p className="mt-2 text-[11px] font-mono leading-tight text-cyan-500/90">
            {helper}
          </p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.3)]">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {/* Subtle scanline */}
      <div className="absolute inset-0 pointer-events-none scanlines-overlay opacity-30"></div>
    </div>
  );
}
