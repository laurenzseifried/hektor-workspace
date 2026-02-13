/**
 * Cookie Middleware
 * 
 * Secure cookie handling with:
 * - httpOnly: true (prevents JavaScript access)
 * - secure: true (HTTPS only)
 * - sameSite: 'strict' (prevents CSRF)
 * - path: '/'
 */

/**
 * Set secure session cookie
 * 
 * @param {object} res - HTTP response object
 * @param {string} sessionId - Session ID
 * @param {object} options - Cookie options
 * @param {boolean} options.secure - Use secure flag (default: true)
 * @param {string} options.domain - Cookie domain (default: undefined)
 * @param {number} options.maxAge - Max age in milliseconds (default: undefined for session cookie)
 */
export function setSessionCookie(res, sessionId, options = {}) {
  const {
    secure = true,
    domain = undefined,
    maxAge = 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  } = options;

  // Convert maxAge from milliseconds to seconds for Set-Cookie header
  const maxAgeSeconds = Math.floor(maxAge / 1000);

  // Construct cookie value with all security flags
  let cookieValue = `openclaw_session=${sessionId}`;
  cookieValue += `; Path=/`;
  cookieValue += `; Max-Age=${maxAgeSeconds}`;
  cookieValue += `; HttpOnly`; // Prevent JavaScript access
  cookieValue += `; SameSite=Strict`; // Prevent CSRF
  
  if (secure) {
    cookieValue += `; Secure`; // HTTPS only
  }
  
  if (domain) {
    cookieValue += `; Domain=${domain}`;
  }

  res.setHeader('Set-Cookie', cookieValue);
  console.log(`[cookie] Session cookie set (secure=${secure}, maxAge=${maxAgeSeconds}s)`);
}

/**
 * Clear session cookie
 */
export function clearSessionCookie(res) {
  const cookieValue = `openclaw_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict; Secure`;
  res.setHeader('Set-Cookie', cookieValue);
  console.log('[cookie] Session cookie cleared');
}

/**
 * Extract session ID from cookie header
 * 
 * @param {string} cookieHeader - Cookie header value
 * @returns {string|null} - Session ID or null
 */
export function extractSessionIdFromCookie(cookieHeader) {
  if (!cookieHeader) return null;

  // Parse cookies
  const cookies = cookieHeader.split(';').map(c => c.trim());
  
  for (const cookie of cookies) {
    if (cookie.startsWith('openclaw_session=')) {
      const sessionId = cookie.substring('openclaw_session='.length);
      return sessionId || null;
    }
  }

  return null;
}

/**
 * Validate cookie security
 * Check if request is using secure connection (important for Secure flag)
 */
export function isCookieSecure(req) {
  // In production, check req.secure or X-Forwarded-Proto header
  // For localhost testing, allow insecure
  if (req.headers['x-forwarded-proto'] === 'https') {
    return true;
  }
  if (req.connection.encrypted) {
    return true;
  }
  // Localhost is allowed for testing
  if (req.headers.host?.startsWith('127.0.0.1') || req.headers.host?.startsWith('localhost')) {
    return true;
  }
  return false;
}

/**
 * Get client IP address
 * Works with proxies (checks X-Forwarded-For)
 */
export function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.socket.remoteAddress ||
    'unknown'
  );
}

/**
 * Get user agent
 */
export function getUserAgent(req) {
  return req.headers['user-agent'] || 'unknown';
}

export default {
  setSessionCookie,
  clearSessionCookie,
  extractSessionIdFromCookie,
  isCookieSecure,
  getClientIp,
  getUserAgent,
};
