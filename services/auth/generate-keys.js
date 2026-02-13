#!/usr/bin/env node
/**
 * RSA Key Generation for JWT Signing
 * 
 * Generates a 2048-bit RSA key pair for JWT token signing (RS256).
 * 
 * Usage:
 *   node generate-keys.js                    # Generate new keys
 *   node generate-keys.js --output ./keys    # Custom output directory
 *   node generate-keys.js --force            # Overwrite existing keys
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- Config ---
const KEYS_DIR = process.env.KEYS_DIR || path.join(__dirname, '.keys');
const PRIVATE_KEY_FILE = path.join(KEYS_DIR, 'private.pem');
const PUBLIC_KEY_FILE = path.join(KEYS_DIR, 'public.pem');
const KEY_SIZE = 2048;
const FORCE = process.argv.includes('--force');
const CUSTOM_OUTPUT = process.argv.includes('--output') 
  ? process.argv[process.argv.indexOf('--output') + 1] 
  : null;

if (CUSTOM_OUTPUT) {
  KEYS_DIR = CUSTOM_OUTPUT;
}

/**
 * Generate RSA key pair using OpenSSL
 */
function generateKeyPair() {
  console.log('\n🔑 Generating RSA key pair...\n');
  console.log(`   Key Size: ${KEY_SIZE} bits`);
  console.log(`   Algorithm: RSA (for JWT RS256 signing)`);
  console.log(`   Output Directory: ${KEYS_DIR}\n`);

  // Check if keys already exist
  if (fs.existsSync(PRIVATE_KEY_FILE) && fs.existsSync(PUBLIC_KEY_FILE) && !FORCE) {
    console.log('⚠️  Keys already exist at:');
    console.log(`   Private: ${PRIVATE_KEY_FILE}`);
    console.log(`   Public:  ${PUBLIC_KEY_FILE}\n`);
    console.log('Use --force to regenerate.\n');
    return false;
  }

  // Ensure output directory exists
  fs.mkdirSync(KEYS_DIR, { recursive: true });

  try {
    // Generate private key
    console.log(`[1/3] Generating private key...`);
    execSync(
      `openssl genrsa -out ${PRIVATE_KEY_FILE} ${KEY_SIZE} 2>/dev/null`,
      { stdio: 'inherit' }
    );
    fs.chmodSync(PRIVATE_KEY_FILE, 0o600); // Owner-only access
    console.log(`✅  Private key saved: ${PRIVATE_KEY_FILE}\n`);

    // Extract public key from private key
    console.log(`[2/3] Extracting public key...`);
    execSync(
      `openssl rsa -in ${PRIVATE_KEY_FILE} -pubout -out ${PUBLIC_KEY_FILE} 2>/dev/null`,
      { stdio: 'inherit' }
    );
    fs.chmodSync(PUBLIC_KEY_FILE, 0o644); // Readable by all
    console.log(`✅  Public key saved: ${PUBLIC_KEY_FILE}\n`);

    // Display keys
    console.log(`[3/3] Key Details:\n`);
    const privateKey = fs.readFileSync(PRIVATE_KEY_FILE, 'utf8');
    const publicKey = fs.readFileSync(PUBLIC_KEY_FILE, 'utf8');

    console.log('Private Key (keep secret):');
    console.log('```');
    console.log(privateKey.split('\n').slice(0, 3).join('\n'));
    console.log('...');
    console.log(privateKey.split('\n').slice(-3).join('\n'));
    console.log('```\n');

    console.log('Public Key (can be shared):');
    console.log('```');
    console.log(publicKey.split('\n').slice(0, 3).join('\n'));
    console.log('...');
    console.log(publicKey.split('\n').slice(-3).join('\n'));
    console.log('```\n');

    // Output environment variables
    console.log('📝 Environment Variables (add to .env):\n');
    console.log('```bash');
    console.log(`OPENCLAW_JWT_PRIVATE_KEY="${privateKey.replace(/\n/g, '\\n')}"`);
    console.log(`OPENCLAW_JWT_PUBLIC_KEY="${publicKey.replace(/\n/g, '\\n')}"`);
    console.log('```\n');

    console.log('✅ RSA key pair generated successfully!\n');
    return true;
  } catch (err) {
    console.error('\n❌ Error generating keys:');
    console.error(err.message);
    console.error('\nMake sure OpenSSL is installed:\n');
    console.error('   macOS: brew install openssl');
    console.error('   Linux: sudo apt-get install openssl');
    console.error('   Windows: Download from https://slproweb.com/products/Win32OpenSSL.html\n');
    process.exit(1);
  }
}

/**
 * Validate existing keys
 */
function validateKeys() {
  if (!fs.existsSync(PRIVATE_KEY_FILE)) {
    console.error(`❌ Private key not found: ${PRIVATE_KEY_FILE}`);
    return false;
  }

  if (!fs.existsSync(PUBLIC_KEY_FILE)) {
    console.error(`❌ Public key not found: ${PUBLIC_KEY_FILE}`);
    return false;
  }

  try {
    const privateKey = fs.readFileSync(PRIVATE_KEY_FILE, 'utf8');
    const publicKey = fs.readFileSync(PUBLIC_KEY_FILE, 'utf8');

    if (!privateKey.includes('BEGIN RSA PRIVATE KEY')) {
      console.error('❌ Invalid private key format');
      return false;
    }

    if (!publicKey.includes('BEGIN PUBLIC KEY')) {
      console.error('❌ Invalid public key format');
      return false;
    }

    console.log('✅ Existing keys are valid\n');
    return true;
  } catch (err) {
    console.error(`❌ Error reading keys: ${err.message}`);
    return false;
  }
}

/**
 * Main
 */
function main() {
  console.log('\n🦞 OpenClaw JWT RSA Key Generator\n');
  console.log('=' .repeat(60));

  const args = process.argv.slice(2);

  if (args.includes('--validate')) {
    validateKeys();
  } else if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node generate-keys.js [options]

Options:
  --output <dir>     Custom output directory (default: ${KEYS_DIR})
  --force            Overwrite existing keys
  --validate         Check if existing keys are valid
  --help             Show this help message

Examples:
  node generate-keys.js
  node generate-keys.js --output ./auth-keys
  node generate-keys.js --force --validate

Generated Files:
  - private.pem (RSA private key, owner-only: 600)
  - public.pem (RSA public key, readable: 644)

Environment Variables (add to .env):
  OPENCLAW_JWT_PRIVATE_KEY="<content of private.pem>"
  OPENCLAW_JWT_PUBLIC_KEY="<content of public.pem>"
    `);
  } else {
    generateKeyPair();
  }

  console.log('=' .repeat(60) + '\n');
}

main();
