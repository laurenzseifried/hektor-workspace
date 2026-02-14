# Token Savings Operations Checklist

**Weekly & Monthly Review Protocol**

Monitor and verify all token optimization strategies are working as intended.

---

## WEEKLY REVIEW (10 min)

### Section 1: Core Optimizations Status

| Optimization | Status | Check Method | Notes |
|---|---|---|---|
| Model Routing (85/15 Haiku/Sonnet) | ☐ Active | Check request logs | Should see mostly Haiku |
| Prompt Caching (1h, "long") | ☐ Active | Anthropic dashboard | Check cache hit rate |
| Session Clearing (/clear commands) | ☐ Active | Check telegram logs | Manual only (no auto yet) |
| Auto-Clear (30 warn, 50 reset) | ☐ Active | tail gateway-proxy logs | Watch for AUTO-CLEAR events |
| Persistent Memory (4 files) | ☐ Active | Check /project/ files | identity, context, tasks, log |
| Response Limiting | ☐ Active | Monitor reply tokens | Should be <100 avg |
| Deduplication Guard | ☐ Active | API call logs | No redundant calls |
| Context Pruning (daily cron) | ☐ Active | Check pruning.log | Should run at 04:00 UTC |

**Quick Check:**
```bash
# Check last auto-clear event
tail -50 services/gateway-proxy/stdout.log | grep "AUTO-CLEAR"

# Check persistent memory files
wc -c project/*.md  # Should total ~2-3KB

# Check pruning log
tail -20 memory/pruning.log

# Check model routing
curl -s http://127.0.0.1:18789/api/metrics | jq '.models' 2>/dev/null || echo "Metrics not available"
```

### Section 2: File Sizes (MUST stay within limits)

| File | Max Tokens | Est. Current | Status | Action if Over |
|---|---|---|---|---|
| identity.md | 500 | _____ | ☐ OK ☐ OVER | Archive to /project/archive/ |
| context.md | 800 | _____ | ☐ OK ☐ OVER | Compress + remove old entries |
| tasks.md | 600 | _____ | ☐ OK ☐ OVER | Archive completed, delete >7d |
| log.md | 400 | _____ | ☐ OK ☐ OVER | Keep last 20 entries only |
| **TOTAL** | **2300** | _____ | ☐ OK ☐ OVER | Run pruning.sh manually |

**Check Sizes:**
```bash
# Rough token count (1 token ≈ 4 chars)
for f in project/{identity,context,tasks,log}.md; do
  chars=$(wc -c < "$f")
  tokens=$((chars / 4))
  echo "$f: $chars chars ≈ $tokens tokens"
done

# Total
du -c project/*.md | tail -1
```

### Section 3: Session Health (Per User)

| User | Avg Msgs/Session | Max Msgs Reached | Auto-Clears This Week | Status |
|---|---|---|---|---|
| Hektor | _____ | _____ | _____ | ☐ OK |
| Scout | _____ | _____ | _____ | ☐ OK |

**Check:**
```bash
# Sessions that hit auto-clear
tail -100 services/gateway-proxy/stdout.log | grep "TRIGGERED" | wc -l

# Average messages before auto-clear
tail -1000 services/gateway-proxy/stdout.log | grep "Msg #" | awk '{print $NF}' | sort -n | tail -5
```

---

## MONTHLY DETAILED REVIEW (45 min)

### Section 1: Cost Analysis (20 min)

**Monthly Spend Breakdown:**

| Category | Budget | Actual | % Used | Status |
|---|---|---|---|---|
| Haiku (85% of requests) | $_____ | $_____ | __% | ☐ On Budget |
| Sonnet (15% of requests) | $_____ | $_____ | __% | ☐ On Budget |
| Opus (<2% of requests) | $_____ | $_____ | __% | ☐ On Budget |
| **TOTAL** | **$200** | **$_____** | **__%** | ☐ On Budget |

**Detailed Report:**
```bash
# Get detailed metrics from Anthropic dashboard
echo "=== MONTHLY COST ANALYSIS ==="
echo "1. Visit: https://console.anthropic.com/account/usage"
echo "2. Check last 30 days"
echo "3. Record by model:"
echo "   - claude-haiku-4-5: $_____ (should be ~$150-170)"
echo "   - claude-sonnet-4-5: $_____ (should be ~$20-30)"
echo "   - claude-opus-4-6: $_____ (should be <$5)"
echo ""
echo "4. Check Cache Hit Rate:"
echo "   - Cache Read Tokens: _____ (should be high)"
echo "   - Cache Write Tokens: _____ (setup cost)"
echo "   - Estimated Cache Savings: ~90% on hits"
```

**Token Metrics:**

| Metric | Last Month | This Month | Trend | Target |
|---|---|---|---|---|
| Input tokens (total) | _____ | _____ | ↑ ↓ → | <10M |
| Output tokens (total) | _____ | _____ | ↑ ↓ → | <2M |
| Cache read tokens | _____ | _____ | ↑ ↓ → | >50% of input |
| Cache write tokens | _____ | _____ | → | <1% of input |
| Avg tokens/request | _____ | _____ | ↓ → | <2000 |

### Section 2: Model Routing Audit (10 min)

**Verify 85/15 Split:**

```bash
# Check request distribution (if available in logs)
tail -10000 /path/to/request/logs | \
  grep -o 'model: [^ ]*' | \
  sort | uniq -c | \
  sort -rn

# Should show roughly:
# ~8500 haiku (85%)
# ~1400 sonnet (15%)
# <100 opus (<2%)
```

| Model | Target % | Actual % | Status | Adjustment Needed? |
|---|---|---|---|---|
| Haiku | 85% | __% | ☐ OK ☐ OVER ☐ UNDER | ☐ Yes → ____ |
| Sonnet | 15% | __% | ☐ OK ☐ OVER ☐ UNDER | ☐ Yes → ____ |
| Opus | <2% | __% | ☐ OK ☐ OVER ☐ UNDER | ☐ Yes → ____ |

**If routing off:**
- Check AGENTS.md for routing rules
- Verify model assignments in config
- Test with direct API call to confirm model used

### Section 3: Session Clearing Effectiveness (10 min)

**Session Statistics:**

| Metric | Target | Actual | Status |
|---|---|---|---|
| Avg session length (msgs) | <40 | _____ | ☐ OK |
| Sessions that cleared at 30 msgs | N/A | _____ | ☐ Tracked |
| Sessions that auto-cleared at 50 msgs | N/A | _____ | ☐ Tracked |
| Manual /clear commands used | Any amount | _____ | ☐ OK |

**Effectiveness Calculation:**

```
Baseline (no clearing):
- 50 msgs @ 100 tokens/msg = 5,000 tokens
- Cost: ~$0.075 (Haiku)

With auto-clear at 50:
- 50 msgs @ 100 tokens/msg = 5,000 tokens
- After clear: conversation history gone
- Next message: ~500 tokens (memory only)
- Ongoing: <100 tokens/msg (memory cached)
- 7-day cost savings: ~$0.35 (vs $0.525)
- Monthly savings: ~$1.50 per session × N sessions
```

**Example:**
If you have 20 active sessions/month averaging 40 msgs each:
- Without clearing: 20 × 40 × 100 × $0.00025 = $20/month
- With clearing: 20 × 25 × 100 × $0.00025 = $12.50/month
- **Savings: $7.50/month per optimization tier**

### Section 4: Persistent Memory Audit (10 min)

**File Content Verification:**

Check each file is current and compressed:

```bash
echo "=== IDENTITY.MD ==="
head -5 project/identity.md
echo ""
echo "=== CONTEXT.MD (first 3 lines, last 3 lines) ==="
head -3 project/context.md
echo "..."
tail -3 project/context.md
echo ""
echo "=== TASKS.MD (active tasks only) ==="
grep "^\- \[" project/tasks.md | head -10
echo ""
echo "=== LOG.MD (last 5 entries) ==="
tail -5 project/log.md
```

**Quality Checks:**

| File | Has Info | Compressed | Recent | Status |
|---|---|---|---|---|
| identity.md | ☐ Yes ☐ Missing | ☐ <200 chars ☐ Bloated | ☐ Current | ☐ OK |
| context.md | ☐ Yes ☐ Missing | ☐ <500 chars ☐ Bloated | ☐ Current | ☐ OK |
| tasks.md | ☐ Yes ☐ Missing | ☐ <400 chars ☐ Bloated | ☐ Current | ☐ OK |
| log.md | ☐ Yes ☐ Missing | ☐ <300 chars ☐ Bloated | ☐ Last 20 | ☐ OK |

**If bloated:**
```bash
# Run manual pruning
bash scripts/context-pruning.sh

# Check result
wc -c project/*.md
```

### Section 5: Response Length Compliance (5 min)

Spot-check replies from last week to ensure token limits:

| Response Type | Limit | Example | Actual Tokens | Status |
|---|---|---|---|---|
| Quick answer | <30 tokens | "Yes" / "Done" | _____ | ☐ OK ☐ OVER |
| Standard reply | <100 tokens | "Done. Next?" | _____ | ☐ OK ☐ OVER |
| Detailed | <200 tokens | Full explanation | _____ | ☐ OK ☐ OVER |

**Check Sample:**
```bash
# Look at recent telegram responses from Hektor
# Count approximate tokens per reply:
# 1 token ≈ 4 characters in English

# Examples:
# "Done ✅" = 10 chars ≈ 2 tokens ✅
# "Status: All systems online, backup running, costs on budget." = 65 chars ≈ 16 tokens ✅
# "[Long explanation paragraph...]" = 500 chars ≈ 125 tokens ⚠️ (borderline)
```

### Section 6: Deduplication Guard Audit (5 min)

**Goal:** Never refetch or regenerate info we already have.

Check logs for patterns:

```bash
# Should NOT see:
# - Same API call twice in 1 session
# - Same question answered twice
# - Duplicate memory_search calls

# Example GOOD:
# [Session 1] memory_search("deployment status") → found in cache
# [Session 1] Use cached result, no re-query ✅

# Example BAD:
# [Session 1] web_search("weather") → got result
# [Session 2] web_search("weather") again → should have cached! ❌
```

| Pattern | Found? | Fix |
|---|---|---|
| Redundant API calls in same session | ☐ No ☐ Yes | Review cache logic |
| Regenerated responses | ☐ No ☐ Yes | Add reference instead |
| Duplicate memory searches | ☐ No ☐ Yes | Implement dedup check |

---

## MONTHLY TREND TRACKING

### Token Cost Trends

```
Month    | Total Cost | Trend | Haiku % | Cache Hit % | Status
---------|-----------|-------|---------|-------------|--------
Jan 2026 | $____      | -     | ___%    | ___%        | Baseline
Feb 2026 | $____      | ↓     | ___%    | ___%        | Caching+Routing
Mar 2026 | $____      | ↓     | ___%    | ___%        | Target <$200
Apr 2026 | $____      | →     | ___%    | ___%        | Stable
```

### Session Health Trends

```
Month    | Avg Session Length | Auto-Clears | Manual Clears | Warnings
---------|-------------------|-------------|---------------|----------
Jan 2026 | _____ msgs        | _____ x     | _____ x       | _____ x
Feb 2026 | _____ msgs        | _____ x     | _____ x       | _____ x
Mar 2026 | _____ msgs        | _____ x     | _____ x       | _____ x
```

### Memory File Health

```
Month    | Total Size | Bloat Issues | Pruning Runs | Action Items
---------|-----------|--------------|--------------|---------------
Jan 2026 | ___ KB    | _____        | _____ x      | _____________
Feb 2026 | ___ KB    | _____        | _____ x      | _____________
Mar 2026 | ___ KB    | _____        | _____ x      | _____________
```

---

## QUARTERLY DEEP-DIVE (Q1/Q2/Q3/Q4)

Run once per quarter for comprehensive analysis:

- [ ] ROI analysis: Total savings vs. implementation cost
- [ ] Scaling assessment: Can current system handle 2x load?
- [ ] New opportunities: Any new token-saving strategies available?
- [ ] Competitor analysis: Are we using latest cost-saving features?
- [ ] Feedback from users: Any pain points with auto-clearing or limits?
- [ ] Architecture review: Should we add more caching layers?

---

## ESCALATION & ACTION ITEMS

**If Token Costs Rise:**

1. Check model routing (might be using Sonnet too much)
2. Check cache hit rate (if <50%, investigate why)
3. Check session length (if avg >50, auto-clear might be off)
4. Check memory files (if bloated, pruning might be failing)
5. If still high, escalate to Laurenz for investigation

**Common Issues & Fixes:**

| Issue | Symptom | Fix |
|---|---|---|
| Cache not working | Cache hit % = 0% | Verify cacheRetention="long" in config |
| Model routing off | Mostly Sonnet/Opus | Check model routing rules in AGENTS.md |
| Session clearing off | Sessions >100 msgs | Verify gateway-proxy running on port 8000 |
| Memory bloated | context.md >800 tokens | Run context-pruning.sh manually |
| Response length over | Replies >200 tokens | Check SOUL.md response limits |

---

## NOTES

**Weekly Review Time:** Every Friday 15:00 UTC  
**Monthly Review Time:** First Monday of month, 14:00 UTC  
**Quarterly Review:** First week of Jan/Apr/Jul/Oct  

**Reviewer:** Laurenz (or delegated)  
**Document Location:** `/docs/TOKEN-SAVINGS-CHECKLIST.md`

**Last Review:** [DATE]  
**Next Review:** [DATE]  
**Reviewer Name:** ________________

---

## QUICK REFERENCE: Token Savings Stack

```
All Strategies Combined = 90-97% Savings

✅ Session Clearing        90% reduction per clear
✅ Persistent Memory       70% reduction (no re-explain)
✅ Context Compression     75% reduction (lean files)
✅ Model Routing (85/15)   85% reduction (Haiku cheap)
✅ Response Limiting       83% reduction (short replies)
✅ Prompt Caching (1h)     90% reduction (cache hits)
✅ Auto-Clear (50 msgs)    Prevents token creep
✅ Deduplication Guard     60% reduction (no refetch)
✅ Daily Pruning           40% reduction (cleanup)

Expected Monthly Cost: $45-150 (vs $1,500 baseline)
```

