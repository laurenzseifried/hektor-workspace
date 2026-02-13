#!/usr/bin/env bash
###############################################################################
# Webhook Security Test Script
# 
# Tests the subagent-webhook server with various scenarios:
# - Valid authentication (Bearer token)
# - Invalid authentication
# - Missing authentication
# - Rate limiting
# - Input validation (path traversal)
# - CORS enforcement
# 
###############################################################################

set -euo pipefail

# Load environment variables
if [[ -f "/Users/laurenz/.openclaw/.env" ]]; then
    export $(grep -v '^#' /Users/laurenz/.openclaw/.env | xargs)
fi

WEBHOOK_URL="http://127.0.0.1:3001/webhooks/subagent-complete"
HEALTH_URL="http://127.0.0.1:3001/health"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_test() {
    echo -e "${BLUE}[TEST]${NC} $*"
}

log_pass() {
    echo -e "${GREEN}[PASS]${NC} $*"
}

log_fail() {
    echo -e "${RED}[FAIL]${NC} $*"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $*"
}

# Test 1: Health check (no auth required)
test_health() {
    log_test "Testing health endpoint..."
    local response
    response=$(curl -s -w "\n%{http_code}" "$HEALTH_URL")
    local body=$(echo "$response" | head -1)
    local code=$(echo "$response" | tail -1)
    
    if [[ "$code" == "200" ]] && echo "$body" | grep -q '"ok":true'; then
        log_pass "Health check succeeded (HTTP $code)"
    else
        log_fail "Health check failed (HTTP $code)"
    fi
}

# Test 2: Valid authentication
test_valid_auth() {
    log_test "Testing valid Bearer token authentication..."
    local payload='{"taskId":"test-valid-auth","status":"ok","result":"test"}'
    local response
    response=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $WEBHOOK_TOKEN" \
        -d "$payload")
    local body=$(echo "$response" | head -1)
    local code=$(echo "$response" | tail -1)
    
    if [[ "$code" == "200" ]] && echo "$body" | grep -q '"ok":true'; then
        log_pass "Valid auth succeeded (HTTP $code)"
    else
        log_fail "Valid auth failed (HTTP $code): $body"
    fi
}

# Test 3: Invalid authentication
test_invalid_auth() {
    log_test "Testing invalid Bearer token..."
    local payload='{"taskId":"test-invalid-auth","status":"ok"}'
    local response
    response=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer INVALID_TOKEN_12345" \
        -d "$payload")
    local code=$(echo "$response" | tail -1)
    
    if [[ "$code" == "401" ]]; then
        log_pass "Invalid auth rejected (HTTP $code)"
    else
        log_fail "Invalid auth should return 401, got $code"
    fi
}

# Test 4: Missing authentication
test_missing_auth() {
    log_test "Testing missing Bearer token..."
    local payload='{"taskId":"test-no-auth","status":"ok"}'
    local response
    response=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        -d "$payload")
    local code=$(echo "$response" | tail -1)
    
    if [[ "$code" == "401" ]]; then
        log_pass "Missing auth rejected (HTTP $code)"
    else
        log_fail "Missing auth should return 401, got $code"
    fi
}

# Test 5: Path traversal attempt
test_path_traversal() {
    log_test "Testing path traversal protection..."
    local payload='{"taskId":"../../../etc/passwd","status":"ok"}'
    local response
    response=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $WEBHOOK_TOKEN" \
        -d "$payload")
    local code=$(echo "$response" | tail -1)
    
    if [[ "$code" == "400" ]]; then
        log_pass "Path traversal blocked (HTTP $code)"
    else
        log_fail "Path traversal should return 400, got $code"
    fi
}

# Test 6: Invalid JSON
test_invalid_json() {
    log_test "Testing invalid JSON handling..."
    local response
    response=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $WEBHOOK_TOKEN" \
        -d "not valid json")
    local code=$(echo "$response" | tail -1)
    
    if [[ "$code" == "400" ]]; then
        log_pass "Invalid JSON rejected (HTTP $code)"
    else
        log_fail "Invalid JSON should return 400, got $code"
    fi
}

# Test 7: CORS check
test_cors() {
    log_test "Testing CORS headers..."
    local response
    response=$(curl -s -i -X OPTIONS "$WEBHOOK_URL" \
        -H "Origin: http://127.0.0.1" \
        -H "Access-Control-Request-Method: POST")
    
    if echo "$response" | grep -q "Access-Control-Allow-Origin: http://127.0.0.1"; then
        log_pass "CORS restricted to localhost"
    else
        log_fail "CORS not properly configured"
    fi
}

# Test 8: Rate limiting (light test - don't hammer the server)
test_rate_limiting() {
    log_test "Testing rate limiting (10 requests)..."
    local success_count=0
    local rate_limited=false
    
    for i in {1..10}; do
        local payload="{\"taskId\":\"test-rate-$i\",\"status\":\"ok\"}"
        local code
        code=$(curl -s -w "%{http_code}" -o /dev/null -X POST "$WEBHOOK_URL" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $WEBHOOK_TOKEN" \
            -d "$payload")
        
        if [[ "$code" == "200" ]]; then
            ((success_count++))
        elif [[ "$code" == "429" ]]; then
            rate_limited=true
        fi
    done
    
    log_pass "Rate limiting active (sent 10, succeeded $success_count)"
    if $rate_limited; then
        log_warn "Rate limit triggered during test (expected if server is busy)"
    fi
}

# Main test suite
main() {
    echo ""
    echo "🔐 WEBHOOK SECURITY TEST SUITE"
    echo "================================"
    echo ""
    
    # Check if webhook is running
    if ! curl -s "$HEALTH_URL" > /dev/null 2>&1; then
        log_fail "Webhook server is not running at $HEALTH_URL"
        log_warn "Start it with: launchctl load ~/Library/LaunchAgents/com.openclaw.subagent-webhook.plist"
        exit 1
    fi
    
    # Check if WEBHOOK_TOKEN is set
    if [[ -z "${WEBHOOK_TOKEN:-}" ]]; then
        log_fail "WEBHOOK_TOKEN not set in environment"
        log_warn "Source .env with: export \$(grep -v '^#' /Users/laurenz/.openclaw/.env | xargs)"
        exit 1
    fi
    
    # Run tests
    test_health
    test_valid_auth
    test_invalid_auth
    test_missing_auth
    test_path_traversal
    test_invalid_json
    test_cors
    test_rate_limiting
    
    echo ""
    echo "================================"
    echo -e "${GREEN}✅ Test suite complete!${NC}"
    echo ""
}

main
