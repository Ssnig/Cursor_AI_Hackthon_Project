import { Clock, MapPin, Package, ShieldAlert } from "lucide-react";
import type { SurplusItem } from "@/types";

function statusLabel(status: string): string {
  if (status === "pending") return "RESCUE PENDING";
  if (status === "confirmed rescue") return "ALLOCATION LOCKED";
  if (status === "rescued") return "RESCUED // COMPLETED";
  if (status === "expired") return "BIO-DECAY EXPIRED";
  return status.toUpperCase();
}

function categoryBadge(category: string): { symbol: string; label: string } {
  const key = category.toLowerCase();
  if (key.includes("bakery")) return { symbol: "🥖", label: "HYDRO-BAKERY" };
  if (key.includes("produce")) return { symbol: "🥗", label: "SYNTH-PRODUCE" };
  if (key.includes("dairy")) return { symbol: "🧀", label: "BIO-DAIRY" };
  if (key.includes("packaged") || key.includes("pantry")) return { symbol: "📦", label: "DRY RESERVES" };
  return { symbol: "🥪", label: "PREPARED FOOD" };
}

export default function SurplusCard({ item }: { item: SurplusItem }) {
  const pending = item.status === "pending";
  const badge = categoryBadge(item.category);

  return (
    <div
      className={`hud-box p-5 text-left relative transition-all ${
        pending ? "border-cyan-400 shadow-cyan-glow" : "border-cyan-500/30"
      }`}
    >
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded bg-cyan-950/80 border border-cyan-400/40 text-xl shadow-[0_0_10px_rgba(0,240,255,0.3)]">
            {badge.symbol}
          </span>
          <div>
            <p className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
              {badge.label}
            </p>
            <p className="text-sm font-mono font-black text-white">{item.quantity} UNITS</p>
          </div>
        </div>

        <span
          className={`food-chip ${
            pending
              ? "bg-amber-950/80 text-amber-300 border-amber-500/50 animate-pulse"
              : "bg-emerald-950/80 text-emerald-300 border-emerald-500/50"
          }`}
        >
          {statusLabel(item.status)}
        </span>
      </div>

      <div>
        <h4 className="font-display text-base font-bold text-white tracking-wide">{item.name}</h4>
        <p className="mt-0.5 text-[11px] font-mono text-cyan-400/70">{item.category}</p>
      </div>

      <div className="mt-4 grid gap-2 text-xs font-mono text-cyan-400/80 border-t border-cyan-500/20 pt-3">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-pink-400" />
          CUTOFF WINDOW: <span className="text-pink-400 font-bold">{item.availableUntil}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-cyan-400" />
          DISPATCH DEPOT: <span className="text-white">{item.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Package className="h-3.5 w-3.5 text-cyan-400" />
          BUFFER ALLOCATION: <span className="text-emerald-400 font-bold">{item.quantity} PORTIONS</span>
        </div>
      </div>
    </div>
  );
}
