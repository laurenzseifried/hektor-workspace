#!/usr/bin/env node
/**
 * Webhook Signature Validation
 * 
 * Validates webhook requests using HMAC-SHA256
 * Combined with IP whitelist for defense-in-depth
 * 
 * Setup:
 * 1. Generate webhook secret: `openssl rand -hex 32`
 * 2. Store in environment: WEBHOOK_HMAC_SECRET
 * 3. Share with webhook sender (out-of-band, NOT in webhook)
 * 4. Sender includes header: X-Webhook-Signature: sha256=<hex>
 * 5. Receiver validates both IP + signature
 * 
 * Usage:
 * ```javascript
 * import { validateWebhookSignature } from './webhook-signature-validation.js';
 * 
 * const result = validateWebhookSignature(req, body, {
 *   secret: process.env.WEBHOOK_HMAC_SECRET
 * });
 * 
 * if (!result.valid) {
 *   res.writeHead(401, { 'Content-Type': 'application/json' });
 *   return res.end(JSON.stringify({ error: result.reason }));
 * }
 * ```
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Signature validation log
const SIG_LOG_PATH = path.resolve(__dirname, '../../logs/webhook-signatures.log');
fs.mkdirSync(path.dirname(SIG_LOG_PATH), { recursive: true });

/**
 * Generate HMAC-SHA256 signature
 * 
 * @param {string} payload - Request body (JSON string or raw)
 * @param {string} secret - Shared webhook secret
 * @returns {string} - "sha256=<hex>" format
 */
function generateSignature(payload, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  return `sha256=${hmac.digest('hex')}`;
}

/**
 * Validate webhook signature
 * 
 * @param {http.IncomingMessage} req
 * @param {string} body - Raw request body (must be exact string received)
 * @param {object} opts - { secret, clientIP, log }
 * @returns {object} - { valid, reason, signature, computed }
 */
function validateWebhookSignature(req, body, opts = {}) {
  const {
    secret = process.env.WEBHOOK_HMAC_SECRET,
    clientIP = 'unknown',
    log = true,
  } = opts;

  // Check if secret is configured
  if (!secret) {
    if (log) {
      logSignatureValidation({
        clientIP,
        path: req.url,
        valid: false,
        reason: 'Secret not configured',
        signature: 'N/A',
        computed: 'N/A',
      });
    }
    return {
      valid: false,
      reason: 'Webhook secret not configured on server',
      signature: null,
      computed: null,
    };
  }

  // Get signature from header
  const signatureHeader = req.headers['x-webhook-signature'];
  if (!signatureHeader) {
    if (log) {
      logSignatureValidation({
        clientIP,
        path: req.url,
        valid: false,
        reason: 'Missing signature header',
        signature: 'N/A',
        computed: 'N/A',
      });
    }
    return {
      valid: false,
      reason: 'Missing X-Webhook-Signature header',
      signature: null,
      computed: null,
    };
  }

  // Validate signature format
  if (!signatureHeader.startsWith('sha256=')) {
    if (log) {
      logSignatureValidation({
        clientIP,
        path: req.url,
        valid: false,
        reason: 'Invalid signature format',
        signature: signatureHeader,
        computed: 'N/A',
      });
    }
    return {
      valid: false,
      reason: 'Invalid signature format (expected sha256=<hex>)',
      signature: signatureHeader,
      computed: null,
    };
  }

  // Compute expected signature
  const computedSignature = generateSignature(body, secret);

  // Constant-time comparison (prevent timing attacks)
  const provided = signatureHeader;
  const expected = computedSignature;

  // Check lengths first (non-timing-critical)
  if (provided.length !== expected.length) {
    if (log) {
      logSignatureValidation({
        clientIP,
        path: req.url,
        valid: false,
        reason: 'Signature length mismatch',
        signature: provided,
        computed: expected,
      });
    }
    return {
      valid: false,
      reason: 'Signature verification failed',
      signature: provided,
      computed: expected,
    };
  }

  // Constant-time comparison using crypto module
  let valid = false;
  try {
    const providedBuf = Buffer.from(provided);
    const expectedBuf = Buffer.from(expected);
    // timingSafeEqual requires both buffers to be same length
    valid = crypto.timingSafeEqual(providedBuf, expectedBuf);
  } catch (err) {
    // Timing attack not possible if function throws, still compare safely
    valid = provided === expected;
  }

  if (log) {
    logSignatureValidation({
      clientIP,
      path: req.url,
      valid,
      reason: valid ? 'Signature valid' : 'Signature mismatch',
      signature: provided,
      computed: expected,
    });
  }

  return {
    valid,
    reason: valid ? 'Signature valid' : 'Signature verification failed',
    signature: provided,
    computed: expected,
  };
}

/**
 * Log signature validation attempt
 * 
 * @param {object} opts - { clientIP, path, valid, reason, signature, computed }
 */
function logSignatureValidation(opts) {
  const {
    clientIP,
    path: reqPath,
    valid,
    reason,
    signature,
    computed,
    timestamp = new Date().toISOString(),
  } = opts;

  const status = valid ? 'VALID' : 'INVALID';
  const logEntry = `[${timestamp}] ${status} | IP: ${clientIP} | Path: ${reqPath} | Reason: ${reason} | Provided: ${signature.substring(0, 20)}... | Computed: ${computed.substring(0, 20) || 'N/A'}...\n`;

  // Log to file
  fs.appendFile(SIG_LOG_PATH, logEntry, (err) => {
    if (err) {
      console.error(`[webhook-sig] Failed to write signature log: ${err.message}`);
    }
  });

  // Console log
  const level = valid ? 'info' : 'warn';
  console.log(`[webhook-sig] ${status}: ${clientIP} → ${reqPath} (${reason})`);
}

/**
 * Middleware for webhook signature validation
 * 
 * Usage:
 * ```javascript
 * if (req.method === 'POST' && req.url === '/webhooks/subagent-complete') {
 *   let body = '';
 *   req.on('data', chunk => { body += chunk; });
 *   req.on('end', () => {
 *     const validation = webhookSignatureMiddleware(req, body, {
 *       clientIP: getClientIP(req)
 *     });
 *     if (!validation.valid) {
 *       res.writeHead(401, { 'Content-Type': 'application/json' });
 *       return res.end(JSON.stringify({ error: validation.reason }));
 *     }
 *     // Continue processing
 *   });
 * }
 * ```
 */
function webhookSignatureMiddleware(req, body, opts = {}) {
  return validateWebhookSignature(req, body, opts);
}

/**
 * Get signature validation log summary
 * 
 * @param {number} lines - Number of lines to read
 * @returns {array} - Log entries
 */
function getSignatureLogSummary(lines = 100) {
  try {
    if (!fs.existsSync(SIG_LOG_PATH)) {
      return [];
    }
    const content = fs.readFileSync(SIG_LOG_PATH, 'utf-8');
    return content.split('\n').filter(l => l.length > 0).slice(-lines);
  } catch (err) {
    console.error(`[webhook-sig] Failed to read signature log: ${err.message}`);
    return [];
  }
}

export {
  generateSignature,
  validateWebhookSignature,
  webhookSignatureMiddleware,
  logSignatureValidation,
  getSignatureLogSummary,
};
