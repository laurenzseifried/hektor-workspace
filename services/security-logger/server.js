#!/usr/bin/env node

/**
 * Security Logger Admin Server
 */

import http from 'http';
import { queryLogs } from './logger.js';
import { checkAlerts, formatTelegramAlert } from './alerts.js';
import { rotateLogs, cleanupOldLogs, getLogStats } from './rotation.js';

const PORT = process.env.LOGGER_PORT || 9000;
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
  const { method, url } = req;
  
  if (url === '/health' && method === 'GET') {
    return sendJSON(res, 200, { status: 'ok' });
  }
  
  // Admin endpoints
  if (url.startsWith('/admin/')) {
    if (!checkAuth(req)) {
      return sendJSON(res, 401, { error: 'Unauthorized' });
    }
  }
  
  try {
    // GET /admin/logs - Query logs
    if (url.startsWith('/admin/logs') && method === 'GET') {
      const params = new URLSearchParams(url.split('?')[1] || '');
      const results = await queryLogs({
        category: params.get('category'),
        level: params.get('level'),
        since: params.get('since'),
        until: params.get('until'),
        limit: parseInt(params.get('limit') || '100'),
      });
      
      return sendJSON(res, 200, {
        count: results.length,
        logs: results,
      });
    }
    
    // GET /admin/alerts - Check alerts
    if (url === '/admin/alerts' && method === 'GET') {
      const alerts = await checkAlerts();
      
      return sendJSON(res, 200, {
        alertCount: alerts.length,
        critical: alerts.filter(a => a.level === 'critical').length,
        high: alerts.filter(a => a.level === 'high').length,
        alerts,
      });
    }
    
    // POST /admin/rotate - Manually trigger rotation
    if (url === '/admin/rotate' && method === 'POST') {
      await rotateLogs();
      await cleanupOldLogs();
      
      return sendJSON(res, 200, { message: 'Logs rotated and cleaned up' });
    }
    
    // GET /admin/stats - Log statistics
    if (url === '/admin/stats' && method === 'GET') {
      const stats = await getLogStats();
      
      return sendJSON(res, 200, {
        ...stats,
        totalSizeMB: (stats.totalSize / 1024 / 1024).toFixed(2),
      });
    }
    
    return sendJSON(res, 404, { error: 'Not found' });
    
  } catch (err) {
    console.error('[logger-server] Error:', err);
    return sendJSON(res, 500, { error: err.message });
  }
}

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`[security-logger] Admin server on http://127.0.0.1:${PORT}`);
});

process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));
