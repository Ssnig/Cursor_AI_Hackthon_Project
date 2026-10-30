import { ArrowRight, Clock3, Compass, Cpu, Radio, Scale, ShieldAlert, Utensils, WalletCards } from "lucide-react";
import { Link } from "react-router-dom";
import MetricCard from "@/components/dashboard/MetricCard";
import PageHeader from "@/components/dashboard/PageHeader";
import RecommendationCard from "@/components/matching/RecommendationCard";
import SurplusCard from "@/components/surplus/SurplusCard";
import FoodHologram from "@/components/cyber/FoodHologram";
import TacticalRadarMap from "@/components/cyber/TacticalRadarMap";
import { Button } from "@/components/ui/button";
import { useFoodLoop } from "@/context/FoodLoopContext";
import { playCyberBlip } from "@/lib/cyberAudio";

const metricIcons = [Utensils, Scale, WalletCards];

export default function Dashboard() {
  const {
    items,
    impact,
    recommendation,
    selectedItem,
    error,
    n8n,
    business,
    recipients,
    hasPendingSurplus
  } = useFoodLoop();

  const activeItem = selectedItem || items.find((item) => item.status === "pending") || null;

  return (
    <div className="grid gap-8">
      {/* Top Cyber Hero Banner */}
      <section className="hud-box p-6 md:p-8 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between relative z-10">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="food-chip">
                <Clock3 className="h-3.5 w-3.5 text-cyan-400" />
                {hasPendingSurplus ? "DECAY VECTOR: CRITICAL" : "RECEPTOR STANDBY"}
              </span>
              <span className="food-chip text-pink-400 border-pink-500/40">
                <Radio className="h-3.5 w-3.5" />
                GRID FREQ: 432.8 THz
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-widest uppercase neon-text-glow">
              {business?.name ? `${business.name} // BIO-STATION` : "QUANTUM BIO-STATION"}
            </h1>
            <p className="mt-3 text-xs sm:text-sm font-mono leading-relaxed text-cyan-400/90">
              {hasPendingSurplus
                ? "Pending biomass surplus detected in sector buffer. Deterministic mitigation split armed. Tactical radar coordinates ready for lock."
                : "No active biomass surplus in staging queue. Initialize intake protocol via the BIO-INTAKE console to arm tactical matching."}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Button
              asChild
              className="hud-btn bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-black text-xs uppercase px-6 py-6 shadow-cyan-glow"
              size="lg"
              onClick={() => playCyberBlip(1200, 0.05)}
            >
              <Link to={hasPendingSurplus ? "/matching" : "/surplus"}>
                {hasPendingSurplus ? (
                  <>
                    <Compass className="h-4 w-4 mr-2" />
                    ENGAGE RADAR LOCK
                  </>
                ) : (
                  <>
                    <Cpu className="h-4 w-4 mr-2" />
                    INITIALIZE INTAKE
                  </>
                )}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Sci-Fi Status Badges */}
        <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-mono border-t border-cyan-500/20 pt-4">
          <span className="food-chip">🥪 PREPARED MACRONUTRIENTS</span>
          <span className="food-chip">🥖 HYDRO-BAKERY RESERVES</span>
          <span className="food-chip">🥗 SYNTH-PRODUCE BATCHES</span>
          <span className="food-chip text-emerald-400 border-emerald-500/40">
            ♻️ ZERO-LANDFILL DIRECTIVE
          </span>
        </div>
      </section>

      {/* Main Grid: Hologram Emitter & Tactical Radar Side-by-Side */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Hologram Emitter */}
        <div>
          <div className="flex items-center justify-between mb-2 font-mono text-xs text-cyan-400/80">
            <span className="font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 bg-pink-500 rounded-full animate-ping"></span>
              3D WIREFRAME FOOD HOLOGRAM
            </span>
            <span className="text-[10px] text-pink-400 font-bold">
              {activeItem ? `PROJECTION: ${activeItem.name}` : "PROJECTION: STANDBY"}
            </span>
          </div>
          <FoodHologram
            itemName={activeItem?.name || "CYBER-SANDWICH"}
            quantity={activeItem?.quantity || 20}
            availableUntil={activeItem?.availableUntil || "20:00"}
            allowModelSwitch={true}
            size={220}
          />
        </div>

        {/* Tactical Radar Map */}
        <div>
          <div className="flex items-center justify-between mb-2 font-mono text-xs text-cyan-400/80">
            <span className="font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
              TACTICAL RADAR TARGETING
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">
              SECTOR RECIPIENTS: {recipients.length}
            </span>
          </div>
          <TacticalRadarMap
            recipients={recipients}
            businessName={business?.name || "ABC Bakery"}
          />
        </div>
      </section>

      {/* Page Header */}
      <PageHeader
        eyebrow={business?.name ? `${business.name} // TERMINAL FEED` : "FOODLOOP COMMAND NETWORK"}
        title="TELEMETRY & IMPACT METRICS"
        description={
          hasPendingSurplus
            ? "Real-time mitigation telemetry, deterministic split calculation, and next batch ready for coordinate dispatch."
            : "Platform status nominal. Input surplus food supplies to calculate split vectors and trigger recipient radar."
        }
      />

      {error ? (
        <div className="hud-box-danger p-4 text-xs font-mono text-pink-300 flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 text-pink-500 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      {/* Satellite / n8n Coordinator Link */}
      <div className="hud-box p-3 font-mono text-xs flex flex-wrap items-center justify-between gap-2 border-cyan-500/30">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              n8n.lastStatus === "ok"
                ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]"
                : n8n.lastStatus === "pending"
                  ? "bg-amber-400 animate-spin"
                  : "bg-pink-500"
            }`}
          ></span>
          <span className="text-cyan-400/80">n8n RESCUE COORDINATOR RELAY:</span>
          <span
            className={`font-black uppercase tracking-wider ${
              n8n.lastStatus === "ok"
                ? "text-emerald-400"
                : n8n.lastStatus === "pending"
                  ? "text-amber-400"
                  : "text-pink-400"
            }`}
          >
            {n8n.lastStatus === "ok"
              ? "UPLINK SYNCHRONIZED"
              : n8n.lastStatus === "pending"
                ? "TRANSMITTING TELEMETRY..."
                : n8n.lastStatus === "error"
                  ? `TRANSMISSION ERROR: ${n8n.lastMessage}`
                  : "STANDBY"}
          </span>
        </div>
        <span className="text-[10px] text-cyan-500/60 font-mono">
          ENDPOINT: {n8n.webhookUrl}
        </span>
      </div>

      {/* Impact Metric Gauges */}
      <section className="grid gap-4 md:grid-cols-3">
        {impact.map((metric, index) => (
          <MetricCard key={metric.label} icon={metricIcons[index]} {...metric} />
        ))}
      </section>

      {/* Active Surplus & Recommendation Split Cards */}
      {hasPendingSurplus && activeItem ? (
        <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <SurplusCard item={activeItem} />
          {recommendation ? <RecommendationCard recommendation={recommendation} /> : null}
        </section>
      ) : (
        <div className="hud-box p-6 border-dashed border-cyan-500/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-display text-lg font-bold text-white">NO PENDING BIO-MATTER BATCH</p>
              <p className="mt-1 text-xs font-mono text-cyan-400/80 max-w-xl leading-relaxed">
                Log surplus food in the intake console to arm the deterministic split engine and reveal the target matching radar.
              </p>
            </div>
            <Button
              asChild
              className="hud-btn bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/50 font-mono text-xs"
              onClick={() => playCyberBlip(900, 0.05)}
            >
              <Link to="/surplus">
                ACCESS INTAKE CONSOLE
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
