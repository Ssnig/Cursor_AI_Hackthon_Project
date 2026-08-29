import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { surplusItems, recipients } from "@/data/mockData";

export default function RescueSummary() {
  const item = surplusItems[0];
  const recipient = recipients[0];
  return <Card><CardHeader><CardTitle>Rescue plan ready</CardTitle><p className="text-sm text-muted-foreground">Mock confirmation details for the human approval step.</p></CardHeader><CardContent className="grid gap-4 md:grid-cols-2"><div className="rounded-3xl bg-secondary p-5"><p className="text-sm text-muted-foreground">Surplus</p><p className="text-xl font-bold">{item.name}</p><p>{item.quantity} portions before {item.availableUntil}</p></div><div className="rounded-3xl bg-secondary p-5"><p className="text-sm text-muted-foreground">Recipient</p><p className="text-xl font-bold">{recipient.name}</p><p>Pickup window {recipient.pickupWindow}</p></div></CardContent></Card>;
}
