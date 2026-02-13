# Setup Guide: Automated Secrets Scanning

## Quick Start (5 minutes)

### Step 1: Verify Installation

```bash
cd /Users/laurenz/.openclaw/workspace

# Check pre-commit hook is executable
ls -la .git/hooks/pre-commit
# Expected: -rwxr-xr-x ... .git/hooks/pre-commit

# Check patterns file exists
ls -la .secrets-patterns
# Expected: -rw-r--r-- ... .secrets-patterns

# Check GitHub Actions workflow
ls -la .github/workflows/secrets-scan.yml
# Expected: -rw-r--r-- ... .github/workflows/secrets-scan.yml

# Check history scanner script
ls -la scripts/scan-git-history.sh
# Expected: -rwxr-xr-x ... scripts/scan-git-history.sh
```

### Step 2: Test Pre-Commit Hook

```bash
# Create a test file with a fake API key
echo "api_key = 'sk-ant-faketoken1234567890abcdefgh'" > test-api.txt

# Try to commit it
git add test-api.txt
git commit -m "test commit"

# Expected: Commit BLOCKED with error
# [ERROR] SECRETS DETECTED IN STAGED FILES
# FILE: test-api.txt
# PATTERN: sk-ant-[a-zA-Z0-9]{20,}

# Clean up
git reset HEAD test-api.txt
rm test-api.txt
```

### Step 3: Test History Scanner

```bash
# Scan last 10 commits
./scripts/scan-git-history.sh --limit 10

# Expected: Report showing commits scanned, secrets found (should be 0)
```

### Step 4: Commit Changes

```bash
# Add all security scanning infrastructure to git
git add .secrets-patterns
git add .git/hooks/pre-commit
git add .github/workflows/secrets-scan.yml
git add scripts/scan-git-history.sh
git add docs/AUTOMATED_SECRETS_SCANNING.md
git add docs/SETUP_AUTOMATED_SECRETS_SCANNING.md

# Commit (pre-commit hook will verify no real secrets)
git commit -m "Add automated secrets scanning infrastructure"

# Push to GitHub
git push origin main
```

## Detailed Setup

### For Local Development

```bash
# No additional setup needed! The pre-commit hook is auto-installed.
# It will run automatically on every commit.

# To verify it works:
git log --all --oneline -- .git/hooks/pre-commit
# Should show the hook file in git history
```

### For GitHub Actions

1. **Verify the workflow file exists:**
   ```bash
   cat .github/workflows/secrets-scan.yml | head -20
   ```

2. **Commit and push the workflow:**
   ```bash
   git add .github/workflows/secrets-scan.yml
   git commit -m "Add GitHub Actions secrets scanning"
   git push origin main
   ```

3. **Test the workflow:**
   - Go to GitHub repo → Actions tab
   - Create a test PR with a fake secret
   - Watch the workflow run
   - Verify it blocks the PR and comments

### For Team Members

```bash
# When team members clone the repo:
git clone <repo>
cd <repo>

# Pre-commit hook auto-runs on first commit attempt
# (they don't need to do anything)

# They can verify it's working:
.git/hooks/pre-commit --version 2>/dev/null || echo "Hook installed"
```

---

## Verification Checklist

After setup, verify everything works:

### ✅ Pre-Commit Hook
```bash
# Test 1: Hook blocks real secret patterns
echo "sk-ant-faketoken1234567890abcdefgh" > test.txt
git add test.txt
git commit -m "test"  # Should FAIL
rm test.txt && git reset HEAD test.txt

# Test 2: Hook allows .env.example
echo "API_KEY=sk-ant-example-replace-me" > .env.example
git add .env.example
git commit -m "Add .env.example"  # Should SUCCEED
```

### ✅ GitHub Actions Workflow
```bash
# Test 1: Workflow file is valid YAML
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/secrets-scan.yml'))"

# Test 2: Workflow uses correct triggers
grep -A5 "on:" .github/workflows/secrets-scan.yml | grep -E "pull_request|push"
```

### ✅ History Scanner Script
```bash
# Test 1: Script is executable
test -x scripts/scan-git-history.sh && echo "✅ Executable"

# Test 2: Script can scan history
./scripts/scan-git-history.sh --check-only && echo "✅ Ready to scan"

# Test 3: Script can generate report
./scripts/scan-git-history.sh --limit 5 --output /tmp/test-report.txt
test -f /tmp/test-report.txt && echo "✅ Report generated"
```

### ✅ Patterns File
```bash
# Test 1: Patterns file is readable
test -r .secrets-patterns && echo "✅ Readable"

# Test 2: Patterns file has content
wc -l .secrets-patterns | awk '{if ($1 > 10) print "✅ Has" $1 "patterns"; else print "❌ Not enough patterns"}'

# Test 3: Sample pattern works
echo "sk-ant-reallylongfaketokenstring123456" | grep -f <(grep "sk-ant" .secrets-patterns)
```

---

## Daily Usage

### For Developers

```bash
# Just commit normally - hook runs automatically
git add <files>
git commit -m "Your message"

# If pre-commit hook blocks:
# 1. Remove the secret from the file
# 2. Use .env.example for non-secret values
# 3. Try commit again

# If you're SURE it's a false positive:
git commit --no-verify  # Bypass hook (use sparingly!)
```

### For CI/CD

```bash
# On GitHub (automatic):
# 1. Create PR
# 2. GitHub Actions runs secrets scan
# 3. If secrets found:
#    - Workflow fails
#    - PR gets comment with details
#    - PR cannot be merged
# 4. Fix the issue and push
# 5. Workflow re-runs automatically
```

### For Audits

```bash
# Weekly audit of last 100 commits
./scripts/scan-git-history.sh --limit 100 --output audit-$(date +%Y%m%d).md

# Monthly audit of entire history
./scripts/scan-git-history.sh --full --output audit-full-$(date +%Y%m%d).md

# Emergency: If secrets are suspected
./scripts/scan-git-history.sh --full --fix --output emergency-audit.md
```

---

## Maintenance

### Update Patterns (Monthly)

```bash
# Review and update .secrets-patterns
# Add new API key formats as they emerge
vi .secrets-patterns

# Test with sample secrets
echo "new-secret-format-xyz" > test.txt
git add test.txt
git commit -m "test"  # Should block

# Commit updated patterns
git add .secrets-patterns
git commit -m "Update secret patterns"
git push origin main
```

### Review Logs (Weekly)

```bash
# Check if any commits were blocked
git log --oneline --all -- | grep -i "secret\|fix\|remove"

# Check GitHub Actions results
# (GitHub → Actions tab → Secrets Scan workflow)
```

### Rotate Compromised Secrets (If Needed)

If a secret leaks in git history:

```bash
# 1. Rotate the credential immediately
# (in provider dashboard)

# 2. Clean git history
brew install bfg
bfg --delete-files .env .

# 3. Force push (DANGEROUS - rewrites history)
git push origin --force-with-lease --all

# 4. Notify team to re-clone
# (they'll get the cleaned history)
```

---

## Troubleshooting

### Pre-Commit Hook Not Running

```bash
# Check if installed
ls -la .git/hooks/pre-commit

# Check if executable
chmod +x .git/hooks/pre-commit

# Check if git hooks are enabled
git config core.hooksPath

# Test manually
.git/hooks/pre-commit
```

### GitHub Actions Workflow Not Running

```bash
# Check syntax
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/secrets-scan.yml'))"

# Check file is in main branch
git log --all -- .github/workflows/secrets-scan.yml

# Go to GitHub and manually trigger
# (Actions tab → Secrets Scan → Run workflow)
```

### History Scanner Hangs

```bash
# Run with timeout
timeout 60 ./scripts/scan-git-history.sh --limit 10

# Or scan smaller range
./scripts/scan-git-history.sh --limit 5
```

### False Positives

```bash
# Option 1: Add placeholder marker to line
# Change: const token = "sk-ant-real-looking-string"
# To: const token = "sk-ant-EXAMPLE-replace-me-in-env"

# Option 2: Move to .env.example
# .env.example (never committed)
# API_KEY=sk-ant-example-replace-me

# Option 3: Update .secrets-patterns to be more specific
vi .secrets-patterns
```

---

## Integration Examples

### With VS Code

Create `.vscode/settings.json`:
```json
{
  "git.ignoreLimitWarning": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.exclude": {
    ".env": true,
    "**/.env.local": true
  }
}
```

### With GitHub Branch Protection

1. Go to repo Settings → Branches
2. Add rule for `main`
3. Enable: "Require status checks to pass before merging"
4. Select: "Secrets Scan" workflow
5. Now PR cannot be merged if scan fails ✅

### With Slack Notifications

Create `.github/workflows/secrets-scan.yml` with:
```yaml
- name: Notify Slack on Failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
    payload: |
      {
        "text": "⚠️ Secrets detected in PR #${{ github.event.pull_request.number }}"
      }
```

---

## Best Practices Summary

✅ **DO:**
- Use `.env.example` with placeholders
- Keep secrets in `.env` (in .gitignore)
- Rotate secrets immediately if leaked
- Test pre-commit hook regularly
- Review history scans monthly
- Add new patterns as new APIs emerge

❌ **DON'T:**
- Commit real secrets (ever!)
- Use `git commit --no-verify` casually
- Hardcode tokens in source files
- Ignore GitHub Actions failures
- Delay history scanning
- Skip team notifications if secrets leaked

---

## Support

For issues or questions:

1. **Pre-commit hook problems?** → Check `.git/hooks/pre-commit` is executable
2. **GitHub Actions not running?** → Check `.github/workflows/secrets-scan.yml` syntax
3. **History scanner issues?** → Run `./scripts/scan-git-history.sh --check-only`
4. **False positives?** → Add placeholder marker or move to .env.example

---

**Setup Complete!** ✅

Your repository is now protected from accidental secret leaks at three levels:
- 🔒 Pre-commit: Stops commits locally
- 🔒 CI/CD: Stops PRs on GitHub
- 🔒 Audit: Detects leaks in history

Start using it immediately with no additional setup!

---

**Last Updated:** 2026-02-12 20:50 GMT+1  
**Version:** 1.0
