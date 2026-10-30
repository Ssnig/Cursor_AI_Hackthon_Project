import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Award,
  ChevronRight,
  Flame,
  Gamepad2,
  Pause,
  Play,
  RotateCcw,
  Shield,
  Sparkles,
  Trophy,
  Zap
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { useFoodLoop } from "@/context/FoodLoopContext";
import {
  isAudioMuted,
  playCyberBlip,
  playHazardAlarm,
  playProtocolEngaged
} from "@/lib/cyberAudio";

interface Position {
  x: number;
  y: number;
}

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

interface FoodItem {
  pos: Position;
  type: "sandwich" | "burger" | "bento" | "ramen" | "overclock";
  symbol: string;
  label: string;
  points: number;
}

const GRID_SIZE = 22;
const CELL_SIZE = 20; // 440px canvas

const FOOD_TYPES: Array<Omit<FoodItem, "pos">> = [
  { type: "sandwich", symbol: "🥪", label: "CYBER-SANDWICH", points: 10 },
  { type: "burger", symbol: "🍔", label: "PLASMA-BURGER", points: 20 },
  { type: "bento", symbol: "🍱", label: "QUANTUM-BENTO", points: 30 },
  { type: "ramen", symbol: "🍜", label: "CYBER-RAMEN", points: 25 },
  { type: "overclock", symbol: "⚡", label: "OVERCLOCK CORE", points: 50 }
];

export default function SnakeGame() {
  const navigate = useNavigate();
  const { submitSurplus, business } = useFoodLoop();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [snake, setSnake] = useState<Position[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ]);
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const nextDirectionRef = useRef<Direction>("RIGHT");

  const [food, setFood] = useState<FoodItem>({
    pos: { x: 16, y: 10 },
    type: "sandwich",
    symbol: "🥪",
    label: "CYBER-SANDWICH",
    points: 10
  });

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem("foodloop.snake.highscore") || "0");
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [wallMode, setWallMode] = useState<"BARRIER" | "WARP">("BARRIER");
  const [speedMode, setSpeedMode] = useState<"NORMAL" | "OVERCLOCK" | "HYPER">("NORMAL");

  // Speed timings in ms
  const speedMs = speedMode === "NORMAL" ? 110 : speedMode === "OVERCLOCK" ? 75 : 45;

  // Generate random food position not on snake
  const spawnFood = useCallback((currentSnake: Position[]): FoodItem => {
    let newPos: Position;
    let collision: boolean;
    do {
      newPos = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      collision = currentSnake.some((seg) => seg.x === newPos.x && seg.y === newPos.y);
    } while (collision);

    const randType =
      Math.random() > 0.85
        ? FOOD_TYPES[4] // 15% chance of overclock core
        : FOOD_TYPES[Math.floor(Math.random() * 4)];

    return {
      pos: newPos,
      ...randType
    };
  }, []);

  // Reset Game
  const resetGame = useCallback(() => {
    const initSnake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    setSnake(initSnake);
    setDirection("RIGHT");
    nextDirectionRef.current = "RIGHT";
    setFood(spawnFood(initSnake));
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    playProtocolEngaged();
  }, [spawnFood]);

  // Handle Keyboard Inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === " ") {
        setIsPlaying((p) => !p);
        return;
      }

      const curr = nextDirectionRef.current;
      if ((e.key === "ArrowUp" || e.key === "w" || e.key === "W") && curr !== "DOWN") {
        nextDirectionRef.current = "UP";
        playCyberBlip(1100, 0.02);
      } else if ((e.key === "ArrowDown" || e.key === "s" || e.key === "S") && curr !== "UP") {
        nextDirectionRef.current = "DOWN";
        playCyberBlip(1100, 0.02);
      } else if ((e.key === "ArrowLeft" || e.key === "a" || e.key === "A") && curr !== "RIGHT") {
        nextDirectionRef.current = "LEFT";
        playCyberBlip(1100, 0.02);
      } else if ((e.key === "ArrowRight" || e.key === "d" || e.key === "D") && curr !== "LEFT") {
        nextDirectionRef.current = "RIGHT";
        playCyberBlip(1100, 0.02);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Main Game Loop Interval
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const dir = nextDirectionRef.current;
        setDirection(dir);

        let newX = head.x;
        let newY = head.y;

        if (dir === "UP") newY -= 1;
        if (dir === "DOWN") newY += 1;
        if (dir === "LEFT") newX -= 1;
        if (dir === "RIGHT") newX += 1;

        // Check Wall Collision
        if (wallMode === "BARRIER") {
          if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) {
            handleGameOver();
            return prevSnake;
          }
        } else {
          // Wrap Around
          if (newX < 0) newX = GRID_SIZE - 1;
          if (newX >= GRID_SIZE) newX = 0;
          if (newY < 0) newY = GRID_SIZE - 1;
          if (newY >= GRID_SIZE) newY = 0;
        }

        const newHead: Position = { x: newX, y: newY };

        // Check Self Collision
        if (prevSnake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
          handleGameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check Food Collision
        if (newHead.x === food.pos.x && newHead.y === food.pos.y) {
          playCyberBlip(1650, 0.05, "triangle");
          setScore((s) => {
            const nextScore = s + food.points;
            if (nextScore > highScore) {
              setHighScore(nextScore);
              localStorage.setItem("foodloop.snake.highscore", String(nextScore));
            }
            return nextScore;
          });
          setFood(spawnFood(newSnake));
        } else {
          // Remove tail if didn't eat
          newSnake.pop();
        }

        return newSnake;
      });
    }, speedMs);

    return () => clearInterval(interval);
  }, [isPlaying, isGameOver, food, speedMs, wallMode, highScore, spawnFood]);

  function handleGameOver() {
    setIsGameOver(true);
    setIsPlaying(false);
    playHazardAlarm();
  }

  // Draw Game onto Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Cyber Grid Lines
    ctx.strokeStyle = "rgba(0, 240, 255, 0.06)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw Food
    const foodX = food.pos.x * CELL_SIZE;
    const foodY = food.pos.y * CELL_SIZE;

    // Pulsing Food Glow
    ctx.shadowColor = food.type === "overclock" ? "#ff0055" : "#00f0ff";
    ctx.shadowBlur = 12;
    ctx.fillStyle = food.type === "overclock" ? "rgba(255, 0, 85, 0.25)" : "rgba(0, 240, 255, 0.25)";
    ctx.fillRect(foodX + 2, foodY + 2, CELL_SIZE - 4, CELL_SIZE - 4);

    // Food Emoji / Symbol
    ctx.font = "14px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(food.symbol, foodX + CELL_SIZE / 2, foodY + CELL_SIZE / 2);

    // Draw Snake Segments
    snake.forEach((seg, index) => {
      const segX = seg.x * CELL_SIZE;
      const segY = seg.y * CELL_SIZE;

      if (index === 0) {
        // Head
        ctx.shadowColor = "#00f0ff";
        ctx.shadowBlur = 15;
        ctx.fillStyle = "#00f0ff";
        ctx.fillRect(segX + 1, segY + 1, CELL_SIZE - 2, CELL_SIZE - 2);

        // Direction Reticle / Eyes
        ctx.fillStyle = "#030712";
        if (direction === "RIGHT") {
          ctx.fillRect(segX + 13, segY + 4, 3, 3);
          ctx.fillRect(segX + 13, segY + 13, 3, 3);
        } else if (direction === "LEFT") {
          ctx.fillRect(segX + 4, segY + 4, 3, 3);
          ctx.fillRect(segX + 4, segY + 13, 3, 3);
        } else if (direction === "UP") {
          ctx.fillRect(segX + 4, segY + 4, 3, 3);
          ctx.fillRect(segX + 13, segY + 4, 3, 3);
        } else {
          ctx.fillRect(segX + 4, segY + 13, 3, 3);
          ctx.fillRect(segX + 13, segY + 13, 3, 3);
        }
      } else {
        // Body Segment with gradient towards emerald
        const ratio = index / snake.length;
        ctx.shadowColor = "#00ff66";
        ctx.shadowBlur = 8;
        ctx.fillStyle = ratio > 0.5 ? "#10b981" : "#06b6d4";
        ctx.fillRect(segX + 2, segY + 2, CELL_SIZE - 4, CELL_SIZE - 4);
      }
    });

    // Reset shadow
    ctx.shadowBlur = 0;
  }, [snake, food, direction]);

  // Convert game score to real surplus batch!
  function handleExportToSurplus() {
    const portions = Math.max(5, Math.floor(score / 5));
    submitSurplus({
      name: `Arcade Harvest (${portions} portions)`,
      category: "Prepared food",
      quantity: portions,
      availableUntil: "20:00",
      location: business?.location || business?.name || "Arcade Depository"
    });
    playProtocolEngaged();
    navigate("/matching");
  }

  // Mobile D-pad control
  const triggerMove = (dir: Direction) => {
    const curr = nextDirectionRef.current;
    if (dir === "UP" && curr !== "DOWN") nextDirectionRef.current = "UP";
    if (dir === "DOWN" && curr !== "UP") nextDirectionRef.current = "DOWN";
    if (dir === "LEFT" && curr !== "RIGHT") nextDirectionRef.current = "LEFT";
    if (dir === "RIGHT" && curr !== "LEFT") nextDirectionRef.current = "RIGHT";
    playCyberBlip(1100, 0.02);
  };

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="CYBER-RECREATION TERMINAL"
        title="CYBER-SERPENT // BIOMASS HARVEST"
        description="Harvest holographic food morsels across the coordinate matrix. Test reflexes, unlock high scores, or transfer your harvested portions directly into real surplus rescues."
        action={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              className="hud-btn bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-xs font-mono"
              onClick={resetGame}
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              NEW SIMULATION
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-start">
        {/* Left Side: Game Canvas & Overlays */}
        <div className="hud-box p-5 flex flex-col items-center relative overflow-hidden select-none">
          {/* Top Score Ribbon */}
          <div className="w-full flex items-center justify-between border-b border-cyan-500/30 pb-3 mb-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                HARVEST: <span className="text-white text-base font-black">{score}</span>
              </span>
              <span className="text-cyan-500/80">
                LENGTH: <span className="text-emerald-400 font-bold">{snake.length}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-400" />
              <span className="text-amber-400 font-bold">HI: {highScore}</span>
            </div>
          </div>

          {/* Canvas Box */}
          <div className="relative border border-cyan-500/40 rounded bg-black/80 shadow-[0_0_25px_rgba(0,240,255,0.2)] overflow-hidden">
            <canvas
              ref={canvasRef}
              width={GRID_SIZE * CELL_SIZE}
              height={GRID_SIZE * CELL_SIZE}
              className="block cursor-pointer"
              onClick={() => {
                if (!isPlaying && !isGameOver) setIsPlaying(true);
              }}
            />

            {/* Scanlines overlay */}
            <div className="absolute inset-0 pointer-events-none scanlines-overlay opacity-30"></div>

            {/* Start Screen Overlay */}
            {!isPlaying && !isGameOver && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center font-mono">
                <Gamepad2 className="h-12 w-12 text-cyan-400 mb-3 animate-bounce" />
                <h3 className="font-display text-xl font-black text-white tracking-widest neon-text-glow">
                  CYBER-SERPENT ONLINE
                </h3>
                <p className="text-xs text-cyan-400/80 mt-2 max-w-xs leading-relaxed">
                  Steer using <strong>Arrow Keys</strong> or <strong>WASD</strong>. Collect food to grow and boost biomass yield.
                </p>
                <Button
                  onClick={resetGame}
                  className="hud-btn mt-5 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-black text-xs uppercase px-6 py-5 shadow-cyan-glow"
                >
                  <Play className="h-4 w-4 mr-1.5" />
                  INITIALIZE HARVEST
                </Button>
              </div>
            )}

            {/* Game Over Screen Overlay */}
            {isGameOver && (
              <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center font-mono z-30">
                <span className="text-[10px] bg-pink-950/80 border border-pink-500 px-2 py-0.5 rounded text-pink-400 font-bold tracking-widest">
                  DECAY VECTOR EXCEEDED
                </span>
                <h3 className="font-display text-2xl font-black text-pink-500 mt-2 tracking-wider neon-text-magenta">
                  SIMULATION TERMINATED
                </h3>
                <p className="text-xs text-cyan-300 mt-2">
                  FINAL BIOMASS SCORE: <strong className="text-white text-base">{score}</strong>
                </p>

                <div className="flex flex-col gap-2 mt-5 w-full max-w-xs">
                  <Button
                    onClick={resetGame}
                    className="hud-btn bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-black text-xs uppercase py-3 shadow-cyan-glow"
                  >
                    <RotateCcw className="h-4 w-4 mr-1.5" />
                    RETRY SIMULATION
                  </Button>

                  {score > 0 && (
                    <Button
                      onClick={handleExportToSurplus}
                      className="hud-btn bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-black text-xs uppercase py-3 shadow-green-glow"
                    >
                      <Sparkles className="h-4 w-4 mr-1.5" />
                      DISPATCH MEALS TO SURPLUS BOARD ({Math.max(5, Math.floor(score / 5))} PKG)
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* On-Screen Mobile D-Pad Controls */}
          <div className="mt-5 w-full flex flex-col items-center sm:hidden">
            <div className="grid grid-cols-3 gap-2 w-48 font-mono">
              <div></div>
              <button
                type="button"
                onClick={() => triggerMove("UP")}
                className="hud-btn p-3 bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center active:bg-cyan-500 active:text-black"
              >
                <ArrowUp className="h-5 w-5" />
              </button>
              <div></div>

              <button
                type="button"
                onClick={() => triggerMove("LEFT")}
                className="hud-btn p-3 bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center active:bg-cyan-500 active:text-black"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="hud-btn p-3 bg-cyan-900 border border-cyan-400 text-cyan-200 flex items-center justify-center font-bold text-xs"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => triggerMove("RIGHT")}
                className="hud-btn p-3 bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center active:bg-cyan-500 active:text-black"
              >
                <ArrowRight className="h-5 w-5" />
              </button>

              <div></div>
              <button
                type="button"
                onClick={() => triggerMove("DOWN")}
                className="hud-btn p-3 bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center active:bg-cyan-500 active:text-black"
              >
                <ArrowDown className="h-5 w-5" />
              </button>
              <div></div>
            </div>
          </div>
        </div>

        {/* Right Side: Settings & Telemetry */}
        <div className="grid gap-5">
          {/* Active Target Hologram Telemetry */}
          <div className="hud-box p-5 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3 mb-3">
              <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-pink-400" />
                ACTIVE FOOD TARGET
              </span>
              <span className="text-pink-400 font-bold">+{food.points} PTS</span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-cyan-950/40 border border-cyan-500/30 rounded">
              <span className="text-3xl">{food.symbol}</span>
              <div>
                <p className="font-bold text-white uppercase">{food.label}</p>
                <p className="text-[11px] text-cyan-400/80 mt-0.5">
                  COORDINATES: [{food.pos.x}, {food.pos.y}]
                </p>
              </div>
            </div>
          </div>

          {/* Simulation Modifiers / Settings */}
          <div className="hud-box p-5 font-mono text-xs">
            <h4 className="font-bold text-white tracking-wider border-b border-cyan-500/30 pb-3 mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-cyan-400" />
              SIMULATION MODIFIERS
            </h4>

            {/* Wall Mode */}
            <div className="mb-4">
              <label className="text-[11px] text-cyan-400/80 block mb-1.5">BOUNDARY PHYSICS:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playCyberBlip(1100, 0.03);
                    setWallMode("BARRIER");
                  }}
                  className={`hud-btn py-1.5 text-xs font-bold ${
                    wallMode === "BARRIER"
                      ? "bg-cyan-500 text-black shadow-cyan-glow"
                      : "bg-cyan-950/60 text-cyan-400 border border-cyan-500/30"
                  }`}
                >
                  HARD BARRIER
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playCyberBlip(1100, 0.03);
                    setWallMode("WARP");
                  }}
                  className={`hud-btn py-1.5 text-xs font-bold ${
                    wallMode === "WARP"
                      ? "bg-cyan-500 text-black shadow-cyan-glow"
                      : "bg-cyan-950/60 text-cyan-400 border border-cyan-500/30"
                  }`}
                >
                  QUANTUM WRAP
                </button>
              </div>
            </div>

            {/* Speed Mode */}
            <div>
              <label className="text-[11px] text-cyan-400/80 block mb-1.5">CLOCK OVERCLOCK:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["NORMAL", "OVERCLOCK", "HYPER"] as const).map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => {
                      playCyberBlip(1200, 0.03);
                      setSpeedMode(spd);
                    }}
                    className={`hud-btn py-1.5 text-[10px] font-bold ${
                      speedMode === spd
                        ? "bg-pink-600 text-white shadow-magenta-glow"
                        : "bg-cyan-950/60 text-cyan-400 border border-cyan-500/30"
                    }`}
                  >
                    {spd}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Harvest Yield Conversion Explainer */}
          <div className="hud-box p-5 font-mono text-xs border-emerald-500/30 bg-emerald-950/15">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
              <Award className="h-4 w-4" />
              BIOMASS CONVERSION PROTOCOL
            </div>
            <p className="text-[11px] text-cyan-400/80 leading-relaxed">
              Every food morsel captured in Cyber-Serpent increments your harvest telemetry. When your run ends, you can convert your arcade score directly into an authentic FoodLoop rescue lot and route it to local shelters!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

