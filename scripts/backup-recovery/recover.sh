#!/bin/bash
# Disaster recovery: download + decrypt + restore + verify

set -e

BACKUP_FILE="${1:?Missing backup file}"
TARGET_DB="${2:-openclaw_recovered}"
WORKSPACE="/Users/laurenz/.openclaw/workspace"
WORK_DIR="/tmp/openclaw-recovery"
S3_BUCKET="${BACKUP_S3_BUCKET:-openclaw-backups}"
AWS_REGION="${AWS_REGION:-us-east-1}"

START_TIME=$(date +%s)

mkdir -p "$WORK_DIR"
cd "$WORK_DIR"

echo "[recover] ===== DISASTER RECOVERY ====="
echo "[recover] Backup: $BACKUP_FILE"
echo "[recover] Target DB: $TARGET_DB"
echo "[recover] Started: $(date)"

# 1. Download from S3
echo "[recover] Downloading backup..."
aws s3 cp "s3://$S3_BUCKET/db-backups/$BACKUP_FILE" . \
  --region "$AWS_REGION" || {
  echo "[recover] ❌ Download failed"
  exit 1
}

# 2. Decrypt
echo "[recover] Decrypting..."
DECRYPTED_FILE="${BACKUP_FILE%.gpg}"

gpg --batch --quiet --decrypt \
  --passphrase-file <(echo "$BACKUP_ENCRYPTION_KEY") \
  --output "$DECRYPTED_FILE" "$BACKUP_FILE"

# 3. Drop old target DB (if exists)
psql $DATABASE_URL -c "DROP DATABASE IF EXISTS $TARGET_DB;" 2>/dev/null || true

# 4. Restore
echo "[recover] Restoring database..."
createdb -U postgres -h localhost $TARGET_DB
gunzip -c "$DECRYPTED_FILE" | psql -d $TARGET_DB -h localhost > /dev/null || {
  echo "[recover] ❌ Restore failed"
  exit 1
}

# 5. Verify integrity
echo "[recover] Verifying integrity..."

# Check row counts
ROW_COUNT=$(psql -d $TARGET_DB -h localhost -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';" 2>/dev/null || echo 0)

if [ "$ROW_COUNT" -lt 5 ]; then
  echo "[recover] ⚠️  Warning: Low table count ($ROW_COUNT)"
fi

# 6. Health check
echo "[recover] Running health checks..."

psql -d $TARGET_DB -h localhost -c "SELECT version();" > /dev/null || {
  echo "[recover] ❌ Health check failed"
  exit 1
}

# 7. Summary
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo "[recover] ✅ Recovery complete"
echo "[recover] Duration: ${DURATION}s"
echo "[recover] Database: $TARGET_DB"
echo "[recover] Tables: $ROW_COUNT"
echo "[recover] Completed: $(date)"

# Cleanup
rm -f "$DECRYPTED_FILE" "$BACKUP_FILE"
