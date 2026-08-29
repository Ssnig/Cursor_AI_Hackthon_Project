/**
 * FoodLoop backend test harness (not the real product UI).
 * Steps through surplus → recommend → match → rescue → complete.
 */
import './style.css';
import {
  getSurplusItems,
  recommendAction,
  findNearbyRecipients,
  createRescue,
  completeRescue,
  getImpactMetrics,
  listRescuePlans,
  resetStore,
  subscribe,
  getState,
  getN8nNotificationStatus,
  resetN8nNotificationStatus,
} from '@backend/services/index.js';
import { registerFoodLoopTools } from '@backend/webmcp/index.js';

const app = document.querySelector('#app');

/** Fixed "2 hours before 20:00" so demo always hits donate 15 / discount 5. */
const DEMO_NOW = new Date('2026-08-29T18:00:00');

let lastRecommendation = null;
let lastRecipients = [];
let lastPlan = null;
let errorMsg = '';

function snapshot() {
  return {
    items: getSurplusItems(),
    recipients: getState().recipients,
    plans: listRescuePlans(),
    impact: getImpactMetrics(),
  };
}

function render() {
  const { items, recipients, plans, impact } = snapshot();
  const item = items[0];
  const n8n = getN8nNotificationStatus();
  const n8nBadge =
    n8n.lastStatus === 'ok'
      ? 'Coordinator notified ✓'
      : n8n.lastStatus === 'pending'
        ? 'Notifying coordinator…'
        : n8n.lastStatus === 'error'
          ? `n8n error: ${n8n.lastMessage}`
          : n8n.lastStatus === 'skipped'
            ? 'n8n skipped'
            : 'n8n idle';

  app.innerHTML = `
    <h1>FoodLoop Backend Test</h1>
    <p class="sub">
      Example page only — wires to <code>Backend/src/services</code>.
      Demo clock locked at <strong>18:00</strong> (2h before 20:00 cutoff).
      <span class="badge">WebMCP: see console</span>
      <span class="badge">${n8nBadge}</span>
    </p>

    <div class="actions">
      <button id="btn-recommend">1. Recommend action</button>
      <button id="btn-match">2. Find nearby recipients</button>
      <button id="btn-rescue" ${!lastRecommendation || !lastRecipients[0] || item?.status !== 'pending' ? 'disabled' : ''}>
        3. Create rescue (donate ${lastRecommendation?.donateQuantity ?? '…'})
      </button>
      <button id="btn-complete" class="secondary" ${!lastPlan || lastPlan.status !== 'planned' ? 'disabled' : ''}>
        4. Complete rescue
      </button>
      <button id="btn-reset" class="danger">Reset demo data</button>
    </div>
    ${errorMsg ? `<p class="err">${errorMsg}</p>` : ''}

    <div class="grid">
      <section>
        <h2>Surplus items</h2>
        <pre>${escapeJson(items)}</pre>
      </section>

      <section>
        <h2>Recommendation</h2>
        <pre>${escapeJson(lastRecommendation || { hint: 'Click “Recommend action”' })}</pre>
      </section>

      <section>
        <h2>Nearby recipients</h2>
        ${
          lastRecipients.length
            ? `<ul>${lastRecipients
                .map(
                  (r) =>
                    `<li><strong>${r.name}</strong> — ${r.distanceKm} km, capacity ${r.availableCapacity}, match ${r.matchScore}%</li>`,
                )
                .join('')}</ul>`
            : '<p class="sub">Click “Find nearby recipients”</p>'
        }
        <pre>${escapeJson(lastRecipients)}</pre>
      </section>

      <section>
        <h2>Recipient directory (live capacity)</h2>
        <pre>${escapeJson(recipients)}</pre>
      </section>

      <section>
        <h2>Rescue plans</h2>
        <pre>${escapeJson(plans)}</pre>
      </section>

      <section>
        <h2>Impact metrics</h2>
        <pre>${escapeJson(impact)}</pre>
      </section>

      <section>
        <h2>n8n coordinator</h2>
        <pre>${escapeJson(n8n)}</pre>
      </section>
    </div>
  `;

  document.getElementById('btn-recommend').onclick = () => {
    errorMsg = '';
    try {
      lastRecommendation = recommendAction(item, { now: DEMO_NOW });
    } catch (e) {
      errorMsg = e.message;
    }
    render();
  };

  document.getElementById('btn-match').onclick = () => {
    errorMsg = '';
    try {
      lastRecipients = findNearbyRecipients(item);
    } catch (e) {
      errorMsg = e.message;
    }
    render();
  };

  document.getElementById('btn-rescue').onclick = async () => {
    errorMsg = '';
    try {
      const top = lastRecipients[0];
      lastPlan = createRescue(
        item,
        top.id,
        lastRecommendation.donateQuantity,
        { now: DEMO_NOW },
      );
      render();
      // Give fire-and-forget webhook a moment, then refresh badge.
      setTimeout(() => render(), 600);
    } catch (e) {
      errorMsg = e.message;
      render();
    }
  };

  document.getElementById('btn-complete').onclick = () => {
    errorMsg = '';
    try {
      const result = completeRescue(lastPlan.id);
      lastPlan = result.plan;
    } catch (e) {
      errorMsg = e.message;
    }
    render();
  };

  document.getElementById('btn-reset').onclick = () => {
    errorMsg = '';
    resetStore();
    resetN8nNotificationStatus();
    lastRecommendation = null;
    lastRecipients = [];
    lastPlan = null;
    render();
  };
}

function escapeJson(value) {
  return JSON.stringify(value, null, 2)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;');
}

// Keep UI in sync if store changes elsewhere (e.g. WebMCP tools).
subscribe(() => render());

registerFoodLoopTools().then((result) => {
  console.log('[test_front] WebMCP registration:', result);
});

render();
