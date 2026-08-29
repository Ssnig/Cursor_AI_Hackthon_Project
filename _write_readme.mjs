import fs from "node:fs";

const p = new URL("./README.md", import.meta.url);
const t = `# FoodLoop

Hackathon MVP that turns commercial food surplus into community rescue plans — split between **donation** and **marketplace discount** — with a React dashboard and the same logic exposed to AI agents via **WebMCP**.

## What it does

1. **Surplus intake** — business logs item, quantity, location, cutoff time
2. **Recommendation** — deterministic donate / discount / recycle split (not ML)
3. **Matching** — rank nearby recipients by distance + capacity
4. **Rescue** — lock a plan (\`pending\` → \`confirmed rescue\`)
5. **Impact** — meals rescued, kg diverted, value recovered

Human UI and WebMCP tools share one in-memory service layer.

## Repo layout

| Path | Role |
|------|------|
| [\`Frontend/\`](Frontend/) | React + Vite + TypeScript dashboard; imports Backend via \`@backend\` |
| [\`Backend/\`](Backend/) | Demo data, store, services, WebMCP tools, n8n webhook client |
| [\`agent.md\`](agent.md) | Product narrative and engineering boundaries |
| [\`run.cmd\`](run.cmd) | One-click Frontend start (Windows) |
| [\`run.md\`](run.md) | Full run / n8n / troubleshooting guide |
| [\`.env\`](.env) | Local secrets (\`N8N_*\`); **do not commit** |

## Architecture

\`\`\`text
React pages  ──┐
               ├──► Backend/src/services ──► in-memory store
WebMCP tools ──┘              │
                              └── createRescue → optional n8n webhook
\`\`\`

- There is **no separate Backend HTTP server**. The Frontend loads Backend JS directly.
- Default n8n target: \`http://127.0.0.1:5678\` (must already be running; \`run.cmd\` does not start it).

## Quick start

**Windows**

\`\`\`bat
run.cmd
\`\`\`

**Manual**

\`\`\`bash
cd Frontend
npm install
npm run dev
\`\`\`

Open **http://localhost:5173**

Port \`5173\` comes from \`Frontend/vite.config.ts\`. Do **not** pass \`--port\` through npm (newer npm can break into \`vite 5173\`).

### Backend checks only (no long-running process)

\`\`\`bash
cd Backend
npm test
npm run demo
\`\`\`

More detail: [\`run.md\`](run.md).

## Demo path

1. **Surplus** — use seed *Chicken Sandwiches* (20 @ 20:00) or log a new item
2. **Matching** — expect **donate 15 / discount 5**; pick Community Food Center
3. **Rescue** — mark complete
4. **Impact** — metrics update; n8n badge shows coordinator status if the workflow is Active

## Stack notes

- Frontend: React Router, Tailwind, shadcn-style UI primitives
- Backend: plain ESM JS (surplus, recommendation, matching, rescue, n8n, WebMCP)
- Env: \`VITE_N8N_RESCUE_WEBHOOK_URL\` (Frontend) + \`N8N_RESCUE_WEBHOOK_URL\` (root \`.env\`)
`;

fs.writeFileSync(p, t, "utf8");
console.log("wrote", p.pathname, fs.statSync(p).size);
