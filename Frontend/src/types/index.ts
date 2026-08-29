export type SurplusStatus = "pending" | "matched" | "rescue-confirmed";

export interface SurplusItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  availableUntil: string;
  location: string;
  status: SurplusStatus;
}

export interface Recipient {
  id: string;
  name: string;
  distanceKm: number;
  capacity: number;
  matchScore: number;
  pickupWindow: string;
  address: string;
}

export interface Recommendation {
  donationQuantity: number;
  discountQuantity: number;
  urgency: "low" | "medium" | "high";
  reason: string;
}

export interface RescuePlan {
  id: string;
  surplusItemId: string;
  recipientId: string;
  pickupTime: string;
  status: "scheduled" | "in-progress" | "completed";
  driverNote: string;
}

export interface ImpactMetric {
  label: string;
  value: string;
  helper: string;
}
