import PageHeader from "@/components/dashboard/PageHeader";
import RescueSummary from "@/components/rescue/RescueSummary";
export default function Rescue() { return <div className="grid gap-8"><PageHeader eyebrow="Rescue" title="Confirm the rescue plan." description="Frontend-only pickup summary without dispatch, backend, or WebMCP logic." /><RescueSummary /></div>; }
