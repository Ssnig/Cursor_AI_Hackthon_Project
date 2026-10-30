import { useState } from "react";
import type { Recipient } from "@/types";
import { playCyberBlip, playTargetLock } from "@/lib/cyberAudio";

interface TacticalRadarMapProps {
  recipients: Recipient[];
  selectedRecipientId?: string | null;
  onSelectRecipient?: (id: string) => void;
  businessName?: string;
}

export default function TacticalRadarMap({
  recipients,
  selectedRecipientId,
  onSelectRecipient,
  businessName = "ABC Bakery"
}: TacticalRadarMapProps) {
  const [hoveredNode, setHoveredNode] = useState<Recipient | null>(null);

  // Position nodes radially around the center based on distance
  const activeRecipient =
    recipients.find((r) => r.id === selectedRecipientId) ||
    hoveredNode ||
    recipients[0] ||
    null;

  return (
    <div className="hud-box p-4 flex flex-col items-center relative overflow-hidden select-none">
      {/* HUD Header */}
      <div className="w-full flex items-center justify-between border-b border-cyan-500/30 pb-2 mb-3 text-xs font-mono">
        <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
          <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
          TACTICAL RADAR // RECIPIENT GRID
        </span>
        <span className="text-emerald-400 font-mono tracking-widest text-[11px] font-bold">
          {recipients.length} TARGETS IN RANGE
        </span>
      </div>

      {/* Circular Radar Screen */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-cyan-500/40 my-2 flex items-center justify-center bg-cyan-950/20 shadow-[inset_0_0_30px_rgba(0,240,255,0.2)] overflow-hidden">
        {/* Concentric distance rings */}
        <div className="absolute w-[80%] h-[80%] rounded-full border border-cyan-500/20"></div>
        <div className="absolute w-[55%] h-[55%] rounded-full border border-cyan-500/20"></div>
        <div className="absolute w-[30%] h-[30%] rounded-full border border-cyan-500/20"></div>

        {/* Crosshair grid lines */}
        <div className="absolute inset-x-0 h-px bg-cyan-500/20"></div>
        <div className="absolute inset-y-0 w-px bg-cyan-500/20"></div>

        {/* Degrees markings */}
        <span className="absolute top-1 text-[9px] font-mono text-cyan-500/60 font-bold">000° N</span>
        <span className="absolute bottom-1 text-[9px] font-mono text-cyan-500/60 font-bold">180° S</span>
        <span className="absolute left-1 text-[9px] font-mono text-cyan-500/60 font-bold">270° W</span>
        <span className="absolute right-1 text-[9px] font-mono text-cyan-500/60 font-bold">090° E</span>

        {/* Radar Sweep Line */}
        <div
          className="absolute inset-0 origin-center pointer-events-none"
          style={{ animation: "radarSweep 5s linear infinite" }}
        >
          <div
            className="w-1/2 h-1/2 bg-gradient-to-r from-transparent via-cyan-400/20 to-cyan-400/40"
            style={{ clipPath: "polygon(100% 100%, 0 0, 100% 0)" }}
          ></div>
        </div>

        {/* Center Node (Current Business Location) */}
        <div
          className="w-3.5 h-3.5 bg-pink-500 rounded-full shadow-[0_0_12px_#ec4899] z-20 flex items-center justify-center border border-white"
          title={`Origin: ${businessName}`}
        >
          <span className="w-1 h-1 bg-white rounded-full"></span>
        </div>

        {/* Radial Recipient Nodes */}
        {recipients.map((recipient, idx) => {
          // Calculate an artificial but stable angle and radius
          const angles = [45, 210, 315, 130, 270];
          const angleDeg = angles[idx % angles.length];
          const angleRad = (angleDeg * Math.PI) / 180;
          // Scale distance (0 to 10km mapped to 20% to 45% radius)
          const radiusPct = Math.min(42, Math.max(18, 15 + recipient.distanceKm * 4.5));
          const isSelected = selectedRecipientId === recipient.id;

          const topPercent = 50 - Math.sin(angleRad) * radiusPct;
          const leftPercent = 50 + Math.cos(angleRad) * radiusPct;

          return (
            <button
              key={recipient.id}
              onClick={() => {
                playTargetLock();
                onSelectRecipient?.(recipient.id);
              }}
              onMouseEnter={() => {
                setHoveredNode(recipient);
                playCyberBlip(1100, 0.04);
              }}
              onMouseLeave={() => setHoveredNode(null)}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none"
              style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
              title={`${recipient.name} (${recipient.distanceKm}km)`}
            >
              {/* Ping Wave */}
              <span
                className={`w-4 h-4 rounded-full inline-block animate-ping absolute -inset-0.5 opacity-70 ${
                  isSelected ? "bg-pink-400" : "bg-emerald-400"
                }`}
              ></span>

              {/* Node Marker */}
              <span
                className={`w-3.5 h-3.5 rounded-full inline-block relative border border-black shadow-[0_0_10px_#10b981] transition-transform ${
                  isSelected
                    ? "bg-pink-500 scale-125 shadow-[0_0_14px_#ff0055]"
                    : "bg-emerald-400 group-hover:scale-125"
                }`}
              ></span>

              {/* Target reticle bracket if selected */}
              {isSelected && (
                <span className="absolute -inset-2 border border-pink-400/80 rounded-sm pointer-events-none animate-pulse"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Target Telemetry Bar */}
      <div className="w-full mt-2 p-2.5 bg-cyan-950/40 border border-cyan-500/30 rounded font-mono text-xs">
        {activeRecipient ? (
          <div>
            <div className="flex items-center justify-between">
              <span className="text-cyan-400 font-bold">
                LOCK: <span className="text-white">{activeRecipient.name}</span>
              </span>
              <span className="text-emerald-400 font-extrabold text-sm">
                {activeRecipient.matchScore}% FIT
              </span>
            </div>
            <div className="flex justify-between text-cyan-300/80 text-[11px] mt-1 border-t border-cyan-500/20 pt-1">
              <span>VECTOR: {activeRecipient.distanceKm} KM</span>
              <span>CAPACITY: {activeRecipient.capacity} MEALS</span>
              <span>WINDOW: {activeRecipient.pickupWindow || "IMMEDIATE"}</span>
            </div>
          </div>
        ) : (
          <p className="text-cyan-500/60 text-center">NO RECIPIENT TARGET SELECTED</p>
        )}
      </div>
    </div>
  );
}

