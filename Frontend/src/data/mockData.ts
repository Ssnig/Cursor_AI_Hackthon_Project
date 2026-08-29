import type {
  ImpactMetric,
  Recommendation,
  Recipient,
  RescuePlan,
  SurplusItem
} from "@/types";

export const surplusItems: SurplusItem[] = [
  {
    id: "food-001",
    name: "Chicken Sandwiches",
    category: "Prepared food",
    quantity: 20,
    availableUntil: "20:00",
    location: "ABC Bakery",
    status: "pending"
  },
  {
    id: "food-002",
    name: "Mixed Pastry Boxes",
    category: "Bakery",
    quantity: 14,
    availableUntil: "18:30",
    location: "ABC Bakery",
    status: "matched"
  },
  {
    id: "food-003",
    name: "Vegetable Soup Portions",
    category: "Prepared food",
    quantity: 32,
    availableUntil: "21:15",
    location: "ABC Bakery",
    status: "rescue-confirmed"
  }
];

export const recommendation: Recommendation = {
  donationQuantity: 15,
  discountQuantity: 5,
  urgency: "high",
  reason:
    "High urgency because the sandwiches expire soon and nearby recipient capacity can absorb most of the batch."
};

export const recipients: Recipient[] = [
  {
    id: "recipient-001",
    name: "Community Food Center",
    distanceKm: 2.1,
    capacity: 15,
    matchScore: 94,
    pickupWindow: "6:30 PM - 7:30 PM",
    address: "18 Market Street"
  },
  {
    id: "recipient-002",
    name: "Hope Shelter Kitchen",
    distanceKm: 3.4,
    capacity: 12,
    matchScore: 88,
    pickupWindow: "6:00 PM - 8:00 PM",
    address: "44 Green Avenue"
  },
  {
    id: "recipient-003",
    name: "Northside Outreach",
    distanceKm: 4.8,
    capacity: 20,
    matchScore: 82,
    pickupWindow: "7:00 PM - 8:45 PM",
    address: "9 Pine Road"
  }
];

export const rescuePlans: RescuePlan[] = [
  {
    id: "rescue-001",
    surplusItemId: "food-003",
    recipientId: "recipient-001",
    pickupTime: "7:10 PM",
    status: "scheduled",
    driverNote: "Use side entrance near loading bay."
  }
];

export const impactMetrics: ImpactMetric[] = [
  {
    label: "Meals rescued",
    value: "1,284",
    helper: "Portions delivered to community partners"
  },
  {
    label: "Food diverted",
    value: "642 kg",
    helper: "Estimated landfill waste avoided"
  },
  {
    label: "Value recovered",
    value: "$8.7k",
    helper: "Donation and discount value retained"
  }
];
