/**
 * Incident Detection — Anomaly detection for security events
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INCIDENTS_FILE = path.join(__dirname, '.incidents.json');

export const INCIDENT_TYPES = {
  KEY_COMPROMISE: 'key_compromise',
  BRUTE_FORCE: 'brute_force',
  COST_ANOMALY: 'cost_anomaly',
  DATA_EXFILTRATION: 'data_exfiltration',
  SERVICE_DEGRADATION: 'service_degradation',
};

export const SEVERITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
};

async function loadIncidents() {
  try {
    const data = await fs.readFile(INCIDENTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { incidents: [], lastDetection: {} };
  }
}

async function saveIncidents(data) {
  await fs.writeFile(INCIDENTS_FILE, JSON.stringify(data, null, 2));
}

/**
 * Detect key compromise (unusual IP/geography)
 */
export async function detectKeyCompromise(apiKey, currentIP, lastKnownIP, lastUsageTime) {
  if (!lastKnownIP || lastKnownIP === currentIP) return null;
  
  const timeSinceLastUse = Date.now() - lastUsageTime;
  if (timeSinceLastUse < 60000) return null; // Same minute = probably ok
  
  return {
    type: INCIDENT_TYPES.KEY_COMPROMISE,
    severity: SEVERITY.CRITICAL,
    api_key: apiKey.slice(0, 4) + '...' + apiKey.slice(-4),
    previous_ip: lastKnownIP,
    current_ip: currentIP,
    time_since_last_use: timeSinceLastUse,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Detect brute force (10+ failed logins from same IP in 5 min)
 */
export async function detectBruteForce(loginAttempts) {
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
  const recent = loginAttempts.filter(a => a.timestamp > fiveMinutesAgo);
  
  const byIP = {};
  for (const attempt of recent) {
    byIP[attempt.ip] = (byIP[attempt.ip] || 0) + 1;
  }
  
  const incidents = [];
  for (const [ip, count] of Object.entries(byIP)) {
    if (count >= 10) {
      incidents.push({
        type: INCIDENT_TYPES.BRUTE_FORCE,
        severity: SEVERITY.CRITICAL,
        source_ip: ip,
        attempt_count: count,
        timeframe: '5 minutes',
        timestamp: new Date().toISOString(),
      });
    }
  }
  
  return incidents;
}

/**
 * Detect cost anomaly (spend > 3x rolling 7-day average)
 */
export async function detectCostAnomaly(currentHourCost, sevenDayAverage) {
  const threshold = sevenDayAverage * 3;
  
  if (currentHourCost > threshold) {
    return {
      type: INCIDENT_TYPES.COST_ANOMALY,
      severity: SEVERITY.HIGH,
      current_hour_cost: currentHourCost,
      seven_day_average: sevenDayAverage,
      threshold: threshold,
      multiplier: (currentHourCost / sevenDayAverage).toFixed(2),
      timestamp: new Date().toISOString(),
    };
  }
  
  return null;
}

/**
 * Detect data exfiltration (unusually large responses)
 */
export async function detectDataExfiltration(responseSize, apiKey, averageSize) {
  const threshold = Math.max(averageSize * 5, 1000000); // 5x average or 1MB
  
  if (responseSize > threshold) {
    return {
      type: INCIDENT_TYPES.DATA_EXFILTRATION,
      severity: SEVERITY.HIGH,
      api_key: apiKey.slice(0, 4) + '...' + apiKey.slice(-4),
      response_size: responseSize,
      threshold: threshold,
      times_normal: (responseSize / averageSize).toFixed(2),
      timestamp: new Date().toISOString(),
    };
  }
  
  return null;
}

/**
 * Detect service degradation (error rate > 10%, latency > 5s)
 */
export async function detectServiceDegradation(recentRequests) {
  if (recentRequests.length < 100) return null;
  
  const errors = recentRequests.filter(r => r.status >= 400).length;
  const errorRate = errors / recentRequests.length;
  
  const avgLatency = recentRequests.reduce((sum, r) => sum + r.latency, 0) / recentRequests.length;
  
  const incidents = [];
  
  if (errorRate > 0.1) {
    incidents.push({
      type: INCIDENT_TYPES.SERVICE_DEGRADATION,
      severity: SEVERITY.HIGH,
      issue: 'high_error_rate',
      error_rate: (errorRate * 100).toFixed(2) + '%',
      total_requests: recentRequests.length,
      timestamp: new Date().toISOString(),
    });
  }
  
  if (avgLatency > 5000) {
    incidents.push({
      type: INCIDENT_TYPES.SERVICE_DEGRADATION,
      severity: SEVERITY.MEDIUM,
      issue: 'high_latency',
      avg_latency_ms: Math.round(avgLatency),
      threshold_ms: 5000,
      timestamp: new Date().toISOString(),
    });
  }
  
  return incidents;
}

/**
 * Record incident
 */
export async function recordIncident(incident) {
  const data = await loadIncidents();
  
  const fullIncident = {
    id: `inc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...incident,
    detected_at: new Date().toISOString(),
    resolved: false,
    timeline: [
      {
        timestamp: new Date().toISOString(),
        event: 'detected',
        details: incident,
      },
    ],
  };
  
  data.incidents.push(fullIncident);
  await saveIncidents(data);
  
  return fullIncident;
}

/**
 * Get all incidents
 */
export async function getIncidents(filters = {}) {
  const data = await loadIncidents();
  let incidents = data.incidents;
  
  if (filters.type) {
    incidents = incidents.filter(i => i.type === filters.type);
  }
  if (filters.severity) {
    incidents = incidents.filter(i => i.severity === filters.severity);
  }
  if (filters.resolved !== undefined) {
    incidents = incidents.filter(i => i.resolved === filters.resolved);
  }
  
  return incidents.sort((a, b) => new Date(b.detected_at) - new Date(a.detected_at));
}

/**
 * Get incident by ID
 */
export async function getIncident(incidentId) {
  const data = await loadIncidents();
  return data.incidents.find(i => i.id === incidentId);
}

/**
 * Resolve incident
 */
export async function resolveIncident(incidentId, notes) {
  const data = await loadIncidents();
  const incident = data.incidents.find(i => i.id === incidentId);
  
  if (incident) {
    incident.resolved = true;
    incident.resolved_at = new Date().toISOString();
    incident.resolution_notes = notes;
    incident.timeline.push({
      timestamp: new Date().toISOString(),
      event: 'resolved',
      notes,
    });
    
    await saveIncidents(data);
  }
  
  return incident;
}
