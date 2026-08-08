#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------------
# scripts/db/reset.sh
#
# Reset the database: drop, recreate, push schema, seed.
# WARNING: This destroys all data.
# ---------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/../.."

info()  { printf "\033[1;34m==>\033[0m %s\n" "$*"; }
ok()    { printf "\033[1;32m==>\033[0m %s\n" "$*"; }
warn()  { printf "\033[1;33m==>\033[0m %s\n" "$*"; }
die()   { printf "\033[1;31mERROR:\033[0m %s\n" "$*" >&2; exit 1; }

if [[ ! -f .env ]]; then
  die "Missing .env file. Copy .env.example to .env first."
fi

if [[ "${FORCE:-}" != "1" ]]; then
  warn "This will DESTROY all data in the database."
  read -p "Are you sure? (y/N) " -n 1 -r
  echo
  [[ $REPLY =~ ^[Yy]$ ]] || exit 0
fi

info "Resetting database..."
npx prisma migrate reset --force

info "Seeding database..."
npx prisma db seed

ok "Database reset complete"
