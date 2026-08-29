/**
 * End-to-end demo rehearsal (no UI):
 * intake → recommend → rank → rescue → complete → impact
 */
import {
  getSurplusItems,
  findNearbyRecipients,
  recommendAction,
  createRescue,
  completeRescue,
  getImpactMetrics,
  resetStore,
} from '../src/services/index.js';

resetStore();

const items = getSurplusItems();
console.log('1. Surplus items:', items);

const recommendation = recommendAction(items[0], {
  now: new Date('2026-08-29T18:00:00'),
});
console.log('2. Recommendation:', recommendation);

const nearby = findNearbyRecipients(items[0]);
console.log(
  '3. Nearby recipients:',
  nearby.map((r) => `${r.name} (${r.distanceKm} km, ${r.matchScore}% match)`),
);

const top = nearby[0];
const plan = createRescue(items[0], top.id, recommendation.donateQuantity);
console.log('4. Rescue plan:', {
  id: plan.id,
  recipient: plan.recipientName,
  donation: plan.donationQuantity,
  discount: plan.discountQuantity,
  status: plan.status,
});

const { impactMetrics } = completeRescue(plan.id);
console.log('5. Impact after completion:', impactMetrics);
console.log('6. getImpactMetrics():', getImpactMetrics());
console.log('Demo flow OK');
