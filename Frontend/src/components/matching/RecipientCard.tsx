import { Clock, Crosshair, MapPin, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Recipient } from "@/types";
import { playCyberBlip, playTargetLock } from "@/lib/cyberAudio";

interface RecipientCardProps {
  recipient: Recipient;
  featured?: boolean;
  onSelect?: () => void;
}

export default function RecipientCard({
  recipient,
  featured = false,
  onSelect
}: RecipientCardProps) {
  return (
    <div
      className={`hud-box p-5 transition-all duration-200 relative ${
        featured
          ? "border-cyan-400 shadow-cyan-glow bg-cyan-950/20"
          : "border-cyan-500/30 hover:border-cyan-400/60"
      }`}
    >
      {/* Corner target reticles */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400 pointer-events-none"></div>

      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-wide">
              {recipient.name}
            </h3>
            {featured ? (
              <span className="food-chip text-emerald-400 border-emerald-500/50 bg-emerald-950/80">
                <ShieldCheck className="h-3 w-3" />
                OPTIMAL TARGET VECTOR
              </span>
            ) : null}
          </div>

          <div className="mt-4 grid gap-2 text-xs font-mono text-cyan-400/80">
            <span className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              VECTOR: <span className="text-white font-bold">{recipient.distanceKm} KM</span> at {recipient.address}
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              CAPACITY RATING: <span className="text-emerald-400 font-bold">{recipient.capacity} MEALS</span>
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              DISPATCH WINDOW: <span className="text-pink-400 font-bold">{recipient.pickupWindow || "IMMEDIATE"}</span>
            </span>
          </div>
        </div>

        {/* Right side: Match Reticle & Lock Button */}
        <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
          <div className="text-right">
            <p className="font-display text-3xl font-black tracking-wider text-cyan-300 neon-text-glow">
              {recipient.matchScore}%
            </p>
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-500/70">
              RADAR FIT COEFFICIENT
            </p>
          </div>

          <Button
            type="button"
            className={`hud-btn font-mono text-xs font-bold tracking-wider px-5 py-2.5 ${
              featured
                ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-glow font-black"
                : "bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40"
            }`}
            onClick={() => {
              playTargetLock();
              onSelect?.();
            }}
            onMouseEnter={() => playCyberBlip(1200, 0.03)}
          >
            <Crosshair className="h-3.5 w-3.5 mr-1.5" />
            LOCK TARGET VECTOR
          </Button>
        </div>
      </div>
    </div>
  );
}
