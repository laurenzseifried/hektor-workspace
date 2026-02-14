/**
 * Output Filter — Detect and redact leaked secrets, PII, and prompt content
 */

// API key patterns
const API_KEY_PATTERNS = [
  { regex: /sk-ant-[a-zA-Z0-9_-]{20,}/g, name: 'anthropic_key' },
  { regex: /sk-[a-zA-Z0-9_-]{20,}/g, name: 'openai_key' },
  { regex: /AIza[0-9A-Za-z\-_]{35}/g, name: 'google_api_key' },
  { regex: /am_[a-zA-Z0-9]{50,}/g, name: 'agentmail_key' },
  { regex: /ghp_[a-zA-Z0-9_]{36}/g, name: 'github_token' },
  { regex: /gsk_[a-zA-Z0-9_]{50,}/g, name: 'groq_key' },
];

// PII patterns
const PII_PATTERNS = [
  { regex: /\b\d{3}-\d{2}-\d{4}\b/g, name: 'ssn', redact: true },
  { regex: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, name: 'credit_card', redact: true },
  { regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, name: 'email', redact: false }, // warn but don't redact
];

// System prompt leak indicators
const PROMPT_LEAK_INDICATORS = [
  'system prompt',
  'system message',
  'system instructions',
  'you are an ai assistant',
  'you are claude',
  'openclaw deployment',
  'internal instructions',
];

/**
 * Filter output for security issues
 */
export async function filterOutput(text, context = {}) {
  const result = {
    clean: text,
    suspicious: false,
    findings: [],
    redactions: {},
  };
  
  if (!text) return result;
  
  // 1. Check for API keys
  for (const { regex, name } of API_KEY_PATTERNS) {
    const matches = text.match(regex);
    if (matches) {
      result.suspicious = true;
      result.findings.push({
        type: 'api_key_leak',
        pattern: name,
        count: matches.length,
      });
      
      // Redact all API keys
      let redactCount = 0;
      result.clean = result.clean.replace(regex, () => {
        redactCount++;
        return `[REDACTED_API_KEY_${name.toUpperCase()}_${redactCount}]`;
      });
      
      result.redactions[`api_key_${name}`] = matches.length;
    }
  }
  
  // 2. Check for PII
  for (const { regex, name, redact } of PII_PATTERNS) {
    const matches = text.match(regex);
    if (matches) {
      result.findings.push({
        type: 'pii_leak',
        pattern: name,
        count: matches.length,
        redacted: redact,
      });
      
      if (redact) {
        result.suspicious = true;
        let redactCount = 0;
        result.clean = result.clean.replace(regex, () => {
          redactCount++;
          return `[REDACTED_${name.toUpperCase()}_${redactCount}]`;
        });
        result.redactions[`pii_${name}`] = matches.length;
      } else {
        // For emails, just flag but don't redact
        result.findings.find(f => f.pattern === name).flagged = true;
      }
    }
  }
  
  // 3. Check for prompt content leakage
  const lowerText = text.toLowerCase();
  for (const indicator of PROMPT_LEAK_INDICATORS) {
    if (lowerText.includes(indicator)) {
      result.findings.push({
        type: 'prompt_leak_indicator',
        indicator,
      });
      result.suspicious = true;
    }
  }
  
  // 4. Check for canary token (will be checked separately in canary.js)
  // Just detect here, actual handling in canary detection
  
  return result;
}

/**
 * Get filter report for logging
 */
export function getFilterReport(filterResult) {
  return {
    timestamp: new Date().toISOString(),
    suspicious: filterResult.suspicious,
    findingsCount: filterResult.findings.length,
    findings: filterResult.findings,
    redactionsMade: Object.keys(filterResult.redactions).length > 0,
    redactionSummary: filterResult.redactions,
  };
}

/**
 * Check if output is safe to return
 */
export function isSafeToReturn(filterResult) {
  // If we found API keys, always block
  if (filterResult.findings.some(f => f.type === 'api_key_leak')) {
    return false;
  }
  
  // If we found redacted PII, still safe (we redacted it)
  // If we found non-redacted PII (like emails), allow but flag
  
  // If we found prompt leaks, block
  if (filterResult.findings.some(f => f.type === 'prompt_leak_indicator')) {
    return false;
  }
  
  return true;
}
