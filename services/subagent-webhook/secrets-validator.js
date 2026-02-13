#!/usr/bin/env node
/**
 * Secrets Validator
 * 
 * Validates that all required environment variables are:
 * 1. Present and set to non-empty values
 * 2. Not set to placeholder/example values
 * 3. Match expected format patterns
 * 
 * Runs on startup and refuses to start if validation fails.
 */

import { fileURLToPath } from 'node:url';

// Required environment variables and their validation patterns
const REQUIRED_SECRETS = {
  WEBHOOK_TOKEN: {
    description: 'Webhook Bearer token for authentication',
    pattern: /^[a-zA-Z0-9_-]{32,}$/, // at least 32 chars, alphanumeric + dash/underscore
    placeholder: ['your_webhook_bearer_token_here', 'webhook_token', 'token']
  },
  HEKTOR_BOT_TOKEN: {
    description: 'Telegram Hektor bot token',
    pattern: /^\d{10}:[\w-]{35,}$/, // Telegram bot token format
    placeholder: ['your_hektor_telegram_bot_token_here', 'hektor_token']
  },
  SCOUT_BOT_TOKEN: {
    description: 'Telegram Scout bot token',
    pattern: /^\d{10}:[\w-]{35,}$/, // Telegram bot token format
    placeholder: ['your_scout_telegram_bot_token_here', 'scout_token']
  },
  OPENCLAW_GATEWAY_TOKEN: {
    description: 'OpenClaw gateway authentication token',
    pattern: /^[a-f0-9]{48,}$/, // hex string, at least 48 chars
    placeholder: ['your_gateway_token_here', 'gateway_token']
  }
};

// Optional but should be validated if present
const OPTIONAL_SECRETS = {
  BRAVE_API_KEY: {
    description: 'Brave Search API key',
    pattern: /^BSA[a-zA-Z0-9_]{20,}$/,
    placeholder: ['BSA_YOUR_BRAVE_API_KEY_HERE', 'bsa_key']
  },
  GROQ_API_KEY: {
    description: 'Groq Whisper API key',
    pattern: /^gsk_[a-zA-Z0-9]{40,}$/,
    placeholder: ['gsk_YOUR_GROQ_API_KEY_HERE', 'gsk_key']
  },
  GITHUB_TOKEN: {
    description: 'GitHub personal access token',
    pattern: /^ghp_[a-zA-Z0-9]{36,}$/,
    placeholder: ['ghp_YOUR_GITHUB_TOKEN_HERE', 'ghp_token']
  },
  GOOGLE_API_KEY: {
    description: 'Google APIs key',
    pattern: /^AIza[0-9A-Za-z_-]{35}$/,
    placeholder: ['AIzaSy_YOUR_GOOGLE_API_KEY_HERE', 'aiza_key']
  }
};

/**
 * Validate a single secret
 * @param {string} key - Environment variable name
 * @param {string} value - Environment variable value
 * @param {object} config - Validation config with pattern and placeholders
 * @returns {object} - {valid: boolean, error: string|null}
 */
function validateSecret(key, value, config) {
  // Check if empty
  if (!value || value.trim() === '') {
    return { valid: false, error: `${key} is empty or not set` };
  }

  // Check for placeholder values
  if (config.placeholder && config.placeholder.includes(value)) {
    return { valid: false, error: `${key} is set to placeholder value: "${value}"` };
  }

  // Check format pattern
  if (config.pattern && !config.pattern.test(value)) {
    return { valid: false, error: `${key} does not match expected format. Expected pattern: ${config.pattern}` };
  }

  return { valid: true, error: null };
}

/**
 * Main validation function
 * @returns {object} - {passed: boolean, errors: array, warnings: array}
 */
function validateSecrets() {
  const errors = [];
  const warnings = [];

  console.log('\n🔐 Validating secrets configuration...\n');

  // Check required secrets
  for (const [key, config] of Object.entries(REQUIRED_SECRETS)) {
    const value = process.env[key];
    const result = validateSecret(key, value, config);

    if (!result.valid) {
      errors.push(`❌ [REQUIRED] ${result.error}`);
    } else {
      console.log(`✅ ${key}: Valid (${config.description})`);
    }
  }

  // Check optional secrets (if present)
  for (const [key, config] of Object.entries(OPTIONAL_SECRETS)) {
    const value = process.env[key];
    
    if (value) {
      const result = validateSecret(key, value, config);
      if (!result.valid) {
        warnings.push(`⚠️  [OPTIONAL] ${result.error}`);
      } else {
        console.log(`✅ ${key}: Valid (${config.description})`);
      }
    }
  }

  // Report results
  console.log('\n' + '='.repeat(60));
  
  if (errors.length > 0) {
    console.error('\n🚨 VALIDATION FAILED\n');
    errors.forEach(err => console.error(err));
    console.error('\n⚠️  Cannot start application with missing or invalid secrets.');
    console.error('Please check your .env file and ensure all required secrets are set.\n');
    return { passed: false, errors, warnings };
  }

  if (warnings.length > 0) {
    console.warn('\n⚠️  WARNINGS (non-blocking):\n');
    warnings.forEach(w => console.warn(w));
  }

  console.log('\n✅ All required secrets validated successfully!\n');
  console.log('='.repeat(60) + '\n');

  return { passed: true, errors: [], warnings };
}

/**
 * Export for use in other modules
 */
export {
  validateSecrets,
  REQUIRED_SECRETS,
  OPTIONAL_SECRETS
};

// Run validation if executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const result = validateSecrets();
  process.exit(result.passed ? 0 : 1);
}
