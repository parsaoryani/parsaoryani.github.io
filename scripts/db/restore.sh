#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------------
# scripts/db/restore.sh
#
# Restore database from a backup file.
# Usage: ./scripts/db/restore.sh backups/backup_20260808_120000.sql.gz
# ---------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/../.."

info()  { printf "\033[1;34m==>\033[0m %s\n" "$*"; }
ok()    { printf "\033[1;32m==>\033[0m %s\n" "$*"; }
warn()  { printf "\033[1;33m==>\033[0m %s\n" "$*"; }
die()   { printf "\033[1;31mERROR:\033[0m %s\n" "$*" >&2; exit 1; }

BACKUP_FILE="${1:-}"

if [[ -z "$BACKUP_FILE" ]]; then
  echo "Usage: $0 <backup-file.sql.gz>"
  echo ""
  echo "Available backups:"
  ls -1 backups/backup_*.sql.gz 2>/dev/null || echo "  No backups found"
  exit 1
fi

if [[ ! -f "$BACKUP_FILE" ]]; then
  die "Backup file not found: $BACKUP_FILE"
fi

if [[ ! -f .env ]]; then
  die "Missing .env file."
fi

DB_URL="${DATABASE_URL:-$(grep -E '^DATABASE_URL=' .env | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'")}"
[[ -z "$DB_URL" ]] && die "DATABASE_URL is not set."

warn "This will OVERWRITE the current database with $BACKUP_FILE"
read -p "Are you sure? (y/N) " -n 1 -r
echo
[[ $REPLY =~ ^[Yy]$ ]] || exit 0

info "Restoring from $BACKUP_FILE..."
gunzip -c "$BACKUP_FILE" | psql "$DB_URL" --quiet

ok "Database restored successfully"
