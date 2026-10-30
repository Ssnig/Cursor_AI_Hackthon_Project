import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Activity, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFoodLoop } from "@/context/FoodLoopContext";
import { DEMO_CREDENTIALS } from "@/lib/foodloop";
import { playCyberBlip, playProtocolEngaged } from "@/lib/cyberAudio";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, authReady, error } = useFoodLoop();
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password);
  const [localError, setLocalError] = useState<string | null>(null);

  if (authReady && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);
    try {
      playProtocolEngaged();
      login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 bg-[#030712]">
      <div className="grid w-full max-w-4xl hud-box border-cyan-500/40 shadow-cyan-glow overflow-hidden md:grid-cols-[1fr_1fr]">
        {/* Left Side: Cyber Hero Brand */}
        <div className="hidden flex-col justify-between p-8 bg-[#060b18] border-r border-cyan-500/30 text-white md:flex relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl"></div>

          <div className="relative z-10">
            <span className="food-chip text-emerald-400 border-emerald-500/50">
              <Activity className="h-3 w-3 animate-pulse" />
              BIOMASS DEFENSE PROTOCOL
            </span>
            <h1 className="font-display mt-6 text-3xl font-black leading-tight tracking-wider uppercase text-white neon-text-glow">
              ORBITAL RESCUE TERMINAL // v9.04
            </h1>
            <p className="mt-4 text-xs font-mono leading-relaxed text-cyan-400/80">
              Autonomous algorithmic food diversion network. Bridges industrial commercial surplus with local shelters and dynamic markdown markets.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-2 text-[10px] font-mono border-t border-cyan-500/20 pt-4">
            <span className="food-chip">DONATE 100%</span>
            <span className="food-chip">DYNAMIC DISCOUNT</span>
            <span className="food-chip">TACTICAL RADAR</span>
            <span className="food-chip text-pink-400 border-pink-500/40">WebMCP ARMED</span>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="p-8 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-11 w-11 items-center justify-center rounded bg-cyan-950 border border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.4)]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-lg font-black tracking-wider text-cyan-300">
                FOODLOOP // ACCESS
              </p>
              <p className="text-[10px] font-mono tracking-widest text-cyan-500/80 font-bold uppercase">
                OPERATOR CLEARANCE VERIFICATION
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
              TERMINAL OPERATOR EMAIL
              <input
                type="email"
                className="h-10 rounded bg-[#030712] border border-cyan-500/40 px-3 font-mono text-xs text-white outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              AUTHENTICATE CLEARANCE
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>

          <div className="mt-6 border-t border-cyan-500/20 pt-4 flex items-center justify-between text-[11px] font-mono text-cyan-500/80">
            <span>UNREGISTERED NODE?</span>
            <Link
              to="/signup"
              onClick={() => playCyberBlip(1200, 0.04)}
              className="font-bold text-cyan-300 hover:text-white hover:underline"
            >
              INITIALIZE RECIPIENT NODE
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
