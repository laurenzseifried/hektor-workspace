#!/usr/bin/env node
/**
 * Sub-Agent Webhook Server
 * 
 * Receives POST /webhooks/subagent-complete from sub-agents,
 * logs results to .subagent-results/, and optionally forwards to Telegram.
 * 
 * Zero dependencies — uses Node built-ins only.
 * 
 * Usage: node server.js [--port 3001] [--telegram] [--telegram-topic 7]
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';

// --- Config ---
const PORT = parseInt(process.env.WEBHOOK_PORT || '3001', 10);
const RESULTS_DIR = process.env.RESULTS_DIR || path.resolve(
  new URL('.', import.meta.url).pathname, '../../.subagent-results'
);
const TELEGRAM_ENABLED = process.argv.includes('--telegram') || process.env.TELEGRAM_NOTIFY === '1';
const TELEGRAM_TOPIC = process.env.TELEGRAM_TOPIC || '7'; // #logs default
const TELEGRAM_GROUP = process.env.TELEGRAM_GROUP || '-1003808534190';

// Ensure results dir
fs.mkdirSync(RESULTS_DIR, { recursive: true });

// --- Telegram notification via openclaw CLI ---
function notifyTelegram(payload) {
  if (!TELEGRAM_ENABLED) return;
  const status = payload.status === 'ok' ? '✅' : '❌';
  const msg = [
    `${status} **Sub-Agent Complete**`,
    `Task: \`${payload.taskId}\``,
    payload.label ? `Label: ${payload.label}` : null,
    `Status: ${payload.status}`,
    payload.error ? `Error: ${payload.error}` : null,
    payload.result ? `Result: ${String(payload.result).slice(0, 200)}` : null,
  ].filter(Boolean).join('\n');

  execFile('openclaw', [
    'message', 'send',
    '--channel', 'telegram',
    '--target', TELEGRAM_GROUP,
    '--thread-id', TELEGRAM_TOPIC,
    '--message', msg,
  ], { timeout: 10000 }, (err) => {
    if (err) console.error('[telegram] notify failed:', err.message);
  });
}

// --- Request handler ---
function handleWebhook(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' });
    return res.end();
  }

  if (req.method !== 'POST' || req.url !== '/webhooks/subagent-complete') {
    // Health check
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: true, uptime: process.uptime() }));
    }
    res.writeHead(404);
    return res.end('Not Found');
  }

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    let payload;
    try {
      payload = JSON.parse(body);
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }

    // Validate required fields
    if (!payload.taskId || !payload.status) {
      res.writeHead(422, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Missing taskId or status' }));
    }

    // Add server timestamp
    payload.receivedAt = new Date().toISOString();
    payload.timestamp = payload.timestamp || payload.receivedAt;

    // Write result file
    const filename = `${payload.taskId}.json`;
    const filepath = path.join(RESULTS_DIR, filename);
    try {
      fs.writeFileSync(filepath, JSON.stringify(payload, null, 2) + '\n');
      console.log(`[webhook] Saved ${filename} (status: ${payload.status})`);
    } catch (err) {
      console.error(`[webhook] Write failed: ${err.message}`);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Write failed' }));
    }

    // Notify Telegram (async, non-blocking)
    notifyTelegram(payload);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, file: filename }));
  });
}

// --- Server ---
const server = http.createServer(handleWebhook);
server.listen(PORT, '127.0.0.1', () => {
  console.log(`[subagent-webhook] Listening on http://127.0.0.1:${PORT}`);
  console.log(`[subagent-webhook] Results → ${RESULTS_DIR}`);
  console.log(`[subagent-webhook] Telegram: ${TELEGRAM_ENABLED ? 'ON' : 'OFF'}`);
});
