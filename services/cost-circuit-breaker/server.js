#!/usr/bin/env node

/**
 * Cost Circuit Breaker Server
 * 
 * Admin API for cost tracking and circuit breaker management
 */

import http from 'http';
import { getCosts, resetCosts, trackRequest } from './tracker.js';
import { getState, updateThresholds, THRESHOLDS, resetAlerts } from './breaker.js';

const PORT = process.env.CIRCUIT_BREAKER_PORT || 3002;
const ADMIN_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN; // Reuse gateway token for auth

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
 * Check admin auth
 */
function checkAuth(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  return token === ADMIN_TOKEN;
}

/**
 * Send JSON response
 */
function sendJSON(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
}

/**
 * Generate HTML dashboard
 */
function generateDashboard(state, costs) {
  const { level, total, threshold } = state;
  
  const color = {
    'OK': '#10b981',
    'WARNING': '#fbbf24',
    'SOFT': '#f97316',
    'HARD': '#ef4444',
    'EMERGENCY': '#dc2626',
  }[level] || '#6b7280';
  
  const percentage = Math.min((total / THRESHOLDS.EMERGENCY) * 100, 100);
  
  const byModel = Object.entries(costs.byModel || {})
    .sort((a, b) => b[1] - a[1])
    .map(([model, cost]) => `<tr><td>${model}</td><td>$${cost.toFixed(2)}</td></tr>`)
    .join('');
  
  const byUser = Object.entries(costs.byUser || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([user, cost]) => `<tr><td>${user}</td><td>$${cost.toFixed(2)}</td></tr>`)
    .join('');
  
  return `<!DOCTYPE html>
<html>
<head>
  <title>Cost Circuit Breaker Dashboard</title>
  <meta http-equiv="refresh" content="30">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; padding: 2rem; }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { font-size: 2rem; margin-bottom: 1rem; color: #111827; }
    .status { background: white; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .status-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .level { font-size: 1.5rem; font-weight: bold; color: ${color}; }
    .amount { font-size: 2.5rem; font-weight: bold; color: #111827; }
    .progress-bar { width: 100%; height: 2rem; background: #e5e7eb; border-radius: 4px; overflow: hidden; margin-top: 1rem; }
    .progress-fill { height: 100%; background: ${color}; transition: width 0.3s; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem; }
    .card { background: white; border-radius: 8px; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .card h2 { font-size: 1.25rem; margin-bottom: 1rem; color: #374151; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 0.5rem 0; border-bottom: 1px solid #f3f4f6; }
    td:last-child { text-align: right; font-weight: 600; }
    .thresholds { display: flex; justify-content: space-between; margin-top: 1rem; font-size: 0.875rem; }
    .threshold { text-align: center; }
    .threshold-label { color: #6b7280; margin-bottom: 0.25rem; }
    .threshold-value { font-weight: 600; color: #111827; }
    .footer { text-align: center; color: #6b7280; margin-top: 2rem; font-size: 0.875rem; }
  </style>
</head>
<body>
  <div class="container">
    <h1>💰 Cost Circuit Breaker</h1>
    
    <div class="status">
      <div class="status-header">
        <div class="level">${level}</div>
        <div class="amount">$${total.toFixed(2)}</div>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${percentage}%"></div>
      </div>
      <div class="thresholds">
        <div class="threshold">
          <div class="threshold-label">WARNING</div>
          <div class="threshold-value">$${THRESHOLDS.WARNING}</div>
        </div>
        <div class="threshold">
          <div class="threshold-label">SOFT</div>
          <div class="threshold-value">$${THRESHOLDS.SOFT}</div>
        </div>
        <div class="threshold">
          <div class="threshold-label">HARD</div>
          <div class="threshold-value">$${THRESHOLDS.HARD}</div>
        </div>
        <div class="threshold">
          <div class="threshold-label">EMERGENCY</div>
          <div class="threshold-value">$${THRESHOLDS.EMERGENCY}</div>
        </div>
      </div>
    </div>
    
    <div class="grid">
      <div class="card">
        <h2>By Model</h2>
        <table>
          ${byModel || '<tr><td colspan="2">No data</td></tr>'}
        </table>
      </div>
      
      <div class="card">
        <h2>By User</h2>
        <table>
          ${byUser || '<tr><td colspan="2">No data</td></tr>'}
        </table>
      </div>
    </div>
    
    <div class="footer">
      Auto-refreshes every 30 seconds • Last updated: ${new Date().toLocaleString()}
    </div>
  </div>
</body>
</html>`;
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
  
  // Dashboard (public, read-only view)
  if (url === '/dashboard' && method === 'GET') {
    const state = await getState();
    const costs = await getCosts();
    
    const html = generateDashboard(state, costs);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(html);
  }
  
  // Admin endpoints require auth
  if (url.startsWith('/admin/')) {
    if (!checkAuth(req)) {
      return sendJSON(res, 401, { error: 'Unauthorized' });
    }
  }
  
  try {
    // GET /admin/costs — View current spend
    if (url === '/admin/costs' && method === 'GET') {
      const costs = await getCosts();
      const state = await getState();
      
      return sendJSON(res, 200, {
        ...state,
        thresholds: THRESHOLDS,
        breakdown: {
          byModel: costs.byModel,
          byUser: costs.byUser,
          byKey: costs.byKey,
        },
        recentRequests: costs.requests.slice(-20),
      });
    }
    
    // POST /admin/costs/reset — Reset circuit breaker
    if (url === '/admin/costs/reset' && method === 'POST') {
      const empty = await resetCosts();
      resetAlerts();
      
      return sendJSON(res, 200, {
        message: 'Costs reset successfully',
        costs: empty,
      });
    }
    
    // PUT /admin/costs/limits — Update thresholds
    if (url === '/admin/costs/limits' && method === 'PUT') {
      const body = await parseBody(req);
      const updated = updateThresholds(body);
      
      return sendJSON(res, 200, {
        message: 'Thresholds updated',
        thresholds: updated,
      });
    }
    
    // POST /track — Track a request (internal use)
    if (url === '/track' && method === 'POST') {
      const { model, inputTokens, outputTokens, user, apiKey } = await parseBody(req);
      
      if (!model || inputTokens == null || outputTokens == null) {
        return sendJSON(res, 400, { error: 'Missing required fields: model, inputTokens, outputTokens' });
      }
      
      const result = await trackRequest(model, inputTokens, outputTokens, user, apiKey);
      const state = await getState();
      
      return sendJSON(res, 200, {
        cost: result.cost,
        total: result.total,
        state: state.level,
      });
    }
    
    // GET /state — Get circuit breaker state (public)
    if (url === '/state' && method === 'GET') {
      const state = await getState();
      
      return sendJSON(res, 200, {
        level: state.level,
        total: state.total,
        threshold: state.threshold,
        thresholds: THRESHOLDS,
      });
    }
    
    // 404
    return sendJSON(res, 404, { error: 'Not found' });
    
  } catch (err) {
    console.error('[server] Error:', err);
    return sendJSON(res, 500, { error: err.message });
  }
}

/**
 * Start server
 */
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`[cost-circuit-breaker] Server listening on http://127.0.0.1:${PORT}`);
  console.log(`[cost-circuit-breaker] Thresholds: WARNING=$${THRESHOLDS.WARNING} SOFT=$${THRESHOLDS.SOFT} HARD=$${THRESHOLDS.HARD} EMERGENCY=$${THRESHOLDS.EMERGENCY}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[cost-circuit-breaker] SIGTERM received, shutting down...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('[cost-circuit-breaker] SIGINT received, shutting down...');
  server.close(() => process.exit(0));
});
