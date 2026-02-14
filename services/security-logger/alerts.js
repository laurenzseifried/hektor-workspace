/**
 * Alert Rules & Detection
 */

import { queryLogs, LEVELS, CATEGORIES } from './logger.js';

export const ALERT_LEVELS = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
};

/**
 * Check alert rules
 */
export async function checkAlerts() {
  const alerts = [];
  const now = Date.now();
  const fiveMinutesAgo = now - 5 * 60 * 1000;
  const fifteenMinutesAgo = now - 15 * 60 * 1000;
  const oneHourAgo = now - 60 * 60 * 1000;
  
  // CRITICAL: 10+ failed logins from same IP in 5 min
  const failedLogins = await queryLogs({
    category: CATEGORIES.AUTH,
    event: 'login_failed',
    since: new Date(fiveMinutesAgo).toISOString(),
    limit: 1000,
  });
  
  const loginsByIP = {};
  for (const log of failedLogins) {
    const ip = log.metadata?.ip;
    if (ip) {
      loginsByIP[ip] = (loginsByIP[ip] || 0) + 1;
    }
  }
  
  for (const [ip, count] of Object.entries(loginsByIP)) {
    if (count >= 10) {
      alerts.push({
        level: ALERT_LEVELS.CRITICAL,
        title: '🚨 CRITICAL: Brute force attack detected',
        ip,
        failedAttempts: count,
        timewindow: '5 minutes',
        action: 'Consider blocking IP temporarily',
      });
    }
  }
  
  // CRITICAL: Circuit breaker emergency
  const cbEvents = await queryLogs({
    category: CATEGORIES.COST,
    event: 'circuit_breaker_triggered',
    since: new Date(fiveMinutesAgo).toISOString(),
  });
  
  if (cbEvents.some(e => e.metadata?.breaker_level === 'EMERGENCY')) {
    alerts.push({
      level: ALERT_LEVELS.CRITICAL,
      title: '🔴 CRITICAL: Cost circuit breaker EMERGENCY',
      action: 'Manual review and reset required',
    });
  }
  
  // HIGH: 5+ injection attempts from same key
  const injections = await queryLogs({
    category: CATEGORIES.SECURITY,
    event: 'injection_detected',
    since: new Date(fifteenMinutesAgo).toISOString(),
    limit: 1000,
  });
  
  const injectionsByKey = {};
  for (const log of injections) {
    const key = log.metadata?.api_key;
    if (key) {
      injectionsByKey[key] = (injectionsByKey[key] || 0) + 1;
    }
  }
  
  for (const [key, count] of Object.entries(injectionsByKey)) {
    if (count >= 5) {
      alerts.push({
        level: ALERT_LEVELS.HIGH,
        title: '🟠 HIGH: Multiple prompt injection attempts',
        api_key: key,
        attempts: count,
        timewindow: '15 minutes',
        action: 'Consider temporary API key quarantine',
      });
    }
  }
  
  // HIGH: Error rate > 10% in 5 min
  const recentLogs = await queryLogs({
    since: new Date(fiveMinutesAgo).toISOString(),
    limit: 10000,
  });
  
  const errorCount = recentLogs.filter(l => l.level === LEVELS.ERROR).length;
  const errorRate = recentLogs.length > 0 ? (errorCount / recentLogs.length) : 0;
  
  if (errorRate > 0.1 && recentLogs.length >= 100) {
    alerts.push({
      level: ALERT_LEVELS.HIGH,
      title: '🟠 HIGH: Elevated error rate detected',
      errorRate: (errorRate * 100).toFixed(2) + '%',
      totalRequests: recentLogs.length,
      timewindow: '5 minutes',
      action: 'Investigate system health',
    });
  }
  
  return alerts;
}

/**
 * Format alert for Telegram
 */
export function formatTelegramAlert(alert) {
  let msg = `${alert.title}\n\n`;
  
  for (const [key, value] of Object.entries(alert)) {
    if (!['level', 'title', 'action'].includes(key)) {
      msg += `**${key}**: ${value}\n`;
    }
  }
  
  msg += `\n**Action**: ${alert.action}`;
  
  return msg;
}
