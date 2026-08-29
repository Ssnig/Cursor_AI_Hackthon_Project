import { FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SurplusForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log new surplus</CardTitle>
        <p className="text-sm text-muted-foreground">
          Mock form for the business dashboard. It is ready to connect to the
          service layer later.
        </p>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold">
              Item name
              <input
                className="h-11 rounded-2xl border bg-background px-4 outline-none focus:ring-2 focus:ring-ring"
                defaultValue="Chicken Sandwiches"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Category
              <select className="h-11 rounded-2xl border bg-background px-4 outline-none focus:ring-2 focus:ring-ring">
                <option>Prepared food</option>
                <option>Bakery</option>
                <option>Produce</option>
                <option>Pantry</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Quantity
              <input
                className="h-11 rounded-2xl border bg-background px-4 outline-none focus:ring-2 focus:ring-ring"
                defaultValue="20"
                type="number"
                min="1"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Available until
              <input
                className="h-11 rounded-2xl border bg-background px-4 outline-none focus:ring-2 focus:ring-ring"
                defaultValue="20:00"
                type="time"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold md:col-span-2">
              Location
              <input
                className="h-11 rounded-2xl border bg-background px-4 outline-none focus:ring-2 focus:ring-ring"
                defaultValue="ABC Bakery"
              />
            </label>
          </div>
          <Button className="w-fit" type="submit">
            Preview rescue recommendation
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
