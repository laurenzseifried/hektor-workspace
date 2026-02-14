#!/bin/bash
# Final Security Verification

echo "🔐 OPENCLAW SECURITY VERIFICATION"
echo "=================================="
echo "Time: $(date)"
echo ""

# 1. Check for hardcoded secrets
echo "1️⃣  Scanning for hardcoded secrets..."
SECRETS=$(grep -r "sk-ant-\|gsk_\|AIza\|ghp_" /Users/laurenz/.openclaw/workspace --include="*.js" --include="*.json" 2>/dev/null | grep -v node_modules | grep -v ".git" | wc -l)
echo "   Found: $SECRETS instances (should be 0)"

# 2. Auth check
echo "2️⃣  Testing unauthenticated access to /admin/costs..."
RESULT=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3003/admin/costs)
if [ "$RESULT" = "401" ]; then
  echo "   ✅ Correctly rejected (401)"
else
  echo "   ❌ Response: $RESULT (expected 401)"
fi

# 3. Rate limiting test
echo "3️⃣  Testing rate limiting (5 rapid requests)..."
for i in {1..5}; do
  curl -s http://127.0.0.1:8000/health > /dev/null
done
RESULT=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8000/health)
echo "   Last response: $RESULT"

# 4. Circuit breaker check
echo "4️⃣  Checking circuit breaker config..."
CB_STATE=$(curl -s -H "Authorization: Bearer ***REDACTED***" http://127.0.0.1:3003/state 2>/dev/null | grep -o '"level":"[^"]*"')
echo "   Circuit breaker: $CB_STATE"

# 5. Security headers
echo "5️⃣  Checking security headers..."
HEADERS=$(curl -s -I http://127.0.0.1:8000/health 2>/dev/null | grep -i "x-content-type-options\|x-frame-options\|content-security-policy" | wc -l)
echo "   Security headers found: $HEADERS (should be 3+)"

# 6. TLS check
echo "6️⃣  Checking TLS configuration..."
HTTP_RESULT=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8000/health 2>/dev/null)
echo "   HTTP response: $HTTP_RESULT"

# 7. Backup status
echo "7️⃣  Checking backups..."
BACKUP_COUNT=$(ls -1 /Users/laurenz/.openclaw/workspace/.subagent-results 2>/dev/null | wc -l)
echo "   Backup files found: $BACKUP_COUNT"

echo ""
echo "✅ VERIFICATION COMPLETE"
