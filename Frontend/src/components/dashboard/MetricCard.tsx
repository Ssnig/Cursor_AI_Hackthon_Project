import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function MetricCard({ icon: Icon, label, value, helper }: { icon: LucideIcon; label: string; value: string; helper: string }) {
  return <Card><CardContent className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-3 text-3xl font-black text-primary">{value}</p><p className="mt-2 text-sm text-muted-foreground">{helper}</p></div><div className="rounded-2xl bg-secondary p-3 text-primary"><Icon /></div></CardContent></Card>;
}
