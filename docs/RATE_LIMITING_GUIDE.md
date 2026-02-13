# Rate Limiting System - Deployment Guide

## Overview

The OpenClaw webhook server implements a comprehensive multi-layer rate limiting system designed to protect against abuse, ensure fair resource allocation, and maintain service quality.

## Architecture

### Three-Layer Rate Limiting

1. **Layer 1: IP-Based Limiting** (Sliding Window)
   - Limit: 100 requests per minute per IP
   - Algorithm: Sliding window (Redis sorted sets)
   - Purpose: Prevent single IP from overwhelming the service

2. **Layer 2: API Key Limiting** (Token Bucket)
   - Limit: 60 requests per minute per API key
   - Algorithm: Token bucket with refill
   - Purpose: Fair allocation per authenticated client

3. **Layer 3: Model-Specific Limiting**
   - **Haiku**: 60 req/min, 60K tokens/min
   - **Sonnet**: 30 req/min, 50K tokens/min
   - **Opus**: 10 req/min, 20K tokens/min
   - Purpose: Manage expensive model usage

### Progressive Blocking

The system implements escalating responses to repeated violations:

| Violations | Time Window | Action | Block Duration |
|-----------|-------------|--------|----------------|
| 1st | 60 seconds | Warn | None |
| 10+ | 5 minutes | Block | 5 minutes |
| 50+ | 15 minutes | Block + Alert Admin | 1 hour |

## Installation

### Prerequisites

1. **Node.js** v18+ (ESM support required)
2. **Redis** v6.0+ (for distributed rate limiting)

### Install Redis

#### macOS (Homebrew)
```bash
brew install redis
brew services start redis
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install redis-server
sudo systemctl start redis
sudo systemctl enable redis
```

#### Docker
```bash
docker run -d \
  --name openclaw-redis \
  -p 6379:6379 \
  redis:7-alpine
```

### Install Node Dependencies

```bash
npm install redis
```

### Verify Installation

```bash
# Check Redis connection
redis-cli ping
# Should return: PONG

# Run test suite
node services/auth/test-rate-limiting.js
```

## Configuration

### Environment Variables

Create a `.env` file or set environment variables:

```bash
# Redis Configuration
REDIS_HOST=localhost          # Redis server host
REDIS_PORT=6379               # Redis server port
REDIS_PASSWORD=               # Redis password (optional)
REDIS_DB=0                    # Redis database number

# Logging
LOG_LEVEL=info                # Logging level: error, warn, info, debug
```

### Custom Configuration

Edit `/services/auth/rate-limit-config.js` to customize limits:

```javascript
export const RATE_LIMIT_CONFIG = {
  // IP Layer
  ipLayer: {
    maxRequests: 100,         // Adjust IP limit
    windowSeconds: 60,
  },
  
  // API Key Layer
  apiKeyLayer: {
    maxRequests: 60,          // Adjust API key limit
    refillRate: 1,            // Tokens per second
  },
  
  // Model Layer
  modelLayer: {
    models: {
      haiku: {
        maxRequests: 60,      // Adjust model limits
        maxTokens: 60000,
      },
      // ... other models
    },
  },
};
```

### Bypass Rules

Configure bypass rules for monitoring and health checks:

```javascript
bypass: {
  // Paths that bypass all rate limiting
  paths: [
    '/health',
    '/metrics',
  ],
  
  // IPs that bypass (internal monitoring)
  ips: [
    '127.0.0.1',
    '10.0.0.0/8',           // Internal network
  ],
  
  // Never bypass these paths (even for internal IPs)
  neverBypass: [
    '/admin',
    '/api/admin',
  ],
}
```

## Integration

### Express/Connect Middleware

```javascript
import express from 'express';
import { rateLimitMiddleware } from './services/auth/rate-limiter.js';

const app = express();

// Apply rate limiting globally
app.use(rateLimitMiddleware());

// Or apply to specific routes
app.post('/api/chat', rateLimitMiddleware(), async (req, res) => {
  // Handle request
});
```

### Custom Integration

```javascript
import { getRateLimiter } from './services/auth/rate-limiter.js';

const limiter = getRateLimiter();
await limiter.initialize();

// Check rate limit manually
const result = await limiter.checkRateLimit(req);

if (!result.allowed) {
  return res.status(429).json({
    error: 'Rate limit exceeded',
    retryAfter: result.retryAfter,
  });
}

// Add headers to response
if (result.headers) {
  Object.entries(result.headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}
```

## Response Format

### Success Response

When rate limit is not exceeded, the system adds headers:

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
```

### 429 Rate Limit Exceeded

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60

{
  "error": "Rate limit exceeded",
  "message": "API key rate limit exceeded",
  "retryAfter": 60
}
```

## Monitoring

### Health Check

```bash
# Check rate limiter status
curl http://localhost:3000/api/rate-limit/status
```

### Logs

The system logs all rate limit events:

```
[RateLimiter INFO] Rate limit IP_LIMIT: IP=192.168.1.100, ApiKey=...a1b2, Endpoint=/api/chat, Count=101, Limit=100, Timestamp=2026-02-12T20:30:00.000Z
```

### Redis Monitoring

```bash
# Monitor Redis commands
redis-cli monitor

# Check specific keys
redis-cli keys "ratelimit:*"

# Get key value
redis-cli get "ratelimit:ip:192.168.1.1"

# Check TTL
redis-cli ttl "ratelimit:ip:192.168.1.1"
```

### Admin Alerts

Configure admin alerts in `/services/auth/rate-limiter.js`:

```javascript
_alertAdmin(identifier, violations, blockSeconds) {
  // Send to your alerting system
  // Examples: Email, Slack, PagerDuty, etc.
  
  // Email
  sendEmail({
    to: 'admin@example.com',
    subject: 'Critical: Rate Limit Violation',
    body: `Identifier: ${identifier}\nViolations: ${violations}`,
  });
  
  // Slack
  slackWebhook({
    text: `:rotating_light: Rate limit violation: ${violations} from ${identifier}`,
  });
}
```

## Testing

### Run Full Test Suite

```bash
node services/auth/test-rate-limiting.js
```

### Manual Testing

#### Test IP Rate Limiting

```bash
# Make 101 requests quickly
for i in {1..101}; do
  curl -X POST http://localhost:3000/api/test
done
# 101st request should return 429
```

#### Test API Key Rate Limiting

```bash
# Make 61 requests with API key
for i in {1..61}; do
  curl -H "Authorization: Bearer test-key" \
       -X POST http://localhost:3000/api/test
done
# 61st request should return 429
```

#### Test Model Rate Limiting

```bash
# Request Opus model (10 req/min limit)
for i in {1..11}; do
  curl -H "Authorization: Bearer test-key" \
       -H "Content-Type: application/json" \
       -d '{"model":"claude-opus-4-5","tokens":1000}' \
       -X POST http://localhost:3000/api/chat
done
# 11th request should return 429
```

#### Test Progressive Blocking

```bash
# Trigger 10 violations to activate 5-minute block
# Then test that requests are blocked
curl -X POST http://localhost:3000/api/test
# Should return 429 with "Temporarily blocked" message
```

## Troubleshooting

### Redis Connection Issues

**Problem**: Rate limiter not connecting to Redis

**Solution**:
```bash
# Check Redis is running
redis-cli ping

# Check environment variables
echo $REDIS_HOST
echo $REDIS_PORT

# Check Redis logs
tail -f /var/log/redis/redis-server.log

# Test connection
redis-cli -h $REDIS_HOST -p $REDIS_PORT ping
```

### Fail-Open Behavior

The system is configured to **fail open** by default. If Redis is unavailable:
- Requests are **allowed** (not blocked)
- Errors are **logged**
- Service remains **operational**

To change to **fail closed** (block on Redis failure):

```javascript
// In rate-limit-config.js
redis: {
  failOpen: false,  // Change to false
}
```

### High Memory Usage

**Problem**: Redis using too much memory

**Solution**:
```bash
# Check Redis memory usage
redis-cli info memory

# Clear rate limit data (WARNING: Resets all limits)
redis-cli --scan --pattern 'ratelimit:*' | xargs redis-cli del

# Set Redis max memory
redis-cli config set maxmemory 256mb
redis-cli config set maxmemory-policy allkeys-lru
```

### Rate Limits Too Strict

**Problem**: Legitimate users hitting rate limits

**Solution**:
1. Review logs to identify patterns
2. Adjust limits in `rate-limit-config.js`
3. Add bypass rules for trusted IPs
4. Increase model-specific limits if needed

### Rate Limits Too Lenient

**Problem**: Abuse not being caught

**Solution**:
1. Lower IP/API key limits
2. Enable stricter model limits
3. Reduce progressive blocking thresholds
4. Add monitoring alerts

## Performance Optimization

### Redis Performance

```bash
# Enable Redis persistence for durability
# Edit /etc/redis/redis.conf
save 900 1
save 300 10
save 60 10000

# Optimize for speed (disable persistence for rate limiting)
save ""
appendonly no
```

### Connection Pooling

For high-traffic scenarios, use Redis connection pooling:

```javascript
// In redis-client.js, increase pool size
const clientConfig = {
  socket: {
    connectTimeout: 5000,
  },
  // Add connection pool config
  isolationPoolOptions: {
    min: 2,
    max: 10,
  },
};
```

### Lua Script Optimization

Rate limiting uses Lua scripts for atomic operations. Redis evaluates these efficiently, but you can optimize:

```bash
# Preload frequently used scripts (Redis 7+)
redis-cli SCRIPT LOAD "your-lua-script-here"
# Use returned SHA in eval calls
```

## Security Considerations

### API Key Security

- Never log full API keys (only last 4 characters)
- Use HTTPS to prevent key interception
- Rotate keys regularly
- Implement key revocation system

### IP Spoofing Prevention

```javascript
// Validate X-Forwarded-For headers
_extractIP(req) {
  // Only trust proxy headers from verified proxies
  if (req.headers['x-forwarded-for'] && isTrustedProxy(req.connection.remoteAddress)) {
    return req.headers['x-forwarded-for'].split(',')[0].trim();
  }
  return req.connection.remoteAddress;
}
```

### Redis Security

```bash
# Set Redis password
redis-cli config set requirepass "your-strong-password"

# Disable dangerous commands
redis-cli config set rename-command FLUSHDB ""
redis-cli config set rename-command FLUSHALL ""

# Bind to localhost only (if not using remote Redis)
redis-cli config set bind 127.0.0.1
```

## Production Checklist

Before deploying to production:

- [ ] Redis installed and configured
- [ ] Environment variables set
- [ ] Rate limits configured appropriately
- [ ] Bypass rules defined
- [ ] Admin alerts configured
- [ ] Monitoring set up
- [ ] Tests passing
- [ ] Redis persistence configured (if needed)
- [ ] Redis password set
- [ ] Logs being collected
- [ ] Backup strategy for Redis data (if persistence enabled)

## Maintenance

### Regular Tasks

**Daily:**
- Monitor rate limit logs for patterns
- Check Redis memory usage

**Weekly:**
- Review and adjust rate limits based on usage
- Check for repeated violators

**Monthly:**
- Audit bypass rules
- Update progressive blocking thresholds if needed
- Review admin alerts

### Emergency Procedures

**Disable Rate Limiting (Emergency Only):**

```javascript
// Temporarily disable all layers
RATE_LIMIT_CONFIG.ipLayer.enabled = false;
RATE_LIMIT_CONFIG.apiKeyLayer.enabled = false;
RATE_LIMIT_CONFIG.modelLayer.enabled = false;

// Or use bypass for all IPs
RATE_LIMIT_CONFIG.bypass.ips.push('0.0.0.0/0');
```

**Clear All Rate Limits:**

```bash
# Clear all rate limit data
redis-cli --scan --pattern 'ratelimit:*' | xargs redis-cli del
```

**Reset Specific User:**

```javascript
const limiter = getRateLimiter();
await limiter.resetLimits('192.168.1.100');  // IP or API key
```

## Support

For issues or questions:

1. Check logs: `tail -f logs/rate-limiter.log`
2. Run tests: `node services/auth/test-rate-limiting.js`
3. Check Redis: `redis-cli info`
4. Review configuration: `services/auth/rate-limit-config.js`

## License

This rate limiting system is part of the OpenClaw project.

---

**Last Updated**: 2026-02-12  
**Version**: 1.0.0
