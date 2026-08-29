import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SurplusForm() {
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); }
  const input = "h-11 rounded-2xl border bg-background px-4 outline-none focus:ring-2 focus:ring-primary";
  return <Card><CardHeader><CardTitle>Log new surplus</CardTitle><p className="text-sm text-muted-foreground">Local-only mock form for the frontend demo.</p></CardHeader><CardContent><form onSubmit={submit} className="grid gap-4"><div className="grid gap-4 md:grid-cols-2"><label className="grid gap-2 text-sm font-semibold">Item name<input className={input} defaultValue="Chicken Sandwiches" /></label><label className="grid gap-2 text-sm font-semibold">Category<select className={input} defaultValue="Prepared food"><option>Prepared food</option><option>Bakery</option><option>Produce</option></select></label><label className="grid gap-2 text-sm font-semibold">Quantity<input className={input} type="number" min="1" defaultValue="20" /></label><label className="grid gap-2 text-sm font-semibold">Available until<input className={input} type="time" defaultValue="20:00" /></label></div><Button className="w-fit">Preview recommendation</Button></form></CardContent></Card>;
}
