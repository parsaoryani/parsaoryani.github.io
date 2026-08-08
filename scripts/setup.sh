#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------------
# Local project setup
#
# One-shot setup + dev runner for the personal-website project.
# Covers everything needed before `npm run dev`:
#   1. npm dependencies (installs if node_modules is missing)
#   2. PostgreSQL server running (tries postgresql@16, @14, plain postgresql)
#   3. `postgres` role created with the password from .env
#   4. `personal_website` database created (schema is pushed, no migrations)
#   5. Prisma client generated
#   6. Schema pushed + seed data applied (seed is idempotent via upserts)
#   7. Next.js dev server started
# ---------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Emit colorful status lines
info()  { printf "\033[1;34m==>\033[0m %s\n" "$*"; }
ok()    { printf "\033[1;32m==>\033[0m %s\n" "$*"; }
die()   { printf "\033[1;31mERROR:\033[0m %s\n" "$*" >&2; exit 1; }

# --------------------------------------------------------------------------
# 1. .env + database URL parsing
# --------------------------------------------------------------------------
if [[ ! -f .env ]]; then
  die "Missing .env. Copy .env.example to .env and fill in the values first."
fi

DB_URL="${DATABASE_URL:-$(grep -E '^DATABASE_URL=' .env | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'")}"
[[ -z "$DB_URL" ]] && die "DATABASE_URL is not set in .env"

# postgresql://user:pass@host:port/db?params
DB_PARTS="$(printf '%s' "$DB_URL" | sed -E 's|^[^:/]+://([^:/]+):([^@]+)@([^:/]+):([0-9]+)/([^?]+).*$|\1 \2 \3 \4 \5|')"
read -r DB_USER DB_PASS DB_HOST DB_PORT DB_NAME <<< "$DB_PARTS"
if [[ -z "$DB_USER" || -z "$DB_HOST" || -z "$DB_NAME" ]]; then
  die "Could not parse DATABASE_URL. Expected: postgresql://user:pass@host:port/db"
fi

info "Database: $DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"

# --------------------------------------------------------------------------
# 2. npm dependencies
# --------------------------------------------------------------------------
if [[ ! -d node_modules ]]; then
  info "Installing npm dependencies..."
  npm install
else
  info "node_modules present, skipping npm install"
fi

# --------------------------------------------------------------------------
# 3. PostgreSQL server
# --------------------------------------------------------------------------
PG_REACHABLE=false
if command -v pg_isready >/dev/null 2>&1 && pg_isready -h "$DB_HOST" -p "$DB_PORT" -q 2>/dev/null; then
  PG_REACHABLE=true
  ok "PostgreSQL already accepting connections on $DB_HOST:$DB_PORT"
fi

if [[ "$PG_REACHABLE" == false ]]; then
  if ! command -v brew >/dev/null 2>&1; then
    die "PostgreSQL is not running and Homebrew is not available to start it. Start it yourself and rerun."
  fi

  started=false
  for v in postgresql@16 postgresql@14 postgresql@13 postgresql postgresql@15; do
    if brew list --formula "$v" >/dev/null 2>&1 || brew list --cask "$v" >/dev/null 2>&1; then
      info "Starting $v..."
      brew services start "$v" >/dev/null 2>&1
      started=true
      break
    fi
  done

  if [[ "$started" == true ]]; then
    info "Waiting for PostgreSQL to accept connections..."
    for i in {1..15}; do
      if pg_isready -h "$DB_HOST" -p "$DB_PORT" -q 2>/dev/null; then
        ok "PostgreSQL is up"
        break
      fi
      [[ $i -eq 15 ]] && die "PostgreSQL did not come up on $DB_HOST:$DB_PORT in time"
      sleep 1
    done
  else
    die "No PostgreSQL installation found via Homebrew."
  fi
fi

# --------------------------------------------------------------------------
# 4. Role
# --------------------------------------------------------------------------
role_exists=$(psql -d postgres -h "$DB_HOST" -p "$DB_PORT" -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" 2>/dev/null || echo "")
if [[ "$role_exists" == "1" ]]; then
  info "Ensuring $DB_USER role password matches .env..."
  psql -d postgres -h "$DB_HOST" -p "$DB_PORT" -qc "ALTER ROLE \"$DB_USER\" WITH LOGIN SUPERUSER PASSWORD '$DB_PASS';" >/dev/null
else
  info "Creating role '$DB_USER'..."
  psql -d postgres -h "$DB_HOST" -p "$DB_PORT" -qc "CREATE ROLE \"$DB_USER\" WITH LOGIN SUPERUSER PASSWORD '$DB_PASS';"
fi
ok "Role '$DB_USER' ready"

# --------------------------------------------------------------------------
# 5. Database
# --------------------------------------------------------------------------
db_exists=$(psql -d postgres -h "$DB_HOST" -p "$DB_PORT" -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" 2>/dev/null || echo "")
if [[ "$db_exists" != "1" ]]; then
  info "Creating database '$DB_NAME'..."
  createdb -h "$DB_HOST" -p "$DB_PORT" -O "$DB_USER" "$DB_NAME"
else
  info "Database '$DB_NAME' already exists"
fi
ok "Database '$DB_NAME' ready"

# --------------------------------------------------------------------------
# 6. Prisma client + schema + seed
# --------------------------------------------------------------------------
info "Generating Prisma client..."
npx prisma generate

info "Pushing schema (no migrations folder in this project)..."
npx prisma db push --skip-generate

info "Applying seed data (idempotent)..."
npx prisma db seed

ok "Database fully set up"

# --------------------------------------------------------------------------
# 7. Dev server
# --------------------------------------------------------------------------
info "Starting Next.js dev server (npm run dev)"
exec npm run dev
