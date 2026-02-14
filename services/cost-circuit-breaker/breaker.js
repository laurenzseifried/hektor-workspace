/**
 * Circuit Breaker — Enforce cost limits
 */

import { getCosts } from './tracker.js';
import { sendAlert } from './notifier.js';

// Default thresholds (can be overridden via env)
export const THRESHOLDS = {
  WARNING: parseFloat(process.env.CIRCUIT_BREAKER_WARNING || '100'),
  SOFT: parseFloat(process.env.CIRCUIT_BREAKER_SOFT || '250'),
  HARD: parseFloat(process.env.CIRCUIT_BREAKER_HARD || '500'),
  EMERGENCY: parseFloat(process.env.CIRCUIT_BREAKER_EMERGENCY || '1000'),
};

let lastAlertLevel = null;

/**
 * Get current circuit breaker state
 */
export async function getState() {
  const costs = await getCosts();
  const total = costs.global;
  
  if (total >= THRESHOLDS.EMERGENCY) {
    return { level: 'EMERGENCY', total, threshold: THRESHOLDS.EMERGENCY, costs };
  } else if (total >= THRESHOLDS.HARD) {
    return { level: 'HARD', total, threshold: THRESHOLDS.HARD, costs };
  } else if (total >= THRESHOLDS.SOFT) {
    return { level: 'SOFT', total, threshold: THRESHOLDS.SOFT, costs };
  } else if (total >= THRESHOLDS.WARNING) {
    return { level: 'WARNING', total, threshold: THRESHOLDS.WARNING, costs };
  }
  
  return { level: 'OK', total, threshold: THRESHOLDS.WARNING, costs };
}

/**
 * Check if a request should be allowed
 */
export async function checkRequest(model) {
  const state = await getState();
  
  // Send alert if level changed
  if (state.level !== 'OK' && state.level !== lastAlertLevel) {
    await sendAlert(state);
    lastAlertLevel = state.level;
  }
  
  // EMERGENCY: Block ALL
  if (state.level === 'EMERGENCY') {
    return {
      allowed: false,
      downgrade: null,
      message: 'Service temporarily suspended due to cost limit. Contact admin.',
      state,
    };
  }
  
  // HARD: Block non-Haiku
  if (state.level === 'HARD') {
    const isHaiku = model.includes('haiku') || model === 'haiku';
    if (!isHaiku) {
      return {
        allowed: false,
        downgrade: null,
        message: 'Cost limit reached. Only economy model (Haiku) available.',
        state,
      };
    }
  }
  
  // SOFT: Downgrade Opus → Sonnet
  if (state.level === 'SOFT') {
    const isOpus = model.includes('opus') || model === 'opus';
    if (isOpus) {
      return {
        allowed: true,
        downgrade: 'anthropic/claude-sonnet-4-5',
        message: 'Opus requests automatically downgraded to Sonnet due to cost limit.',
        state,
      };
    }
  }
  
  // WARNING: Allow, just log
  return {
    allowed: true,
    downgrade: null,
    message: state.level === 'WARNING' ? 'Cost warning threshold reached.' : null,
    state,
  };
}

/**
 * Update thresholds
 */
export function updateThresholds(newThresholds) {
  Object.assign(THRESHOLDS, newThresholds);
  return THRESHOLDS;
}

/**
 * Reset alert state
 */
export function resetAlerts() {
  lastAlertLevel = null;
}
