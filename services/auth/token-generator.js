#!/usr/bin/env node
/**
 * JWT Token Generator
 * 
 * Creates RS256-signed JWT tokens for access and refresh tokens.
 * 
 * - Access Token: 15-minute expiry
 * - Refresh Token: 7-day expiry, one-time use rotation
 */

import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

// --- Config ---
const OPENCLAW_JWT_PRIVATE_KEY = process.env.OPENCLAW_JWT_PRIVATE_KEY;
const OPENCLAW_JWT_ISSUER = process.env.OPENCLAW_JWT_ISSUER || 'openclaw-deployment';
const OPENCLAW_ACCESS_TOKEN_EXPIRY = parseInt(process.env.OPENCLAW_ACCESS_TOKEN_EXPIRY || '900', 10); // 15 minutes
const OPENCLAW_REFRESH_TOKEN_EXPIRY = parseInt(process.env.OPENCLAW_REFRESH_TOKEN_EXPIRY || '604800', 10); // 7 days

/**
 * Generate a unique token ID (jti)
 * Used to track and invalidate tokens
 */
function generateTokenId() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Generate Access Token (15 min expiry)
 * 
 * @param {object} user - User object
 * @param {string} user.id - User ID
 * @param {string} user.role - User role (admin, operator, viewer)
 * @param {string[]} user.permissions - User permissions
 * 
 * @returns {string} - Signed JWT access token
 */
function generateAccessToken(user) {
  if (!OPENCLAW_JWT_PRIVATE_KEY) {
    throw new Error('OPENCLAW_JWT_PRIVATE_KEY environment variable not set');
  }

  const payload = {
    sub: user.id,
    role: user.role,
    permissions: user.permissions || [],
    jti: generateTokenId(),
  };

  const token = jwt.sign(payload, OPENCLAW_JWT_PRIVATE_KEY, {
    algorithm: 'RS256',
    issuer: OPENCLAW_JWT_ISSUER,
    audience: 'openclaw-api',
    expiresIn: OPENCLAW_ACCESS_TOKEN_EXPIRY,
  });

  return token;
}

/**
 * Generate Refresh Token (7 day expiry, one-time use)
 * 
 * @param {object} user - User object
 * @param {string} user.id - User ID
 * @param {number} rotationCount - How many times this token has been rotated (default: 0)
 * 
 * @returns {string} - Signed JWT refresh token
 */
function generateRefreshToken(user, rotationCount = 0) {
  if (!OPENCLAW_JWT_PRIVATE_KEY) {
    throw new Error('OPENCLAW_JWT_PRIVATE_KEY environment variable not set');
  }

  const payload = {
    sub: user.id,
    rotation: rotationCount,
    jti: generateTokenId(),
  };

  const token = jwt.sign(payload, OPENCLAW_JWT_PRIVATE_KEY, {
    algorithm: 'RS256',
    issuer: OPENCLAW_JWT_ISSUER,
    audience: 'openclaw-refresh',
    expiresIn: OPENCLAW_REFRESH_TOKEN_EXPIRY,
  });

  return token;
}

/**
 * Generate both access and refresh tokens
 * Used for login and token refresh endpoints
 * 
 * @param {object} user - User object
 * @param {string} user.id - User ID
 * @param {string} user.role - User role
 * @param {string[]} user.permissions - User permissions
 * @param {number} rotationCount - Rotation count for refresh token (default: 0)
 * 
 * @returns {object} - { accessToken, refreshToken, expiresIn }
 */
function generateTokenPair(user, rotationCount = 0) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, rotationCount);

  return {
    accessToken,
    refreshToken,
    expiresIn: OPENCLAW_ACCESS_TOKEN_EXPIRY,
  };
}

/**
 * Export for use in other modules
 */
export {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  generateTokenId,
};

// Example usage
if (process.argv[1] === new URL(import.meta.url).pathname) {
  console.log('\n🔑 JWT Token Generator\n');
  
  const user = {
    id: 'user-001',
    role: 'admin',
    permissions: ['tasks:read', 'tasks:write', 'users:read'],
  };

  console.log('Generating tokens for user:', user);
  console.log();

  try {
    const tokens = generateTokenPair(user);
    
    console.log('✅ Token pair generated:\n');
    console.log('Access Token (15 min expiry):');
    console.log(`  ${tokens.accessToken}\n`);
    
    console.log('Refresh Token (7 day expiry):');
    console.log(`  ${tokens.refreshToken}\n`);
    
    console.log(`Expires in: ${tokens.expiresIn} seconds\n`);
  } catch (err) {
    console.error('❌ Error generating tokens:');
    console.error(err.message);
    console.error('\nMake sure OPENCLAW_JWT_PRIVATE_KEY is set in .env');
  }
}
