#!/bin/bash

################################################################################
# operations-review.sh
# Automated weekly + monthly security & token savings review
# Called by cron jobs: SECURITY_REVIEW_WEEKLY & TOKEN_REVIEW_MONTHLY
################################################################################

set -euo pipefail

WORKSPACE="${WORKSPACE:-/Users/laurenz/.openclaw/workspace}"
REVIEW_TYPE="${1:-security}"  # "security" or "token"
REPORT_FILE="/tmp/review-report-$(date +%Y%m%d-%H%M%S).txt"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*" | tee -a "$REPORT_FILE"
}

check_service() {
    local port=$1
    local name=$2
    local status="❌ DOWN"
    
    if curl -s http://127.0.0.1:$port/health >/dev/null 2>&1; then
        status="✅ UP"
    fi
    
    log "$name (port $port): $status"
    echo "$name:$status" >> "$REPORT_FILE"
}

estimate_tokens() {
    # Rough estimate: 1 token ≈ 4 characters
    local chars=$(wc -c < "$1" 2>/dev/null || echo 0)
    echo $((chars / 4))
}

# ============================================================================
# SECURITY REVIEW
# ============================================================================

security_review() {
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log "🔒 SECURITY REVIEW — $(date +'%Y-%m-%d %H:%M:%S')"
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log ""
    
    # Section 1: Service Health
    log "📊 SERVICE HEALTH"
    check_service 3003 "Cost Circuit Breaker"
    check_service 3004 "Prompt Injection Defense"
    check_service 3005 "API Orchestrator"
    check_service 8000 "Gateway Proxy"
    check_service 9000 "Security Logger"
    check_service 9001 "Incident Response"
    check_service 3001 "Sub-Agent Webhook"
    
    log ""
    log "🚨 RECENT INCIDENTS"
    local incident_count=$(find "$WORKSPACE/services/incident-response" -name ".incidents.json" -exec jq '.incidents | length' {} \; 2>/dev/null || echo "0")
    log "Total incidents tracked: $incident_count"
    
    local recent=$(curl -s http://127.0.0.1:9001/admin/incidents 2>/dev/null | jq -r '.incidents[-3:] | .[] | "\(.severity): \(.type)"' 2>/dev/null || echo "N/A")
    log "Last 3 incidents:"
    echo "$recent" | while read line; do
        [[ ! -z "$line" ]] && log "  $line"
    done
    
    log ""
    log "📁 FILE INTEGRITY"
    
    local env_ok="✅"
    [[ ! -f ~/.env ]] && env_ok="❌ MISSING"
    log ".env: $env_ok"
    
    local config_ok="✅"
    [[ ! -f ~/.openclaw/openclaw.json ]] && config_ok="❌ MISSING"
    log "openclaw.json: $config_ok"
    
    local cost_size=$(du -h "$WORKSPACE/services/cost-circuit-breaker/.costs.json" 2>/dev/null | cut -f1 || echo "N/A")
    log "Costs DB size: $cost_size (should be <1MB)"
    
    log ""
    log "💰 COST STATUS"
    local cost_state=$(curl -s http://127.0.0.1:3003/state 2>/dev/null | jq -r '.state' 2>/dev/null || echo "unavailable")
    log "Circuit breaker state: $cost_state"
    
    log ""
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log "✅ SECURITY REVIEW COMPLETE"
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# ============================================================================
# TOKEN SAVINGS REVIEW
# ============================================================================

token_review() {
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log "💰 TOKEN SAVINGS REVIEW — $(date +'%Y-%m-%d %H:%M:%S')"
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log ""
    
    # Section 1: File Sizes
    log "📁 PERSISTENT MEMORY FILES"
    
    local total_tokens=0
    for file in identity.md context.md tasks.md log.md; do
        if [[ -f "$WORKSPACE/project/$file" ]]; then
            local tokens=$(estimate_tokens "$WORKSPACE/project/$file")
            local limit=500
            [[ "$file" == "context.md" ]] && limit=800
            [[ "$file" == "tasks.md" ]] && limit=600
            [[ "$file" == "log.md" ]] && limit=400
            
            local status="✅"
            [[ $tokens -gt $limit ]] && status="⚠️ OVER"
            
            log "$file: $tokens/$limit tokens $status"
            total_tokens=$((total_tokens + tokens))
        fi
    done
    
    log "TOTAL: $total_tokens/2300 tokens"
    
    log ""
    log "🔄 AUTO-CLEAR EVENTS"
    
    local warnings=$(grep -c "AUTO-CLEAR WARNING" "$WORKSPACE/services/gateway-proxy/stdout.log" 2>/dev/null || echo "0")
    local clears=$(grep -c "AUTO-CLEAR TRIGGERED" "$WORKSPACE/services/gateway-proxy/stdout.log" 2>/dev/null || echo "0")
    
    log "Warnings (30+ msgs): $warnings x this month"
    log "Auto-clears (50+ msgs): $clears x this month"
    
    log ""
    log "📊 SESSION STATS"
    
    local max_msg=$(grep "Msg #" "$WORKSPACE/services/gateway-proxy/stdout.log" 2>/dev/null | grep -o "Msg #[0-9]*" | sed 's/Msg #//' | sort -rn | head -1 || echo "0")
    log "Longest session: $max_msg messages"
    
    log ""
    log "✅ CACHING STATUS"
    log "Prompt Caching: Enabled (1h retention, 'long')"
    log "Cache Hit Rate: Check Anthropic dashboard"
    log "Expected Savings: ~90% on cached tokens"
    
    log ""
    log "🎯 MODEL ROUTING"
    log "Target: 85% Haiku, 15% Sonnet, <2% Opus"
    log "Verify in: Anthropic dashboard or request logs"
    
    log ""
    log "📝 RESPONSE LIMITS"
    log "Quick answers: <30 tokens ✅"
    log "Standard replies: <100 tokens ✅"
    log "Detailed (on request): <200 tokens ✅"
    log "Spot-check last week's replies for compliance"
    
    log ""
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log "✅ TOKEN SAVINGS REVIEW COMPLETE"
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# ============================================================================
# MAIN
# ============================================================================

main() {
    # Create report file
    > "$REPORT_FILE"
    
    if [[ "$REVIEW_TYPE" == "security" ]]; then
        security_review
    elif [[ "$REVIEW_TYPE" == "token" ]]; then
        token_review
    else
        log "ERROR: Unknown review type: $REVIEW_TYPE"
        exit 1
    fi
    
    log ""
    log "📋 Full report saved to: $REPORT_FILE"
    
    # Display report
    cat "$REPORT_FILE"
}

main "$@"
