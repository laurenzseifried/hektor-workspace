#!/bin/bash
# Automated backup: database + config

set -e

BACKUP_TYPE="${1:-full}"
WORKSPACE="/Users/laurenz/.openclaw/workspace"
BACKUP_DIR="/tmp/openclaw-backups"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
S3_BUCKET="${BACKUP_S3_BUCKET:-openclaw-backups}"
AWS_REGION="${AWS_REGION:-us-east-1}"

mkdir -p "$BACKUP_DIR"

echo "[backup] Starting $BACKUP_TYPE backup at $(date)"

# 1. Database backup
echo "[backup] Dumping database..."
BACKUP_FILE="$BACKUP_DIR/db-$BACKUP_TYPE-$TIMESTAMP.sql.gz"

pg_dump $DATABASE_URL 2>/dev/null | gzip > "$BACKUP_FILE" || {
  echo "[backup] ❌ Database dump failed"
  exit 1
}

echo "[backup] ✅ Database dumped: $(du -h $BACKUP_FILE | cut -f1)"

# 2. Encrypt backup
echo "[backup] Encrypting..."
ENCRYPTED_FILE="$BACKUP_FILE.gpg"
gpg --batch --quiet --symmetric --cipher-algo AES256 \
  --passphrase-file <(echo "$BACKUP_ENCRYPTION_KEY") \
  --output "$ENCRYPTED_FILE" "$BACKUP_FILE"

rm "$BACKUP_FILE"
echo "[backup] ✅ Encrypted"

# 3. Upload to S3
echo "[backup] Uploading to S3..."
aws s3 cp "$ENCRYPTED_FILE" "s3://$S3_BUCKET/db-backups/" \
  --region "$AWS_REGION" --sse AES256 || {
  echo "[backup] ❌ Upload failed"
  exit 1
}

echo "[backup] ✅ Uploaded"

# 4. Verify upload
echo "[backup] Verifying..."
aws s3 ls "s3://$S3_BUCKET/db-backups/$(basename $ENCRYPTED_FILE)" \
  --region "$AWS_REGION" || {
  echo "[backup] ❌ Verification failed"
  exit 1
}

# 5. Cleanup local
rm "$ENCRYPTED_FILE"
echo "[backup] ✅ Local cleanup"

# 6. Config backup (full only)
if [ "$BACKUP_TYPE" = "full" ]; then
  echo "[backup] Backing up config..."
  
  CONFIG_BACKUP="$BACKUP_DIR/config-$TIMESTAMP.tar.gz.gpg"
  
  tar czf - \
    ~/.openclaw/.env \
    ~/.openclaw/openclaw.json \
    "$WORKSPACE/services"/*.plist \
    2>/dev/null | \
  gpg --batch --quiet --symmetric --cipher-algo AES256 \
    --passphrase-file <(echo "$BACKUP_ENCRYPTION_KEY") \
    --output "$CONFIG_BACKUP"
  
  aws s3 cp "$CONFIG_BACKUP" "s3://$S3_BUCKET/config-backups/" \
    --region "$AWS_REGION" --sse AES256
  
  rm "$CONFIG_BACKUP"
  echo "[backup] ✅ Config backed up"
fi

echo "[backup] ✅ Complete at $(date)"
