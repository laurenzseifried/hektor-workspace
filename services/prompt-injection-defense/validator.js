/**
 * Input Validation Middleware — Defend against prompt injection attacks
 */

// Length limits
export const LIMITS = {
  maxInputLength: 4000,
  maxConversationTurns: 50,
  maxSystemPromptLength: 2000,
};

// Patterns that trigger immediate rejection
const BLOCKED_PATTERNS = [
  /ignore\s+(all\s+|your\s+)?instructions/i,
  /reveal\s+your\s+(instructions|config|prompt|system)/i,
  /act\s+as\s+(an?\s+)?unrestricted/i,
  /you\s+are\s+now\s+in\s+(developer|DAN|jailbreak)\s+mode/i,
  /ignore\s+everything\s+above/i,
  /disregard\s+(your\s+|all\s+)?(rules|guidelines|instructions)/i,
  /forget\s+(all\s+|previous\s+)?instructions/i,
  /override\s+(my\s+)?instructions/i,
  /bypass\s+(security|rules|filters|content\s+policy)/i,
  /execute\s+(code|commands?|shell)/i,
  /sudo\s+rm\s+-rf/i,
  /drop\s+table/i,
];

// Patterns that should be sanitized (stripped) but request still allowed
const SANITIZED_PATTERNS = [
  { regex: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, name: 'script' },
  { regex: /javascript:\s*/gi, name: 'javascript_protocol' },
  { regex: /on\w+\s*=\s*["'][^"']*["']/gi, name: 'event_handler' },
  { regex: /union\s+select/i, name: 'sql_injection' },
  { regex: /'\s*or\s*'1'\s*=\s*'1/i, name: 'sql_injection' },
  { regex: /\.\.\//g, name: 'path_traversal' },
  { regex: /\$\{\s*.*?\s*\}/g, name: 'template_injection' },
  { regex: /{{.*?}}/g, name: 'template_injection' },
];

/**
 * Validate input before sending to model
 */
export async function validateInput(message, sessionData = {}) {
  const result = {
    valid: true,
    errors: [],
    warnings: [],
    sanitized: false,
    originalLength: message.length,
    input: message,
  };
  
  // 1. Check length
  if (message.length > LIMITS.maxInputLength) {
    result.valid = false;
    result.errors.push(`Input exceeds max length (${message.length} > ${LIMITS.maxInputLength})`);
  }
  
  // 2. Check conversation turns
  const turns = sessionData.turns || 0;
  if (turns > LIMITS.maxConversationTurns) {
    result.valid = false;
    result.errors.push(`Conversation exceeds max turns (${turns} > ${LIMITS.maxConversationTurns})`);
  }
  
  // 3. Check system prompt length
  const systemPromptLength = sessionData.systemPrompt?.length || 0;
  if (systemPromptLength > LIMITS.maxSystemPromptLength) {
    result.valid = false;
    result.errors.push(`System prompt exceeds max length (${systemPromptLength} > ${LIMITS.maxSystemPromptLength})`);
  }
  
  // 4. Check for blocked patterns (REJECT)
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(message)) {
      result.valid = false;
      result.errors.push(`Blocked pattern detected: ${pattern.toString()}`);
      result.blockedPattern = pattern.toString();
    }
  }
  
  // 5. Check for sanitizable patterns (ALLOW but CLEAN)
  let sanitized = message;
  for (const { regex, name } of SANITIZED_PATTERNS) {
    if (regex.test(message)) {
      result.warnings.push(`Sanitized pattern detected: ${name}`);
      sanitized = sanitized.replace(regex, '');
      result.sanitized = true;
    }
  }
  
  if (result.sanitized) {
    result.input = sanitized;
    result.sanitizedLength = sanitized.length;
  }
  
  return result;
}

/**
 * Validate system prompt
 */
export function validateSystemPrompt(systemPrompt) {
  const result = {
    valid: true,
    errors: [],
    length: systemPrompt.length,
  };
  
  if (systemPrompt.length > LIMITS.maxSystemPromptLength) {
    result.valid = false;
    result.errors.push(`System prompt exceeds max length (${systemPrompt.length} > ${LIMITS.maxSystemPromptLength})`);
  }
  
  // Check for suspicious patterns in system prompt itself
  if (systemPrompt.includes('CANARY_TOKEN_')) {
    result.errors.push('System prompt contains canary token placeholder (should be injected, not hardcoded)');
    result.valid = false;
  }
  
  return result;
}

/**
 * Get validation report for logging
 */
export function getValidationReport(input, validationResult) {
  return {
    timestamp: new Date().toISOString(),
    inputLength: validationResult.originalLength,
    sanitized: validationResult.sanitized,
    blockedPatterns: validationResult.blockedPattern ? [validationResult.blockedPattern] : [],
    warnings: validationResult.warnings,
    errors: validationResult.errors,
    valid: validationResult.valid,
    // Do NOT include actual input for privacy
  };
}
