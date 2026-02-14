/**
 * Security Logger — Audit trail for security events (NO full prompts stored)
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SECURITY_LOG = path.join(__dirname, '.security-events.jsonl');
const FLAGGED_LOG = path.join(__dirname, '.flagged-requests.jsonl');

/**
 * Log input validation event
 */
export async function logInputValidation(sessionId, apiKey, validationResult, incident = false) {
  const event = {
    timestamp: new Date().toISOString(),
    type: 'input_validation',
    sessionId,
    apiKey: hashKey(apiKey),
    inputLength: validationResult.originalLength,
    valid: validationResult.valid,
    sanitized: validationResult.sanitized,
    blockedPatterns: validationResult.errors.filter(e => e.includes('Blocked')).length,
    warnings: validationResult.warnings.length,
    incident, // true if suspicious activity
  };
  
  if (incident) {
    event.errors = validationResult.errors;
  }
  
  await appendLog(SECURITY_LOG, event);
  
  if (incident) {
    await appendLog(FLAGGED_LOG, {
      ...event,
      severity: 'high',
      action: 'blocked_request',
    });
  }
}

/**
 * Log output filter event
 */
export async function logOutputFilter(sessionId, apiKey, filterResult, incident = false) {
  const event = {
    timestamp: new Date().toISOString(),
    type: 'output_filter',
    sessionId,
    apiKey: hashKey(apiKey),
    suspicious: filterResult.suspicious,
    findingsCount: filterResult.findings.length,
    findingTypes: filterResult.findings.map(f => f.type),
    redactionsMade: Object.keys(filterResult.redactions).length,
    incident,
  };
  
  if (incident) {
    event.findings = filterResult.findings;
    event.redactionSummary = filterResult.redactions;
  }
  
  await appendLog(SECURITY_LOG, event);
  
  if (incident) {
    await appendLog(FLAGGED_LOG, {
      ...event,
      severity: filterResult.findings.some(f => f.type === 'api_key_leak') ? 'critical' : 'high',
      action: 'redacted_output',
    });
  }
}

/**
 * Log canary token leak
 */
export async function logCanaryLeak(sessionId, apiKey, canaryResult) {
  const event = {
    timestamp: new Date().toISOString(),
    type: 'canary_token_leak',
    sessionId,
    apiKey: hashKey(apiKey),
    severity: 'critical',
    message: canaryResult.message,
  };
  
  await appendLog(SECURITY_LOG, event);
  await appendLog(FLAGGED_LOG, {
    ...event,
    action: 'prompt_injection_detected',
  });
}

/**
 * Log quarantine event
 */
export async function logQuarantine(apiKey, reason, duration) {
  const event = {
    timestamp: new Date().toISOString(),
    type: 'quarantine',
    apiKey: hashKey(apiKey),
    reason,
    duration,
    until: new Date(Date.now() + duration).toISOString(),
  };
  
  await appendLog(SECURITY_LOG, event);
  await appendLog(FLAGGED_LOG, {
    ...event,
    severity: 'critical',
    action: 'api_key_quarantined',
  });
}

/**
 * Get security audit trail
 */
export async function getSecurityAudit(options = {}) {
  const { sessionId, apiKey, days = 7, type } = options;
  
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const events = [];
  
  try {
    const data = await fs.readFile(SECURITY_LOG, 'utf-8');
    const lines = data.split('\n').filter(l => l.trim());
    
    for (const line of lines) {
      const event = JSON.parse(line);
      
      // Filter
      if (event.timestamp < new Date(cutoff).toISOString()) continue;
      if (sessionId && event.sessionId !== sessionId) continue;
      if (apiKey && event.apiKey !== hashKey(apiKey)) continue;
      if (type && event.type !== type) continue;
      
      events.push(event);
    }
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
  
  return events;
}

/**
 * Get flagged requests
 */
export async function getFlaggedRequests(options = {}) {
  const { severity = 'high', days = 7 } = options;
  
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const flagged = [];
  
  try {
    const data = await fs.readFile(FLAGGED_LOG, 'utf-8');
    const lines = data.split('\n').filter(l => l.trim());
    
    for (const line of lines) {
      const event = JSON.parse(line);
      
      if (event.timestamp < new Date(cutoff).toISOString()) continue;
      if (event.severity && severity && event.severity !== severity) {
        if (severity === 'high' && event.severity !== 'critical') continue;
      }
      
      flagged.push(event);
    }
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
  
  return flagged;
}

/**
 * Get security statistics
 */
export async function getSecurityStats(days = 7) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const stats = {
    period: `${days} days`,
    cutoff: new Date(cutoff).toISOString(),
    totalEvents: 0,
    byType: {},
    incidents: 0,
    criticalIncidents: 0,
  };
  
  try {
    const data = await fs.readFile(SECURITY_LOG, 'utf-8');
    const lines = data.split('\n').filter(l => l.trim());
    
    for (const line of lines) {
      const event = JSON.parse(line);
      
      if (event.timestamp < new Date(cutoff).toISOString()) continue;
      
      stats.totalEvents++;
      stats.byType[event.type] = (stats.byType[event.type] || 0) + 1;
      
      if (event.incident || event.severity === 'critical') {
        stats.criticalIncidents++;
      } else if (event.incident) {
        stats.incidents++;
      }
    }
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
  
  return stats;
}

/**
 * Append to JSONL log
 */
async function appendLog(filePath, event) {
  const line = JSON.stringify(event) + '\n';
  try {
    await fs.appendFile(filePath, line);
  } catch (err) {
    console.error('[security-logger] Error appending log:', err.message);
  }
}

/**
 * Hash API key for privacy (show last 8 chars)
 */
function hashKey(apiKey) {
  if (!apiKey || apiKey.length < 8) return 'unknown';
  return `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`;
}
