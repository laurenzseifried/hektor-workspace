#!/usr/bin/env node
/**
 * Weekly Security Report
 */

import { queryLogs } from '../security-logger/logger.js';
import { getCosts } from '../cost-circuit-breaker/tracker.js';

async function generateReport() {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  
  // 1. Failed auth
  const failedAuth = await queryLogs({
    event: 'login_failed',
    since: oneWeekAgo,
    limit: 1000,
  });
  
  const ipCounts = {};
  for (const log of failedAuth) {
    const ip = log.metadata?.ip;
    if (ip) ipCounts[ip] = (ipCounts[ip] || 0) + 1;
  }
  
  const topIPs = Object.entries(ipCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([ip, count]) => `  • ${ip}: ${count} attempts`);
  
  // 2. Cost summary
  const costs = await getCosts();
  const costByModel = Object.entries(costs.byModel || {})
    .sort((a, b) => b[1] - a[1])
    .map(([model, cost]) => `  • ${model}: $${cost.toFixed(2)}`)
    .slice(0, 5);
  
  // 3. Rate limits
  const rateLimitHits = await queryLogs({
    event: 'rate_limit_exceeded',
    since: oneWeekAgo,
    limit: 1000,
  });
  
  // 4. Circuit breaker
  const cbEvents = await queryLogs({
    event: 'circuit_breaker_triggered',
    since: oneWeekAgo,
  });
  
  // Format report
  const report = `
╔════════════════════════════════════════╗
║   OpenClaw Weekly Security Report      ║
║   ${new Date().toLocaleDateString()}          ║
╚════════════════════════════════════════╝

📋 AUTHENTICATION
  Failed Logins: ${failedAuth.length}
  Top Attacking IPs:
${topIPs.join('\n')}

💰 COST SUMMARY
  Total: $${costs.global.toFixed(2)}
  By Model:
${costByModel.join('\n')}

🚨 RATE LIMITS
  Violations: ${rateLimitHits.length}

🔴 CIRCUIT BREAKER
  Events: ${cbEvents.length}
${cbEvents.length > 0 ? cbEvents.map(e => `  • ${e.metadata?.breaker_level}: $${e.metadata?.current_spend?.toFixed(2)}`).join('\n') : '  • None'}

✅ Status: ${failedAuth.length < 50 && rateLimitHits.length < 100 ? 'HEALTHY' : 'REVIEW NEEDED'}
`;
  
  return report;
}

generateReport().then(report => console.log(report));
