import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  ChevronDown,
  ChevronUp,
  CornerDownLeft,
  Gamepad2,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  Volume2,
  VolumeX,
  X,
  Zap
} from "lucide-react";
import {
  addSurplusItem,
  completeRescue,
  createRescue,
  findNearbyRecipients,
  getImpactMetrics,
  getN8nNotificationStatus,
  getSurplusItems,
  recommendAction
} from "@backend/services/index.js";
import { useFoodLoop } from "@/context/FoodLoopContext";
import { isAudioMuted, playCyberBlip, playProtocolEngaged, playTargetLock } from "@/lib/cyberAudio";

interface LogEntry {
  id: string;
  timestamp: string;
  type: "system" | "user" | "call" | "result" | "success" | "error";
  text: string;
}

export default function CyberCopilot() {
  const navigate = useNavigate();
  const { business, selectItem } = useFoodLoop();
  const [isOpen, setIsOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [inputCommand, setInputCommand] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "init-1",
      timestamp: "00:00.00",
      type: "system",
      text: "ORBITAL AI AGENT INITIALIZED // WebMCP IMPERATIVE ADAPTER ONLINE"
    },
    {
      id: "init-2",
      timestamp: "00:00.01",
      type: "system",
      text: "Type natural commands or select an autonomous mission macro below."
    }
  ]);

  const consoleEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  function speak(text: string) {
    if (!voiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.15;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore speech synth blocks
    }
  }

  function appendLog(type: LogEntry["type"], text: string) {
    const now = new Date();
    const ts = `${now.getMinutes().toString().padStart(2, "0")}:${now
      .getSeconds()
      .toString()
      .padStart(2, "0")}.${Math.floor(now.getMilliseconds() / 10)
      .toString()
      .padStart(2, "0")}`;

    setLogs((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, timestamp: ts, type, text }]);
  }

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  /**
   * Macro 1: Autonomous End-to-End Rescue Pipeline
   * getSurplusItems -> recommendAction -> findNearbyRecipients -> createRescue -> completeRescue
   */
  async function runAutonomousRescue() {
    if (isExecuting) return;
    setIsExecuting(true);
    playProtocolEngaged();
    appendLog("user", "MISSION INITIATED: Full Autonomous Surplus Rescue Pipeline");
    speak("Autonomous surplus rescue protocol engaged.");

    try {
      await sleep(400);

      // Step 1: Query Surplus Items
      appendLog("call", ">> WebMCP.getSurplusItems({ status: 'pending' })");
      playCyberBlip(1200, 0.04);
      await sleep(450);

      let items = getSurplusItems({ status: "pending", businessId: business?.id });
      if (items.length === 0) {
        // Auto-intake seed if empty
        appendLog("system", "Buffer empty. Synthesizing emergency seed: 20 Chicken Sandwiches...");
        const created = addSurplusItem({
          name: "Chicken Sandwiches",
          category: "prepared-food",
          quantity: 20,
          availableUntil: "20:00",
          location: business?.location || business?.name || "ABC Bakery",
          businessId: business?.id || "biz-001"
        });
        selectItem(created.id);
        items = [created];
        appendLog("result", `↳ BUFFER POPULATED: ${created.name} (Qty: ${created.quantity}) [ID: ${created.id}]`);
        await sleep(400);
      } else {
        appendLog("result", `↳ FOUND: ${items.length} pending batch(es). Targeting ${items[0].name} [${items[0].id}]`);
      }

      const targetItem = items[0];

      // Step 2: Recommend Action
      await sleep(400);
      appendLog("call", `>> WebMCP.recommendAction({ foodItemId: '${targetItem.id}' })`);
      playCyberBlip(1400, 0.04);
      await sleep(500);

      const rec = recommendAction(targetItem.id);
      appendLog(
        "result",
        `↳ DECISION: ${rec.action.toUpperCase()} -> Allocate ${rec.donateQuantity} to shelter, ${rec.discountQuantity} to markdown. Urgency: ${rec.urgency.toUpperCase()}`
      );
      speak(`Decision calculated. Donate ${rec.donateQuantity}, discount ${rec.discountQuantity}.`);

      // Step 3: Find Nearby Recipients
      await sleep(450);
      appendLog("call", `>> WebMCP.findNearbyRecipients({ foodItemId: '${targetItem.id}' })`);
      playTargetLock();
      await sleep(550);

      const ranked = findNearbyRecipients(targetItem.id);
      if (ranked.length === 0) {
        appendLog("error", "↳ NO RECIPIENTS AVAILABLE IN SECTOR RANGE");
        setIsExecuting(false);
        return;
      }

      const top = ranked[0];
      appendLog(
        "result",
        `↳ TOP TARGET LOCKED: ${top.name} [Distance: ${top.distanceKm} km // Fit: ${top.matchScore}% // Cap: ${top.capacity}]`
      );
      speak(`Target locked: ${top.name}. Fit: ${top.matchScore} percent.`);

      // Step 4: Create Rescue Plan
      await sleep(500);
      appendLog(
        "call",
        `>> WebMCP.createRescue({ foodItemId: '${targetItem.id}', recipientId: '${top.id}', quantity: ${rec.donateQuantity} })`
      );
      playProtocolEngaged();
      await sleep(600);

      const plan = createRescue(targetItem.id, top.id, rec.donateQuantity);
      appendLog("result", `↳ PLAN GENERATED: PLAN-${plan.id} [Status: CONFIRMED RESCUE]`);

      const n8nStatus = getN8nNotificationStatus();
      appendLog("system", `↳ SATELLITE RELAY: n8n webhook status -> ${n8nStatus.lastStatus.toUpperCase()}`);

      // Step 5: Complete Rescue & Update Impact
      await sleep(600);
      appendLog("call", `>> WebMCP.completeRescue({ rescueId: '${plan.id}' })`);
      playCyberBlip(1600, 0.06);
      await sleep(500);

      const completed = completeRescue(plan.id);
      appendLog(
        "success",
        `↳ RESCUE EXECUTED! Meals Rescued: +${completed.plan.donationQuantity} // Cumulative Diverted: ${completed.impactMetrics.foodDivertedKg} kg`
      );
      speak("Rescue protocol completed. Planetary impact telemetry recorded.");

      playProtocolEngaged();
    } catch (err) {
      appendLog("error", `EXECUTION FAULT: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsExecuting(false);
    }
  }

  /**
   * Macro 2: Query Surplus Buffer
   */
  async function runQueryBuffer() {
    if (isExecuting) return;
    setIsExecuting(true);
    appendLog("user", "COMMAND: Query Buffer Inventory");
    playCyberBlip(1100, 0.04);
    await sleep(300);

    appendLog("call", ">> WebMCP.getSurplusItems({})");
    const items = getSurplusItems({ businessId: business?.id });
    await sleep(350);

    if (items.length === 0) {
      appendLog("result", "↳ BUFFER STATUS: Empty (0 items pending)");
    } else {
      items.forEach((it, i) => {
        appendLog(
          "result",
          `↳ [${i + 1}] ${it.name} | Qty: ${it.quantity} | Cutoff: ${it.availableUntil} | Status: ${it.status.toUpperCase()}`
        );
      });
    }
    setIsExecuting(false);
  }

  /**
   * Macro 3: Query Impact Metrics
   */
  async function runQueryMetrics() {
    if (isExecuting) return;
    setIsExecuting(true);
    appendLog("user", "COMMAND: Query Global Telemetry Ledger");
    playCyberBlip(1200, 0.04);
    await sleep(300);

    appendLog("call", ">> WebMCP.getImpactMetrics()");
    const metrics = getImpactMetrics();
    await sleep(350);

    appendLog(
      "result",
      `↳ IMPACT LEDGER: Meals Rescued: ${metrics.mealsRescued} | Diverted: ${metrics.foodDivertedKg} kg | Recovered Value: $${metrics.valueRecovered}`
    );
    setIsExecuting(false);
  }

  /**
   * Natural Language Command Handler
   */
  function handleCommandSubmit(e: FormEvent) {
    e.preventDefault();
    const cmd = inputCommand.trim();
    if (!cmd || isExecuting) return;

    setInputCommand("");
    const lower = cmd.toLowerCase();

    if (lower.includes("clear") || lower === "cls") {
      setLogs([]);
      appendLog("system", "CONSOLE PURGED.");
      return;
    }

    if (lower.includes("rescue") || lower.includes("auto") || lower.includes("run") || lower.includes("solve")) {
      runAutonomousRescue();
      return;
    }

    if (lower.includes("buffer") || lower.includes("items") || lower.includes("inventory") || lower.includes("list")) {
      runQueryBuffer();
      return;
    }

    if (lower.includes("metric") || lower.includes("impact") || lower.includes("ledger") || lower.includes("stats")) {
      runQueryMetrics();
      return;
    }

    if (lower.includes("seed") || lower.includes("intake") || lower.includes("add") || lower.includes("sandwich")) {
      appendLog("user", `COMMAND: ${cmd}`);
      playCyberBlip(1300, 0.05);
      const created = addSurplusItem({
        name: "Chicken Sandwiches",
        category: "prepared-food",
        quantity: 20,
        availableUntil: "20:00",
        location: business?.location || business?.name || "ABC Bakery",
        businessId: business?.id || "biz-001"
      });
      selectItem(created.id);
      appendLog("success", `>> WebMCP INTAKE EXECUTED: Added ${created.name} (20 portions) [ID: ${created.id}]`);
      return;
    }

    if (lower.includes("snake") || lower.includes("arcade") || lower.includes("game") || lower.includes("play")) {
      appendLog("user", `COMMAND: ${cmd}`);
      playCyberBlip(1600, 0.05);
      appendLog("system", "LAUNCHING RECREATION SIMULATION: CYBER-SNAKE BIOMASS HARVEST ARCADE...");
      speak("Launching Cyber-Serpent Biomass Harvest simulation.");
      navigate("/arcade");
      return;
    }

    // Default intent fallback
    appendLog("user", `QUERY: ${cmd}`);
    appendLog(
      "system",
      "Analyzing natural query... Identified nearest vector: 'Autonomous Rescue Pipeline'. Triggering WebMCP execution."
    );
    runAutonomousRescue();
  }

  return (
    <>
      {/* Floating Trigger Pill (Bottom Right) */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-40">
          <button
            onClick={() => {
              playCyberBlip(1400, 0.05);
              setIsOpen(true);
            }}
            className="hud-btn flex items-center gap-2.5 px-4 py-2.5 bg-[#060b18]/95 border border-cyan-400 text-cyan-300 font-mono text-xs font-bold shadow-cyan-glow hover:bg-cyan-950 transition-all group"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <Bot className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="tracking-wider">CYBER COPILOT // WebMCP TERMINAL</span>
            <span className="text-[10px] bg-cyan-950 border border-cyan-500/50 px-1.5 py-0.5 rounded text-pink-400 font-bold">
              AI AGENT
            </span>
          </button>
        </div>
      )}

      {/* Expanded Cyber Copilot Console Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[560px] max-h-[85vh] hud-box border-cyan-400/80 shadow-[0_0_35px_rgba(0,240,255,0.35)] flex flex-col overflow-hidden bg-[#030712]/98 backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan-500/40 p-3 bg-cyan-950/40 font-mono text-xs select-none">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold text-white tracking-widest flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                CYBER COPILOT // WebMCP CONSOLE
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* TTS Voice Toggle */}
              <button
                type="button"
                onClick={() => {
                  playCyberBlip(1100, 0.04);
                  setVoiceEnabled((v) => !v);
                }}
                className={`p-1 rounded border text-[10px] flex items-center gap-1 ${
                  voiceEnabled
                    ? "border-emerald-400 text-emerald-300 bg-emerald-950/60"
                    : "border-cyan-500/30 text-cyan-500/60 hover:text-cyan-300"
                }`}
                title="Toggle Robotic Voice Synthesizer"
              >
                {voiceEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
                <span className="hidden sm:inline">{voiceEnabled ? "VOICE ON" : "VOICE OFF"}</span>
              </button>

              {/* Clear Console */}
              <button
                type="button"
                onClick={() => {
                  playCyberBlip(800, 0.04);
                  setLogs([]);
                }}
                className="p-1 text-cyan-400/70 hover:text-cyan-200"
                title="Clear logs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>

              {/* Minimize / Close */}
              <button
                type="button"
                onClick={() => {
                  playCyberBlip(600, 0.05);
                  setIsOpen(false);
                }}
                className="p-1 text-pink-400 hover:text-pink-300"
                title="Minimize Console"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Mission Macro Selector Buttons */}
          <div className="p-2 border-b border-cyan-500/20 bg-black/40 flex flex-wrap gap-1.5 font-mono text-[11px]">
            <button
              type="button"
              disabled={isExecuting}
              onClick={runAutonomousRescue}
              className="hud-btn px-2.5 py-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/60 text-cyan-300 font-bold flex items-center gap-1 disabled:opacity-50"
            >
              <Zap className="h-3 w-3 text-pink-400" />
              ⚡ AUTO-RESCUE MISSION
            </button>
            <button
              type="button"
              disabled={isExecuting}
              onClick={runQueryBuffer}
              className="hud-btn px-2.5 py-1 bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-400 flex items-center gap-1 disabled:opacity-50"
            >
              BUFFER AUDIT
            </button>
            <button
              type="button"
              disabled={isExecuting}
              onClick={runQueryMetrics}
              className="hud-btn px-2.5 py-1 bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-400 flex items-center gap-1 disabled:opacity-50"
            >
              IMPACT LEDGER
            </button>
            <button
              type="button"
              disabled={isExecuting}
              onClick={() => {
                playCyberBlip(1600, 0.05);
                navigate("/arcade");
              }}
              className="hud-btn px-2.5 py-1 bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/30 text-emerald-400 flex items-center gap-1 disabled:opacity-50"
            >
              <Gamepad2 className="h-3 w-3" />
              CYBER-SNAKE
            </button>
          </div>

          {/* Live Terminal Streaming Log Window */}
          <div className="flex-1 p-3 font-mono text-[11px] overflow-y-auto space-y-1.5 min-h-[220px] max-h-[340px] bg-[#02050c] select-text">
            {logs.map((log) => {
              let colorClass = "text-cyan-400/90";
              if (log.type === "system") colorClass = "text-cyan-500/60";
              if (log.type === "user") colorClass = "text-pink-400 font-bold";
              if (log.type === "call") colorClass = "text-amber-300 font-bold";
              if (log.type === "result") colorClass = "text-emerald-400";
              if (log.type === "success") colorClass = "text-emerald-300 font-black bg-emerald-950/40 px-1 py-0.5 rounded";
              if (log.type === "error") colorClass = "text-pink-500 font-bold bg-pink-950/40 px-1 py-0.5 rounded";

              return (
                <div key={log.id} className="leading-tight flex items-start gap-2">
                  <span className="text-cyan-700 select-none text-[10px] shrink-0 font-light">
                    [{log.timestamp}]
                  </span>
                  <span className={`${colorClass} break-words`}>{log.text}</span>
                </div>
              );
            })}
            {isExecuting && (
              <div className="flex items-center gap-2 text-pink-400 text-xs animate-pulse">
                <span>&gt;&gt; AGENT REASONING &amp; CALLING WebMCP ENGINE</span>
                <span className="w-1.5 h-3.5 bg-pink-400 inline-block animate-ping"></span>
              </div>
            )}
            <div ref={consoleEndRef} />
          </div>

          {/* Interactive Command Input Form */}
          <form
            onSubmit={handleCommandSubmit}
            className="p-2.5 border-t border-cyan-500/30 bg-black/80 flex items-center gap-2 font-mono"
          >
            <span className="text-emerald-400 text-xs font-bold select-none">AGENT://&gt;</span>
            <input
              type="text"
              value={inputCommand}
              disabled={isExecuting}
              onChange={(e) => setInputCommand(e.target.value)}
              placeholder="e.g. 'auto rescue', 'query buffer', 'intake sandwiches'..."
              className="flex-1 bg-transparent border-none text-white text-xs outline-none placeholder:text-cyan-600/60 font-mono disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isExecuting || !inputCommand.trim()}
              className="hud-btn px-3 py-1 bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 disabled:opacity-30 flex items-center gap-1"
            >
              SEND
              <CornerDownLeft className="h-3 w-3" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
