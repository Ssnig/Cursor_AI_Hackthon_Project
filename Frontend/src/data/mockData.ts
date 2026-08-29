import type { ImpactMetric, Recipient, SurplusItem } from "@/types";

export const surplusItems: SurplusItem[] = [
  { id: "food-001", name: "Chicken Sandwiches", category: "Prepared food", quantity: 20, availableUntil: "20:00", location: "ABC Bakery", status: "pending" },
  { id: "food-002", name: "Mixed Pastry Boxes", category: "Bakery", quantity: 14, availableUntil: "18:30", location: "ABC Bakery", status: "matched" },
  { id: "food-003", name: "Vegetable Soup Portions", category: "Prepared food", quantity: 32, availableUntil: "21:15", location: "ABC Bakery", status: "rescue-confirmed" }
];

export const recipients: Recipient[] = [
  { id: "recipient-001", name: "Community Food Center", distanceKm: 2.1, capacity: 15, matchScore: 94, pickupWindow: "6:30 PM - 7:30 PM" },
  { id: "recipient-002", name: "Hope Shelter Kitchen", distanceKm: 3.4, capacity: 12, matchScore: 88, pickupWindow: "6:00 PM - 8:00 PM" },
  { id: "recipient-003", name: "Northside Outreach", distanceKm: 4.8, capacity: 20, matchScore: 82, pickupWindow: "7:00 PM - 8:45 PM" }
];

export const impactMetrics: ImpactMetric[] = [
  { label: "Meals rescued", value: "1,284", helper: "Portions delivered to partners" },
  { label: "Food diverted", value: "642 kg", helper: "Estimated landfill waste avoided" },
  { label: "Value recovered", value: "$8.7k", helper: "Donation and discount value retained" }
];
