import {
  addSurplusItem,
  completeRescue,
  createRescue,
  findNearbyRecipients,
  getImpactMetrics,
  getN8nNotificationStatus,
  getState,
  getSurplusItems,
  listRescuePlans,
  recommendAction,
  resetStore,
  subscribe
} from "@backend/services/index.js";
import type {
  ImpactMetric,
  Recommendation,
  Recipient,
  RescuePlan,
  SurplusItem
} from "@/types";

/**
 * Demo clock: stand 2 hours before the item cutoff so the MVP always
 * demonstrates high urgency (donate 15 / discount 5 for the seed item).
 */
export function demoNowForItem(availableUntil: string): Date {
  const [hours, minutes] = availableUntil.split(":").map(Number);
  const cutoff = new Date();
  cutoff.setHours(hours, minutes, 0, 0);
  return new Date(cutoff.getTime() - 2 * 60 * 60 * 1000);
}

export function toUiRecommendation(
  rec: ReturnType<typeof recommendAction>
): Recommendation {
  return {
    action: rec.action,
    donationQuantity: rec.donateQuantity,
    discountQuantity: rec.discountQuantity,
    urgency: rec.urgency,
    reason: rec.reasoning
  };
}

export function toUiRecipient(
  recipient: ReturnType<typeof findNearbyRecipients>[number]
): Recipient {
  return {
    id: recipient.id,
    name: recipient.name,
    distanceKm: recipient.distanceKm,
    capacity: recipient.availableCapacity,
    availableCapacity: recipient.availableCapacity,
    matchScore: recipient.matchScore,
    suggestedQuantity: recipient.suggestedQuantity,
    address: recipient.address || "Address on file",
    pickupWindow: `Before ${recipient.distanceKm <= 3 ? "cutoff" : "evening"}`
  };
}

export function toUiRescuePlan(plan: ReturnType<typeof listRescuePlans>[number]): RescuePlan {
  const created = plan.createdAt ? new Date(plan.createdAt) : new Date();
  const pickupTime = created.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });

  return {
    id: plan.id,
    surplusItemId: plan.surplusItemId,
    recipientId: plan.recipientId,
    recipientName: plan.recipientName,
    foodName: plan.foodName,
    quantity: plan.quantity,
    donationQuantity: plan.donationQuantity,
    discountQuantity: plan.discountQuantity,
    availableUntil: plan.availableUntil,
    pickupLocation: plan.pickupLocation,
    pickupTime,
    status: plan.status,
    createdAt: plan.createdAt,
    completedAt: plan.completedAt,
    driverNote:
      plan.status === "completed"
        ? "Rescue completed — impact metrics updated."
        : plan.status === "planned"
          ? "Awaiting pickup confirmation. Coordinator notified via n8n when created."
          : "Rescue plan status updated."
  };
}

export function toImpactCards(
  metrics: ReturnType<typeof getImpactMetrics> = getImpactMetrics()
): ImpactMetric[] {
  return [
    {
      label: "Meals rescued",
      value: String(metrics.mealsRescued),
      helper: "Portions delivered to community partners"
    },
    {
      label: "Food diverted",
      value: `${metrics.foodDivertedKg} kg`,
      helper: "Estimated landfill waste avoided"
    },
    {
      label: "Value recovered",
      value: `$${metrics.valueRecovered.toFixed(0)}`,
      helper: "Donation and discount value retained"
    }
  ];
}

export function readSnapshot() {
  const state = getState();
  const items = getSurplusItems() as SurplusItem[];
  const plans = listRescuePlans().map(toUiRescuePlan);
  const impact = toImpactCards(getImpactMetrics());
  const n8n = getN8nNotificationStatus();

  return {
    items,
    recipientsDirectory: state.recipients,
    plans,
    impact,
    n8n,
    business: state.business
  };
}

export {
  addSurplusItem,
  completeRescue,
  createRescue,
  findNearbyRecipients,
  getImpactMetrics,
  getN8nNotificationStatus,
  getSurplusItems,
  listRescuePlans,
  recommendAction,
  resetStore,
  subscribe
};
