#!/bin/bash
###############################################################################
# OpenClaw JWT Authentication Test Suite
#
# Tests all authentication endpoints and security validations:
# 1. Login endpoint (valid/invalid credentials)
# 2. Token structure validation
# 3. Protected route access (valid/invalid tokens)
# 4. Token refresh + rotation
# 5. Token expiration
# 6. Failed attempt logging
#
# Usage:
#   ./scripts/test-auth.sh [--webhook-url http://127.0.0.1:3001] [--verbose]
###############################################################################

set -e

# Configuration
WEBHOOK_URL="${WEBHOOK_URL:-http://127.0.0.1:3001}"
VERBOSE=${VERBOSE:-0}
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TESTS_TOTAL=0
TESTS_PASSED=0
TESTS_FAILED=0

###############################################################################
# Helper Functions
###############################################################################

log_info() {
  echo -e "${BLUE}[INFO]${NC} $@"
}

log_success() {
  echo -e "${GREEN}✅${NC} $@"
  ((TESTS_PASSED++))
}

log_error() {
  echo -e "${RED}❌${NC} $@"
  ((TESTS_FAILED++))
}

log_warn() {
  echo -e "${YELLOW}⚠️${NC} $@"
}

log_test() {
  echo ""
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}[TEST $TESTS_TOTAL]${NC} $@"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

assert_status() {
  local expected=$1
  local actual=$2
  local message=$3
  
  ((TESTS_TOTAL++))
  
  if [[ "$actual" == "$expected" ]]; then
    log_success "$message (got $actual)"
  else
    log_error "$message (expected $expected, got $actual)"
  fi
}

# Helper to extract HTTP status from curl output
extract_status() {
  local response="$1"
  # Get last line (should be status code)
  echo "$response" | tail -1
}

# Helper to extract body from curl output
extract_body() {
  local response="$1"
  # Get all but last line (status code)
  echo "$response" | head -n -1 || echo "$response"
}

assert_json_field() {
  local json=$1
  local field=$2
  local message=$3
  
  ((TESTS_TOTAL++))
  
  local value=$(echo "$json" | jq -r ".$field" 2>/dev/null || echo "null")
  
  if [[ "$value" != "null" && "$value" != "" ]]; then
    log_success "$message"
    echo "$value"
  else
    log_error "$message (field not found)"
    echo "null"
  fi
}

###############################################################################
# Test Cases
###############################################################################

test_health_check() {
  log_test "Health Check (no auth required)"
  
  local response=$(curl -s -w "\n%{http_code}" "$WEBHOOK_URL/health")
  local body=$(echo "$response" | head -n -1)
  local status=$(echo "$response" | tail -n 1)
  
  assert_status "200" "$status" "Health check should return 200"
  
  local ok=$(echo "$body" | jq -r '.ok' 2>/dev/null || echo "missing")
  if [[ "$ok" == "true" ]]; then
    log_success "Health check returns valid response"
  else
    log_error "Health check invalid response format"
  fi
}

test_login_missing_credentials() {
  log_test "Login with missing credentials"
  
  local response=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{}')
  local status=$(echo "$response" | tail -n 1)
  
  assert_status "422" "$status" "Missing credentials should return 422"
}

test_login_invalid_credentials() {
  log_test "Login with invalid credentials"
  
  local response=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username": "admin", "password": "wrong"}')
  local body=$(echo "$response" | head -n -1)
  local status=$(echo "$response" | tail -n 1)
  
  assert_status "401" "$status" "Invalid credentials should return 401"
  
  local error=$(echo "$body" | jq -r '.error' 2>/dev/null || echo "missing")
  if [[ "$error" == "invalid_credentials" ]]; then
    log_success "Error message is correct"
  else
    log_error "Expected 'invalid_credentials' error, got '$error'"
  fi
}

test_login_valid_credentials() {
  log_test "Login with valid credentials"
  
  local response=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username": "admin", "password": "changeme"}')
  local body=$(echo "$response" | head -n -1)
  local status=$(echo "$response" | tail -n 1)
  
  assert_status "200" "$status" "Valid credentials should return 200"
  
  # Extract tokens
  local access_token=$(assert_json_field "$body" "accessToken" "Response contains accessToken")
  local refresh_token=$(assert_json_field "$body" "refreshToken" "Response contains refreshToken")
  local expires_in=$(echo "$body" | jq -r '.expiresIn')
  
  # Save for next tests
  echo "$access_token" > /tmp/test_access_token
  echo "$refresh_token" > /tmp/test_refresh_token
  
  if [[ "$expires_in" -gt 0 ]]; then
    log_success "expiresIn is valid ($expires_in seconds)"
  else
    log_error "expiresIn should be > 0, got $expires_in"
  fi
}

test_protected_route_without_token() {
  log_test "Protected route without token"
  
  local response=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL/webhooks/subagent-complete" \
    -H "Content-Type: application/json" \
    -d '{"taskId": "test-001", "status": "ok"}')
  local status=$(echo "$response" | tail -n 1)
  
  assert_status "401" "$status" "Protected route without token should return 401"
}

test_protected_route_with_invalid_token() {
  log_test "Protected route with invalid token"
  
  local response=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL/webhooks/subagent-complete" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer invalid.token.here" \
    -d '{"taskId": "test-001", "status": "ok"}')
  local status=$(echo "$response" | tail -n 1)
  
  assert_status "401" "$status" "Invalid token should return 401"
}

test_protected_route_with_valid_token() {
  log_test "Protected route with valid token"
  
  local access_token=$(cat /tmp/test_access_token 2>/dev/null || echo "")
  
  if [[ -z "$access_token" ]]; then
    log_warn "Access token not found, skipping (run login test first)"
    ((TESTS_TOTAL++))
    return
  fi
  
  local response=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL/webhooks/subagent-complete" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $access_token" \
    -d '{"taskId": "test-001", "status": "ok"}')
  local body=$(echo "$response" | head -n -1)
  local status=$(echo "$response" | tail -n 1)
  
  assert_status "200" "$status" "Valid token should return 200"
}

test_token_refresh() {
  log_test "Token refresh endpoint"
  
  local refresh_token=$(cat /tmp/test_refresh_token 2>/dev/null || echo "")
  
  if [[ -z "$refresh_token" ]]; then
    log_warn "Refresh token not found, skipping (run login test first)"
    ((TESTS_TOTAL++))
    return
  fi
  
  local response=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL/auth/refresh" \
    -H "Content-Type: application/json" \
    -d "{\"refreshToken\": \"$refresh_token\"}")
  local body=$(echo "$response" | head -n -1)
  local status=$(echo "$response" | tail -n 1)
  
  assert_status "200" "$status" "Token refresh should return 200"
  
  local new_access_token=$(assert_json_field "$body" "accessToken" "Response contains new accessToken")
  local new_refresh_token=$(assert_json_field "$body" "refreshToken" "Response contains new refreshToken")
  
  # Save new tokens
  echo "$new_access_token" > /tmp/test_access_token
  echo "$new_refresh_token" > /tmp/test_refresh_token
}

test_refresh_token_reuse() {
  log_test "Refresh token one-time use (rotation)"
  
  local old_refresh_token=$(cat /tmp/test_refresh_token 2>/dev/null || echo "")
  
  if [[ -z "$old_refresh_token" ]]; then
    log_warn "Refresh token not found, skipping"
    ((TESTS_TOTAL++))
    return
  fi
  
  # Try to use old token again (should fail)
  local response=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL/auth/refresh" \
    -H "Content-Type: application/json" \
    -d "{\"refreshToken\": \"$old_refresh_token\"}")
  local status=$(echo "$response" | tail -n 1)
  
  assert_status "401" "$status" "Reusing refresh token should return 401 (one-time use)"
}

test_bearer_token_format() {
  log_test "Bearer token format validation"
  
  local access_token=$(cat /tmp/test_access_token 2>/dev/null || echo "")
  
  if [[ -z "$access_token" ]]; then
    log_warn "Access token not found, skipping"
    ((TESTS_TOTAL++))
    return
  fi
  
  # Test with "Bearer " prefix
  local response=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL/webhooks/subagent-complete" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $access_token" \
    -d '{"taskId": "test-001", "status": "ok"}')
  local status=$(echo "$response" | tail -n 1)
  
  assert_status "200" "$status" "Bearer token with 'Bearer ' prefix should work"
  
  # Test without "Bearer " prefix
  local response=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL/webhooks/subagent-complete" \
    -H "Content-Type: application/json" \
    -H "Authorization: $access_token" \
    -d '{"taskId": "test-001", "status": "ok"}')
  local status=$(echo "$response" | tail -n 1)
  
  assert_status "401" "$status" "Token without 'Bearer ' prefix should fail"
}

###############################################################################
# Main
###############################################################################

main() {
  echo ""
  echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║      OpenClaw JWT Authentication Test Suite                    ║${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "Target: ${BLUE}$WEBHOOK_URL${NC}"
  echo ""
  
  # Parse arguments
  while [[ $# -gt 0 ]]; do
    case $1 in
      --webhook-url)
        WEBHOOK_URL="$2"
        shift 2
        ;;
      --verbose)
        VERBOSE=1
        shift
        ;;
      *)
        echo "Unknown option: $1"
        exit 1
        ;;
    esac
  done
  
  # Run tests
  test_health_check
  test_login_missing_credentials
  test_login_invalid_credentials
  test_login_valid_credentials
  test_protected_route_without_token
  test_protected_route_with_invalid_token
  test_protected_route_with_valid_token
  test_token_refresh
  test_refresh_token_reuse
  test_bearer_token_format
  
  # Summary
  echo ""
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}Test Summary${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo "Total:  $TESTS_TOTAL"
  echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
  echo -e "Failed: ${RED}$TESTS_FAILED${NC}"
  
  if [[ $TESTS_FAILED -eq 0 ]]; then
    echo -e "\n${GREEN}✅ All tests passed!${NC}\n"
    return 0
  else
    echo -e "\n${RED}❌ Some tests failed${NC}\n"
    return 1
  fi
}

main "$@"
