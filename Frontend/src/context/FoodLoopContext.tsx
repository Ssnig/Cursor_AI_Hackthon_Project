import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { registerFoodLoopTools } from "@backend/webmcp/index.js";
import type { Recommendation, Recipient, RescuePlan, SurplusItem } from "@/types";
import {
  addSurplusItem,
  completeRescue,
  createRescue,
  demoNowForItem,
  findNearbyRecipients,
  readSnapshot,
  recommendAction,
  resetStore,
  subscribe,
  toUiRecipient,
  toUiRecommendation,
  toUiRescuePlan
} from "@/lib/foodloop";

interface FoodLoopContextValue {
  items: SurplusItem[];
  plans: RescuePlan[];
  impact: ReturnType<typeof readSnapshot>["impact"];
  n8n: ReturnType<typeof readSnapshot>["n8n"];
  selectedItemId: string | null;
  selectedItem: SurplusItem | null;
  recommendation: Recommendation | null;
  recipients: Recipient[];
  activePlan: RescuePlan | null;
  error: string | null;
  selectItem: (id: string) => void;
  refreshRecommendation: () => void;
  refreshRecipients: () => void;
  submitSurplus: (input: {
    name: string;
    category: string;
    quantity: number;
    availableUntil: string;
    location: string;
  }) => void;
  selectRecipient: (recipientId: string) => void;
  completeActiveRescue: () => void;
  resetDemo: () => void;
}

const FoodLoopContext = createContext<FoodLoopContextValue | null>(null);

function categoryToBackend(category: string): string {
  const map: Record<string, string> = {
    "Prepared food": "prepared-food",
    Bakery: "bakery",
    Produce: "produce",
    Pantry: "packaged",
    Dairy: "dairy"
  };
  return map[category] || category.toLowerCase().replace(/\s+/g, "-");
}

export function FoodLoopProvider({ children }: { children: ReactNode }) {
  const [tick, setTick] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => subscribe(() => setTick((value) => value + 1)), []);

  useEffect(() => {
    const controller = new AbortController();
    registerFoodLoopTools({ signal: controller.signal }).then((result) => {
      console.log("[FoodLoop] WebMCP registration:", result);
    });
    return () => controller.abort();
  }, []);

  const snapshot = useMemo(() => readSnapshot(), [tick]);

  useEffect(() => {
    if (!selectedItemId && snapshot.items[0]) {
      setSelectedItemId(snapshot.items[0].id);
    } else if (
      selectedItemId &&
      !snapshot.items.some((item) => item.id === selectedItemId) &&
      snapshot.items[0]
    ) {
      setSelectedItemId(snapshot.items[0].id);
    }
  }, [selectedItemId, snapshot.items]);

  const selectedItem =
    snapshot.items.find((item) => item.id === selectedItemId) || snapshot.items[0] || null;

  const activePlan =
    snapshot.plans.find(
      (plan) =>
        selectedItem &&
        plan.surplusItemId === selectedItem.id &&
        (plan.status === "planned" || plan.status === "completed")
    ) ||
    snapshot.plans[snapshot.plans.length - 1] ||
    null;

  const refreshRecommendation = useCallback(() => {
    if (!selectedItem) return;
    setError(null);
    try {
      const rec = recommendAction(selectedItem, {
        now: demoNowForItem(selectedItem.availableUntil)
      });
      setRecommendation(toUiRecommendation(rec));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [selectedItem]);

  const refreshRecipients = useCallback(() => {
    if (!selectedItem) return;
    setError(null);
    try {
      if (!recommendation) {
        const rec = recommendAction(selectedItem, {
          now: demoNowForItem(selectedItem.availableUntil)
        });
        setRecommendation(toUiRecommendation(rec));
      }
      setRecipients(findNearbyRecipients(selectedItem).map(toUiRecipient));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [recommendation, selectedItem]);

  useEffect(() => {
    if (!selectedItem) {
      setRecommendation(null);
      setRecipients([]);
      return;
    }
    try {
      const rec = recommendAction(selectedItem, {
        now: demoNowForItem(selectedItem.availableUntil)
      });
      setRecommendation(toUiRecommendation(rec));
      setRecipients(findNearbyRecipients(selectedItem).map(toUiRecipient));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [selectedItem?.id, selectedItem?.status, selectedItem?.quantity, tick]);

  const submitSurplus = useCallback(
    (input: {
      name: string;
      category: string;
      quantity: number;
      availableUntil: string;
      location: string;
    }) => {
      setError(null);
      try {
        const created = addSurplusItem({
          name: input.name,
          category: categoryToBackend(input.category),
          quantity: input.quantity,
          availableUntil: input.availableUntil,
          location: input.location
        });
        setSelectedItemId(created.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    },
    []
  );

  const selectRecipient = useCallback(
    (recipientId: string) => {
      if (!selectedItem || !recommendation) return;
      if (selectedItem.status !== "pending") {
        setError("This surplus item is already locked in a rescue.");
        return;
      }
      if (recommendation.donationQuantity <= 0) {
        setError("Recommendation has nothing to donate — try another item.");
        return;
      }
      setError(null);
      try {
        const plan = createRescue(
          selectedItem,
          recipientId,
          recommendation.donationQuantity
        );
        toUiRescuePlan(plan);
        setRecipients(findNearbyRecipients(selectedItem.id).map(toUiRecipient));
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    },
    [recommendation, selectedItem]
  );

  const completeActiveRescue = useCallback(() => {
    if (!activePlan || activePlan.status !== "planned") return;
    setError(null);
    try {
      completeRescue(activePlan.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [activePlan]);

  const resetDemo = useCallback(() => {
    resetStore();
    setRecommendation(null);
    setRecipients([]);
    setSelectedItemId(null);
    setError(null);
  }, []);

  const value: FoodLoopContextValue = {
    items: snapshot.items,
    plans: snapshot.plans,
    impact: snapshot.impact,
    n8n: snapshot.n8n,
    selectedItemId: selectedItem?.id ?? null,
    selectedItem,
    recommendation,
    recipients,
    activePlan,
    error,
    selectItem: setSelectedItemId,
    refreshRecommendation,
    refreshRecipients,
    submitSurplus,
    selectRecipient,
    completeActiveRescue,
    resetDemo
  };

  return <FoodLoopContext.Provider value={value}>{children}</FoodLoopContext.Provider>;
}

export function useFoodLoop() {
  const ctx = useContext(FoodLoopContext);
  if (!ctx) {
    throw new Error("useFoodLoop must be used within FoodLoopProvider");
  }
  return ctx;
}
