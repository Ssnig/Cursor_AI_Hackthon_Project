import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const events = ["Surplus logged", "Recommendation reviewed", "Recipient selected", "Rescue pickup scheduled"];

export default function ImpactTimeline() {
  return <Card><CardHeader><CardTitle>Impact trail</CardTitle></CardHeader><CardContent className="grid gap-3">{events.map((event) => <div key={event} className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /><span className="font-medium">{event}</span></div>)}</CardContent></Card>;
}
