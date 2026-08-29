# FoodLoop Backend (Person B)

In-memory business logic, matching, recommendations, and WebMCP tools.
No external server, auth, payments, or n8n.

## Layout

```text
Backend/
  src/
    data/
      demoData.js      # ABC Bakery surplus + recipients
      store.js         # shared in-memory state
    services/
      surplusService.js
      matchingService.js
      recommendationService.js
      rescueService.js
      index.js         # barrel export for App.jsx
    webmcp/
      registerTools.js    # feature-detect + register all tools
      inventoryTools.js   # getSurplusItems, recommendAction
      matchingTools.js    # findNearbyRecipients
      rescueTools.js      # createRescue
      toolHelpers.js      # logging + getModelContext
      index.js
  test/
  scripts/demo-flow.js
```

## WebMCP (Chrome Imperative API only)

```js
await document.modelContext.registerTool(toolDef, { signal });
```

Falls back to `navigator.modelContext` when needed. If unsupported, registration is skipped and the site still works. Console logs: `register`, `invoke`, `result`.

## Demo data

| Entity | Value |
|--------|--------|
| Business | ABC Bakery |
| Surplus | Chicken Sandwiches × 20, until 20:00, status `pending` |
| Recipient | Community Food Center — 2.1 km, capacity 30 |
| Recipient | Hope Shelter — 3.4 km, capacity 50 |
| Recipient | University Community Kitchen — 4.7 km, capacity 20 |

## Public API (import from services)

```js
import {
  getSurplusItems,
  findNearbyRecipients,
  recommendAction,
  createRescue,
  completeRescue,
  getImpactMetrics,
  getState,
  subscribe,
  resetStore,
} from '../Backend/src/services/index.js';

import { registerFoodLoopTools } from '../Backend/src/webmcp/index.js';
```

### Function contracts

```js
getSurplusItems()
findNearbyRecipients(foodItem)   // id string or item object
recommendAction(foodItem)
createRescue(foodItem, recipient, quantity)
```

## Frontend integration (`src/App.jsx`)

```jsx
import { useEffect, useState } from 'react';
import {
  getSurplusItems,
  recommendAction,
  findNearbyRecipients,
  createRescue,
  completeRescue,
  getImpactMetrics,
  subscribe,
} from '../../Backend/src/services/index.js';
import { registerFoodLoopTools } from '../../Backend/src/webmcp/index.js';

useEffect(() => {
  const controller = new AbortController();
  registerFoodLoopTools({ signal: controller.signal });
  return () => controller.abort();
}, []);

useEffect(() => subscribe(() => {
  setItems(getSurplusItems());
  setImpact(getImpactMetrics());
}), []);
```

Adjust the relative import path if your React app lives under `Frontend/`.

## Deterministic logic

- **Urgency:** ≤60m critical, ≤120m high, ≤240m medium, else low
- **Donation split:** `min(quantity, nearby capacity)`; remainder discounted
- **Match score:** `0.6 * proximity + 0.4 * capacity` → percent 0–100
- **Rescue:** sets item status to `confirmed rescue`, decrements recipient capacity
- **Complete:** updates meals rescued, kg diverted, value recovered

## Commands

```bash
cd Backend
npm test
npm run demo
```
