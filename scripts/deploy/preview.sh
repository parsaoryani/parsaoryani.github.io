#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------------
# scripts/deploy/preview.sh
#
# Deploy a preview build to Vercel.
# ---------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/../.."

info()  { printf "\033[1;34m==>\033[0m %s\n" "$*"; }
ok()    { printf "\033[1;32m==>\033[0m %s\n" "$*"; }
die()   { printf "\033[1;31mERROR:\033[0m %s\n" "$*" >&2; exit 1; }

command -v vercel >/dev/null 2>&1 || die "Vercel CLI not found. Install: npm i -g vercel"

info "Running typecheck..."
npx tsc --noEmit || die "Typecheck failed"

info "Running tests..."
npm test || die "Tests failed"

info "Deploying preview..."
vercel

ok "Preview deployed"
