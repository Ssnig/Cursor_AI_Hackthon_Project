import { Link } from "react-router-dom";
import { ArrowRight, RefreshCw } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import SurplusCard from "@/components/surplus/SurplusCard";
import SurplusForm from "@/components/surplus/SurplusForm";
import { Button } from "@/components/ui/button";
import { useFoodLoop } from "@/context/FoodLoopContext";
import { cn } from "@/lib/utils";
import { playCyberBlip } from "@/lib/cyberAudio";

export default function Surplus() {
  const { items, selectedItemId, selectItem, resetDemo, error, hasPendingSurplus } =
    useFoodLoop();

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="BIO-INTAKE CONSOLE"
        title="SURPLUS LOGISTICS & REGISTRATION BUFFER"
        description="Log excess macronutrients, hydro-bakery reserves, or produce batches prior to the decay cutoff window. Target radar activates once a pending batch is staged."
        action={
          <Button
            type="button"
            className="hud-btn bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-xs font-mono"
            onClick={() => {
              playCyberBlip(700, 0.08);
              resetDemo();
            }}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-2" />
            PURGE & RESET BUFFER
          </Button>
        }
      />

      {error ? (
        <div className="hud-box-danger p-4 text-xs font-mono text-pink-300">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SurplusForm />

        <div className="grid gap-4">
          <div className="text-xs font-mono tracking-widest text-cyan-400 font-bold uppercase">
            STAGED BATCHES ({items.length})
          </div>

          {items.length === 0 ? (
            <div className="hud-box p-6 border-dashed border-cyan-500/40">
              <p className="font-display text-base font-bold text-white">NO STAGED BIO-MATTER</p>
              <p className="mt-2 text-xs font-mono text-cyan-400/80 leading-relaxed">
                Buffer queue is currently empty. Complete the intake form on the left to initialize your first batch and unlock <strong>TACTICAL RADAR</strong> dispatch.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={cn(
                  "text-left transition-all focus:outline-none",
                  selectedItemId === item.id && "ring-2 ring-cyan-400"
                )}
                onClick={() => {
                  playCyberBlip(1100, 0.04);
                  selectItem(item.id);
                }}
              >
                <SurplusCard item={item} />
              </button>
            ))
          )}

          {hasPendingSurplus && (
            <Button
              asChild
              className="hud-btn mt-2 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-black text-xs uppercase py-3 shadow-cyan-glow"
              onClick={() => playCyberBlip(1400, 0.05)}
            >
              <Link to="/matching">
                PROCEED TO TACTICAL RADAR
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
