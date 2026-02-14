/**
 * Quarantine System — Automatically block API keys after repeated injection attempts
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUARANTINE_FILE = path.join(__dirname, '.quarantined-keys.json');

// Config
const TEMPORARY_THRESHOLD = 3; // 3 blocked attempts = temporary block
const PERMANENT_THRESHOLD = 10; // 10 blocked attempts in 24h = permanent block

/**
 * Load quarantine database
 */
async function loadQuarantine() {
  try {
    const data = await fs.readFile(QUARANTINE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return {
        temporary: {}, // apiKey → { blockedUntil, reason, attemptCount }
        permanent: [], // [apiKey, ...]
        attemptLog: {}, // apiKey → [timestamps of blocked attempts]
      };
    }
    throw err;
  }
}

/**
 * Save quarantine database
 */
async function saveQuarantine(data) {
  await fs.writeFile(QUARANTINE_FILE, JSON.stringify(data, null, 2));
}

/**
 * Record a blocked attempt for an API key
 */
export async function recordBlockedAttempt(apiKey, reason = 'injection_attempt') {
  const quarantine = await loadQuarantine();
  const now = Date.now();
  
  // Initialize attempt log if needed
  if (!quarantine.attemptLog[apiKey]) {
    quarantine.attemptLog[apiKey] = [];
  }
  
  // Add this attempt
  quarantine.attemptLog[apiKey].push({
    timestamp: now,
    reason,
  });
  
  // Prune old attempts (older than 24h)
  const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;
  quarantine.attemptLog[apiKey] = quarantine.attemptLog[apiKey]
    .filter(a => a.timestamp > twentyFourHoursAgo);
  
  const attemptCount = quarantine.attemptLog[apiKey].length;
  
  // Check if should be permanently blocked
  if (attemptCount >= PERMANENT_THRESHOLD) {
    quarantine.permanent.push({
      apiKey,
      blockedAt: new Date(now).toISOString(),
      reason: `Permanent ban after ${attemptCount} blocked attempts in 24h`,
      attemptLog: quarantine.attemptLog[apiKey],
    });
    
    // Remove from temporary if it was there
    delete quarantine.temporary[apiKey];
    delete quarantine.attemptLog[apiKey];
    
    await saveQuarantine(quarantine);
    
    return {
      status: 'permanently_blocked',
      message: `API key permanently blocked after ${attemptCount} injection attempts`,
    };
  }
  
  // Check if should be temporarily blocked
  if (attemptCount >= TEMPORARY_THRESHOLD && !quarantine.temporary[apiKey]) {
    const duration = 60 * 60 * 1000; // 1 hour
    
    quarantine.temporary[apiKey] = {
      blockedAt: new Date(now).toISOString(),
      blockedUntil: new Date(now + duration).toISOString(),
      duration,
      reason: `Temporary ban after ${attemptCount} blocked attempts`,
      attemptCount,
    };
    
    await saveQuarantine(quarantine);
    
    return {
      status: 'temporarily_blocked',
      duration,
      durationMinutes: Math.round(duration / 60 / 1000),
      message: `API key temporarily blocked for ${Math.round(duration / 60 / 1000)} minutes`,
    };
  }
  
  await saveQuarantine(quarantine);
  
  return {
    status: 'warning',
    attemptCount,
    threshold: TEMPORARY_THRESHOLD,
    message: `${attemptCount}/${TEMPORARY_THRESHOLD} blocked attempts. Further attempts will trigger temporary block.`,
  };
}

/**
 * Check if an API key is quarantined
 */
export async function isQuarantined(apiKey) {
  const quarantine = await loadQuarantine();
  const now = Date.now();
  
  // Check permanent
  if (quarantine.permanent.some(q => q.apiKey === apiKey)) {
    return {
      quarantined: true,
      type: 'permanent',
      message: 'API key is permanently blocked due to repeated injection attempts',
    };
  }
  
  // Check temporary (and clean up if expired)
  const temp = quarantine.temporary[apiKey];
  if (temp) {
    const blockedUntil = new Date(temp.blockedUntil).getTime();
    
    if (now < blockedUntil) {
      const remaining = blockedUntil - now;
      return {
        quarantined: true,
        type: 'temporary',
        remaining,
        remainingMinutes: Math.round(remaining / 60 / 1000),
        message: `API key is temporarily blocked. Remaining: ${Math.round(remaining / 60 / 1000)} minutes`,
      };
    } else {
      // Temp block expired, clean up
      delete quarantine.temporary[apiKey];
      if (quarantine.attemptLog[apiKey]) {
        quarantine.attemptLog[apiKey] = quarantine.attemptLog[apiKey]
          .filter(a => a.timestamp > now - 24 * 60 * 60 * 1000);
      }
      await saveQuarantine(quarantine);
    }
  }
  
  return { quarantined: false };
}

/**
 * Unblock a temporarily quarantined key (admin)
 */
export async function unquarantineTemporary(apiKey) {
  const quarantine = await loadQuarantine();
  
  if (quarantine.temporary[apiKey]) {
    delete quarantine.temporary[apiKey];
    await saveQuarantine(quarantine);
    
    return { success: true, message: 'Temporary quarantine removed' };
  }
  
  return { success: false, message: 'API key not temporarily quarantined' };
}

/**
 * Remove permanent block (admin only)
 */
export async function unquarantinePermanent(apiKey) {
  const quarantine = await loadQuarantine();
  
  const index = quarantine.permanent.findIndex(q => q.apiKey === apiKey);
  if (index !== -1) {
    quarantine.permanent.splice(index, 1);
    await saveQuarantine(quarantine);
    
    return { success: true, message: 'Permanent quarantine removed' };
  }
  
  return { success: false, message: 'API key not permanently quarantined' };
}

/**
 * Get quarantine status
 */
export async function getQuarantineStatus() {
  const quarantine = await loadQuarantine();
  const now = Date.now();
  
  // Count active temporary blocks
  let activeTempCount = 0;
  for (const [_, block] of Object.entries(quarantine.temporary)) {
    if (new Date(block.blockedUntil).getTime() > now) {
      activeTempCount++;
    }
  }
  
  return {
    temporaryQuarantines: activeTempCount,
    permanentQuarantines: quarantine.permanent.length,
    keysUnderMonitoring: Object.keys(quarantine.attemptLog).length,
    permanentlyBlockedKeys: quarantine.permanent.map(q => q.apiKey),
  };
}
