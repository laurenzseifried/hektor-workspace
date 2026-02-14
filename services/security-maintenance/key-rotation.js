/**
 * Key Rotation Tracking & Reminders
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KEY_REGISTRY = path.join(__dirname, '.key-registry.json');

async function loadRegistry() {
  try {
    return JSON.parse(await fs.readFile(KEY_REGISTRY, 'utf-8'));
  } catch {
    return { keys: {} };
  }
}

async function saveRegistry(data) {
  await fs.writeFile(KEY_REGISTRY, JSON.stringify(data, null, 2));
}

/**
 * Register a new key
 */
export async function registerKey(name, createdAt = new Date().toISOString()) {
  const registry = await loadRegistry();
  registry.keys[name] = { createdAt, lastAlertAt: null };
  await saveRegistry(registry);
  return registry.keys[name];
}

/**
 * Check key ages & send reminders
 */
export async function checkKeyRotations() {
  const registry = await loadRegistry();
  const reminders = [];
  const now = Date.now();
  const EIGHTY_DAYS = 80 * 24 * 60 * 60 * 1000;
  const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;
  const HUNDRED_DAYS = 100 * 24 * 60 * 60 * 1000;
  
  for (const [name, key] of Object.entries(registry.keys || {})) {
    const age = now - new Date(key.createdAt).getTime();
    const daysOld = Math.floor(age / (24 * 60 * 60 * 1000));
    
    if (age > HUNDRED_DAYS) {
      reminders.push({
        key: name,
        daysOld,
        level: 'CRITICAL',
        message: `🚨 CRITICAL: ${name} is ${daysOld} days old - ROTATE IMMEDIATELY`,
      });
    } else if (age > NINETY_DAYS) {
      reminders.push({
        key: name,
        daysOld,
        level: 'URGENT',
        message: `⚠️  URGENT: ${name} is ${daysOld} days old - rotation overdue`,
      });
    } else if (age > EIGHTY_DAYS) {
      reminders.push({
        key: name,
        daysOld,
        level: 'WARNING',
        message: `⏰ WARNING: ${name} rotation due in ${90 - daysOld} days`,
      });
    }
  }
  
  return reminders;
}

/**
 * Mark key as rotated
 */
export async function rotateKey(name) {
  const registry = await loadRegistry();
  if (registry.keys[name]) {
    registry.keys[name].createdAt = new Date().toISOString();
    registry.keys[name].lastRotated = new Date().toISOString();
    await saveRegistry(registry);
  }
}

/**
 * Get all key statuses
 */
export async function getKeyStatus() {
  const registry = await loadRegistry();
  const now = Date.now();
  
  const status = {};
  for (const [name, key] of Object.entries(registry.keys || {})) {
    const daysOld = Math.floor((now - new Date(key.createdAt).getTime()) / (24 * 60 * 60 * 1000));
    status[name] = {
      daysOld,
      createdAt: key.createdAt,
      rotationDueIn: Math.max(0, 90 - daysOld),
      needsRotation: daysOld >= 80,
    };
  }
  
  return status;
}
