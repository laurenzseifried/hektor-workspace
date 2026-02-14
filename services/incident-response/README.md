# Incident Response System

Automated detection & response for security incidents, cost anomalies, and service degradation.

## Quick Start

```bash
cp com.openclaw.incident-response.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.openclaw.incident-response.plist
curl http://127.0.0.1:9001/health
```

## Detection

Auto-detects:
- **Key Compromise**: Unusual IP/geography usage
- **Brute Force**: 10+ failed logins in 5 min from same IP
- **Cost Anomaly**: Spend > 3x rolling 7-day average
- **Data Exfiltration**: Response size > 5x normal
- **Service Degradation**: Error rate > 10% or latency > 5s avg

## Automatic Responses

| Incident | Response |
|----------|----------|
| Key Compromise | Disable key, block IP, alert |
| Brute Force | Block IP, enable CAPTCHA if distributed |
| Cost Anomaly | Activate soft breaker, downgrade models |
| Data Exfiltration | Disable key, alert |
| Service Degradation | Alert, track metrics |

## Admin Endpoints

```bash
GET /admin/incidents?type=key_compromise&severity=critical
GET /admin/incidents/:id
POST /admin/incidents/:id/resolve -d '{"notes":"..."}'

# KILL SWITCH
POST /admin/killswitch -d '{"confirm":"KILLSWITCH_CONFIRMED"}'
POST /admin/killswitch/release -d '{"confirm":"KILLSWITCH_RELEASE_CONFIRMED"}'
```

**Port**: 9001  
**Requires**: Bearer token auth
