import type { Recipient } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function RecipientCard({ recipient, featured = false }: { recipient: Recipient; featured?: boolean }) {
  return <Card className={featured ? "border-primary ring-4 ring-primary/10" : ""}><CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><h3 className="text-xl font-bold">{recipient.name}</h3><p className="mt-2 text-sm text-muted-foreground">{recipient.distanceKm} km away • Capacity {recipient.capacity} • {recipient.pickupWindow}</p></div><div className="flex items-center gap-4"><p className="text-3xl font-black text-primary">{recipient.matchScore}%</p><Button variant={featured ? "default" : "secondary"}>Select</Button></div></CardContent></Card>;
}
