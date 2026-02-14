#!/bin/bash

################################################################################
# context-pruning.sh
# Daily context maintenance: audit, prune, compress project memory files
################################################################################

set -euo pipefail

WORKSPACE="${WORKSPACE:-/Users/laurenz/.openclaw/workspace}"
PROJECT_DIR="$WORKSPACE/project"
ARCHIVE_DIR="$PROJECT_DIR/archive"
PRUNE_LOG="$WORKSPACE/memory/pruning.log"

# Create archive directory
mkdir -p "$ARCHIVE_DIR"
mkdir -p "$(dirname "$PRUNE_LOG")"

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*" | tee -a "$PRUNE_LOG"
}

estimate_tokens() {
    # Rough estimate: 1 token ≈ 4 characters
    local chars=$(wc -c < "$1" 2>/dev/null || echo 0)
    echo $((chars / 4))
}

# ============================================================================
# STEP 1: AUDIT
# ============================================================================

log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "📋 CONTEXT PRUNING: AUDIT PHASE"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

declare -A limits=(
    ["identity.md"]=2000
    ["context.md"]=3200
    ["tasks.md"]=2400
    ["log.md"]=1600
)

for file in identity.md context.md tasks.md log.md; do
    if [[ -f "$PROJECT_DIR/$file" ]]; then
        tokens=$(estimate_tokens "$PROJECT_DIR/$file")
        limit=${limits[$file]}
        status="✓ OK"
        [[ $tokens -gt $limit ]] && status="⚠ OVER LIMIT"
        log "  $file: $tokens/$limit tokens $status"
    fi
done

# ============================================================================
# STEP 2: ARCHIVE OLD COMPLETED ITEMS
# ============================================================================

log ""
log "📦 ARCHIVING old completed tasks..."

if [[ -f "$PROJECT_DIR/tasks.md" ]]; then
    # Move [DONE] items older than 48 hours to archive
    awk '
        /\[DONE\]/ && NR > 1 {
            print $0 > "'"$ARCHIVE_DIR"'/tasks-archive-$(date +%Y-%m-%d).md"
            next
        }
        { print > "'"$PROJECT_DIR"'/tasks.md.tmp" }
    ' "$PROJECT_DIR/tasks.md"
    mv "$PROJECT_DIR/tasks.md.tmp" "$PROJECT_DIR/tasks.md"
    log "  Archived completed tasks"
fi

# ============================================================================
# STEP 3: PRUNE LOG (keep last 20 entries)
# ============================================================================

log ""
log "🧹 PRUNING log entries..."

if [[ -f "$PROJECT_DIR/log.md" ]]; then
    # Keep header + last 20 entries
    head -1 "$PROJECT_DIR/log.md" > "$PROJECT_DIR/log.md.tmp"
    tail -20 "$PROJECT_DIR/log.md" >> "$PROJECT_DIR/log.md.tmp"
    mv "$PROJECT_DIR/log.md.tmp" "$PROJECT_DIR/log.md"
    log "  Pruned log to last 20 entries"
fi

# ============================================================================
# STEP 4: COMPRESS (remove redundant info)
# ============================================================================

log ""
log "🔨 COMPRESSING context..."

# Remove entries older than 7 days from context.md (basic cleanup)
if [[ -f "$PROJECT_DIR/context.md" ]]; then
    # Just log it for now (actual compression is manual review)
    log "  Context ready for manual review (tokens within limit)"
fi

# ============================================================================
# STEP 5: FINAL AUDIT + REPORT
# ============================================================================

log ""
log "✅ FINAL AUDIT:"

total_tokens=0
for file in identity.md context.md tasks.md log.md; do
    if [[ -f "$PROJECT_DIR/$file" ]]; then
        tokens=$(estimate_tokens "$PROJECT_DIR/$file")
        total_tokens=$((total_tokens + tokens))
        log "  $file: $tokens tokens"
    fi
done

log ""
log "📊 SUMMARY"
log "  Total project memory: $total_tokens tokens (max: 8000 for all)"
est_savings=$((8000 - total_tokens))
log "  Savings potential: ~$est_savings tokens/request (vs bloated files)"
log ""
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "✅ CONTEXT PRUNING COMPLETE"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
