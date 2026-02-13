#!/usr/bin/env bash
###############################################################################
# Secrets Rotation Script
# 
# Rotates all critical secrets and updates configuration files.
# Run this script whenever:
# - A secret may have been leaked
# - Scheduled rotation is due (see ROTATION_SCHEDULE below)
# - A team member leaves with access to secrets
# - After a security incident
# 
# ROTATION SCHEDULE (recommended):
# - WEBHOOK_TOKEN: 90 days
# - OPENCLAW_GATEWAY_TOKEN: 60 days
# - HEKTOR_BOT_TOKEN: 180 days (Telegram bot tokens)
# - SCOUT_BOT_TOKEN: 180 days
# - GOOGLE_API_KEY: 90 days (regenerate in Google Cloud Console)
# - BRAVE_API_KEY: 90 days (contact Brave support)
# - GITHUB_TOKEN: 90 days (regenerate in GitHub settings)
# - GROQ_API_KEY: 90 days (regenerate in Groq dashboard)
# 
# USAGE:
#   ./rotate-secrets.sh [--all|--token TOKEN_NAME]
#   ./rotate-secrets.sh --all                    # Rotate all auto-rotatable tokens
#   ./rotate-secrets.sh --token WEBHOOK_TOKEN    # Rotate specific token
#   ./rotate-secrets.sh --check                  # Check rotation status
# 
###############################################################################

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="/Users/laurenz/.openclaw/.env"
BACKUP_DIR="$WORKSPACE_DIR/.secret-backups"
ROTATION_LOG="$WORKSPACE_DIR/memory/secret-rotations.log"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

# Logging function
log() {
    local timestamp
    timestamp="$(date -u +"%Y-%m-%d %H:%M:%S UTC")"
    echo "[$timestamp] $*" | tee -a "$ROTATION_LOG"
}

log_color() {
    local color=$1
    shift
    echo -e "${color}$*${NC}"
}

# Backup current .env before rotation
backup_env() {
    local backup_file
    backup_file="$BACKUP_DIR/.env.backup.$(date +%Y%m%d-%H%M%S)"
    cp "$ENV_FILE" "$backup_file"
    chmod 600 "$backup_file"
    log "Backed up .env to $backup_file"
    log_color "$GREEN" "✅ Backup created: $backup_file"
}

# Generate secure random token (hex)
generate_hex_token() {
    local length=${1:-32}
    node -e "console.log(require('crypto').randomBytes($length).toString('hex'))"
}

# Update .env file with new token value
update_env_var() {
    local var_name=$1
    local new_value=$2
    
    if grep -q "^${var_name}=" "$ENV_FILE"; then
        # macOS-compatible sed (with backup)
        sed -i.bak "s|^${var_name}=.*|${var_name}=${new_value}|" "$ENV_FILE"
        rm "${ENV_FILE}.bak"
        log "Updated $var_name in $ENV_FILE"
    else
        echo "${var_name}=${new_value}" >> "$ENV_FILE"
        log "Added $var_name to $ENV_FILE"
    fi
}

# Rotate WEBHOOK_TOKEN (auto-rotatable)
rotate_webhook_token() {
    log_color "$BLUE" "\n🔄 Rotating WEBHOOK_TOKEN..."
    local new_token
    new_token=$(generate_hex_token 32)
    update_env_var "WEBHOOK_TOKEN" "$new_token"
    log_color "$GREEN" "✅ WEBHOOK_TOKEN rotated"
    log_color "$YELLOW" "⚠️  ACTION REQUIRED: Restart subagent-webhook service:"
    log_color "$YELLOW" "   launchctl unload ~/Library/LaunchAgents/com.openclaw.subagent-webhook.plist"
    log_color "$YELLOW" "   launchctl load ~/Library/LaunchAgents/com.openclaw.subagent-webhook.plist"
}

# Rotate OPENCLAW_GATEWAY_TOKEN (auto-rotatable)
rotate_gateway_token() {
    log_color "$BLUE" "\n🔄 Rotating OPENCLAW_GATEWAY_TOKEN..."
    local new_token
    new_token=$(generate_hex_token 24)
    update_env_var "OPENCLAW_GATEWAY_TOKEN" "$new_token"
    log_color "$GREEN" "✅ OPENCLAW_GATEWAY_TOKEN rotated"
    log_color "$YELLOW" "⚠️  ACTION REQUIRED: Restart OpenClaw gateway:"
    log_color "$YELLOW" "   openclaw gateway restart"
}

# Rotate Telegram bot tokens (manual - requires BotFather)
rotate_telegram_token() {
    local token_name=$1
    log_color "$BLUE" "\n🔄 Rotating $token_name..."
    log_color "$YELLOW" "⚠️  MANUAL ACTION REQUIRED:"
    log_color "$YELLOW" "   1. Open Telegram and message @BotFather"
    log_color "$YELLOW" "   2. Send /mybots"
    log_color "$YELLOW" "   3. Select your bot (Hektor or Scout)"
    log_color "$YELLOW" "   4. Select 'API Token' → 'Revoke current token'"
    log_color "$YELLOW" "   5. Copy the new token"
    log_color "$YELLOW" "   6. Update $ENV_FILE manually with:"
    log_color "$YELLOW" "      ${token_name}=<new_token>"
    log_color "$YELLOW" "   7. Restart OpenClaw gateway"
    
    log "$token_name rotation initiated (manual steps required)"
}

# Rotate API keys (manual - requires provider dashboards)
rotate_api_key() {
    local key_name=$1
    local provider=$2
    local dashboard_url=$3
    
    log_color "$BLUE" "\n🔄 Rotating $key_name..."
    log_color "$YELLOW" "⚠️  MANUAL ACTION REQUIRED:"
    log_color "$YELLOW" "   1. Go to $provider dashboard: $dashboard_url"
    log_color "$YELLOW" "   2. Revoke the old key"
    log_color "$YELLOW" "   3. Generate a new key"
    log_color "$YELLOW" "   4. Update $ENV_FILE with:"
    log_color "$YELLOW" "      ${key_name}=<new_key>"
    log_color "$YELLOW" "   5. Test the new key"
    
    log "$key_name rotation initiated (manual steps required)"
}

# Check rotation status (last rotation date for each secret)
check_rotation_status() {
    log_color "$BLUE" "\n📊 Checking rotation status...\n"
    
    if [[ ! -f "$ROTATION_LOG" ]]; then
        log_color "$YELLOW" "No rotation log found. This may be the first rotation."
        return
    fi
    
    log_color "$BLUE" "Last rotations (from $ROTATION_LOG):"
    echo ""
    
    # Parse log for last rotation of each secret
    for secret in WEBHOOK_TOKEN OPENCLAW_GATEWAY_TOKEN HEKTOR_BOT_TOKEN SCOUT_BOT_TOKEN GOOGLE_API_KEY BRAVE_API_KEY GITHUB_TOKEN GROQ_API_KEY; do
        local last_rotation
        last_rotation=$(grep "$secret" "$ROTATION_LOG" | tail -1 || echo "Never rotated")
        echo "  $secret: $last_rotation"
    done
    
    echo ""
    log_color "$YELLOW" "RECOMMENDED ROTATION SCHEDULE:"
    echo "  WEBHOOK_TOKEN: Every 90 days"
    echo "  OPENCLAW_GATEWAY_TOKEN: Every 60 days"
    echo "  HEKTOR_BOT_TOKEN: Every 180 days"
    echo "  SCOUT_BOT_TOKEN: Every 180 days"
    echo "  GOOGLE_API_KEY: Every 90 days"
    echo "  BRAVE_API_KEY: Every 90 days"
    echo "  GITHUB_TOKEN: Every 90 days"
    echo "  GROQ_API_KEY: Every 90 days"
}

# Main rotation logic
rotate_all() {
    log_color "$GREEN" "\n🔐 FULL SECRETS ROTATION INITIATED\n"
    backup_env
    
    # Auto-rotatable tokens
    rotate_webhook_token
    rotate_gateway_token
    
    # Manual rotation instructions
    rotate_telegram_token "HEKTOR_BOT_TOKEN"
    rotate_telegram_token "SCOUT_BOT_TOKEN"
    rotate_api_key "GOOGLE_API_KEY" "Google Cloud Console" "https://console.cloud.google.com/apis/credentials"
    rotate_api_key "BRAVE_API_KEY" "Brave Search Dashboard" "https://brave.com/search/api/"
    rotate_api_key "GITHUB_TOKEN" "GitHub Settings" "https://github.com/settings/tokens"
    rotate_api_key "GROQ_API_KEY" "Groq Dashboard" "https://console.groq.com/keys"
    
    log_color "$GREEN" "\n✅ Rotation process complete!"
    log_color "$YELLOW" "⚠️  Remember to complete all manual steps above and restart services."
}

# Parse arguments
case "${1:-}" in
    --all)
        rotate_all
        ;;
    --token)
        if [[ -z "${2:-}" ]]; then
            log_color "$RED" "❌ Error: --token requires a token name"
            exit 1
        fi
        
        backup_env
        
        case "$2" in
            WEBHOOK_TOKEN)
                rotate_webhook_token
                ;;
            OPENCLAW_GATEWAY_TOKEN)
                rotate_gateway_token
                ;;
            HEKTOR_BOT_TOKEN)
                rotate_telegram_token "HEKTOR_BOT_TOKEN"
                ;;
            SCOUT_BOT_TOKEN)
                rotate_telegram_token "SCOUT_BOT_TOKEN"
                ;;
            GOOGLE_API_KEY)
                rotate_api_key "GOOGLE_API_KEY" "Google Cloud Console" "https://console.cloud.google.com/apis/credentials"
                ;;
            BRAVE_API_KEY)
                rotate_api_key "BRAVE_API_KEY" "Brave Search Dashboard" "https://brave.com/search/api/"
                ;;
            GITHUB_TOKEN)
                rotate_api_key "GITHUB_TOKEN" "GitHub Settings" "https://github.com/settings/tokens"
                ;;
            GROQ_API_KEY)
                rotate_api_key "GROQ_API_KEY" "Groq Dashboard" "https://console.groq.com/keys"
                ;;
            *)
                log_color "$RED" "❌ Error: Unknown token name: $2"
                exit 1
                ;;
        esac
        ;;
    --check)
        check_rotation_status
        ;;
    *)
        log_color "$BLUE" "Secrets Rotation Script"
        echo ""
        echo "Usage:"
        echo "  $0 --all                      Rotate all secrets (auto + manual instructions)"
        echo "  $0 --token TOKEN_NAME         Rotate a specific token"
        echo "  $0 --check                    Check rotation status"
        echo ""
        echo "Examples:"
        echo "  $0 --all"
        echo "  $0 --token WEBHOOK_TOKEN"
        echo "  $0 --check"
        exit 0
        ;;
esac
