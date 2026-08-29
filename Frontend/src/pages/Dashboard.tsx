import { Link } from "react-router-dom";
import { Scale, Utensils, WalletCards } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import MetricCard from "@/components/dashboard/MetricCard";
import SurplusCard from "@/components/surplus/SurplusCard";
import { Button } from "@/components/ui/button";
import { impactMetrics, surplusItems } from "@/data/mockData";

const icons = [Utensils, Scale, WalletCards];
export default function Dashboard() { return <div className="grid gap-8"><PageHeader eyebrow="FoodLoop dashboard" title="Turn surplus food into rescue plans." description="A clean frontend MVP using local mock data only." action={<Button asChild><Link to="/surplus">Log surplus</Link></Button>} /><section className="grid gap-4 md:grid-cols-3">{impactMetrics.map((metric, index) => <MetricCard key={metric.label} icon={icons[index]} {...metric} />)}</section><section className="grid gap-4 md:grid-cols-3">{surplusItems.map((item) => <SurplusCard key={item.id} item={item} />)}</section></div>; }
