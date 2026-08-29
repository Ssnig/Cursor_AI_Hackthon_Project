import { ArrowRight, Scale, Utensils, WalletCards } from "lucide-react";
import { Link } from "react-router-dom";
import MetricCard from "@/components/dashboard/MetricCard";
import PageHeader from "@/components/dashboard/PageHeader";
import RecommendationCard from "@/components/matching/RecommendationCard";
import SurplusCard from "@/components/surplus/SurplusCard";
import { Button } from "@/components/ui/button";
import { useFoodLoop } from "@/context/FoodLoopContext";

const metricIcons = [Utensils, Scale, WalletCards];

export default function Dashboard() {
  const { items, impact, recommendation, selectedItem, error, n8n } = useFoodLoop();
  const activeItem = selectedItem || items[0];

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="FoodLoop command center"
        title="Turn surplus into rescue plans before food expires."
        description="Live dashboard wired to the Backend decision engine, matching service, and rescue flow."
        action={
          <Button asChild>
            <Link to="/surplus">
              Log surplus
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      />

      {error ? (
        <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <p className="text-sm text-muted-foreground">
        n8n coordinator:{" "}
        <span className="font-semibold text-foreground">
          {n8n.lastStatus === "ok"
            ? "notified"
            : n8n.lastStatus === "pending"
              ? "notifying…"
              : n8n.lastStatus === "error"
                ? n8n.lastMessage
                : n8n.lastStatus}
        </span>
      </p>

      <section className="grid gap-4 md:grid-cols-3">
        {impact.map((metric, index) => (
          <MetricCard key={metric.label} icon={metricIcons[index]} {...metric} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        {activeItem ? <SurplusCard item={activeItem} /> : null}
        {recommendation ? <RecommendationCard recommendation={recommendation} /> : null}
      </section>
    </div>
  );
}
