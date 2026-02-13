# Automated Secrets Scanning — Complete Guide

## Overview

This document describes the automated secrets scanning system for the OpenClaw repository. It prevents accidental commits of sensitive data (API keys, tokens, passwords) through multiple layers:

1. **Pre-commit hooks** — Local machine (Git hooks)
2. **CI/CD scanning** — Pull requests (GitHub Actions)
3. **Git history scanning** — Full repository audit

---

## Components

### 1. `.secrets-patterns` File

Contains regex patterns for detecting secrets:
- API key formats (sk-ant-*, sk-*, AKIA*, ghp_*, gsk_*, BSA*, AIza*)
- Bearer tokens
- Telegram bot tokens
- Private key file headers
- Common secret variable names (password=, secret=, token=, etc.)
- High-entropy strings (40+ alphanumeric characters)

**Location:** `/.secrets-patterns`

**Usage:** Both pre-commit hook and CI/CD scanning read this file.

**Updating patterns:**
```bash
vi .secrets-patterns  # Add new patterns (one regex per line)
git add .secrets-patterns && git commit -m "Add new secret pattern"
```

---

### 2. Pre-Commit Hook (Local)

**Purpose:** Blocks commits with secrets BEFORE they reach the repository.

**Location:** `/.git/hooks/pre-commit`

**How it works:**
1. Git stages files for commit
2. Hook script runs automatically
3. Scans each staged file against `.secrets-patterns`
4. If secrets found:
   - Displays detailed report
   - Lists matching patterns and line numbers
   - BLOCKS the commit
5. If clean:
   - Allows commit to proceed

**Whitelisting:**
The hook automatically skips:
- `.env.example` (allowed to contain placeholder-like values)
- Test/fixture files with markers (test, spec, fixtures)
- Documentation with example markers (e.g., "# Example:")

**Installation:**
```bash
# Should already be executable from setup
chmod +x .git/hooks/pre-commit

# Test it
# (Try to commit a file with "sk-ant-fake1234567890abcde" in it)
# The hook should block the commit
```

**To bypass (NOT recommended):**
```bash
git commit --no-verify  # ⚠️ Skips all pre-commit hooks
```

**Manual testing:**
```bash
# Create a test file with a fake secret
echo "GROQ_API_KEY=gsk_faketoken1234567890abcdefghijklmnopqr" > test-secret.txt

# Try to commit
git add test-secret.txt
git commit -m "test"

# Expected: Commit blocked with error message
# Now clean up
rm test-secret.txt
git reset HEAD test-secret.txt
```

---

### 3. GitHub Actions CI/CD Scanning

**Purpose:** Secondary check on pull requests (catches missed pre-commit hooks).

**Location:** `/.github/workflows/secrets-scan.yml`

**Triggers:**
- Pull request to main/master/develop
- Push to main/master/develop
- Manual trigger (workflow_dispatch)

**What it does:**
1. Checks out code and full git history
2. Scans changed files in PR
3. Scans last 50 commits for secrets
4. Reports findings with commit hash and file path
5. Comments on PR if secrets detected
6. Blocks PR merge if secrets found

**Configuration:**
```yaml
# Adjust which branches to scan
on:
  pull_request:
    branches:
      - main
      - master
      - develop
```

**View results:**
1. Go to GitHub repo → Actions tab
2. Find "Secrets Scan" workflow run
3. Click to see detailed output
4. If PR: See comment on the PR with findings

**Disable (not recommended):**
```bash
# Rename or delete the workflow
mv .github/workflows/secrets-scan.yml .github/workflows/secrets-scan.yml.disabled
```

---

### 4. Git History Scanning Script

**Purpose:** Audit entire repository for secrets that may have been committed.

**Location:** `/scripts/scan-git-history.sh`

**Usage:**

```bash
# Scan last 100 commits (default)
./scripts/scan-git-history.sh

# Scan entire history
./scripts/scan-git-history.sh --full

# Scan last N commits
./scripts/scan-git-history.sh --limit 500

# Save report to file
./scripts/scan-git-history.sh --output report.md

# With fix instructions
./scripts/scan-git-history.sh --full --fix --output report.md
```

**Output Example:**
```
# Git History Secrets Scan Report

**Date:** Thu Feb 12 20:50:00 GMT+1 2026
**Repository:** git@github.com:user/openclaw.git
**Commits Scanned:** 100
**Secrets Found:** 0

✅ **No secrets detected in git history!**
```

**If secrets are found:**
```
❌ **SECRETS DETECTED IN GIT HISTORY**

## Findings

COMMIT: a1b2c3d
FILE: .env
PATTERN: GROQ_API_KEY.*

---

## Remediation

### Option 1: Remove from Staging (Recommended)
...
```

---

## Workflow: Complete Example

### Scenario 1: Normal Development (No Secrets)

```bash
# Create feature
git checkout -b feature/my-feature
echo "function myFeature() { ... }" > my-feature.js

# Stage and commit
git add my-feature.js
git commit -m "Add my feature"

# ✅ Pre-commit hook runs, finds no secrets
# ✅ Commit proceeds

# Push to GitHub
git push origin feature/my-feature

# ✅ GitHub Actions CI/CD runs, finds no secrets
# ✅ PR can be merged
```

### Scenario 2: Accidental Secret (Caught by Pre-Commit)

```bash
# Oops! Include an API key in config file
echo "api_key = 'sk-ant-1234567890abcdefghijklmnop'" > config.js

git add config.js
git commit -m "Add config"

# ❌ Pre-commit hook BLOCKS commit:
# ERROR: SECRETS DETECTED IN STAGED FILES
# FILE: config.js
# PATTERN: sk-ant-[a-zA-Z0-9]{20,}
# MATCHING LINES:
#   1: api_key = 'sk-ant-1234567890abcdefghijklmnop'

# Fix: Use .env.example instead
echo "api_key = '${API_KEY}'" > config.js
echo "api_key = 'sk-ant-example-replace-me'" > .env.example

git add config.js .env.example
git commit -m "Add config with env variables"

# ✅ Pre-commit hook runs, finds no real secrets
# ✅ Commit proceeds
```

### Scenario 3: Secret Leaked in History (Caught by Scanning)

```bash
# Run history scan to audit for leaks
./scripts/scan-git-history.sh --full --output audit-report.md

# If secrets found:
cat audit-report.md
# Shows: COMMIT a1b2c3d FILE .env (old leaked file)

# Clean the history using BFG:
brew install bfg
bfg --delete-files .env .

# Force push (rewrites history)
git push origin --force-with-lease --all

# Rotate compromised credentials
```

---

## Security Best Practices

### DO ✅

1. **Use `.env.example`** with placeholder values:
   ```
   GROQ_API_KEY=sk-example-replace-me
   DATABASE_PASSWORD=change_me_in_production
   ```

2. **Keep secrets in `.env`** (already in .gitignore):
   ```bash
   # .env (never committed)
   GROQ_API_KEY=sk-real-secret-key-here
   ```

3. **Use environment variables** in code:
   ```javascript
   const apiKey = process.env.GROQ_API_KEY;
   ```

4. **Rotate secrets** if accidentally committed:
   ```bash
   # 1. Regenerate the secret in the provider
   # 2. Clean git history with bfg/filter-repo
   # 3. Update .env with new secret
   # 4. Force-push the clean history
   ```

5. **Test the scanning** regularly:
   ```bash
   ./scripts/scan-git-history.sh --check-only
   ```

### DON'T ❌

1. **Never commit real secrets:**
   ```javascript
   // ❌ WRONG
   const apiKey = "sk-ant-real-secret-here";
   ```

2. **Never use `git commit --no-verify`** unless absolutely necessary:
   ```bash
   git commit --no-verify  # Bypasses pre-commit hook
   ```

3. **Never hardcode tokens** in source files:
   ```javascript
   // ❌ WRONG
   const token = "ghp_1234567890abcdefghijklmnopqrst";
   ```

4. **Never push to main** without PR review:
   ```bash
   # ❌ Skips CI/CD scanning
   git push origin main
   ```

---

## Troubleshooting

### Problem: Pre-commit hook not running

**Solution:**
```bash
# Make sure hook is executable
chmod +x .git/hooks/pre-commit

# Test hook manually
.git/hooks/pre-commit

# Check git config
git config core.hooksPath
```

### Problem: False positive (legitimate code flagged)

**Solution:**

1. **Add placeholder marker** if it's an example:
   ```javascript
   // Example API key (PLACEHOLDER, never real)
   const apiKey = "sk-ant-1234567890abcdefghijklmnop";
   ```

2. **Add to whitelist** in pre-commit hook if it's a test:
   ```bash
   # Test files with obvious markers are auto-whitelisted
   # Add "EXAMPLE" or "FAKE" to the line
   const testToken = "sk-ant-example-token-for-tests";
   ```

3. **Update .secrets-patterns** if pattern is too broad:
   ```bash
   # Remove overly broad pattern
   # Or update to be more specific
   ```

### Problem: Pre-commit hook blocks legitimate file

**Solution:**

1. **Check for whitelisted patterns:**
   ```bash
   # Add one of these to the file:
   # PLACEHOLDER, EXAMPLE, FAKE, TODO, FIXME, test
   ```

2. **Use `--no-verify` only if sure:**
   ```bash
   git commit --no-verify
   # Then immediately:
   ./scripts/scan-git-history.sh  # Verify it's clean
   ```

### Problem: Want to disable scanning

**Solution:**
```bash
# Disable pre-commit hook (locally)
chmod -x .git/hooks/pre-commit

# Disable GitHub Actions (remove workflow)
rm .github/workflows/secrets-scan.yml
git add -A && git commit -m "Disable secrets scanning"

# ⚠️ Not recommended - re-enable after development
```

---

## Integration with Development Workflow

### VS Code

Create `.vscode/settings.json`:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "files.exclude": {
    ".env": true,
    "**/.env.local": true
  }
}
```

### Git Configuration

```bash
# Set default branch to main
git config --global init.defaultBranch main

# Use branch.autoSetupMerge
git config --global branch.autoSetupMerge true

# Enforce signed commits (optional)
git config user.signingkey <GPG_KEY_ID>
git config commit.gpgSign true
```

### Team Workflow

```bash
# All team members should:
# 1. Clone repo
# 2. Pre-commit hook auto-runs
# 3. No additional setup needed

# Verify on new clone:
.git/hooks/pre-commit --version 2>/dev/null || echo "Hook installed"
```

---

## Scheduled Audits

### Daily History Scan (Cron)

```bash
# Create cron job to audit daily
# crontab -e

# Add this line:
0 1 * * * /Users/laurenz/.openclaw/workspace/scripts/scan-git-history.sh --limit 50 --output /tmp/daily-secrets-audit.log

# Check logs:
tail /tmp/daily-secrets-audit.log
```

### Monthly Full History Audit

```bash
# crontab -e

# Add this line (first day of month at 2 AM):
0 2 1 * * /Users/laurenz/.openclaw/workspace/scripts/scan-git-history.sh --full --output /tmp/monthly-secrets-audit.log

# Results saved to /tmp/monthly-secrets-audit.log
```

---

## Implementation Summary

| Component | Location | Trigger | Action |
|-----------|----------|---------|--------|
| Patterns | `.secrets-patterns` | Manual edit | Defines what to scan for |
| Pre-commit | `.git/hooks/pre-commit` | `git commit` | Blocks if secrets detected |
| CI/CD | `.github/workflows/secrets-scan.yml` | PR/push to main | Scans changed files + history |
| History Scanner | `scripts/scan-git-history.sh` | Manual run | Audits entire history |

---

## Testing Checklist

- [ ] Pre-commit hook is executable
- [ ] Pre-commit hook blocks fake secrets
- [ ] Pre-commit hook allows `.env.example`
- [ ] Pre-commit hook allows test files with markers
- [ ] GitHub Actions workflow runs on PRs
- [ ] GitHub Actions comments on PRs with findings
- [ ] `scan-git-history.sh` runs without errors
- [ ] `scan-git-history.sh --full` completes
- [ ] Secrets in .gitignore files are not flagged
- [ ] Team can commit normally without false positives

---

## References

- [.secrets-patterns](/.secrets-patterns)
- [.git/hooks/pre-commit](/.git/hooks/pre-commit)
- [.github/workflows/secrets-scan.yml](/.github/workflows/secrets-scan.yml)
- [scripts/scan-git-history.sh](/scripts/scan-git-history.sh)
- [SECURITY_HARDENING_COMPLETE.md](/docs/SECURITY_HARDENING_COMPLETE.md)

---

**Document Version:** 1.0  
**Last Updated:** 2026-02-12 20:45 GMT+1  
**Author:** Hektor (COO Agent)  
**Status:** ✅ Complete
