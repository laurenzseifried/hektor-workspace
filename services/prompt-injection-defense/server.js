#!/usr/bin/env node

/**
 * Prompt Injection Defense Server
 * 
 * Validates inputs, filters outputs, detects prompt injections, logs security events
 */

import http from 'http';
import { validateInput, validateSystemPrompt, getValidationReport } from './validator.js';
import { filterOutput, getFilterReport, isSafeToReturn } from './filter.js';
import { getCanaryToken, injectCanaryIntoPrompt, checkCanaryLeak, getCanaryStats } from './canary.js';
import { 
  logInputValidation, 
  logOutputFilter, 
  logCanaryLeak, 
  getSecurityAudit, 
  getFlaggedRequests,
  getSecurityStats,
} from './logger.js';
import { 
  recordBlockedAttempt, 
  isQuarantined, 
  unquarantineTemporary,
  unquarantinePermanent,
  getQuarantineStatus,
} from './quarantine.js';

const PORT = process.env.INJECTION_DEFENSE_PORT || 3004;
const ADMIN_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN;

/**
 * Parse JSON body
 */
async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

/**
 * Send JSON response
 */
function sendJSON(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
}

/**
 * Check admin auth
 */
function checkAuth(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  return token === ADMIN_TOKEN;
}

/**
 * Request handler
 */
async function handleRequest(req, res) {
  const { method, url } = req;
  
  // Health check
  if (url === '/health' && method === 'GET') {
    return sendJSON(res, 200, { status: 'ok', timestamp: new Date().toISOString() });
  }
  
  try {
    // POST /validate-input — Validate user input before sending to model
    if (url === '/validate-input' && method === 'POST') {
      const { message, sessionData, apiKey } = await parseBody(req);
      
      if (!message) {
        return sendJSON(res, 400, { error: 'Missing message' });
      }
      
      // Check quarantine
      const quarantineStatus = await isQuarantined(apiKey);
      if (quarantineStatus.quarantined) {
        await logInputValidation(sessionData?.sessionId, apiKey, 
          { originalLength: message.length, valid: false, errors: ['Quarantined'], warnings: [], sanitized: false },
          true);
        return sendJSON(res, 429, {
          error: 'API_KEY_QUARANTINED',
          ...quarantineStatus,
        });
      }
      
      // Validate input
      const validation = await validateInput(message, sessionData);
      
      if (!validation.valid) {
        // Record blocked attempt
        const attempt = await recordBlockedAttempt(apiKey, 'input_validation_failed');
        
        // Log it
        await logInputValidation(sessionData?.sessionId, apiKey, validation, true);
        
        // Check if now quarantined
        if (attempt.status !== 'warning') {
          return sendJSON(res, 429, {
            error: 'QUOTA_EXCEEDED',
            ...attempt,
          });
        }
        
        return sendJSON(res, 400, {
          error: 'VALIDATION_FAILED',
          report: getValidationReport(message, validation),
        });
      }
      
      // Valid - return the (possibly sanitized) message
      await logInputValidation(sessionData?.sessionId, apiKey, validation, false);
      
      return sendJSON(res, 200, {
        valid: true,
        message: validation.input,
        sanitized: validation.sanitized,
        warnings: validation.warnings,
      });
    }
    
    // POST /prepare-system-prompt — Inject canary into system prompt
    if (url === '/prepare-system-prompt' && method === 'POST') {
      const { systemPrompt, sessionId } = await parseBody(req);
      
      if (!systemPrompt) {
        return sendJSON(res, 400, { error: 'Missing systemPrompt' });
      }
      
      // Validate system prompt
      const validation = validateSystemPrompt(systemPrompt);
      if (!validation.valid) {
        return sendJSON(res, 400, {
          error: 'SYSTEM_PROMPT_INVALID',
          errors: validation.errors,
        });
      }
      
      // Inject canary
      const { injected, canaryToken } = await injectCanaryIntoPrompt(systemPrompt, sessionId);
      
      return sendJSON(res, 200, {
        prompt: injected,
        canaryToken, // Return token so server can detect leaks
      });
    }
    
    // POST /filter-output — Filter model output before returning to user
    if (url === '/filter-output' && method === 'POST') {
      const { output, sessionId, apiKey } = await parseBody(req);
      
      if (!output) {
        return sendJSON(res, 400, { error: 'Missing output' });
      }
      
      // Filter the output
      const filter = await filterOutput(output);
      
      // Check canary leak
      let canaryLeak = { leaked: false };
      if (sessionId) {
        canaryLeak = await checkCanaryLeak(output, sessionId);
      }
      
      // Log filter events
      if (filter.suspicious) {
        await logOutputFilter(sessionId, apiKey, filter, true);
      }
      
      if (canaryLeak.leaked) {
        await logCanaryLeak(sessionId, apiKey, canaryLeak);
        
        // Record attempt for quarantine
        await recordBlockedAttempt(apiKey, 'canary_token_leaked');
        
        return sendJSON(res, 403, {
          error: 'PROMPT_INJECTION_DETECTED',
          message: canaryLeak.message,
          severity: 'CRITICAL',
        });
      }
      
      // Check if safe to return
      if (!isSafeToReturn(filter)) {
        await logOutputFilter(sessionId, apiKey, filter, true);
        
        return sendJSON(res, 403, {
          error: 'UNSAFE_OUTPUT',
          message: 'Output contains leaked secrets or sensitive information',
          findings: filter.findings,
        });
      }
      
      return sendJSON(res, 200, {
        safe: true,
        output: filter.clean,
        findings: filter.findings.length > 0 ? filter.findings : undefined,
        report: filter.findings.length > 0 ? getFilterReport(filter) : undefined,
      });
    }
    
    // Admin endpoints require auth
    if (url.startsWith('/admin/')) {
      if (!checkAuth(req)) {
        return sendJSON(res, 401, { error: 'Unauthorized' });
      }
    }
    
    // GET /admin/audit — Security audit trail
    if (url.startsWith('/admin/audit') && method === 'GET') {
      const params = new URLSearchParams(url.split('?')[1] || '');
      const days = parseInt(params.get('days') || '7');
      
      const events = await getSecurityAudit({ days });
      
      return sendJSON(res, 200, {
        period: `${days} days`,
        eventCount: events.length,
        events: events.slice(-50), // Return last 50
      });
    }
    
    // GET /admin/flagged — Flagged requests
    if (url.startsWith('/admin/flagged') && method === 'GET') {
      const params = new URLSearchParams(url.split('?')[1] || '');
      const days = parseInt(params.get('days') || '7');
      const severity = params.get('severity') || 'high';
      
      const flagged = await getFlaggedRequests({ days, severity });
      
      return sendJSON(res, 200, {
        count: flagged.length,
        flagged: flagged.slice(-50),
      });
    }
    
    // GET /admin/stats — Security statistics
    if (url === '/admin/stats' && method === 'GET') {
      const params = new URLSearchParams(url.split('?')[1] || '');
      const days = parseInt(params.get('days') || '7');
      
      const stats = await getSecurityStats(days);
      const canaryStats = await getCanaryStats();
      const quarantineStats = await getQuarantineStatus();
      
      return sendJSON(res, 200, {
        ...stats,
        canary: canaryStats,
        quarantine: quarantineStats,
      });
    }
    
    // POST /admin/unquarantine-temp — Remove temporary quarantine
    if (url === '/admin/unquarantine-temp' && method === 'POST') {
      const { apiKey } = await parseBody(req);
      
      if (!apiKey) {
        return sendJSON(res, 400, { error: 'Missing apiKey' });
      }
      
      const result = await unquarantineTemporary(apiKey);
      
      return sendJSON(res, result.success ? 200 : 404, result);
    }
    
    // POST /admin/unquarantine-permanent — Remove permanent block (CAREFUL!)
    if (url === '/admin/unquarantine-permanent' && method === 'POST') {
      const { apiKey } = await parseBody(req);
      
      if (!apiKey) {
        return sendJSON(res, 400, { error: 'Missing apiKey' });
      }
      
      const result = await unquarantinePermanent(apiKey);
      
      return sendJSON(res, result.success ? 200 : 404, result);
    }
    
    // 404
    return sendJSON(res, 404, { error: 'Not found' });
    
  } catch (err) {
    console.error('[injection-defense] Error:', err);
    return sendJSON(res, 500, { error: err.message });
  }
}

/**
 * Start server
 */
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`[prompt-injection-defense] Server listening on http://127.0.0.1:${PORT}`);
  console.log(`[prompt-injection-defense] Input limits: max=${4000} chars, max=${50} turns`);
});

process.on('SIGTERM', () => {
  console.log('[prompt-injection-defense] SIGTERM received, shutting down...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('[prompt-injection-defense] SIGINT received, shutting down...');
  server.close(() => process.exit(0));
});
