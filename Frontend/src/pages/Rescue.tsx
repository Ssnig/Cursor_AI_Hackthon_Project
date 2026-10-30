import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Radio, ShieldCheck } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import RescueSummary from "@/components/rescue/RescueSummary";
import FoodHologram from "@/components/cyber/FoodHologram";
import { Button } from "@/components/ui/button";
import { useFoodLoop } from "@/context/FoodLoopContext";
import { playCyberBlip, playProtocolEngaged } from "@/lib/cyberAudio";

export default function Rescue() {
  const {
    activePlan,
    items,
    recipients,
    completeActiveRescue,
    n8n,
    error
  } = useFoodLoop();

  if (!activePlan) {
    return (
      <div className="grid gap-8">
        <PageHeader
          eyebrow="RESCUE PROTOCOL EXECUTION"
          title="NO RESCUE PLAN ARMED"
          description="Engage target coordinates on the Tactical Radar page to lock a courier plan."
          action={
            <Button
              asChild
              className="hud-btn bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs"
            >
              <Link to="/matching">GO TO TACTICAL RADAR</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const item = items.find((surplusItem) => surplusItem.id === activePlan.surplusItemId);
  const recipient =
    recipients.find((partner) => partner.id === activePlan.recipientId) || {
      id: activePlan.recipientId,
      name: activePlan.recipientName || "Recipient Node",
      distanceKm: 0,
      capacity: activePlan.donationQuantity || 0,
      matchScore: 0,
      address: activePlan.pickupLocation || "",
      pickupWindow: `Until ${activePlan.availableUntil || "cutoff"}`
    };

  if (!item) {
    return null;
  }

  const handleComplete = () => {
    playProtocolEngaged();
    completeActiveRescue();
  };

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="MISSION EXECUTION TERMINAL"
        title="CONFIRM COURIER DISPATCH PROTOCOL"
        description={`Active Protocol: PLAN-${activePlan.id} · Relay status: ${n8n.lastStatus}${
          n8n.lastMessage ? ` (${n8n.lastMessage})` : ""
        }`}
        action={
          <div className="flex flex-wrap gap-2">
            {activePlan.status === "planned" ? (
              <Button
                type="button"
                className="hud-btn bg-pink-600 hover:bg-pink-500 text-white font-mono font-black text-xs uppercase px-6 py-6 shadow-magenta-glow"
                onClick={handleComplete}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                EXECUTE RESCUE & RECORD IMPACT ⚡
              </Button>
            ) : (
              <Button
                asChild
                className="hud-btn bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-black text-xs uppercase py-3 shadow-green-glow"
                onClick={() => playCyberBlip(1200, 0.05)}
              >
                <Link to="/impact">
                  VIEW TELEMETRY IMPACT
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            )}
          </div>
        }
      />

      {error ? (
        <div className="hud-box-danger p-4 text-xs font-mono text-pink-300">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <RescueSummary plan={activePlan} item={item} recipient={recipient} />

        {/* 3D Hologram of Rescued Lot */}
        <div>
          <div className="flex items-center justify-between mb-2 font-mono text-xs text-cyan-400">
            <span className="font-bold flex items-center gap-1.5">
              <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
              LOCKED BIOMASS PAYLOAD
            </span>
            <span className="text-emerald-400 font-bold">STATUS: CONFIRMED</span>
          </div>
          <FoodHologram
            itemName={item.name}
            category={item.category}
            quantity={activePlan.donationQuantity ?? item.quantity}
            availableUntil={item.availableUntil}
            allowModelSwitch={false}
            size={200}
          />
        </div>
      </div>
    </div>
  );
}
