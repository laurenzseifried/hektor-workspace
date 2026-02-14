# OpenClaw Disaster Recovery Runbook

**Target RTO (Recovery Time Objective): < 4 hours**  
**Target RPO (Recovery Point Objective): < 6 hours**

---

## Pre-Disaster Checklist (Do Monthly)

- [ ] Verify S3 bucket exists and backups are uploading
- [ ] Test full recovery procedure on staging
- [ ] Confirm all credentials are accessible
- [ ] Review and update this runbook

---

## Disaster Scenarios & Recovery Steps

### Scenario 1: Database Corruption or Data Loss

**Time to recover: 30-45 minutes**

**Step 1: Assess Damage**
```bash
# Check database health
psql $DATABASE_URL -c "SELECT version();"

# Count records
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
```

**Step 2: Choose Backup**
```bash
# List available backups
aws s3 ls s3://openclaw-backups/db-backups/ --region us-east-1

# Select most recent: db-full-YYYYMMDD-HHMMSS.sql.gz.gpg
```

**Step 3: Recover**
```bash
# Run recovery script with chosen backup
bash /Users/laurenz/.openclaw/workspace/scripts/backup-recovery/recover.sh \
  db-full-20260213-020000.sql.gz.gpg openclaw_restored
```

**Step 4: Verify**
```bash
# Test application against restored DB
export DATABASE_URL="postgresql://user:pass@localhost:5432/openclaw_restored"
curl http://127.0.0.1:8000/health
```

**Step 5: Switchover** (only if verified)
```bash
# Backup current DB
pg_dump $DATABASE_URL | gzip > /tmp/db-failed-$(date +%s).sql.gz

# Stop applications
launchctl unload ~/Library/LaunchAgents/com.openclaw.*.plist

# Rename restored DB
psql -c "ALTER DATABASE openclaw RENAME TO openclaw_corrupted;"
psql -c "ALTER DATABASE openclaw_restored RENAME TO openclaw;"

# Restart applications
launchctl load ~/Library/LaunchAgents/com.openclaw.*.plist
```

---

### Scenario 2: Complete Server Failure (Total Loss)

**Time to recover: 2-4 hours**

**Step 1: Provision New Server**
- Use same specs as original
- Install OpenClaw + dependencies
- Configure network access

**Step 2: Restore Configuration**
```bash
# Get latest config backup
aws s3 cp s3://openclaw-backups/config-backups/config-*.tar.gz.gpg . \
  --region us-east-1

# Decrypt
gpg --decrypt --passphrase-file <(echo $BACKUP_ENCRYPTION_KEY) \
  --output config.tar.gz config-*.tar.gz.gpg

# Extract (review before applying!)
tar tzf config.tar.gz | head -20
tar xzf config.tar.gz -C /
```

**Step 3: Restore Database**
```bash
# Follow database recovery above
bash recover.sh db-full-YYYYMMDD-HHMMSS.sql.gz.gpg openclaw
```

**Step 4: Restart Services**
```bash
launchctl load ~/Library/LaunchAgents/com.openclaw.*.plist
sleep 10
openclaw status
```

**Step 5: Verify**
```bash
# Health check all services
curl http://127.0.0.1:8000/health
curl http://127.0.0.1:3005/status
curl http://127.0.0.1:9000/health
```

---

## Required Credentials & Where to Find Them

| Credential | Location | Used For |
|-----------|----------|----------|
| `DATABASE_URL` | `~/.openclaw/.env` | PostgreSQL connection |
| `BACKUP_ENCRYPTION_KEY` | `~/.openclaw/.env` (separate, not in repo) | GPG decryption |
| `AWS_ACCESS_KEY_ID` | `~/.aws/credentials` | S3 access |
| `AWS_SECRET_ACCESS_KEY` | `~/.aws/credentials` | S3 access |
| `BACKUP_S3_BUCKET` | `~/.openclaw/.env` | S3 bucket name |
| GPG private key | `~/.gnupg/` | Decrypt backups |

**Critical: Store credentials in secure password manager (1Password, etc.)**

---

## Health Checks After Recovery

```bash
# 1. Database
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"

# 2. Gateway
curl http://127.0.0.1:8000/health

# 3. Cost breaker
curl http://127.0.0.1:3003/health

# 4. Security logger
curl http://127.0.0.1:9000/health

# 5. Incident response
curl http://127.0.0.1:9001/health

# 6. Model inference (test)
curl -X POST http://127.0.0.1:8000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"hello"}],"model":"anthropic/claude-haiku-4-5"}'
```

---

## Rollback Procedure (If Recovery Fails)

```bash
# 1. Stop services
launchctl unload ~/Library/LaunchAgents/com.openclaw.*.plist

# 2. Restore original DB name
psql -c "ALTER DATABASE openclaw_corrupted RENAME TO openclaw;"

# 3. Restart services
launchctl load ~/Library/LaunchAgents/com.openclaw.*.plist

# 4. Verify
openclaw status
```

---

## Post-Disaster Actions

- [ ] Document what went wrong
- [ ] Update this runbook with lessons learned
- [ ] Test recovery again
- [ ] Notify stakeholders
- [ ] Review backup retention policy

---

**Last Updated:** 2026-02-13  
**Next Review:** Monthly (first Monday)  
**Owner:** @ciphershell
