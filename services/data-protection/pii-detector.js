/**
 * PII Detection — Comprehensive patterns
 */

export const PII_PATTERNS = {
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  credit_card: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone_us: /\b(\+1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
  ip_address: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
};

/**
 * Detect PII in text
 */
export function detectPII(text) {
  const findings = [];
  
  for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
    const matches = text.match(pattern);
    if (matches) {
      findings.push({
        type,
        count: matches.length,
        samples: matches.slice(0, 3),
      });
    }
  }
  
  return findings;
}

/**
 * Redact PII from text
 */
export function redactPII(text) {
  let redacted = text;
  
  redacted = redacted.replace(PII_PATTERNS.ssn, '[REDACTED_SSN]');
  redacted = redacted.replace(PII_PATTERNS.credit_card, '[REDACTED_CC]');
  redacted = redacted.replace(PII_PATTERNS.email, '[REDACTED_EMAIL]');
  redacted = redacted.replace(PII_PATTERNS.phone_us, '[REDACTED_PHONE]');
  
  return redacted;
}

/**
 * Check if text contains sensitive PII
 */
export function containsSensitivePII(text) {
  return PII_PATTERNS.ssn.test(text) || PII_PATTERNS.credit_card.test(text);
}
