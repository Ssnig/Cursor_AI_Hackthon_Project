import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import RescueSummary from "@/components/rescue/RescueSummary";
import { Button } from "@/components/ui/button";
import { recipients, rescuePlans, surplusItems } from "@/data/mockData";

export default function Rescue() {
  const plan = rescuePlans[0];
  const item = surplusItems.find((surplusItem) => surplusItem.id === plan.surplusItemId);
  const recipient = recipients.find((partner) => partner.id === plan.recipientId);

  if (!item || !recipient) {
    return null;
  }

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Rescue execution"
        title="Confirm pickup details before the cutoff window closes."
        description="The rescue screen makes the human approval step clear while staying disconnected from backend dispatch or WebMCP actions."
        action={
          <Button asChild variant="secondary">
            <Link to="/impact">
              View impact
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <RescueSummary plan={plan} item={item} recipient={recipient} />
    </div>
  );
}
