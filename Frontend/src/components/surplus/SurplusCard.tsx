import { Clock, MapPin, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SurplusItem } from "@/types";

const statusLabel: Record<SurplusItem["status"], string> = {
  pending: "Pending",
  matched: "Matched",
  "rescue-confirmed": "Rescue confirmed"
};

export default function SurplusCard({ item }: { item: SurplusItem }) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>{item.name}</CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">{item.category}</p>
        </div>
        <Badge variant={item.status === "pending" ? "warning" : "secondary"}>
          {statusLabel[item.status]}
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          {item.quantity} portions available
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Available until {item.availableUntil}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          {item.location}
        </div>
      </CardContent>
    </Card>
  );
}
