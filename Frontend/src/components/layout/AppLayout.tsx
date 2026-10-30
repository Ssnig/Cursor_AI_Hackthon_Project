import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Bot,
  Box,
  Compass,
  Cpu,
  Gamepad2,
  LogOut,
  Menu,
  ShieldAlert,
  Volume2,
  VolumeX,
  X
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import CyberCopilot from "@/components/cyber/CyberCopilot";
import { useFoodLoop } from "@/context/FoodLoopContext";
import { cn } from "@/lib/utils";
import { isAudioMuted, playCyberBlip, toggleAudioMute } from "@/lib/cyberAudio";

const baseNavItems = [
  { to: "/dashboard", label: "COMMAND HUB", icon: Cpu, id: "dashboard" },
  { to: "/surplus", label: "BIO-INTAKE", icon: Box, id: "surplus" },
  { to: "/matching", label: "TACTICAL RADAR", icon: Compass, id: "matching" },
  { to: "/rescue", label: "RESCUE PROTOCOL", icon: ShieldAlert, id: "rescue" },
  { to: "/impact", label: "GLOBAL TELEMETRY", icon: BarChart3, id: "impact" },
  { to: "/arcade", label: "CYBER-SNAKE", icon: Gamepad2, id: "arcade" }
] as const;

function Brand({ restaurantName }: { restaurantName?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-950 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
        <Activity className="h-6 w-6 animate-pulse" />
      </div>
      <div>
        <p className="font-display text-lg font-black tracking-widest text-cyan-400 neon-text-glow">
          FOODLOOP // HUD
        </p>
        <p className="text-[10px] font-mono tracking-widest text-pink-400 font-bold uppercase">
          {restaurantName ? `NODE: ${restaurantName}` : "QUANTUM BIO-RESCUE"}
        </p>
      </div>
    </div>
  );
}

function Navigation({
  onNavigate,
  items
}: {
  onNavigate?: () => void;
  items: Array<(typeof baseNavItems)[number]>;
}) {
  return (
    <nav className="grid gap-2" aria-label="Cyber navigation">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => {
              playCyberBlip(1100, 0.04);
              onNavigate?.();
            }}
            className={({ isActive }) =>
              cn(
                "hud-btn flex items-center gap-3 px-4 py-2.5 text-xs font-mono font-bold tracking-wider transition-all border",
                isActive
                  ? "bg-cyan-500 text-black border-cyan-300 shadow-[0_0_18px_rgba(0,240,255,0.7)] font-black"
                  : "bg-cyan-950/30 text-cyan-400 border-cyan-500/20 hover:bg-cyan-900/40 hover:text-cyan-200 hover:border-cyan-400/50"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}

function OwnerCard() {
  const navigate = useNavigate();
  const { user, business, logout } = useFoodLoop();

  function handleLogout() {
    playCyberBlip(600, 0.08);
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="mt-auto hud-box p-4 text-xs font-mono">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-emerald-400 font-bold tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          NODE ONLINE
        </span>
        <span className="text-[9px] text-cyan-400/70">SEC-99</span>
      </div>
      <p className="font-display text-sm font-bold text-white truncate">
        {business?.name || "RESTAURANT NODE"}
      </p>
      <p className="mt-0.5 text-[11px] text-cyan-400/70 truncate">
        OPERATOR: {user?.name}
      </p>
      <Button
        className="mt-3 w-full justify-center gap-2 hud-btn bg-pink-950/60 hover:bg-pink-900/80 text-pink-300 border border-pink-500/40 text-xs font-mono"
        size="sm"
        variant="outline"
        onClick={handleLogout}
      >
        <LogOut className="h-3.5 w-3.5" />
        DISENGAGE SESSION
      </Button>
    </div>
  );
}

export default function AppLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [muted, setMuted] = useState(isAudioMuted());
  const { business, hasPendingSurplus, hasRescuePlans } = useFoodLoop();

  const handleToggleSound = () => {
    const nextMuted = toggleAudioMute();
    setMuted(nextMuted);
  };

  const navItems = useMemo(
    () =>
      baseNavItems.filter((item) => {
        if (item.id === "matching") return hasPendingSurplus;
        if (item.id === "rescue") return hasRescuePlans;
        return true;
      }),
    [hasPendingSurplus, hasRescuePlans]
  );

  return (
    <div className="min-h-screen bg-[#030712] text-cyan-400 lg:grid lg:grid-cols-[280px_1fr]">
      {/* Desktop HUD Sidebar */}
      <aside className="sticky top-0 hidden h-screen border-r border-cyan-500/30 bg-[#060b18]/90 p-5 backdrop-blur-xl lg:flex lg:flex-col shadow-[inset_-10px_0_20px_rgba(0,240,255,0.05)]">
        <Brand restaurantName={business?.name} />
        
        {/* Audio FX & Telemetry Header */}
        <div className="mt-6 flex items-center justify-between border-y border-cyan-500/20 py-2.5 font-mono text-[11px]">
          <span className="text-cyan-400/70">AUDIO SYNTH:</span>
          <button
            onClick={handleToggleSound}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20"
            title={muted ? "Unmute Audio FX" : "Mute Audio FX"}
          >
            {muted ? <VolumeX className="h-3.5 w-3.5 text-pink-400" /> : <Volume2 className="h-3.5 w-3.5 text-emerald-400" />}
            <span className={muted ? "text-pink-400 font-bold" : "text-emerald-400 font-bold"}>
              {muted ? "MUTED" : "ARMED"}
            </span>
          </button>
        </div>

        <div className="mt-6 flex-1">
          <div className="text-[10px] font-mono tracking-widest text-cyan-500/60 font-bold mb-2">
            MISSION DIRECTIVES
          </div>
          <Navigation items={navItems} />
        </div>

        <OwnerCard />
      </aside>

      {/* Main Content Pane */}
      <div className="flex min-h-screen flex-col">
        {/* Top Ticker Bar */}
        <div className="border-b border-cyan-500/30 bg-black/60 px-4 py-1.5 text-[10px] font-mono tracking-widest flex items-center justify-between text-cyan-400/80">
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              ● WebMCP: INTEGRATED
            </span>
            <span className="hidden sm:inline text-cyan-500/70">
              SYS-BUS: 432.8 THz
            </span>
            <span className="hidden md:inline text-cyan-500/70">
              SECTOR: 07-BAY
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleSound}
              className="lg:hidden flex items-center gap-1 text-cyan-300 text-[10px]"
            >
              {muted ? <VolumeX className="h-3 w-3 text-pink-400" /> : <Volume2 className="h-3 w-3 text-emerald-400" />}
            </button>
            <span className="text-pink-400 font-bold animate-pulse">
              BIO-DIVERSION ACTIVE
            </span>
          </div>
        </div>

        {/* Mobile Header */}
        <header className="sticky top-0 z-20 border-b border-cyan-500/30 bg-[#060b18]/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <Brand restaurantName={business?.name} />
            <Button
              aria-label="Toggle navigation"
              size="sm"
              variant="outline"
              className="hud-btn bg-cyan-950 border-cyan-500 text-cyan-300"
              onClick={() => setIsMobileOpen((value) => !value)}
            >
              {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
          {isMobileOpen ? (
            <div className="mt-4 space-y-3 rounded-lg border border-cyan-500/40 bg-[#060b18] p-4 shadow-2xl">
              <Navigation items={navItems} onNavigate={() => setIsMobileOpen(false)} />
              <OwnerCard />
            </div>
          ) : null}
        </header>

        {/* Page Container */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8 relative">
          {/* Subtle background tech grid */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]"></div>
          <div className="relative z-10">
            <Outlet />
          </div>
        </main>

        {/* Global Floating Cyber Copilot & WebMCP Terminal */}
        <CyberCopilot />
      </div>
    </div>
  );
}
