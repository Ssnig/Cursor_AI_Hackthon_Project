import PageHeader from "@/components/dashboard/PageHeader";
import SurplusCard from "@/components/surplus/SurplusCard";
import SurplusForm from "@/components/surplus/SurplusForm";
import { surplusItems } from "@/data/mockData";

export default function Surplus() {
  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Surplus intake"
        title="Capture food, quantity, location, and cutoff time."
        description="This page works with local mock data for now and keeps the form boundary ready for the backend recommendation service."
      />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SurplusForm />
        <div className="grid gap-4">
          {surplusItems.map((item) => (
            <SurplusCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
