#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------------
# scripts/db/backup.sh
#
# Create a timestamped backup of the database.
# Requires pg_dump to be available.
# ---------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/../.."

info()  { printf "\033[1;34m==>\033[0m %s\n" "$*"; }
ok()    { printf "\033[1;32m==>\033[0m %s\n" "$*"; }
die()   { printf "\033[1;31mERROR:\033[0m %s\n" "$*" >&2; exit 1; }

if [[ ! -f .env ]]; then
  die "Missing .env file."
fi

DB_URL="${DATABASE_URL:-$(grep -E '^DATABASE_URL=' .env | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'")}"
[[ -z "$DB_URL" ]] && die "DATABASE_URL is not set."

BACKUP_DIR="backups"
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_${TIMESTAMP}.sql.gz"

info "Creating backup..."
pg_dump "$DB_URL" | gzip > "$BACKUP_FILE"

ok "Backup saved to $BACKUP_FILE ($(du -h "$BACKUP_FILE" | cut -f1))"

# Keep only last 10 backups
BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/backup_*.sql.gz 2>/dev/null | wc -l)
if [[ $BACKUP_COUNT -gt 10 ]]; then
  info "Cleaning old backups (keeping last 10)..."
  ls -1t "$BACKUP_DIR"/backup_*.sql.gz | tail -n +11 | xargs rm -f
  ok "Old backups removed"
fi
