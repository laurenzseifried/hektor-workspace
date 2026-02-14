/**
 * Automatic Response Actions
 */

import { recordIncident, INCIDENT_TYPES } from './detector.js';

const BLOCKED_IPS = new Set();
const BLOCKED_KEYS = new Set();

/**
 * Response: Key Compromise
 */
export async function respondToKeyCompromise(incident) {
  const actions = [];
  
  // 1. Disable key
  BLOCKED_KEYS.add(incident.api_key);
  actions.push({
    action: 'disable_api_key',
    key: incident.api_key,
    timestamp: new Date().toISOString(),
  });
  
  // 2. Block IP
  BLOCKED_IPS.add(incident.current_ip);
  actions.push({
    action: 'block_ip',
    ip: incident.current_ip,
    duration: '24 hours',
    timestamp: new Date().toISOString(),
  });
  
  // 3. Send alert (would call notifier)
  actions.push({
    action: 'send_alert',
    type: 'CRITICAL',
    recipients: ['admin'],
    message: `API key compromise detected from ${incident.current_ip}. Key disabled, IP blocked.`,
  });
  
  incident.automated_responses = actions;
  await recordIncident(incident);
  
  return actions;
}

/**
 * Response: Brute Force
 */
export async function respondToBruteForce(incidents) {
  const allActions = [];
  
  for (const incident of incidents) {
    const actions = [];
    
    // 1. Block attacking IP
    BLOCKED_IPS.add(incident.source_ip);
    actions.push({
      action: 'block_ip',
      ip: incident.source_ip,
      duration: '24 hours',
      timestamp: new Date().toISOString(),
    });
    
    // 2. Check if distributed (5+ IPs) → enable CAPTCHA
    if (incidents.length >= 5) {
      actions.push({
        action: 'enable_captcha',
        endpoint: '/auth/login',
        duration: '24 hours',
        timestamp: new Date().toISOString(),
      });
    }
    
    // 3. Alert
    actions.push({
      action: 'send_alert',
      type: 'CRITICAL',
      message: `Brute force attack from ${incident.source_ip} (${incident.attempt_count} attempts)`,
    });
    
    incident.automated_responses = actions;
    await recordIncident(incident);
    allActions.push(...actions);
  }
  
  return allActions;
}

/**
 * Response: Cost Anomaly
 */
export async function respondToCostAnomaly(incident) {
  const actions = [];
  
  // 1. Activate soft circuit breaker
  actions.push({
    action: 'activate_soft_breaker',
    effect: 'opus_to_sonnet_downgrade',
    timestamp: new Date().toISOString(),
  });
  
  // 2. Auto-downgrade model tier
  actions.push({
    action: 'downgrade_model_tier',
    from: 'opus/sonnet',
    to: 'haiku',
    reason: 'cost_anomaly_detected',
  });
  
  // 3. Alert with breakdown
  actions.push({
    action: 'send_alert',
    type: 'HIGH',
    message: `Cost anomaly: ${incident.multiplier}x normal rate. Models downgraded.`,
  });
  
  incident.automated_responses = actions;
  await recordIncident(incident);
  
  return actions;
}

/**
 * Response: Data Exfiltration
 */
export async function respondToDataExfiltration(incident) {
  const actions = [];
  
  // 1. Block the key immediately
  BLOCKED_KEYS.add(incident.api_key);
  actions.push({
    action: 'disable_api_key',
    key: incident.api_key,
    reason: 'possible_data_exfiltration',
  });
  
  // 2. Alert
  actions.push({
    action: 'send_alert',
    type: 'HIGH',
    message: `Unusually large response (${incident.times_normal}x normal). Key disabled.`,
  });
  
  incident.automated_responses = actions;
  await recordIncident(incident);
  
  return actions;
}

/**
 * Response: Service Degradation
 */
export async function respondToServiceDegradation(incidents) {
  const actions = [];
  
  for (const incident of incidents) {
    if (incident.issue === 'high_error_rate') {
      actions.push({
        action: 'alert',
        type: 'HIGH',
        message: `Error rate ${incident.error_rate}% (threshold 10%)`,
      });
    } else if (incident.issue === 'high_latency') {
      actions.push({
        action: 'alert',
        type: 'MEDIUM',
        message: `Avg latency ${incident.avg_latency_ms}ms (threshold 5000ms)`,
      });
    }
    
    incident.automated_responses = actions;
    await recordIncident(incident);
  }
  
  return actions;
}

/**
 * Check if IP is blocked
 */
export function isIPBlocked(ip) {
  return BLOCKED_IPS.has(ip);
}

/**
 * Check if key is blocked
 */
export function isKeyBlocked(key) {
  return BLOCKED_KEYS.has(key);
}

/**
 * Get blocked status
 */
export function getBlockedStatus() {
  return {
    blockedIPs: Array.from(BLOCKED_IPS),
    blockedKeys: Array.from(BLOCKED_KEYS),
  };
}
