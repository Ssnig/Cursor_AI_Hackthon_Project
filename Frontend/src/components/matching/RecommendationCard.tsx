import { AlertTriangle, Sparkles, Zap } from "lucide-react";
import type { Recommendation } from "@/types";

export default function RecommendationCard({
  recommendation
}: {
  recommendation: Recommendation;
}) {
  const isCritical = recommendation.urgency === "critical" || recommendation.urgency === "high";

  return (
    <div className="hud-box p-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-cyan-500/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-cyan-400" />
            <h3 className="font-display text-lg font-bold text-white tracking-wider">
              QUANTUM MITIGATION SPLIT
            </h3>
          </div>
          <p className="mt-2 text-xs font-mono text-cyan-400/80 leading-relaxed">
            {recommendation.reason}
          </p>
          <div className="mt-2 flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase">
            <span className="text-cyan-500/70">OPTIMAL PROTOCOL:</span>
            <span className="text-emerald-400 font-extrabold">{recommendation.action}</span>
          </div>
        </div>

        <div className="shrink-0">
          <span
            className={`food-chip ${
              isCritical
                ? "bg-pink-950/80 text-pink-300 border-pink-500/50 shadow-[0_0_10px_#ff0055]"
                : "bg-cyan-950/80 text-cyan-300 border-cyan-500/50"
            }`}
          >
            {isCritical && <AlertTriangle className="h-3 w-3 text-pink-400 animate-bounce" />}
            {recommendation.urgency.toUpperCase()} URGENCY
          </span>
        </div>
      </div>

      {/* Split Energy Gauges */}
      <div className="grid gap-4 sm:grid-cols-2 mt-5">
        {/* Left: Community Donation Vector */}
        <div className="hud-box p-4 bg-cyan-950/30 border-cyan-500/40 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              COMMUNITY DONATION VECTOR
            </span>
            <span className="text-[10px] text-cyan-500/70 font-mono">100% RECOVERY</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="font-display text-4xl font-black text-emerald-300 neon-text-green">
              {recommendation.donationQuantity}
            </p>
            <span className="text-xs font-mono text-cyan-400/80 uppercase">Units to Shelters</span>
          </div>
          <div className="w-full bg-cyan-950 h-2 mt-3 rounded-none overflow-hidden border border-emerald-500/30">
            <div
              className="bg-emerald-400 h-full shadow-[0_0_8px_#10b981]"
              style={{
                width: `${
                  (recommendation.donationQuantity /
                    (recommendation.donationQuantity + recommendation.discountQuantity || 1)) *
                  100
                }%`
              }}
            ></div>
          </div>
        </div>

        {/* Right: Markdown Discount Vector */}
        <div className="hud-box p-4 bg-amber-950/20 border-amber-500/40 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
              <Zap className="h-3 w-3" />
              MARKETPLACE DISCOUNT VECTOR
            </span>
            <span className="text-[10px] text-amber-500/70 font-mono">COST RECOVERY</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="font-display text-4xl font-black text-amber-300 shadow-[0_0_10px_#f59e0b]">
              {recommendation.discountQuantity}
            </p>
            <span className="text-xs font-mono text-amber-300/80 uppercase">Units to Flash Sale</span>
          </div>
          <div className="w-full bg-amber-950 h-2 mt-3 rounded-none overflow-hidden border border-amber-500/30">
            <div
              className="bg-amber-400 h-full shadow-[0_0_8px_#f59e0b]"
              style={{
                width: `${
                  (recommendation.discountQuantity /
                    (recommendation.donationQuantity + recommendation.discountQuantity || 1)) *
                  100
                }%`
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
