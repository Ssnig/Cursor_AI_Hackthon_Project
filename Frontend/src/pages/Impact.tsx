import { Scale, Utensils, WalletCards } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import MetricCard from "@/components/dashboard/MetricCard";
import ImpactTimeline from "@/components/impact/ImpactTimeline";
import { impactMetrics } from "@/data/mockData";

const metricIcons = [Utensils, Scale, WalletCards];

export default function Impact() {
  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Impact tracking"
        title="Show the measurable outcome of every rescued batch."
        description="FoodLoop's frontend highlights social impact, landfill diversion, and value recovery using mock metrics until the service layer is ready."
      />

      <section className="grid gap-4 md:grid-cols-3">
        {impactMetrics.map((metric, index) => (
          <MetricCard key={metric.label} icon={metricIcons[index]} {...metric} />
        ))}
      </section>

      <ImpactTimeline />
    </div>
  );
}
