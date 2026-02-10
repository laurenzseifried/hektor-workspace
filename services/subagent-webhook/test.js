#!/usr/bin/env node
/** Quick smoke test — run while server is up */
import { reportComplete } from './client.js';

const taskId = `test-${Date.now()}`;
try {
  const res = await reportComplete({ taskId, status: 'ok', result: 'Smoke test passed', label: 'Test Task' });
  console.log('✅ Webhook test OK:', res);
} catch (err) {
  console.error('❌ Webhook test FAILED:', err.message);
  process.exit(1);
}
