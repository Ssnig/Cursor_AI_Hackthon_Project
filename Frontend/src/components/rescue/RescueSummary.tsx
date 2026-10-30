import { CheckCircle2, Clock, MapPin, PackageCheck, ShieldCheck } from "lucide-react";
import type { Recipient, RescuePlan, SurplusItem } from "@/types";

interface RescueSummaryProps {
  plan: RescuePlan;
  item: SurplusItem;
  recipient: Recipient;
}

export default function RescueSummary({ plan, item, recipient }: RescueSummaryProps) {
  const isComplete = plan.status === "completed";

  return (
    <div className="hud-box p-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-cyan-500/30 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-cyan-400" />
            <h3 className="font-display text-lg font-bold text-white tracking-wider">
              AUTHORIZED RESCUE PROTOCOL [PLAN-{plan.id}]
            </h3>
          </div>
          <p className="mt-1 text-xs font-mono text-cyan-400/80">
            Validated by Backend <code>createRescue</code> engine · Allotted:{" "}
            <span className="text-emerald-400 font-bold">{plan.donationQuantity ?? item.quantity} to shelter</span>
            {plan.discountQuantity ? ` · ${plan.discountQuantity} to markdown discount` : ""}.
          </p>
        </div>

        <span
          className={`food-chip ${
            isComplete
              ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_#10b981]"
              : "bg-pink-950/80 text-pink-300 border-pink-500/50 animate-pulse"
          }`}
        >
          {isComplete ? "PROTOCOL EXECUTED" : "AWAITING COURIER LOCK"}
        </span>
      </div>

      <div className="grid gap-4 rounded bg-cyan-950/30 border border-cyan-500/30 p-5 md:grid-cols-2 text-xs font-mono">
        <div className="flex items-start gap-3">
          <PackageCheck className="mt-1 h-4 w-4 text-cyan-400 shrink-0" />
          <div>
            <p className="font-bold text-white uppercase">{item.name}</p>
            <p className="text-cyan-400/80 mt-0.5">
              {plan.donationQuantity ?? item.quantity} portions locked for courier pickup
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="mt-1 h-4 w-4 text-cyan-400 shrink-0" />
          <div>
            <p className="font-bold text-white uppercase">{recipient.name}</p>
            <p className="text-cyan-400/80 mt-0.5">
              {recipient.address || plan.pickupLocation}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="mt-1 h-4 w-4 text-cyan-400 shrink-0" />
          <div>
            <p className="font-bold text-white uppercase">
              COURIER WINDOW: {plan.pickupTime || "IMMEDIATE"}
            </p>
            <p className="text-cyan-400/80 mt-0.5">
              Available until {plan.availableUntil || item.availableUntil}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-1 h-4 w-4 text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold text-white uppercase">RESCUE DISPATCH DIRECTIVE</p>
            <p className="text-cyan-400/80 mt-0.5">
              {plan.notes || "Driver dispatched. Present courier verification code upon depot arrival."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
