import { useEffect, useRef, useState } from "react";
import { playCyberBlip } from "@/lib/cyberAudio";

export type HologramModelType = "sandwich" | "burger" | "bento" | "ramen";

interface FoodHologramProps {
  itemName?: string;
  category?: string;
  quantity?: number;
  availableUntil?: string;
  allowModelSwitch?: boolean;
  size?: number;
}

export default function FoodHologram({
  itemName = "CYBER-SANDWICH",
  quantity = 20,
  availableUntil = "20:00",
  allowModelSwitch = true,
  size = 200
}: FoodHologramProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [model, setModel] = useState<HologramModelType>("sandwich");
  const [isGlitching, setIsGlitching] = useState(false);
  const anglesRef = useRef({ x: 0.35, y: 0 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  // Map category or name to model default
  useEffect(() => {
    const lower = itemName.toLowerCase();
    if (lower.includes("burger") || lower.includes("patty")) {
      setModel("burger");
    } else if (lower.includes("bento") || lower.includes("produce") || lower.includes("salad")) {
      setModel("bento");
    } else if (lower.includes("ramen") || lower.includes("soup") || lower.includes("noodle")) {
      setModel("ramen");
    } else {
      setModel("sandwich");
    }
  }, [itemName]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!isDraggingRef.current) {
        anglesRef.current.y += 0.018;
      }

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const scale = (size / 2) * 0.55;

      let lines: [number[], number[]][] = [];

      if (model === "sandwich") {
        const top = [[-1, -0.6, -0.6], [1, -0.6, -0.6], [0, -0.6, 0.8]];
        const bot = [[-1, 0.6, -0.6], [1, 0.6, -0.6], [0, 0.6, 0.8]];
        lines = [
          [top[0], top[1]], [top[1], top[2]], [top[2], top[0]],
          [bot[0], bot[1]], [bot[1], bot[2]], [bot[2], bot[0]],
          [top[0], bot[0]], [top[1], bot[1]], [top[2], bot[2]],
          [[-0.8, 0, -0.5], [0.8, 0, -0.5]],
          [[0.8, 0, -0.5], [0, 0, 0.6]],
          [[0, 0, 0.6], [-0.8, 0, -0.5]]
        ];
      } else if (model === "burger") {
        const makeCircle = (y: number, r: number, count = 8) => {
          const pts = [];
          for (let i = 0; i < count; i++) {
            const rad = (i / count) * Math.PI * 2;
            pts.push([Math.cos(rad) * r, y, Math.sin(rad) * r]);
          }
          return pts;
        };
        const cTop = makeCircle(-0.7, 0.85);
        const cMid1 = makeCircle(-0.2, 0.98);
        const cMid2 = makeCircle(0.2, 0.98);
        const cBot = makeCircle(0.7, 0.85);

        const connect = (c: number[][]) => {
          for (let i = 0; i < c.length; i++) {
            lines.push([c[i], c[(i + 1) % c.length]]);
          }
        };
        connect(cTop);
        connect(cMid1);
        connect(cMid2);
        connect(cBot);
        for (let i = 0; i < 8; i += 2) {
          lines.push([cTop[i], cBot[i]]);
        }
      } else if (model === "bento") {
        const s = 0.82;
        const pts = [
          [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
          [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s]
        ];
        lines = [
          [pts[0], pts[1]], [pts[1], pts[2]], [pts[2], pts[3]], [pts[3], pts[0]],
          [pts[4], pts[5]], [pts[5], pts[6]], [pts[6], pts[7]], [pts[7], pts[4]],
          [pts[0], pts[4]], [pts[1], pts[5]], [pts[2], pts[6]], [pts[3], pts[7]],
          [[0, -s, -s], [0, -s, s]],
          [[0, s, -s], [0, s, s]],
          [[-s, 0, -s], [s, 0, -s]]
        ];
      } else {
        // Ramen bowl
        const makeRing = (y: number, r: number) => {
          const pts = [];
          for (let i = 0; i < 10; i++) {
            const rad = (i / 10) * Math.PI * 2;
            pts.push([Math.cos(rad) * r, y, Math.sin(rad) * r]);
          }
          return pts;
        };
        const rRim = makeRing(-0.5, 0.95);
        const rSoup = makeRing(-0.2, 0.85);
        const rBase = makeRing(0.65, 0.45);
        const connect = (c: number[][]) => {
          for (let i = 0; i < c.length; i++) {
            lines.push([c[i], c[(i + 1) % c.length]]);
          }
        };
        connect(rRim);
        connect(rSoup);
        connect(rBase);
        for (let i = 0; i < 10; i += 2) {
          lines.push([rRim[i], rBase[i % rBase.length]]);
        }
      }

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = isGlitching ? "#ff0055" : "#00f0ff";
      ctx.shadowColor = isGlitching ? "#ff0055" : "#00f0ff";
      ctx.shadowBlur = 10;

      const project = (p: number[]) => {
        let x = p[0] * Math.cos(anglesRef.current.y) - p[2] * Math.sin(anglesRef.current.y);
        let z = p[0] * Math.sin(anglesRef.current.y) + p[2] * Math.cos(anglesRef.current.y);
        let y = p[1];
        let y2 = y * Math.cos(anglesRef.current.x) - z * Math.sin(anglesRef.current.x);
        let z2 = y * Math.sin(anglesRef.current.x) + z * Math.cos(anglesRef.current.x);

        const fov = 3.2;
        const persp = fov / (fov + z2 + 2);
        return [cx + x * scale * persp, cy + y2 * scale * persp];
      };

      lines.forEach(([p1, p2]) => {
        const [x1, y1] = project(p1);
        const [x2, y2] = project(p2);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.fillStyle = isGlitching ? "#00f0ff" : "#ff0055";
        ctx.fillRect(x1 - 1.5, y1 - 1.5, 3, 3);
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [model, size, isGlitching]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    anglesRef.current.y += dx * 0.01;
    anglesRef.current.x = Math.max(-1.2, Math.min(1.2, anglesRef.current.x + dy * 0.01));
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const triggerGlitch = () => {
    setIsGlitching(true);
    playCyberBlip(1600, 0.05, "sawtooth");
    setTimeout(() => {
      setIsGlitching(false);
      playCyberBlip(750, 0.04, "triangle");
    }, 180);
  };

  return (
    <div className="hud-box relative p-4 flex flex-col items-center select-none overflow-hidden group">
      {/* Top telemetry status */}
      <div className="w-full flex items-center justify-between text-[11px] font-mono tracking-wider border-b border-cyan-500/30 pb-2 mb-2">
        <span className="flex items-center gap-1.5 text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          HOLOGRAM EMITTER [ACTIVE]
        </span>
        <button
          onClick={triggerGlitch}
          className="text-pink-400 hover:text-pink-300 text-[10px] font-bold border border-pink-500/40 px-1.5 py-0.5 rounded"
        >
          GLITCH ⚡
        </button>
      </div>

      {/* Projection container */}
      <div
        className="relative flex items-center justify-center cursor-grab active:cursor-grabbing my-2"
        style={{ width: size, height: size }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Hologram Light Cone */}
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/15 via-transparent to-transparent pointer-events-none rounded-full"></div>
        
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="relative z-10"
        />

        {/* Scanlines overlay */}
        <div className="absolute inset-0 pointer-events-none scanlines-overlay opacity-40"></div>
      </div>

      {/* Model switcher */}
      {allowModelSwitch && (
        <div className="w-full grid grid-cols-4 gap-1 text-[10px] font-mono font-bold mt-1">
          {(["sandwich", "burger", "bento", "ramen"] as HologramModelType[]).map((m) => (
            <button
              key={m}
              onClick={() => {
                setModel(m);
                playCyberBlip(620, 0.05);
              }}
              className={`hud-btn py-1 px-0.5 text-center transition-all ${
                model === m
                  ? "bg-cyan-500 text-black font-extrabold shadow-[0_0_12px_#00f0ff]"
                  : "bg-cyan-950/60 text-cyan-400 hover:bg-cyan-900/60 border border-cyan-500/30"
              }`}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* Telemetry data strip */}
      <div className="w-full mt-3 pt-2 border-t border-cyan-500/20 grid grid-cols-2 gap-1 text-[11px] font-mono text-cyan-400/90 leading-snug">
        <div>
          ID: <span className="text-white font-bold">{itemName}</span>
        </div>
        <div>
          UNITS: <span className="text-amber-400 font-bold">{quantity} PKG</span>
        </div>
        <div>
          CUTOFF: <span className="text-pink-400 font-bold">{availableUntil}</span>
        </div>
        <div>
          STATE: <span className="text-emerald-400 font-bold">RESCUE READY</span>
        </div>
      </div>
    </div>
  );
}

