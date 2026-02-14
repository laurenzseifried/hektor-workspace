/**
 * Structured Security Logger — JSON logs with privacy
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_DIR = path.join(__dirname, '.logs');
const SECURITY_LOG = path.join(LOG_DIR, 'security.jsonl');
const GENERAL_LOG = path.join(LOG_DIR, 'general.jsonl');

// Ensure log directory
await fs.mkdir(LOG_DIR, { recursive: true }).catch(() => {});

export const LEVELS = {
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  CRITICAL: 'critical',
};

export const CATEGORIES = {
  AUTH: 'auth',
  API: 'api',
  MODEL: 'model',
  ADMIN: 'admin',
  SECURITY: 'security',
  COST: 'cost',
  SYSTEM: 'system',
};

/**
 * Sanitize sensitive data
 */
function sanitize(obj) {
  const sanitized = JSON.parse(JSON.stringify(obj));
  
  const redactPaths = [
    ['password'],
    ['token'],
    ['secret'],
    ['api_key'],
    ['full_token'],
    ['full_key'],
  ];
  
  for (const paths of redactPaths) {
    for (const path of [paths]) {
      const value = sanitized;
      if (value && typeof value === 'object' && path[0] in value) {
        value[path[0]] = '[REDACTED]';
      }
    }
  }
  
  return sanitized;
}

/**
 * Hash/obfuscate sensitive values
 */
function obfuscate(value, keepChars = 4) {
  if (!value || typeof value !== 'string') return value;
  if (value.length <= keepChars) return '[REDACTED]';
  return `${value.slice(0, 2)}...${value.slice(-keepChars)}`;
}

/**
 * Log structured event
 */
export async function log(level, category, event, metadata = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    category,
    event,
    request_id: metadata.request_id || generateRequestId(),
    metadata: sanitize({
      ip: metadata.ip ? obfuscate(metadata.ip, 8) : undefined,
      user_id: metadata.user_id ? obfuscate(metadata.user_id, 8) : undefined,
      api_key: metadata.api_key ? obfuscate(metadata.api_key, 4) : undefined,
      endpoint: metadata.endpoint,
      method: metadata.method,
      status_code: metadata.status_code,
      duration_ms: metadata.duration_ms,
      error: metadata.error,
      details: metadata.details,
    }),
  };
  
  // Remove undefined fields
  Object.keys(logEntry.metadata).forEach(k => 
    logEntry.metadata[k] === undefined && delete logEntry.metadata[k]
  );
  
  const line = JSON.stringify(logEntry) + '\n';
  
  // Write to appropriate log
  const isSecurity = [LEVELS.CRITICAL, LEVELS.ERROR].includes(level) ||
    [CATEGORIES.SECURITY, CATEGORIES.AUTH, CATEGORIES.ADMIN].includes(category);
  
  const logFile = isSecurity ? SECURITY_LOG : GENERAL_LOG;
  
  try {
    await fs.appendFile(logFile, line);
  } catch (err) {
    console.error('[logger] Write failed:', err.message);
  }
  
  return logEntry;
}

/**
 * Specific event loggers
 */
export async function logFailedLogin(ip, username, reason) {
  return log(LEVELS.WARN, CATEGORIES.AUTH, 'login_failed', {
    ip,
    username: obfuscate(username, 3),
    reason,
  });
}

export async function logRateLimitHit(ip, apiKey, endpoint, currentCount) {
  return log(LEVELS.WARN, CATEGORIES.SECURITY, 'rate_limit_exceeded', {
    ip,
    api_key: apiKey,
    endpoint,
    current_count: currentCount,
  });
}

export async function logAuthorizationFailure(userId, action, reason) {
  return log(LEVELS.WARN, CATEGORIES.SECURITY, 'authorization_failed', {
    user_id: userId,
    attempted_action: action,
    reason,
  });
}

export async function logCircuitBreakerEvent(level, currentSpend, threshold, action) {
  return log(level, CATEGORIES.COST, 'circuit_breaker_triggered', {
    breaker_level: level,
    current_spend: currentSpend,
    threshold,
    action_taken: action,
  });
}

export async function logPromptInjectionDetected(apiKey, pattern, blocked) {
  return log(LEVELS.CRITICAL, CATEGORIES.SECURITY, 'injection_detected', {
    api_key: apiKey,
    pattern_matched: pattern,
    request_blocked: blocked,
  });
}

export async function logAdminAction(adminId, action, target, ip) {
  return log(LEVELS.INFO, CATEGORIES.ADMIN, 'admin_action', {
    admin_id: adminId,
    action,
    target,
    ip,
  });
}

export async function logCanaryLeak(sessionId, apiKey) {
  return log(LEVELS.CRITICAL, CATEGORIES.SECURITY, 'canary_token_leaked', {
    session_id: sessionId,
    api_key: apiKey,
  });
}

/**
 * Query logs
 */
export async function queryLogs(options = {}) {
  const { category, level, since, until, limit = 100 } = options;
  
  const sinceTime = since ? new Date(since).getTime() : 0;
  const untilTime = until ? new Date(until).getTime() : Date.now();
  
  const results = [];
  
  for (const logFile of [SECURITY_LOG, GENERAL_LOG]) {
    try {
      const data = await fs.readFile(logFile, 'utf-8');
      const lines = data.split('\n').filter(l => l.trim());
      
      for (const line of lines) {
        const entry = JSON.parse(line);
        const timestamp = new Date(entry.timestamp).getTime();
        
        if (timestamp < sinceTime || timestamp > untilTime) continue;
        if (category && entry.category !== category) continue;
        if (level && entry.level !== level) continue;
        
        results.push(entry);
      }
    } catch (err) {
      // Ignore missing files
    }
  }
  
  return results
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
}

/**
 * Generate request ID
 */
export function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get log file paths
 */
export function getLogFiles() {
  return { security: SECURITY_LOG, general: GENERAL_LOG };
}
