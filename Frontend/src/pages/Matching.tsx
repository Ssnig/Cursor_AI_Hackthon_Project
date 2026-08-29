import PageHeader from "@/components/dashboard/PageHeader";
import RecommendationCard from "@/components/matching/RecommendationCard";
import RecipientCard from "@/components/matching/RecipientCard";
import { recommendation, recipients } from "@/data/mockData";

export default function Matching() {
  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Recipient matching"
        title="Compare nearby partners by distance, capacity, and fit."
        description="Recipient cards are currently powered by mock data and can later receive results from the matching service without changing page structure."
      />

      <RecommendationCard recommendation={recommendation} />

      <section className="grid gap-4">
        {recipients.map((recipient, index) => (
          <RecipientCard
            key={recipient.id}
            recipient={recipient}
            featured={index === 0}
          />
        ))}
      </section>
    </div>
  );
}
