#!/usr/bin/env node

/**
 * Incident Response Server
 */

import http from 'http';
import { getIncidents, getIncident, resolveIncident } from './detector.js';

const PORT = process.env.INCIDENT_PORT || 9001;
const ADMIN_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN;

let KILLSWITCH_ACTIVE = false;
let KILLSWITCH_ACTIVATED_BY = null;
let KILLSWITCH_ACTIVATED_AT = null;

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
  
  // Check killswitch on all requests
  if (KILLSWITCH_ACTIVE && !url.includes('/killswitch')) {
    return sendJSON(res, 503, {
      error: 'Service unavailable',
      reason: 'Kill switch activated',
      activated_at: KILLSWITCH_ACTIVATED_AT,
      activated_by: KILLSWITCH_ACTIVATED_BY,
    });
  }
  
  if (url === '/health' && method === 'GET') {
    return sendJSON(res, 200, { 
      status: 'ok',
      killswitch: KILLSWITCH_ACTIVE,
    });
  }
  
  if (!url.startsWith('/admin/')) {
    return sendJSON(res, 404, { error: 'Not found' });
  }
  
  if (!checkAuth(req)) {
    return sendJSON(res, 401, { error: 'Unauthorized' });
  }
  
  try {
    // GET /admin/incidents
    if (url === '/admin/incidents' && method === 'GET') {
      const params = new URLSearchParams(url.split('?')[1] || '');
      const incidents = await getIncidents({
        type: params.get('type'),
        severity: params.get('severity'),
        resolved: params.get('resolved') === 'true' ? true : 
                  params.get('resolved') === 'false' ? false : undefined,
      });
      
      return sendJSON(res, 200, {
        count: incidents.length,
        incidents,
      });
    }
    
    // GET /admin/incidents/:id
    if (url.match(/^\/admin\/incidents\/[^\/]+$/) && method === 'GET') {
      const id = url.split('/').pop();
      const incident = await getIncident(id);
      
      if (!incident) {
        return sendJSON(res, 404, { error: 'Incident not found' });
      }
      
      return sendJSON(res, 200, incident);
    }
    
    // POST /admin/incidents/:id/resolve
    if (url.match(/^\/admin\/incidents\/[^\/]+\/resolve$/) && method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const { notes } = JSON.parse(body || '{}');
          const id = url.split('/')[3];
          
          const incident = await resolveIncident(id, notes);
          
          if (!incident) {
            return sendJSON(res, 404, { error: 'Incident not found' });
          }
          
          return sendJSON(res, 200, {
            message: 'Incident resolved',
            incident,
          });
        } catch (err) {
          return sendJSON(res, 400, { error: err.message });
        }
      });
      return;
    }
    
    // POST /admin/killswitch - ACTIVATE
    if (url === '/admin/killswitch' && method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const { confirm } = JSON.parse(body || '{}');
          
          if (confirm !== 'KILLSWITCH_CONFIRMED') {
            return sendJSON(res, 400, {
              error: 'Kill switch not confirmed',
              required: 'confirm=KILLSWITCH_CONFIRMED',
            });
          }
          
          KILLSWITCH_ACTIVE = true;
          KILLSWITCH_ACTIVATED_BY = req.headers['x-user-id'] || 'unknown';
          KILLSWITCH_ACTIVATED_AT = new Date().toISOString();
          
          return sendJSON(res, 200, {
            message: 'Kill switch ACTIVATED',
            activated_by: KILLSWITCH_ACTIVATED_BY,
            activated_at: KILLSWITCH_ACTIVATED_AT,
          });
        } catch (err) {
          return sendJSON(res, 400, { error: err.message });
        }
      });
      return;
    }
    
    // POST /admin/killswitch/release - DEACTIVATE
    if (url === '/admin/killswitch/release' && method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const { confirm } = JSON.parse(body || '{}');
          
          if (confirm !== 'KILLSWITCH_RELEASE_CONFIRMED') {
            return sendJSON(res, 400, {
              error: 'Release not confirmed',
              required: 'confirm=KILLSWITCH_RELEASE_CONFIRMED',
            });
          }
          
          KILLSWITCH_ACTIVE = false;
          
          return sendJSON(res, 200, {
            message: 'Kill switch RELEASED',
            released_at: new Date().toISOString(),
          });
        } catch (err) {
          return sendJSON(res, 400, { error: err.message });
        }
      });
      return;
    }
    
    return sendJSON(res, 404, { error: 'Not found' });
    
  } catch (err) {
    console.error('[incident-response] Error:', err);
    return sendJSON(res, 500, { error: err.message });
  }
}

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`[incident-response] Server on http://127.0.0.1:${PORT}`);
});

process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));
