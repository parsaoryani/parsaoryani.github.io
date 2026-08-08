# ---------------------------------------------------------------------------
# Dockerfile — Personal Website (Next.js 16)
#
# Multi-stage build optimized for layer caching and minimal image size.
# Uses standalone output mode for minimal production image.
#
# Build:  docker build -t personal-site .
# Run:    docker run -p 3000:3000 personal-site
# ---------------------------------------------------------------------------

# =============================================================================
# Stage 1: Install dependencies
# =============================================================================
FROM node:20-alpine AS deps
WORKDIR /app

# Install libc6-compat for Alpine compatibility
RUN apk add --no-cache libc6-compat

# Copy dependency manifests first (layer cache)
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install with clean cache
RUN npm ci --prefer-offline --no-audit --no-fund

# =============================================================================
# Stage 2: Build application
# =============================================================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js application
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

RUN npm run build

# =============================================================================
# Stage 3: Production runner
# =============================================================================
FROM node:20-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Add tini for proper signal handling
RUN apk add --no-cache tini

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output (minimal production bundle)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy Prisma for runtime migrations
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Switch to non-root user
USER nextjs

EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
