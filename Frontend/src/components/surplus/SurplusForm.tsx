import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Cpu, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FoodHologram from "@/components/cyber/FoodHologram";
import { useFoodLoop } from "@/context/FoodLoopContext";
import { playCyberBlip, playProtocolEngaged } from "@/lib/cyberAudio";

export default function SurplusForm() {
  const navigate = useNavigate();
  const { submitSurplus, business } = useFoodLoop();
  const [name, setName] = useState("Chicken Sandwiches");
  const [category, setCategory] = useState("Prepared food");
  const [quantity, setQuantity] = useState(20);
  const [availableUntil, setAvailableUntil] = useState("20:00");
  const [location, setLocation] = useState(business?.location || business?.name || "ABC Bakery");

  useEffect(() => {
    if (business?.location || business?.name) {
      setLocation(business.location || business.name);
    }
  }, [business?.id, business?.location, business?.name]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    playProtocolEngaged();
    submitSurplus({
      name,
      category,
      quantity: Number(quantity),
      availableUntil,
      location
    });
    navigate("/matching");
  }

  return (
    <div className="hud-box p-6 relative">
      <div className="border-b border-cyan-500/30 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-cyan-400" />
          <h3 className="font-display text-lg font-black text-white tracking-wider">
            BIO-MATTER INTAKE TELEMETRY
          </h3>
        </div>
        <p className="mt-1 text-xs font-mono text-cyan-400/80">
          Registers biomass surplus batch into the quantum buffer, arms the deterministic split engine, and activates recipient radar.
        </p>
      </div>

      <form className="grid gap-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1.5 text-xs font-mono font-bold text-cyan-300">
            BIOMASS ITEM CODENAME
            <input
              className="h-10 rounded bg-[#030712] border border-cyan-500/40 px-3 font-mono text-xs text-white outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,240,255,0.4)]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chicken Sandwiches"
              required
            />
          </label>

          <label className="grid gap-1.5 text-xs font-mono font-bold text-cyan-300">
            BIO-CLASSIFICATION
            <select
              className="h-10 rounded bg-[#030712] border border-cyan-500/40 px-3 font-mono text-xs text-cyan-200 outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,240,255,0.4)]"
              value={category}
              onChange={(e) => {
                playCyberBlip(800, 0.04);
                setCategory(e.target.value);
              }}
            >
              <option value="Prepared food">Prepared food (Sandwich / Meals)</option>
              <option value="Bakery">Bakery (Bread / Baguettes / Pastries)</option>
              <option value="Produce">Produce (Greens / Fruit / Vegetables)</option>
              <option value="Dairy">Dairy (Milk / Cheese / Protein)</option>
              <option value="Pantry">Pantry (Canned / Dry goods)</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-1.5 text-xs font-mono font-bold text-cyan-300">
            BUFFER QUANTITY (PORTIONS)
            <input
              type="number"
              min={1}
              className="h-10 rounded bg-[#030712] border border-cyan-500/40 px-3 font-mono text-xs text-amber-300 outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,240,255,0.4)]"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </label>

          <label className="grid gap-1.5 text-xs font-mono font-bold text-cyan-300">
            DECAY CUTOFF TIME (HH:MM)
            <input
              type="text"
              pattern="[0-2][0-9]:[0-5][0-9]"
              className="h-10 rounded bg-[#030712] border border-cyan-500/40 px-3 font-mono text-xs text-pink-400 outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,240,255,0.4)]"
              value={availableUntil}
              onChange={(e) => setAvailableUntil(e.target.value)}
              placeholder="20:00"
              required
            />
          </label>

          <label className="grid gap-1.5 text-xs font-mono font-bold text-cyan-300">
            DEPOT SECTOR LOCATION
            <input
              className="h-10 rounded bg-[#030712] border border-cyan-500/40 px-3 font-mono text-xs text-white outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,240,255,0.4)]"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </label>
        </div>

        {/* Live 3D Hologram Projection Preview of current intake */}
        <div className="mt-2 pt-4 border-t border-cyan-500/20">
          <div className="flex items-center justify-between mb-2 text-[11px] font-mono text-cyan-400/80">
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles className="h-3.5 w-3.5 text-pink-400" />
              LIVE INTAKE PROJECTION PREVIEW
            </span>
            <span className="text-pink-400 font-bold">EMITTER: SYNCHRONIZED</span>
          </div>
          <FoodHologram
            itemName={name}
            category={category}
            quantity={Number(quantity) || 1}
            availableUntil={availableUntil}
            allowModelSwitch={false}
            size={180}
          />
        </div>

        <Button
          type="submit"
          className="hud-btn mt-2 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-black text-xs uppercase py-3 shadow-cyan-glow"
        >
          CONFIRM INTAKE & ENGAGE RADAR
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </form>
    </div>
  );
}
