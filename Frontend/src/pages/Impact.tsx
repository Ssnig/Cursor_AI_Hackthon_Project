import { Radio, Scale, Utensils, WalletCards } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import MetricCard from "@/components/dashboard/MetricCard";
import ImpactTimeline from "@/components/impact/ImpactTimeline";
import { useFoodLoop } from "@/context/FoodLoopContext";

const metricIcons = [Utensils, Scale, WalletCards];

export default function Impact() {
  const { impact, plans, items, n8n } = useFoodLoop();

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="GLOBAL RECOVERY TELEMETRY"
        title="PLANETARY BIO-DIVERSION IMPACT"
        description="Quantified social and environmental output verified via Backend getImpactMetrics engine."
      />

      <div className="hud-box p-3 font-mono text-xs flex flex-wrap items-center justify-between gap-2 border-cyan-500/30">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
          <span className="text-cyan-400/80">SATELLITE COORDINATOR STATUS:</span>
          <span className="text-emerald-400 font-bold uppercase">{n8n.lastStatus}</span>
          {n8n.lastMessage ? (
            <span className="text-cyan-500/70">({n8n.lastMessage})</span>
          ) : null}
        </div>
        <span className="text-[10px] text-pink-400 font-mono font-bold">
          TOTAL PROTOCOLS LOGGED: {plans.length}
        </span>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {impact.map((metric, index) => (
          <MetricCard key={metric.label} icon={metricIcons[index]} {...metric} />
        ))}
      </section>

      <ImpactTimeline plans={plans} items={items} />
    </div>
  );
}
