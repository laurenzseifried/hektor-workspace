/**
 * Sub-Agent Webhook Client
 * 
 * Call reportComplete() at end of sub-agent work to POST result to webhook.
 * Includes retry logic (3 attempts, exponential backoff).
 * 
 * Usage in sub-agent context:
 *   import { reportComplete } from './client.js';
 *   await reportComplete({ taskId: 'xxx', status: 'ok', result: '...' });
 */

import http from 'node:http';

const DEFAULT_URL = 'http://127.0.0.1:3001/webhooks/subagent-complete';
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

function post(url, data) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const body = JSON.stringify(data);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      timeout: 5000,
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(JSON.parse(d));
        else reject(new Error(`HTTP ${res.statusCode}: ${d}`));
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.end(body);
  });
}

export async function reportComplete({ taskId, status = 'ok', result, error, label, callbackUrl } = {}) {
  const url = callbackUrl || process.env.SUBAGENT_CALLBACK_URL || DEFAULT_URL;
  const payload = {
    taskId,
    status,
    result: result || undefined,
    error: error || undefined,
    label: label || undefined,
    timestamp: new Date().toISOString(),
  };

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const resp = await post(url, payload);
      return resp;
    } catch (err) {
      console.error(`[webhook-client] Attempt ${attempt}/${MAX_RETRIES} failed: ${err.message}`);
      if (attempt < MAX_RETRIES) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
        await new Promise(r => setTimeout(r, delay));
      } else {
        console.error(`[webhook-client] All retries exhausted for task ${taskId}`);
        throw err;
      }
    }
  }
}
