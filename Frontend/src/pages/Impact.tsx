import { Scale, Utensils, WalletCards } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import MetricCard from "@/components/dashboard/MetricCard";
import ImpactTimeline from "@/components/impact/ImpactTimeline";
import { impactMetrics } from "@/data/mockData";
const icons = [Utensils, Scale, WalletCards];
export default function Impact() { return <div className="grid gap-8"><PageHeader eyebrow="Impact" title="Measure rescued meals and recovered value." description="Mock metrics for the hackathon dashboard." /><section className="grid gap-4 md:grid-cols-3">{impactMetrics.map((metric, index) => <MetricCard key={metric.label} icon={icons[index]} {...metric} />)}</section><ImpactTimeline /></div>; }
