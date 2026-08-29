import PageHeader from "@/components/dashboard/PageHeader";
import RecipientCard from "@/components/matching/RecipientCard";
import { recipients } from "@/data/mockData";
export default function Matching() { return <div className="grid gap-8"><PageHeader eyebrow="Matching" title="Find the best recipient partner." description="Ranked mock recipient cards by capacity, distance, and match score." /><section className="grid gap-4">{recipients.map((recipient, index) => <RecipientCard key={recipient.id} recipient={recipient} featured={index === 0} />)}</section></div>; }
