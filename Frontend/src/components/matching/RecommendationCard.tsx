import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Recommendation } from "@/types";

export default function RecommendationCard({
  recommendation
}: {
  recommendation: Recommendation;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>Recommended action split</CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">{recommendation.reason}</p>
        </div>
        <Badge variant="urgent">{recommendation.urgency} urgency</Badge>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-secondary p-5">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-background text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-muted-foreground">Donation allocation</p>
          <p className="mt-2 text-4xl font-black tracking-tight text-primary">
            {recommendation.donationQuantity}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">portions for recipient partners</p>
        </div>
        <div className="rounded-3xl bg-amber-100 p-5 text-amber-950">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-background text-amber-700">
            <Sparkles className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-amber-800">Discount allocation</p>
          <p className="mt-2 text-4xl font-black tracking-tight">
            {recommendation.discountQuantity}
          </p>
          <p className="mt-1 text-sm text-amber-800">portions for local markdown recovery</p>
        </div>
      </CardContent>
    </Card>
  );
}
