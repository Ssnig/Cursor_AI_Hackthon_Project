# FoodLoop Backend (Person B)

In-memory business logic, matching, recommendations, WebMCP tools, and n8n rescue coordination.

## Layout

```text
Backend/
  src/
    data/
      demoData.js
      store.js
    services/
      surplusService.js
      matchingService.js
      recommendationService.js
      rescueService.js
      n8nService.js
      index.js
    webmcp/
      registerTools.js
      inventoryTools.js
      matchingTools.js
      rescueTools.js
      toolHelpers.js
      index.js
  test/
  scripts/
    demo-flow.js
    n8n-rescue-workflow.json
```

## WebMCP tools

`getSurplusItems`, `recommendAction`, `findNearbyRecipients`, `createRescue`, `completeRescue`, `getImpactMetrics`

## n8n rescue coordinator

`createRescue` POSTs `rescue.created` to:

```text
POST http://127.0.0.1:5678/webhook/foodloop-rescue-created
```

Workflow: **FoodLoop - Rescue Coordinator** (must be Active). Failures never roll back the rescue.

### Frontend handoff

1. Never put `N8N_API_KEY` in Vite/React code.
2. Frontend env:

```env
VITE_N8N_RESCUE_WEBHOOK_URL=/api/n8n/webhook/foodloop-rescue-created
```

3. Vite proxy:

```js
proxy: {
  '/api/n8n': {
    target: 'http://127.0.0.1:5678',
    changeOrigin: true,
    rewrite: (p) => p.replace(/^\/api\/n8n/, ''),
  },
}
```

4. Badge: `getN8nNotificationStatus()` → show "Coordinator notified" when `lastStatus === 'ok'`.

## Public API

```js
import {
  getSurplusItems,
  findNearbyRecipients,
  recommendAction,
  createRescue,
  completeRescue,
  getImpactMetrics,
  getN8nNotificationStatus,
  getState,
  subscribe,
  resetStore,
} from '../Backend/src/services/index.js';
import { registerFoodLoopTools } from '../Backend/src/webmcp/index.js';
```

## Commands

```bash
cd Backend
npm test
npm run demo
```
