import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, ShieldPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFoodLoop } from "@/context/FoodLoopContext";
import { playCyberBlip, playProtocolEngaged } from "@/lib/cyberAudio";

export default function Signup() {
  const navigate = useNavigate();
  const { signup, isAuthenticated, authReady, error } = useFoodLoop();
  const [name, setName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  if (authReady && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);
    try {
      playProtocolEngaged();
      signup({ name, restaurantName, email, password });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 bg-[#030712]">
      <div className="w-full max-w-md hud-box p-8 border-cyan-500/40 shadow-cyan-glow">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded bg-cyan-950 border border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.4)]">
            <ShieldPlus className="h-6 w-6" />
          </div>
          <div>
            <p className="font-display text-lg font-black tracking-wider text-cyan-300">
              NODE REGISTRATION
            </p>
            <p className="text-[10px] font-mono tracking-widest text-cyan-500/80 font-bold uppercase">
              NEW BIOMASS STATION INITIALIZATION
            </p>
          </div>
        </div>

        {localError || error ? (
          <div className="hud-box-danger p-3 mb-4 text-xs font-mono text-pink-300">
            {localError || error}
          </div>
        ) : null}

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-1.5 text-xs font-mono font-bold text-cyan-300">
            OPERATOR CALLSIGN
            <input
              className="h-10 rounded bg-[#030712] border border-cyan-500/40 px-3 font-mono text-xs text-white outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,240,255,0.4)]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Commander Sarah"
              required
            />
          </label>

          <label className="grid gap-1.5 text-xs font-mono font-bold text-cyan-300">
            KITCHEN / DEPOT FACILITY NAME
            <input
              className="h-10 rounded bg-[#030712] border border-cyan-500/40 px-3 font-mono text-xs text-white outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,240,255,0.4)]"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="e.g. Neo Tokyo Bakery"
              required
            />
          </label>

          <label className="grid gap-1.5 text-xs font-mono font-bold text-cyan-300">
            TRANSMISSION COMMS EMAIL
            <input
              type="email"
              className="h-10 rounded bg-[#030712] border border-cyan-500/40 px-3 font-mono text-xs text-white outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,240,255,0.4)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@neobakery.io"
              required
            />
          </label>

          <label className="grid gap-1.5 text-xs font-mono font-bold text-cyan-300">
            SECURITY ACCESS CIPHER
            <input
              type="password"
              className="h-10 rounded bg-[#030712] border border-cyan-500/40 px-3 font-mono text-xs text-white outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,240,255,0.4)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <Button
            type="submit"
            className="hud-btn mt-2 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-black text-xs uppercase py-3 shadow-cyan-glow"
          >
            INITIALIZE NODE
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </form>

        <div className="mt-6 border-t border-cyan-500/20 pt-4 flex items-center justify-between text-[11px] font-mono text-cyan-500/80">
          <span>ALREADY CLEARED?</span>
          <Link
            to="/login"
            onClick={() => playCyberBlip(1200, 0.04)}
            className="font-bold text-cyan-300 hover:text-white hover:underline"
          >
            ACCESS CLEARANCE LOGIN
          </Link>
        </div>
      </div>
    </div>
  );
}
