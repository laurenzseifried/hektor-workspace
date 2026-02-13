#!/usr/bin/env bash
###############################################################################
# Git History Secrets Scanner
# 
# Scans entire git repository history for secrets and generates report.
# Provides instructions for cleaning if secrets are found.
# 
# USAGE:
#   ./scan-git-history.sh [OPTIONS]
# 
# OPTIONS:
#   --full              Scan entire history (default: last 100 commits)
#   --limit N           Scan last N commits (default: 100)
#   --output FILE       Save report to file (default: stdout)
#   --fix               Provide instructions for removing secrets
#   --check-only        Don't scan, just check if scan is needed
# 
# EXAMPLES:
#   ./scan-git-history.sh                    # Scan last 100 commits
#   ./scan-git-history.sh --full             # Scan entire history
#   ./scan-git-history.sh --limit 500        # Scan last 500 commits
#   ./scan-git-history.sh --output report.md # Save to file
# 
###############################################################################

set -euo pipefail

# Parse arguments
FULL_HISTORY=false
LIMIT=100
OUTPUT_FILE=""
FIX_INSTRUCTIONS=false
CHECK_ONLY=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --full)
            FULL_HISTORY=true
            ;;
        --limit)
            LIMIT="$2"
            shift
            ;;
        --output)
            OUTPUT_FILE="$2"
            shift
            ;;
        --fix)
            FIX_INSTRUCTIONS=true
            ;;
        --check-only)
            CHECK_ONLY=true
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
    shift
done

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Repo info
REPO_ROOT="$(git rev-parse --show-toplevel)"
PATTERNS_FILE="$REPO_ROOT/.secrets-patterns"
TEMP_DIR="/tmp/git-scan-$$"
mkdir -p "$TEMP_DIR"

# Cleanup on exit
cleanup() {
    rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

# Logging
log_info() {
    echo -e "${BLUE}[scan]${NC} $*"
}

log_warn() {
    echo -e "${YELLOW}[warn]${NC} $*"
}

log_error() {
    echo -e "${RED}[error]${NC} $*"
}

log_pass() {
    echo -e "${GREEN}[pass]${NC} $*"
}

# Output function (to file or stdout)
output() {
    if [[ -n "$OUTPUT_FILE" ]]; then
        echo "$*" >> "$OUTPUT_FILE"
    else
        echo "$*"
    fi
}

# Main scan function
scan_history() {
    local commit_count
    if $FULL_HISTORY; then
        commit_count=$(git rev-list --count HEAD)
        log_info "Scanning entire history ($commit_count commits)..."
    else
        commit_count=$LIMIT
        log_info "Scanning last $LIMIT commits..."
    fi
    
    # Determine range
    local range
    if $FULL_HISTORY; then
        range="HEAD"
    else
        range="HEAD~$LIMIT..HEAD"
    fi
    
    # Get list of commits
    local commits
    commits=$(git log --pretty=format:"%H" $range 2>/dev/null || git log --pretty=format:"%H" -$LIMIT)
    
    local total_commits=0
    local found_secrets=0
    local findings_file="$TEMP_DIR/findings.txt"
    touch "$findings_file"
    
    # Scan each commit
    while IFS= read -r commit; do
        ((total_commits++))
        
        # Get files changed in commit
        local files
        files=$(git diff-tree --no-commit-id --name-only -r "$commit" 2>/dev/null || echo "")
        
        while IFS= read -r file; do
            [[ -z "$file" ]] && continue
            
            # Skip binary files
            if git show "$commit:$file" 2>/dev/null | file - | grep -qi "binary"; then
                continue
            fi
            
            # Skip whitelisted files
            if [[ "$file" == ".env.example" ]] || [[ "$file" =~ test|spec|fixtures ]] || [[ "$file" =~ \.md$ ]]; then
                continue
            fi
            
            # Get file content from that commit
            local content
            content=$(git show "$commit:$file" 2>/dev/null || echo "")
            
            # Scan patterns
            while IFS= read -r pattern; do
                [[ -z "$pattern" || "$pattern" =~ ^# ]] && continue
                
                # Check if pattern matches
                if echo "$content" | grep -E "$pattern" > /dev/null 2>&1; then
                    # Skip if has placeholder markers
                    if echo "$content" | grep -E "$pattern" | grep -qi "PLACEHOLDER\|EXAMPLE\|FAKE\|dummy\|test\|YOUR_"; then
                        continue
                    fi
                    
                    # Secret found!
                    found_secrets=$((found_secrets + 1))
                    echo "COMMIT: $commit" >> "$findings_file"
                    echo "FILE: $file" >> "$findings_file"
                    echo "PATTERN: $pattern" >> "$findings_file"
                    echo "---" >> "$findings_file"
                fi
            done < "$PATTERNS_FILE"
        done <<< "$files"
        
        # Progress indicator
        if (( total_commits % 10 == 0 )); then
            log_info "Scanned $total_commits commits..."
        fi
    done <<< "$commits"
    
    # Generate report
    output "# Git History Secrets Scan Report"
    output ""
    output "**Date:** $(date)"
    output "**Repository:** $(git remote get-url origin 2>/dev/null || echo 'Local repo')"
    output "**Commits Scanned:** $total_commits"
    output "**Secrets Found:** $found_secrets"
    output ""
    
    if [[ $found_secrets -eq 0 ]]; then
        output "✅ **No secrets detected in git history!**"
        return 0
    else
        output "❌ **SECRETS DETECTED IN GIT HISTORY**"
        output ""
        output "## Findings"
        output ""
        
        if [[ -f "$findings_file" && -s "$findings_file" ]]; then
            output "\`\`\`"
            cat "$findings_file" >> "$OUTPUT_FILE" 2>/dev/null || cat "$findings_file"
            output "\`\`\`"
        fi
        
        output ""
        output "## Remediation"
        output ""
        
        if $FIX_INSTRUCTIONS; then
            output "### Option 1: Remove from Staging (Recommended)"
            output ""
            output "\`\`\`bash"
            output "# Unstage the file from current index"
            output "git rm --cached <filename>"
            output ""
            output "# Add to .gitignore"
            output "echo '<filename>' >> .gitignore"
            output ""
            output "# Commit"
            output "git add .gitignore"
            output "git commit -m 'Remove secrets from tracking'"
            output "\`\`\`"
            output ""
            output "### Option 2: Clean Git History (Advanced)"
            output ""
            output "If secrets were committed in previous commits, use \`git-filter-repo\`:"
            output ""
            output "\`\`\`bash"
            output "# Install git-filter-repo"
            output "pip install git-filter-repo"
            output ""
            output "# Remove secret file from ALL commits"
            output "git filter-repo --path <path-to-secret-file> --invert-paths"
            output ""
            output "# Force push (DANGER: rewrites history)"
            output "git push origin --force-with-lease --all"
            output "\`\`\`"
            output ""
            output "### Option 3: Use BFG Repo Cleaner"
            output ""
            output "\`\`\`bash"
            output "# Download BFG"
            output "brew install bfg"
            output ""
            output "# Remove file from all commits"
            output "bfg --delete-files <filename> ."
            output ""
            output "# Clean and push"
            output "git reflog expire --expire=now --all && git gc --prune=now --aggressive"
            output "git push origin --force-with-lease --all"
            output "\`\`\`"
            output ""
        fi
        
        output "### IMPORTANT: After Removing Secrets"
        output ""
        output "1. **Rotate all compromised credentials immediately**"
        output "2. **Force-push the cleaned history** (this rewrites git history)"
        output "3. **Notify team members to re-clone** the repository"
        output "4. **Check if credentials were used** (e.g., API logs)"
        output "5. **Monitor accounts** for unauthorized access"
        output ""
        
        return 1
    fi
}

# Check if scanning is needed
check_if_needed() {
    if ! command -v git &> /dev/null; then
        log_error "git not found"
        exit 1
    fi
    
    if [[ ! -f "$PATTERNS_FILE" ]]; then
        log_error ".secrets-patterns file not found"
        exit 1
    fi
    
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "Not in a git repository"
        exit 1
    fi
}

# Main
main() {
    check_if_needed
    
    if $CHECK_ONLY; then
        log_pass "Git history scan is properly configured"
        return 0
    fi
    
    if [[ -n "$OUTPUT_FILE" ]]; then
        > "$OUTPUT_FILE"  # Clear output file
        log_info "Report will be saved to: $OUTPUT_FILE"
    fi
    
    if ! scan_history; then
        log_error "Secrets detected in git history"
        return 1
    fi
    
    log_pass "Scan complete"
    return 0
}

main
