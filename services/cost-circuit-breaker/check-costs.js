#!/usr/bin/env node

/**
 * Quick CLI to check cost circuit breaker status
 */

import http from 'http';

const PORT = process.env.CIRCUIT_BREAKER_PORT || 3002;
const TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN;

async function checkCosts() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: PORT,
      path: '/admin/costs',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
      },
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  try {
    const data = await checkCosts();
    
    // Visual indicator
    const indicator = {
      'OK': '🟢',
      'WARNING': '🟡',
      'SOFT': '🟠',
      'HARD': '🔴',
      'EMERGENCY': '🚨',
    }[data.level] || '❓';
    
    console.log(`\n${indicator} COST CIRCUIT BREAKER STATUS\n`);
    console.log(`Level:        ${data.level}`);
    console.log(`Current:      $${data.total.toFixed(2)}`);
    console.log(`Next Alert:   $${data.threshold.toFixed(2)}`);
    console.log(`\nThresholds:`);
    console.log(`  WARNING:    $${data.thresholds.WARNING}`);
    console.log(`  SOFT:       $${data.thresholds.SOFT}`);
    console.log(`  HARD:       $${data.thresholds.HARD}`);
    console.log(`  EMERGENCY:  $${data.thresholds.EMERGENCY}`);
    
    console.log(`\nBy Model:`);
    Object.entries(data.breakdown.byModel)
      .sort((a, b) => b[1] - a[1])
      .forEach(([model, cost]) => {
        console.log(`  ${model.padEnd(35)} $${cost.toFixed(2)}`);
      });
    
    console.log(`\nBy User:`);
    Object.entries(data.breakdown.byUser)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([user, cost]) => {
        console.log(`  ${user.padEnd(20)} $${cost.toFixed(2)}`);
      });
    
    console.log(`\nRecent Requests: ${data.recentRequests.length}`);
    console.log();
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();
