/**
 * Rescue WebMCP tools — thin adapters over rescueService.
 * No business logic here.
 */

import { createRescue } from '../services/rescueService.js';
import { registerOneTool, withToolLogging } from './toolHelpers.js';

/**
 * @param {object} modelContext - document.modelContext | navigator.modelContext
 * @param {{ signal?: AbortSignal }} [registerOptions]
 */
export async function registerRescueTools(modelContext, registerOptions) {
  await registerOneTool(
    modelContext,
    {
      name: 'createRescue',
      description:
        'Create a rescue plan connecting a business surplus item with a recipient organization.',
      inputSchema: {
        type: 'object',
        properties: {
          foodItemId: {
            type: 'string',
            description: 'Surplus item id',
          },
          recipientId: {
            type: 'string',
            description: 'Recipient organization id',
          },
          quantity: {
            type: 'number',
            description: 'Donation quantity to allocate to the recipient',
          },
        },
        required: ['foodItemId', 'recipientId', 'quantity'],
      },
      annotations: { readOnlyHint: false },
      execute: withToolLogging('createRescue', (args) =>
        createRescue(args.foodItemId, args.recipientId, args.quantity),
      ),
    },
    registerOptions,
  );
}
