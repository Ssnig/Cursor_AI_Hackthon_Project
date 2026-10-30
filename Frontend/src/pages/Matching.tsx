import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Crosshair, RefreshCw } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import RecommendationCard from "@/components/matching/RecommendationCard";
import RecipientCard from "@/components/matching/RecipientCard";
import TacticalRadarMap from "@/components/cyber/TacticalRadarMap";
import { Button } from "@/components/ui/button";
import { useFoodLoop } from "@/context/FoodLoopContext";
import { playCyberBlip, playTargetLock } from "@/lib/cyberAudio";

export default function Matching() {
  const navigate = useNavigate();
  const {
    selectedItem,
    recommendation,
    recipients,
    selectRecipient,
    refreshRecipients,
    business,
    error
  } = useFoodLoop();

  const [activeRecipientId, setActiveRecipientId] = useState<string | null>(
    recipients[0]?.id || null
  );

  const handleSelect = (recipientId: string) => {
    playTargetLock();
    selectRecipient(recipientId);
    navigate("/rescue");
  };

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="TACTICAL RADAR DISPATCH"
        title="RECIPIENT RADAR COORDINATES & CAPACITY"
        description={
          selectedItem
            ? `Active targeting for ${selectedItem.name} (${selectedItem.quantity} portions) via Backend findNearbyRecipients engine.`
            : "Select a surplus biomass lot first to calculate vectors."
        }
        action={
          <Button
            type="button"
            className="hud-btn bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-xs font-mono"
            onClick={() => {
              playCyberBlip(1400, 0.05);
              refreshRecipients();
            }}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-2" />
            RE-SWEEP RADAR
          </Button>
        }
      />

      {error ? (
        <div className="hud-box-danger p-4 text-xs font-mono text-pink-300">
          {error}
        </div>
      ) : null}

      {/* Interactive Tactical Radar Sweep Display */}
      <section>
        <div className="flex items-center justify-between mb-2 font-mono text-xs text-cyan-400">
          <span className="font-bold flex items-center gap-2">
            <Crosshair className="h-4 w-4 text-pink-500 animate-spin" />
            SECTOR 07 RADAR SWEEP // CLICK A NODE TO ENGAGE TARGET
          </span>
          <span className="text-emerald-400 font-bold">
            RADAR STATUS: ACTIVE
          </span>
        </div>
        <TacticalRadarMap
          recipients={recipients}
          selectedRecipientId={activeRecipientId}
          onSelectRecipient={(id) => {
            setActiveRecipientId(id);
          }}
          businessName={business?.name || "ABC Bakery"}
        />
      </section>

      {recommendation ? <RecommendationCard recommendation={recommendation} /> : null}

      {/* Recipient Target Cards */}
      <section className="grid gap-4">
        <div className="text-xs font-mono tracking-widest text-cyan-400/80 font-bold uppercase">
          IDENTIFIED RESCUE TARGETS ({recipients.length})
        </div>
        {recipients.map((recipient, index) => (
          <RecipientCard
            key={recipient.id}
            recipient={recipient}
            featured={index === 0 || recipient.id === activeRecipientId}
            onSelect={() => handleSelect(recipient.id)}
          />
        ))}
        {recipients.length === 0 ? (
          <div className="hud-box p-6 text-center text-xs font-mono text-cyan-500/70">
            NO COMPATIBLE TARGET NODES FOUND. LOG SURPLUS OR RE-SWEEP RADAR.
          </div>
        ) : null}
      </section>
    </div>
  );
}
