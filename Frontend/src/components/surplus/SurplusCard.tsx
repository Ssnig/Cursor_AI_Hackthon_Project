import { Clock, MapPin, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SurplusItem } from "@/types";

export default function SurplusCard({ item }: { item: SurplusItem }) {
  return <Card><CardHeader><div className="flex items-start justify-between gap-3"><div><CardTitle>{item.name}</CardTitle><p className="mt-1 text-sm text-muted-foreground">{item.category}</p></div><Badge>{item.status}</Badge></div></CardHeader><CardContent className="grid gap-2 text-sm text-muted-foreground"><span className="flex gap-2"><Package className="h-4 w-4 text-primary" />{item.quantity} portions</span><span className="flex gap-2"><Clock className="h-4 w-4 text-primary" />Until {item.availableUntil}</span><span className="flex gap-2"><MapPin className="h-4 w-4 text-primary" />{item.location}</span></CardContent></Card>;
}
