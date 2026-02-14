/**
 * Cost Tracker — Calculate and track API costs
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORAGE_FILE = path.join(__dirname, '.costs.json');

// Model pricing per million tokens
export const PRICING = {
  'anthropic/claude-haiku-4-5': { input: 0.25, output: 1.25 },
  'anthropic/claude-sonnet-4-5': { input: 3.00, output: 15.00 },
  'anthropic/claude-opus-4-6': { input: 15.00, output: 75.00 },
  // Aliases
  'haiku': { input: 0.25, output: 1.25 },
  'sonnet': { input: 3.00, output: 15.00 },
  'opus': { input: 15.00, output: 75.00 },
  // Ollama (free)
  'ollama/llama3.2:3b': { input: 0, output: 0 },
  'ollama': { input: 0, output: 0 },
};

/**
 * Calculate cost for a request
 */
export function calculateCost(model, inputTokens, outputTokens) {
  const pricing = PRICING[model] || PRICING['haiku']; // Default to haiku if unknown
  
  const inputCost = (inputTokens / 1_000_000) * pricing.input;
  const outputCost = (outputTokens / 1_000_000) * pricing.output;
  
  return inputCost + outputCost;
}

/**
 * Load costs from storage
 */
export async function loadCosts() {
  try {
    const data = await fs.readFile(STORAGE_FILE, 'utf-8');
    const stored = JSON.parse(data);
    
    // Check if data is stale (>24h)
    const now = Date.now();
    if (stored.timestamp && (now - stored.timestamp > 24 * 60 * 60 * 1000)) {
      return getEmptyState();
    }
    
    return stored;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return getEmptyState();
    }
    throw err;
  }
}

/**
 * Save costs to storage
 */
export async function saveCosts(costs) {
  await fs.writeFile(STORAGE_FILE, JSON.stringify({
    ...costs,
    timestamp: Date.now(),
  }, null, 2));
}

/**
 * Get empty state
 */
function getEmptyState() {
  return {
    timestamp: Date.now(),
    global: 0,
    byModel: {},
    byUser: {},
    byKey: {},
    requests: [],
  };
}

/**
 * Track a request
 */
export async function trackRequest(model, inputTokens, outputTokens, user = 'unknown', apiKey = 'default') {
  const cost = calculateCost(model, inputTokens, outputTokens);
  const costs = await loadCosts();
  
  // Update global
  costs.global += cost;
  
  // Update by model
  costs.byModel[model] = (costs.byModel[model] || 0) + cost;
  
  // Update by user
  costs.byUser[user] = (costs.byUser[user] || 0) + cost;
  
  // Update by key
  costs.byKey[apiKey] = (costs.byKey[apiKey] || 0) + cost;
  
  // Log request
  costs.requests.push({
    timestamp: Date.now(),
    model,
    inputTokens,
    outputTokens,
    cost,
    user,
    apiKey,
  });
  
  // Keep only last 1000 requests
  if (costs.requests.length > 1000) {
    costs.requests = costs.requests.slice(-1000);
  }
  
  await saveCosts(costs);
  
  return { cost, total: costs.global };
}

/**
 * Get current costs
 */
export async function getCosts() {
  return await loadCosts();
}

/**
 * Reset costs
 */
export async function resetCosts() {
  const empty = getEmptyState();
  await saveCosts(empty);
  return empty;
}
