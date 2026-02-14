# Security Operations Checklist

**Weekly & Monthly Review Protocol**

Review this checklist **every week (quick)** and **every month (detailed)**.

---

## WEEKLY REVIEW (15 min)

### Section 1: Production Services Status

**7 Security Services Running:**

| Service | Port | Launchd Label | Check Command | Status |
|---------|------|---|---|---|
| Cost Circuit Breaker | 3003 | com.openclaw.cost-circuit-breaker | `curl http://127.0.0.1:3003/health` | ☐ OK ☐ DOWN |
| Prompt Injection Defense | 3004 | com.openclaw.prompt-injection-defense | `curl http://127.0.0.1:3004/health` | ☐ OK ☐ DOWN |
| API Orchestrator | 3005 | com.openclaw.api-orchestrator | `curl http://127.0.0.1:3005/health` | ☐ OK ☐ DOWN |
| Gateway Proxy | 8000 | com.openclaw.gateway-proxy | `curl http://127.0.0.1:8000/health` | ☐ OK ☐ DOWN |
| Security Logger | 9000 | com.openclaw.security-logger | `curl http://127.0.0.1:9000/admin/logs?limit=1` | ☐ OK ☐ DOWN |
| Incident Response | 9001 | com.openclaw.incident-response | `curl http://127.0.0.1:9001/admin/incidents?limit=1` | ☐ OK ☐ DOWN |
| Sub-Agent Webhook | 3001 | com.openclaw.subagent-webhook | `curl http://127.0.0.1:3001/health` | ☐ OK ☐ DOWN |

**Quick Check:**
```bash
for port in 3003 3004 3005 8000 9000 9001 3001; do
  echo -n "Port $port: "
  curl -s http://127.0.0.1:$port/health >/dev/null 2>&1 && echo "✅ UP" || echo "❌ DOWN"
done
```

### Section 2: Key Alerts & Thresholds

| Alert Type | Threshold | Status | Notes |
|---|---|---|---|
| Cost WARNING | $100/day | ☐ Checked | Circuit breaker active? |
| Cost SOFT | $250/day | ☐ Checked | Model downgrade triggered? |
| Cost HARD | $500/day | ☐ Checked | Only Haiku allowed? |
| Injection Attempts | 5+ in 15min | ☐ Checked | Quarantine active? |
| Failed Logins | 10+ in 5min | ☐ Checked | IP blocked? |
| Canary Token Leak | Any | ☐ Checked | CRITICAL triggered? |

**Check:**
```bash
# Security logs
tail -20 /Users/laurenz/.openclaw/workspace/services/security-logger/.logs/security.jsonl

# Incidents
curl http://127.0.0.1:9001/admin/incidents | jq '.incidents[-5:]'

# Cost state
curl http://127.0.0.1:3003/state
```

### Section 3: File Integrity

| File | Location | Last Check | Status | Notes |
|---|---|---|---|---|
| .env | ~/.env | ☐ | ☐ Intact ☐ Modified | Any token changes? |
| Config | ~/.openclaw/openclaw.json | ☐ | ☐ Intact ☐ Modified | Any security changes? |
| Costs DB | services/cost-circuit-breaker/.costs.json | ☐ | ☐ <1MB ☐ Bloated | Normal growth? |
| Incidents DB | services/incident-response/.incidents.json | ☐ | ☐ <1MB ☐ Bloated | Archive old? |

---

## MONTHLY DETAILED REVIEW (1 hour)

### Section 1: Security Audit (30 min)

**1.1: Firewall & Rate Limiting**
- [ ] Firewall rules still enforced (check iptables or pf)
- [ ] Rate limits per IP working (check logs for blocks)
- [ ] HTTPS/TLS certificate valid (if applicable)
- [ ] Security headers present (X-Content-Type-Options, CSP, etc.)

**1.2: Authentication & Authorization**
- [ ] RBAC roles still defined (admin, operator, viewer)
- [ ] Token rotation status (last rotated: ______)
- [ ] No hardcoded secrets in code (git scan)
- [ ] SSH keys rotated last _____ months ago

**1.3: Data Protection**
- [ ] Encryption keys secure (KMS/vault)
- [ ] PII detection active (redaction working)
- [ ] Data retention policies enforced
- [ ] Backup encryption verified (GPG keys intact)

**1.4: Audit Trails**
- [ ] Security logs retained (365 days)
- [ ] General logs retained (30 days)
- [ ] Log rotation working (check .logs/security.jsonl size)
- [ ] No log tampering detected

**1.5: Incident Response**
- [ ] Incident detection rules up-to-date
- [ ] Auto-remediation working (test with mock incident)
- [ ] Escalation contacts current (email, Telegram)
- [ ] Recovery procedures documented

**1.6: Backup & Disaster Recovery**
- [ ] Backups running on schedule (00:00 full, 6h incremental)
- [ ] Latest backup recoverable (test restore in staging)
- [ ] Backup encryption keys secured
- [ ] Recovery runbook updated

**Audit Commands:**
```bash
# Check log sizes
du -sh services/security-logger/.logs/*

# Check backup status
ls -lh /Users/laurenz/.openclaw/workspace/backups/ | tail -5

# Check encryption keys
openssl rand -hex 32 # Should be in .env

# Verify GPG
gpg --list-keys

# Test incident detection
curl -X POST http://127.0.0.1:9001/admin/incidents \
  -H "Content-Type: application/json" \
  -d '{"type":"test_incident","severity":"LOW"}'
```

### Section 2: Cost Analysis (15 min)

| Metric | Last Month | This Month | Trend | Target |
|---|---|---|---|---|
| Total API Cost | $_____ | $_____ | ↑ ↓ → | <$200 |
| Avg Cost/Day | $_____ | $_____ | ↑ ↓ → | <$6.50 |
| Haiku % | ___% | ___% | ↑ ↓ → | >80% |
| Sonnet % | ___% | ___% | ↑ ↓ → | <15% |
| Opus % | ___% | ___% | ↑ ↓ → | <5% |
| Cache Hit Rate | ___% | ___% | ↑ ↓ → | >50% |

**Cost Report:**
```bash
# Anthropic dashboard: Check costs last 30 days
# Check circuit breaker logs
tail -100 services/cost-circuit-breaker/stdout.log | grep "TRACK\|WARNING\|SOFT\|HARD"

# Estimate cache savings
echo "Cache hits save ~90% on token costs"
echo "If $200/month → Cache should save ~$180/month"
```

### Section 3: Compliance Check (10 min)

- [ ] GDPR compliance (data handling, retention)
- [ ] SOC 2 readiness (audit trails, access controls)
- [ ] Incident response tested in last 30 days
- [ ] Security documentation up-to-date
- [ ] Team has access to incident runbook
- [ ] Backup recovery tested in last 30 days

### Section 4: Action Items

**Issues Found This Month:**

| Issue | Severity | Action | Owner | Due |
|---|---|---|---|---|
| | P0/P1/P2 | | | |

---

## MONTHLY TREND TRACKING

### Cost Trends

```
Month    | Total  | Trend | Status
---------|--------|-------|--------
Jan 2026 | $_____ | -     | Baseline
Feb 2026 | $_____ | ↓     | Post-caching
Mar 2026 | $_____ | ↓     | Post-routing
Apr 2026 | $_____ | ↓     | Target: <$200
```

### Security Incidents

```
Month    | Incidents | Critical | Resolved | Resolution Time
---------|-----------|----------|----------|----------------
Jan 2026 |     0     |    0     |    0     | N/A
Feb 2026 |     0     |    0     |    0     | N/A
Mar 2026 |           |          |          |
```

### System Uptime

```
Month    | Uptime % | Downtime | Root Cause
---------|----------|----------|----------
Jan 2026 | 99.9%    | 10 min   | Restart
Feb 2026 | 99.95%   | 5 min    | Backup
Mar 2026 | ____%    | ___ min  |
```

---

## ESCALATION PROTOCOL

**If anything fails:**

1. **P0 (Critical):** Service down or breach detected
   - [ ] Alert to Telegram #alerts immediately
   - [ ] Contact Laurenz (SMS if no response in 5 min)
   - [ ] Document in incident log
   - [ ] Page on-call (Laurenz)

2. **P1 (High):** Threshold breached or unusual pattern
   - [ ] Log to #alerts
   - [ ] Investigate root cause
   - [ ] Update incident log
   - [ ] Notify within 1 hour

3. **P2 (Medium):** Minor issue, can wait
   - [ ] Log to #logs
   - [ ] Add to monthly review
   - [ ] Fix in next sprint

---

## NOTES

**Weekly Review Time:** Every Friday 16:00 UTC (or as needed)  
**Monthly Review Time:** First Monday of month, 10:00 UTC  
**Reviewer:** Laurenz (or delegated to team)  
**Document Location:** `/docs/SECURITY-OPERATIONS-CHECKLIST.md`

**Last Review:** [DATE]  
**Next Review:** [DATE]  
**Reviewer Name:** ________________

