/**
 * Data Retention & Auto-Purge
 */

import fs from 'fs/promises';
import path from 'path';

export const RETENTION_POLICIES = {
  prompts: 7,      // days
  sessions: 1,     // days (expired only)
  analytics: 90,   // days (then anonymize)
  logs_general: 30,
  logs_security: 365,
};

/**
 * Purge old log files
 */
export async function purgeOldLogs(logDir, maxAgeDays) {
  const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;
  const purged = [];
  
  try {
    const files = await fs.readdir(logDir);
    
    for (const file of files) {
      const filepath = path.join(logDir, file);
      const stats = await fs.stat(filepath);
      
      if (stats.mtimeMs < cutoff) {
        await fs.unlink(filepath);
        purged.push(file);
      }
    }
  } catch (err) {
    console.error('[retention] Purge error:', err.message);
  }
  
  return purged;
}

/**
 * Purge expired sessions
 */
export async function purgeExpiredSessions(sessionStore) {
  const now = Date.now();
  let purged = 0;
  
  for (const [id, session] of Object.entries(sessionStore)) {
    if (session.expiresAt && session.expiresAt < now) {
      delete sessionStore[id];
      purged++;
    }
  }
  
  return purged;
}

/**
 * Anonymize old analytics
 */
export async function anonymizeOldAnalytics(analyticsFile, maxAgeDays) {
  const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;
  
  try {
    const data = await fs.readFile(analyticsFile, 'utf-8');
    const lines = data.split('\n').filter(l => l.trim());
    
    const anonymized = lines.map(line => {
      const entry = JSON.parse(line);
      const timestamp = new Date(entry.timestamp).getTime();
      
      if (timestamp < cutoff) {
        delete entry.user_id;
        delete entry.api_key;
        delete entry.ip;
        entry.anonymized = true;
      }
      
      return JSON.stringify(entry);
    }).join('\n') + '\n';
    
    await fs.writeFile(analyticsFile, anonymized);
    
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Run all retention policies
 */
export async function runRetentionPolicies() {
  const results = {};
  
  // Purge old general logs
  results.generalLogs = await purgeOldLogs(
    '/Users/laurenz/.openclaw/workspace/services/security-logger/.logs',
    RETENTION_POLICIES.logs_general
  );
  
  console.log(`[retention] Purged ${results.generalLogs.length} old general log files`);
  
  return results;
}
