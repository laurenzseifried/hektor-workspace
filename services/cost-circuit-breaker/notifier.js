/**
 * Notifier — Send alerts via Telegram and Email
 */

import https from 'https';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const TELEGRAM_TOPIC = process.env.CIRCUIT_BREAKER_TELEGRAM_TOPIC || '9'; // #alerts
const TELEGRAM_CHAT = process.env.CIRCUIT_BREAKER_TELEGRAM_CHAT || '-1003808534190'; // HQ Group
const EMAIL_TO = process.env.CIRCUIT_BREAKER_EMAIL || 'laurenz.seifried@gmail.com';
const AGENTMAIL_INBOX = process.env.AGENTMAIL_INBOX || 'hektor@agentmail.to';

/**
 * Format cost breakdown
 */
function formatBreakdown(costs) {
  const byModel = Object.entries(costs.byModel)
    .sort((a, b) => b[1] - a[1])
    .map(([model, cost]) => `  • ${model}: $${cost.toFixed(2)}`)
    .join('\n');
  
  const byUser = Object.entries(costs.byUser)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([user, cost]) => `  • ${user}: $${cost.toFixed(2)}`)
    .join('\n');
  
  return { byModel, byUser };
}

/**
 * Send Telegram alert
 */
async function sendTelegram(message) {
  return new Promise((resolve, reject) => {
    const botToken = process.env.HEKTOR_BOT_TOKEN;
    if (!botToken) {
      console.error('[notifier] ⚠️ HEKTOR_BOT_TOKEN not set, skipping Telegram alert');
      resolve(false);
      return;
    }
    
    const payload = JSON.stringify({
      chat_id: TELEGRAM_CHAT,
      message_thread_id: parseInt(TELEGRAM_TOPIC),
      text: message,
      parse_mode: 'Markdown',
    });
    
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${botToken}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('[notifier] ✅ Telegram alert sent');
          resolve(true);
        } else {
          console.error('[notifier] ❌ Telegram error:', data);
          resolve(false);
        }
      });
    });
    
    req.on('error', (err) => {
      console.error('[notifier] ❌ Telegram network error:', err.message);
      resolve(false);
    });
    
    req.write(payload);
    req.end();
  });
}

/**
 * Send email alert
 */
async function sendEmail(subject, body) {
  return new Promise((resolve) => {
    const scriptPath = path.resolve(__dirname, '../../skills/agentmail/scripts/send_email.py');
    
    const proc = spawn('python3', [
      scriptPath,
      '--inbox', AGENTMAIL_INBOX,
      '--to', EMAIL_TO,
      '--subject', subject,
      '--text', body,
    ], {
      env: process.env,
      cwd: path.resolve(__dirname, '../..'),
    });
    
    proc.on('close', (code) => {
      if (code === 0) {
        console.log('[notifier] ✅ Email alert sent');
        resolve(true);
      } else {
        console.error('[notifier] ❌ Email failed with code:', code);
        resolve(false);
      }
    });
    
    proc.on('error', (err) => {
      console.error('[notifier] ❌ Email spawn error:', err.message);
      resolve(false);
    });
  });
}

/**
 * Send alert for circuit breaker state
 */
export async function sendAlert(state) {
  const { level, total, threshold, costs } = state;
  const { byModel, byUser } = formatBreakdown(costs);
  
  // Emoji and urgency
  const emoji = {
    'WARNING': '⚠️',
    'SOFT': '🟠',
    'HARD': '🔴',
    'EMERGENCY': '🚨',
  }[level] || '⚠️';
  
  // Telegram message
  const telegramMsg = `${emoji} **COST CIRCUIT BREAKER: ${level}**

**Current Spend:** $${total.toFixed(2)} / $${threshold.toFixed(2)}

**By Model:**
${byModel}

**Top Users:**
${byUser}

**Action Taken:**
${getActionMessage(level)}`;
  
  // Email subject & body
  const emailSubject = `[OpenClaw] Cost Alert: ${level} ($${total.toFixed(2)})`;
  const emailBody = `COST CIRCUIT BREAKER ALERT

Level: ${level}
Current Spend: $${total.toFixed(2)}
Threshold: $${threshold.toFixed(2)}

BY MODEL:
${byModel}

TOP USERS:
${byUser}

ACTION TAKEN:
${getActionMessage(level)}

---
OpenClaw Cost Circuit Breaker
${new Date().toISOString()}`;
  
  // Send alerts
  await Promise.all([
    sendTelegram(telegramMsg),
    (level === 'HARD' || level === 'EMERGENCY') ? sendEmail(emailSubject, emailBody) : Promise.resolve(),
  ]);
}

/**
 * Get action message for level
 */
function getActionMessage(level) {
  switch (level) {
    case 'WARNING':
      return '✅ No restrictions. Monitoring costs.';
    case 'SOFT':
      return '🟠 Opus requests downgraded to Sonnet.';
    case 'HARD':
      return '🔴 Only Haiku requests allowed.';
    case 'EMERGENCY':
      return '🚨 ALL MODEL REQUESTS BLOCKED. Manual reset required.';
    default:
      return '';
  }
}
