#!/usr/bin/env node

/**
 * API Orchestrator — Coordinates Cost + Security + Model Inference
 *
 * Flow:
 * 1. Validate input (3004)
 * 2. Inject canary (3004)
 * 3. Track cost start (3003)
 * 4. Call OpenClaw model
 * 5. Filter output (3004)
 * 6. Track cost end (3003)
 * 7. Return response
 */

import http from 'http';
import https from 'https';
import { URL } from 'url';

const PORT = process.env.ORCHESTRATOR_PORT || 3005;
const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://127.0.0.1:8000';
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN;

// Service endpoints
const SERVICES = {
  injectionDefense: 'http://127.0.0.1:3004',
  costCircuitBreaker: 'http://127.0.0.1:3003',
};

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
 * Make HTTP request
 */
function httpRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    const urlObj = new URL(url);
    
    const reqOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };
    
    const req = client.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: data ? JSON.parse(data) : {},
            headers: res.headers,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data,
            headers: res.headers,
            parseError: true,
          });
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

/**
 * POST /infer — Main orchestration endpoint
 * 
 * Request:
 * {
 *   messages: [...],        // Chat history
 *   systemPrompt: "...",    // System instructions
 *   model: "...",           // Model to use
 *   sessionId: "...",       // Session identifier
 *   apiKey: "...",          // API key for tracking
 * }
 */
async function handleInfer(req, res, body) {
  const startTime = Date.now();
  const { messages, systemPrompt, model, sessionId, apiKey } = body;
  
  if (!messages || !systemPrompt || !model) {
    return sendJSON(res, 400, { error: 'Missing required fields: messages, systemPrompt, model' });
  }
  
  try {
    // 1. Validate the last user message
    console.log(`[orchestrator] 1. Validating input for session ${sessionId}`);
    const lastMessage = messages[messages.length - 1]?.content || '';
    
    const validateResp = await httpRequest(`${SERVICES.injectionDefense}/validate-input`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        message: lastMessage,
        sessionData: { sessionId, turns: messages.length },
        apiKey,
      },
    });
    
    if (validateResp.status !== 200) {
      console.log(`[orchestrator] ❌ Input validation failed: ${validateResp.status}`);
      return sendJSON(res, validateResp.status, {
        error: 'INPUT_VALIDATION_FAILED',
        details: validateResp.data,
      });
    }
    
    const validatedMessage = validateResp.data.message;
    const sanitized = validateResp.data.sanitized;
    
    // 2. Inject canary token into system prompt
    console.log(`[orchestrator] 2. Injecting canary into system prompt`);
    const canaryResp = await httpRequest(`${SERVICES.injectionDefense}/prepare-system-prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        systemPrompt,
        sessionId,
      },
    });
    
    if (canaryResp.status !== 200) {
      console.log(`[orchestrator] ⚠️ Canary injection failed: ${canaryResp.status}`);
      // Continue without canary (not critical)
    }
    
    const systemPromptWithCanary = canaryResp.data?.prompt || systemPrompt;
    const canaryToken = canaryResp.data?.canaryToken;
    
    // 3. Start cost tracking
    console.log(`[orchestrator] 3. Starting cost tracking`);
    
    // 4. Call OpenClaw model API
    console.log(`[orchestrator] 4. Calling model: ${model}`);
    
    const modelMessages = [
      ...messages.slice(0, -1),
      { role: 'user', content: validatedMessage },
    ];
    
    const modelResp = await httpRequest(`${GATEWAY_URL}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GATEWAY_TOKEN}`,
      },
      body: {
        model,
        messages: modelMessages,
        system: systemPromptWithCanary,
        max_tokens: 2000,
      },
    });
    
    if (modelResp.status !== 200) {
      console.log(`[orchestrator] ❌ Model API failed: ${modelResp.status}`);
      return sendJSON(res, modelResp.status, {
        error: 'MODEL_API_FAILED',
        details: modelResp.data,
      });
    }
    
    const modelOutput = modelResp.data?.content?.[0]?.text || '';
    const usage = modelResp.data?.usage || { input_tokens: 0, output_tokens: 0 };
    
    // 5. Track costs
    console.log(`[orchestrator] 5. Tracking costs (${usage.input_tokens} in, ${usage.output_tokens} out)`);
    const costResp = await httpRequest(`${SERVICES.costCircuitBreaker}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        model,
        inputTokens: usage.input_tokens,
        outputTokens: usage.output_tokens,
        user: sessionId,
        apiKey,
      },
    });
    
    const costData = costResp.data || { cost: 0, total: 0, state: 'UNKNOWN' };
    
    // 6. Filter output for security issues
    console.log(`[orchestrator] 6. Filtering output for security`);
    const filterResp = await httpRequest(`${SERVICES.injectionDefense}/filter-output`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        output: modelOutput,
        sessionId,
        apiKey,
      },
    });
    
    if (filterResp.status !== 200) {
      console.log(`[orchestrator] 🔴 SECURITY ALERT: Output blocked`);
      return sendJSON(res, 403, {
        error: 'OUTPUT_SECURITY_CHECK_FAILED',
        message: 'Model output contains sensitive information and was blocked',
        details: filterResp.data,
      });
    }
    
    const safeOutput = filterResp.data?.output || modelOutput;
    const findings = filterResp.data?.findings || [];
    
    // 7. Return response
    const duration = Date.now() - startTime;
    
    console.log(`[orchestrator] ✅ Complete in ${duration}ms`);
    
    return sendJSON(res, 200, {
      success: true,
      output: safeOutput,
      metadata: {
        sanitized,
        findings,
        cost: {
          thisCycle: costData.cost || 0,
          total: costData.total || 0,
          state: costData.state,
        },
        canary: canaryToken ? { injected: true } : { injected: false },
        duration,
      },
    });
    
  } catch (err) {
    console.error('[orchestrator] Error:', err);
    return sendJSON(res, 500, { error: err.message });
  }
}

/**
 * GET /health
 */
function handleHealth(res) {
  sendJSON(res, 200, {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      injectionDefense: '3004',
      costCircuitBreaker: '3003',
      gateway: GATEWAY_URL,
    },
  });
}

/**
 * GET /status — Aggregated service status
 */
async function handleStatus(res) {
  const checks = {
    orchestrator: { ok: true },
    injectionDefense: null,
    costCircuitBreaker: null,
    gateway: null,
  };
  
  try {
    const idResp = await httpRequest(`${SERVICES.injectionDefense}/health`);
    checks.injectionDefense = { ok: idResp.status === 200 };
  } catch (e) {
    checks.injectionDefense = { ok: false, error: e.message };
  }
  
  try {
    const ccbResp = await httpRequest(`${SERVICES.costCircuitBreaker}/health`);
    checks.costCircuitBreaker = { ok: ccbResp.status === 200 };
  } catch (e) {
    checks.costCircuitBreaker = { ok: false, error: e.message };
  }
  
  try {
    const gwResp = await httpRequest(`${GATEWAY_URL}/health`);
    checks.gateway = { ok: gwResp.status === 200 };
  } catch (e) {
    checks.gateway = { ok: false, error: e.message };
  }
  
  const allOk = Object.values(checks).every(c => c.ok);
  
  return sendJSON(res, allOk ? 200 : 503, {
    status: allOk ? 'healthy' : 'degraded',
    checks,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Request handler
 */
async function handleRequest(req, res) {
  const { method, url } = req;
  
  if (url === '/health' && method === 'GET') {
    return handleHealth(res);
  }
  
  if (url === '/status' && method === 'GET') {
    return handleStatus(res);
  }
  
  if (url === '/infer' && method === 'POST') {
    const body = await parseBody(req);
    return handleInfer(req, res, body);
  }
  
  return sendJSON(res, 404, { error: 'Not found' });
}

/**
 * Start server
 */
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`[api-orchestrator] Server listening on http://127.0.0.1:${PORT}`);
  console.log(`[api-orchestrator] Gateway: ${GATEWAY_URL}`);
  console.log(`[api-orchestrator] Injection Defense: ${SERVICES.injectionDefense}`);
  console.log(`[api-orchestrator] Cost Circuit Breaker: ${SERVICES.costCircuitBreaker}`);
});

process.on('SIGTERM', () => {
  console.log('[api-orchestrator] SIGTERM received, shutting down...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('[api-orchestrator] SIGINT received, shutting down...');
  server.close(() => process.exit(0));
});
