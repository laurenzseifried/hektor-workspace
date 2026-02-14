#!/usr/bin/env node

/**
 * Gateway Proxy — Transparent middleware for OpenClaw API
 *
 * Routes:
 * - POST /api/messages → Orchestrator 3005 (validated + secured)
 * - All others → Real Gateway 18789 (passthrough)
 *
 * Benefits:
 * - All model requests protected (Cost + Security)
 * - Clients unchanged (still use localhost:8000)
 * - Real gateway untouched
 * - Clean separation of concerns
 */

import http from 'http';
import { URL } from 'url';

const PORT = process.env.GATEWAY_PROXY_PORT || 8000;
const REAL_GATEWAY = process.env.REAL_GATEWAY_URL || 'http://127.0.0.1:18789';
const ORCHESTRATOR = process.env.ORCHESTRATOR_URL || 'http://127.0.0.1:3005';

/**
 * Session Message Counter (in-memory)
 * Tracks message count per session for auto-clear thresholds
 */
const sessionCounts = new Map();

function getSessionId(headers, body) {
  // Extract from headers or body
  return headers['x-session-id'] || 
         body?.sessionId || 
         headers.authorization?.split('Bearer ').pop()?.substring(0, 16) ||
         'unknown';
}

function countMessage(sessionId) {
  const current = (sessionCounts.get(sessionId) || 0) + 1;
  sessionCounts.set(sessionId, current);
  
  // Auto-cleanup old sessions (>1000 msgs = prob dead)
  if (current > 10000) {
    sessionCounts.delete(sessionId);
  }
  
  return current;
}

function getMessageCount(sessionId) {
  return sessionCounts.get(sessionId) || 0;
}

function resetSessionCount(sessionId) {
  sessionCounts.delete(sessionId);
}

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
 * Make HTTP request
 */
function httpRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const reqOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        ...options.headers,
        'Host': urlObj.hostname,
      },
    };
    
    // Remove certain headers that should be re-negotiated
    delete reqOptions.headers['content-length'];
    delete reqOptions.headers['host'];
    delete reqOptions.headers['connection'];
    
    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

/**
 * Route POST /api/messages through Orchestrator
 * Includes session-based auto-clear logic
 */
async function handleModelRequest(req, res, body) {
  try {
    const sessionId = getSessionId(req.headers, body);
    const msgCount = countMessage(sessionId);
    
    console.log(`[gateway-proxy] Model request (Session: ${sessionId}, Msg #${msgCount}) → Orchestrator 3005`);
    
    // Check auto-clear thresholds
    if (msgCount === 30) {
      console.log(`[gateway-proxy] ⚠️  AUTO-CLEAR WARNING: Session ${sessionId} reached 30 messages`);
      // Send warning response without processing
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        type: 'auto_clear_warning',
        message: '[AUTO-SESSION WARNING] This session has 30+ messages. Token usage is high. Reply /clear to start fresh while keeping your project context.',
        sessionId: sessionId,
        messageCount: msgCount,
        action: 'none',
      }));
    }
    
    if (msgCount >= 50) {
      console.log(`[gateway-proxy] 🔄 AUTO-CLEAR TRIGGERED: Session ${sessionId} reached ${msgCount} messages`);
      // Reset the session counter
      resetSessionCount(sessionId);
      
      // Inject SESSION_CLEARED into the request
      const modifiedBody = {
        ...body,
        messages: [
          { role: 'system', content: 'SESSION_CLEARED' },
          ...(body.messages || []),
        ],
      };
      
      // Forward modified request to Orchestrator
      const orchestratorResp = await httpRequest(`${ORCHESTRATOR}/infer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': req.headers.authorization || '',
          'User-Agent': req.headers['user-agent'] || '',
        },
        body: JSON.stringify({
          ...modifiedBody,
          sessionId: sessionId,
          apiKey: req.headers['x-api-key'] || body.apiKey || req.headers.authorization?.replace('Bearer ', ''),
        }),
      });
      
      // Parse and modify response to include auto-clear notification
      let responseBody = orchestratorResp.body;
      try {
        const parsed = JSON.parse(responseBody);
        parsed.auto_cleared = true;
        parsed.notification = '[AUTO-CLEARED] Session reset to save tokens. Your project memory and tasks are preserved.';
        responseBody = JSON.stringify(parsed);
      } catch (e) {
        // If response isn't JSON, just append notification
        responseBody = orchestratorResp.body + '\n\n[AUTO-CLEARED] Session reset to save tokens. Your project memory and tasks are preserved.';
      }
      
      res.writeHead(orchestratorResp.status, {
        'Content-Type': orchestratorResp.headers['content-type'] || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      });
      
      return res.end(responseBody);
    }
    
    // Normal flow: forward to Orchestrator
    const orchestratorResp = await httpRequest(`${ORCHESTRATOR}/infer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization || '',
        'User-Agent': req.headers['user-agent'] || '',
      },
      body: JSON.stringify({
        ...body,
        sessionId: sessionId,
        apiKey: req.headers['x-api-key'] || body.apiKey || req.headers.authorization?.replace('Bearer ', ''),
      }),
    });
    
    // Return Orchestrator response
    res.writeHead(orchestratorResp.status, {
      'Content-Type': orchestratorResp.headers['content-type'] || 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    
    return res.end(orchestratorResp.body);
    
  } catch (err) {
    console.error('[gateway-proxy] Orchestrator error:', err.message);
    
    res.writeHead(500, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      error: 'Orchestrator unavailable',
      message: err.message,
    }));
  }
}

/**
 * Passthrough all other requests to real gateway
 */
async function handlePassthrough(req, res, body) {
  try {
    console.log(`[gateway-proxy] Passthrough → Real Gateway 18789: ${req.method} ${req.url}`);
    
    const gatewayUrl = new URL(req.url, REAL_GATEWAY).href;
    
    const gwResp = await httpRequest(gatewayUrl, {
      method: req.method,
      headers: req.headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    
    // Forward response
    res.writeHead(gwResp.status, {
      ...gwResp.headers,
      'Access-Control-Allow-Origin': '*',
    });
    
    return res.end(gwResp.body);
    
  } catch (err) {
    console.error('[gateway-proxy] Gateway passthrough error:', err.message);
    
    res.writeHead(502, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      error: 'Bad Gateway',
      message: 'Real gateway unavailable',
      details: err.message,
    }));
  }
}

/**
 * Main request handler
 */
async function handleRequest(req, res) {
  const { method, url } = req;
  
  // CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Session-ID, X-API-Key',
      'Access-Control-Max-Age': '86400',
    });
    return res.end();
  }
  
  try {
    // Parse body once
    let body;
    if (method !== 'GET' && method !== 'HEAD') {
      body = await parseBody(req);
    }
    
    // Route to Orchestrator if model request
    if (method === 'POST' && url === '/api/messages') {
      return handleModelRequest(req, res, body);
    }
    
    // Passthrough everything else
    return handlePassthrough(req, res, body);
    
  } catch (err) {
    console.error('[gateway-proxy] Error:', err.message);
    
    res.writeHead(500, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: err.message }));
  }
}

/**
 * Start server
 */
const server = http.createServer(handleRequest);

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[gateway-proxy] Listening on http://127.0.0.1:${PORT}`);
  console.log(`[gateway-proxy] Model requests (POST /api/messages) → Orchestrator ${ORCHESTRATOR}`);
  console.log(`[gateway-proxy] All other requests → Real Gateway ${REAL_GATEWAY}`);
  console.log(`[gateway-proxy] Ready for client connections`);
});

process.on('SIGTERM', () => {
  console.log('[gateway-proxy] SIGTERM received, shutting down...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('[gateway-proxy] SIGINT received, shutting down...');
  server.close(() => process.exit(0));
});
