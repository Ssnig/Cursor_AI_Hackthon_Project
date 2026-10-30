import { CheckCircle2, ShieldCheck } from "lucide-react";
import type { RescuePlan, SurplusItem } from "@/types";

export default function ImpactTimeline({
  plans,
  items
}: {
  plans: RescuePlan[];
  items: SurplusItem[];
}) {
  const milestones =
    plans.length === 0
      ? [
          "Initialize biomass lot in the BIO-INTAKE console",
          "Analyze quantum recommendation & engage target on Tactical Radar",
          "Lock courier dispatch — allocation status shifts to confirmed rescue",
          "Execute mission protocol to update planetary recovery telemetry"
        ]
      : plans.flatMap((plan) => {
          const item = items.find((entry) => entry.id === plan.surplusItemId);
          const name = item?.name || plan.foodName || "Surplus batch";
          return [
            `${name} targeted to ${plan.recipientName || "Recipient Node"} [STATUS: ${plan.status.toUpperCase()}]`,
            plan.status === "completed"
              ? `Protocol ${plan.id} completed — biomass recovery recorded on ledger`
              : `Protocol ${plan.id} staged — awaiting courier execution`
          ];
        });

  return (
    <div className="hud-box p-6 relative">
      <div className="border-b border-cyan-500/30 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-cyan-400" />
          <h3 className="font-display text-lg font-bold text-white tracking-wider">
            MISSION AUDIT TRAIL // RECOVERY LEDGER
          </h3>
        </div>
        <p className="mt-1 text-xs font-mono text-cyan-400/80">
          Immutable event log generated directly from Backend rescue plans.
        </p>
      </div>

      <div className="grid gap-4">
        {milestones.map((milestone, idx) => (
          <div key={`${milestone}-${idx}`} className="flex items-start gap-3 text-xs font-mono">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-cyan-950 border border-cyan-400/50 text-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.4)]">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="pt-0.5">
              <p className="font-bold text-white tracking-wide">{milestone}</p>
              <span className="text-[10px] text-cyan-500/70 font-mono">
                EVENT-ID: 0x{((idx + 1) * 9841).toString(16).toUpperCase()} // VERIFIED
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
