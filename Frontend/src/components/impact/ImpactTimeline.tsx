import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const milestones = [
  "Surplus logged by ABC Bakery",
  "Recommendation allocated donation and discount quantities",
  "Community Food Center selected as recipient",
  "Rescue pickup scheduled for this evening"
];

export default function ImpactTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Impact trail</CardTitle>
        <p className="text-sm text-muted-foreground">
          A simple event trail showing how one surplus batch becomes measurable impact.
        </p>
      </CardHeader>
      <CardContent className="grid gap-4">
        {milestones.map((milestone) => (
          <div key={milestone} className="flex gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <p className="pt-1 text-sm font-medium">{milestone}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
