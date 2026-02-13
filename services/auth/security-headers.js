#!/usr/bin/env node
/**
 * Security Headers Middleware
 * 
 * Adds security headers to all HTTP responses:
 * - X-Content-Type-Options: nosniff (prevent MIME-sniffing)
 * - X-Frame-Options: DENY (prevent clickjacking)
 * - X-XSS-Protection: 0 (disable XSS filter, rely on CSP)
 * - Content-Security-Policy: restrict resources
 * - Referrer-Policy: privacy-aware referrer handling
 * - Permissions-Policy: disable dangerous APIs
 * - Cache-Control: prevent caching of sensitive data
 * - Strict-Transport-Security: HTTPS enforcement (when enabled)
 * 
 * Usage:
 * ```javascript
 * import { addSecurityHeaders } from './security-headers.js';
 * 
 * function handleRequest(req, res) {
 *   addSecurityHeaders(res, { csp: true, hsts: true });
 *   // ... handler code
 * }
 * ```
 */

/**
 * Add security headers to response
 * 
 * @param {http.ServerResponse} res
 * @param {object} opts - Configuration options
 * @param {boolean} opts.csp - Enable CSP header (default: true)
 * @param {boolean} opts.hsts - Enable HSTS header (default: false, set to true for HTTPS)
 * @param {string} opts.cspPolicy - Custom CSP policy
 * @param {string} opts.domain - Domain for HSTS/CSP
 */
function addSecurityHeaders(res, opts = {}) {
  const {
    csp = true,
    hsts = false,
    cspPolicy = null,
    domain = 'localhost',
  } = opts;

  // X-Content-Type-Options: nosniff
  // Prevents browser from MIME-sniffing and forces Content-Type interpretation
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // X-Frame-Options: DENY
  // Prevents clickjacking by disallowing embedding in frames
  res.setHeader('X-Frame-Options', 'DENY');

  // X-XSS-Protection: 0
  // Disable older XSS filter (rely on CSP instead)
  // Setting to 0 tells modern browsers to disable it
  res.setHeader('X-XSS-Protection', '0');

  // Content-Security-Policy
  // Restrict where resources can be loaded from
  if (csp) {
    const cspValue =
      cspPolicy ||
      `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`;
    res.setHeader('Content-Security-Policy', cspValue);
  }

  // Referrer-Policy: strict-origin-when-cross-origin
  // Send referrer only when upgrading from HTTP to HTTPS, or same-origin
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy (formerly Feature-Policy)
  // Disable dangerous APIs
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  );

  // Cache-Control: no-store, no-cache, must-revalidate
  // Prevent sensitive data from being cached
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');

  // Pragma (for HTTP/1.0 compatibility)
  res.setHeader('Pragma', 'no-cache');

  // Expires (for older clients)
  res.setHeader('Expires', '0');

  // Strict-Transport-Security (HTTPS only)
  // Forces HTTPS for future requests
  if (hsts) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Remove server identification (security through obscurity)
  // This should be done at server startup or in config
  // res.removeHeader('Server');
}

/**
 * Middleware wrapper for security headers
 * 
 * Usage in request handler:
 * ```javascript
 * function handleRequest(req, res) {
 *   securityHeadersMiddleware(res);
 *   // ... rest of handler
 * }
 * ```
 */
function securityHeadersMiddleware(res, opts = {}) {
  addSecurityHeaders(res, opts);
}

/**
 * Get security headers object (for inspection/testing)
 * 
 * @param {object} opts - Same options as addSecurityHeaders
 * @returns {object} - Headers key-value pairs
 */
function getSecurityHeaders(opts = {}) {
  const headers = {};
  const res = {
    setHeader(name, value) {
      headers[name] = value;
    },
  };

  addSecurityHeaders(res, opts);
  return headers;
}

/**
 * Validate security headers (for testing)
 * 
 * @param {object} headers - Response headers object
 * @returns {object} - { valid: boolean, missing: array, errors: array }
 */
function validateSecurityHeaders(headers) {
  const required = [
    'X-Content-Type-Options',
    'X-Frame-Options',
    'X-XSS-Protection',
    'Referrer-Policy',
    'Permissions-Policy',
    'Cache-Control',
  ];

  const missing = [];
  const errors = [];

  for (const header of required) {
    if (!headers[header]) {
      missing.push(header);
    }
  }

  // Validate header values
  if (headers['X-Content-Type-Options'] !== 'nosniff') {
    errors.push(`X-Content-Type-Options should be 'nosniff', got '${headers['X-Content-Type-Options']}'`);
  }
  if (headers['X-Frame-Options'] !== 'DENY') {
    errors.push(`X-Frame-Options should be 'DENY', got '${headers['X-Frame-Options']}'`);
  }
  if (headers['X-XSS-Protection'] !== '0') {
    errors.push(`X-XSS-Protection should be '0', got '${headers['X-XSS-Protection']}'`);
  }

  return {
    valid: missing.length === 0 && errors.length === 0,
    missing,
    errors,
  };
}

export {
  addSecurityHeaders,
  securityHeadersMiddleware,
  getSecurityHeaders,
  validateSecurityHeaders,
};
