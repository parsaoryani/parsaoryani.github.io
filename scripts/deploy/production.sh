#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------------
# scripts/deploy/production.sh
#
# Deploy to production on Vercel.
# ---------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/../.."

info()  { printf "\033[1;34m==>\033[0m %s\n" "$*"; }
ok()    { printf "\033[1;32m==>\033[0m %s\n" "$*"; }
warn()  { printf "\033[1;33m==>\033[0m %s\n" "$*"; }
die()   { printf "\033[1;31mERROR:\033[0m %s\n" "$*" >&2; exit 1; }

command -v vercel >/dev/null 2>&1 || die "Vercel CLI not found. Install: npm i -g vercel"

info "Running typecheck..."
npx tsc --noEmit || die "Typecheck failed"

info "Running tests..."
npm test || die "Tests failed"

warn "Deploying to PRODUCTION..."
read -p "Continue? (y/N) " -n 1 -r
echo
[[ $REPLY =~ ^[Yy]$ ]] || exit 0

info "Deploying..."
vercel --prod

ok "Production deployment complete"
