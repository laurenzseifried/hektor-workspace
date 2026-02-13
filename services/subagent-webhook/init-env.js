/**
 * Environment Initialization
 * 
 * Loads environment variables and JWT keys BEFORE other modules import them.
 * This must be imported first in server.js.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- Load .env file ---
const envPath = path.resolve(__dirname, '../../../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const equalsIndex = line.indexOf('=');
      if (equalsIndex > 0) {
        const key = line.substring(0, equalsIndex).trim();
        let value = line.substring(equalsIndex + 1).trim();
        
        // Skip JWT keys (load from PEM files)
        if (key.includes('JWT_PRIVATE_KEY') || key.includes('JWT_PUBLIC_KEY')) {
          return;
        }
        
        // Remove quotes
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        // Replace escape sequences
        value = value.replace(/\\n/g, '\n')
                     .replace(/\\r/g, '\r')
                     .replace(/\\t/g, '\t')
                     .replace(/\\\\/g, '\\');
        
        if (key && !process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  });
}

// --- Load JWT keys from PEM files ---
const privateKeyPath = path.resolve(__dirname, '../auth/.keys/private.pem');
const publicKeyPath = path.resolve(__dirname, '../auth/.keys/public.pem');

if (fs.existsSync(privateKeyPath)) {
  process.env.OPENCLAW_JWT_PRIVATE_KEY = fs.readFileSync(privateKeyPath, 'utf-8');
  console.log('[init] ✅ Loaded JWT private key from PEM file');
}

if (fs.existsSync(publicKeyPath)) {
  process.env.OPENCLAW_JWT_PUBLIC_KEY = fs.readFileSync(publicKeyPath, 'utf-8');
  console.log('[init] ✅ Loaded JWT public key from PEM file');
}

console.log('[init] Environment initialization complete');
