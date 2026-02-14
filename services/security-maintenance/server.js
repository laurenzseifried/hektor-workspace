#!/usr/bin/env node
/**
 * Security Maintenance Server - /admin/security-status endpoint
 */

import http from 'http';
import { getKeyStatus } from './key-rotation.js';
import { checkKeyRotations } from './key-rotation.js';

const PORT = process.env.MAINTENANCE_PORT || 9002;
const ADMIN_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN;

function sendJSON(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
}

function checkAuth(req) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  return token === ADMIN_TOKEN;
}

async function handleRequest(req, res) {
  const { url, method } = req;
  
  if (url === '/health' && method === 'GET') {
    return sendJSON(res, 200, { status: 'ok' });
  }
  
  if (!url.startsWith('/admin/')) {
    return sendJSON(res, 404, { error: 'Not found' });
  }
  
  if (!checkAuth(req)) {
    return sendJSON(res, 401, { error: 'Unauthorized' });
  }
  
  try {
    // GET /admin/security-status
    if (url === '/admin/security-status' && method === 'GET') {
      const keyStatus = await getKeyStatus();
      const keyReminders = await checkKeyRotations();
      
      // Calculate security score
      let score = 100;
      
      // Key rotation (30 points)
      const overdueKeys = keyReminders.filter(k => k.level === 'CRITICAL').length;
      const urgentKeys = keyReminders.filter(k => k.level === 'URGENT').length;
      score -= overdueKeys * 20;
      score -= urgentKeys * 10;
      
      const status = {
        timestamp: new Date().toISOString(),
        security_score: Math.max(0, score),
        key_rotation: {
          status_by_key: keyStatus,
          reminders: keyReminders,
          keys_needing_rotation: keyReminders.length,
        },
        backup_status: {
          last_verified: 'check backup verification logs',
          retention_policy: '30d daily / 365d security',
        },
        rate_limit_config: {
          configured: true,
          current_limits: 'see gateway-proxy logs',
        },
        circuit_breaker: {
          warning: 100,
          soft_limit: 250,
          hard_limit: 500,
          emergency: 1000,
        },
        action_items: keyReminders.filter(k => k.level !== 'WARNING'),
      };
      
      return sendJSON(res, 200, status);
    }
    
    return sendJSON(res, 404, { error: 'Endpoint not found' });
    
  } catch (err) {
    console.error('[maintenance] Error:', err);
    return sendJSON(res, 500, { error: err.message });
  }
}

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`[security-maintenance] Server on http://127.0.0.1:${PORT}`);
});

process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));
