import { ArrowRight, Scale, Utensils, WalletCards } from "lucide-react";
import { Link } from "react-router-dom";
import MetricCard from "@/components/dashboard/MetricCard";
import PageHeader from "@/components/dashboard/PageHeader";
import RecommendationCard from "@/components/matching/RecommendationCard";
import SurplusCard from "@/components/surplus/SurplusCard";
import { Button } from "@/components/ui/button";
import { impactMetrics, recommendation, surplusItems } from "@/data/mockData";

const metricIcons = [Utensils, Scale, WalletCards];

export default function Dashboard() {
  const activeItem = surplusItems[0];

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="FoodLoop command center"
        title="Turn surplus into rescue plans before food expires."
        description="A frontend-first SaaS dashboard for logging surplus, previewing recommended action splits, matching recipients, and tracking local impact."
        action={
          <Button asChild>
            <Link to="/surplus">
              Log surplus
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        {impactMetrics.map((metric, index) => (
          <MetricCard key={metric.label} icon={metricIcons[index]} {...metric} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <SurplusCard item={activeItem} />
        <RecommendationCard recommendation={recommendation} />
      </section>
    </div>
  );
}
