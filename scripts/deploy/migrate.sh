#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------------
# scripts/deploy/migrate.sh
#
# Run production database migrations.
# Usage: ./scripts/deploy/migrate.sh [--seed]
# ---------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/../.."

info()  { printf "\033[1;34m==>\033[0m %s\n" "$*"; }
ok()    { printf "\033[1;32m==>\033[0m %s\n" "$*"; }
die()   { printf "\033[1;31mERROR:\033[0m %s\n" "$*" >&2; exit 1; }

if [[ ! -f .env ]]; then
  die "Missing .env file."
fi

NODE_ENV="${NODE_ENV:-production}"

info "Running migrations in $NODE_ENV mode..."
npx prisma migrate deploy

if [[ "${1:-}" == "--seed" ]]; then
  info "Seeding database..."
  npx prisma db seed
fi

ok "Migrations complete"
