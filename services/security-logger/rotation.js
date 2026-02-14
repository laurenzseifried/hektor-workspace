/**
 * Log Rotation & Retention Policy
 */

import fs from 'fs/promises';
import { exec } from 'child_process';
import path from 'path';

const LOG_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '.logs');
const ARCHIVE_DIR = path.join(LOG_DIR, 'archive');

export const RETENTION = {
  security: 365, // 1 year
  general: 30,   // 30 days
};

/**
 * Rotate logs (daily)
 */
export async function rotateLogs() {
  await fs.mkdir(ARCHIVE_DIR, { recursive: true });
  
  const date = new Date().toISOString().split('T')[0];
  const files = [
    { src: path.join(LOG_DIR, 'security.jsonl'), name: `security_${date}.jsonl` },
    { src: path.join(LOG_DIR, 'general.jsonl'), name: `general_${date}.jsonl` },
  ];
  
  for (const { src, name } of files) {
    try {
      const dest = path.join(ARCHIVE_DIR, name);
      await fs.rename(src, dest);
      console.log(`[rotation] ✅ Rotated ${name}`);
      
      // Try to gzip (non-blocking)
      exec(`gzip "${dest}"`, (err) => {
        if (!err) {
          console.log(`[rotation] ✅ Compressed ${name}.gz`);
        }
      });
    } catch (err) {
      // File may not exist yet, that's OK
    }
  }
}

/**
 * Cleanup old logs based on retention policy
 */
export async function cleanupOldLogs() {
  const now = Date.now();
  
  try {
    const files = await fs.readdir(ARCHIVE_DIR);
    
    for (const file of files) {
      // Extract date from filename
      const match = file.match(/(security|general)_(\d{4}-\d{2}-\d{2})/);
      if (!match) continue;
      
      const [, type, dateStr] = match;
      const fileDate = new Date(dateStr).getTime();
      const retentionDays = RETENTION[type] || 30;
      const maxAge = retentionDays * 24 * 60 * 60 * 1000;
      
      if (now - fileDate > maxAge) {
        const filepath = path.join(ARCHIVE_DIR, file);
        await fs.unlink(filepath);
        console.log(`[rotation] 🗑️ Deleted old log: ${file}`);
      }
    }
  } catch (err) {
    console.error('[rotation] Cleanup error:', err.message);
  }
}

/**
 * Get log stats
 */
export async function getLogStats() {
  const stats = {
    active: {},
    archived: {},
    totalSize: 0,
  };
  
  try {
    // Active logs
    const activeFiles = await fs.readdir(LOG_DIR);
    for (const file of activeFiles.filter(f => f.endsWith('.jsonl'))) {
      const filepath = path.join(LOG_DIR, file);
      const stat = await fs.stat(filepath);
      stats.active[file] = {
        size: stat.size,
        lines: (await fs.readFile(filepath, 'utf-8')).split('\n').length - 1,
      };
      stats.totalSize += stat.size;
    }
    
    // Archived logs
    const archivedFiles = await fs.readdir(ARCHIVE_DIR);
    for (const file of archivedFiles) {
      const filepath = path.join(ARCHIVE_DIR, file);
      const stat = await fs.stat(filepath);
      stats.archived[file] = {
        size: stat.size,
      };
      stats.totalSize += stat.size;
    }
  } catch (err) {
    console.error('[rotation] Stats error:', err.message);
  }
  
  return stats;
}
