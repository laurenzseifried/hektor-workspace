#!/usr/bin/env node

/**
 * Data Audit — Scan what data is stored where
 */

import fs from 'fs/promises';
import path from 'path';

const WORKSPACE = '/Users/laurenz/.openclaw/workspace';

async function scanDirectory(dir, pattern) {
  const files = [];
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        files.push(...await scanDirectory(fullPath, pattern));
      } else if (pattern.test(entry.name)) {
        const stats = await fs.stat(fullPath);
        files.push({
          path: fullPath.replace(WORKSPACE, ''),
          size: stats.size,
          modified: stats.mtime,
        });
      }
    }
  } catch (err) {
    // Skip inaccessible dirs
  }
  
  return files;
}

async function auditData() {
  console.log('🔍 Data Audit\n');
  
  // 1. Log files
  const logs = await scanDirectory(WORKSPACE, /\.(log|jsonl)$/);
  console.log(`📋 Log files: ${logs.length}`);
  const logSize = logs.reduce((sum, f) => sum + f.size, 0);
  console.log(`   Total: ${(logSize / 1024 / 1024).toFixed(2)} MB\n`);
  
  // 2. Session data
  const sessions = await scanDirectory(WORKSPACE, /session.*\.json/);
  console.log(`🔐 Session files: ${sessions.length}`);
  const sessionSize = sessions.reduce((sum, f) => sum + f.size, 0);
  console.log(`   Total: ${(sessionSize / 1024).toFixed(2)} KB\n`);
  
  // 3. Incidents/security data
  const incidents = await scanDirectory(WORKSPACE, /incidents\.json/);
  console.log(`⚠️  Incident files: ${incidents.length}\n`);
  
  // 4. Quarantined keys
  const quarantine = await scanDirectory(WORKSPACE, /quarantine.*\.json/);
  console.log(`🚫 Quarantine files: ${quarantine.length}\n`);
  
  // Summary
  console.log('📊 Summary:');
  console.log(`   Total files scanned: ${logs.length + sessions.length + incidents.length + quarantine.length}`);
  console.log(`   Total size: ${((logSize + sessionSize) / 1024 / 1024).toFixed(2)} MB`);
}

auditData();
