# Deployment Guide

Complete deployment instructions for Parsa Oryani's personal academic website.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Deployment Options](#deployment-options)
  - [Vercel (Recommended)](#vercel-recommended)
  - [Docker](#docker)
  - [Railway](#railway)
  - [Render](#render)
  - [Fly.io](#flyio)
  - [Self-Hosted (VPS)](#self-hosted-vps)
- [Post-Deployment Checklist](#post-deployment-checklist)
- [Troubleshooting](#troubleshooting)
- [Architecture Reference](#architecture-reference)

---

## Prerequisites

| Requirement | Version |
|---|---|
| Node.js | >= 20 |
| PostgreSQL | >= 14 |
| npm | >= 10 |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | **Yes** | PostgreSQL connection string |
| `NEXT_PUBLIC_SITE_URL` | **Yes** | Production URL (e.g., `https://parsaoryani.me`) |
| `ADMIN_PATH` | No | Admin route slug (default: `x7k2-console`) |
| `RESEND_API_KEY` | No | Resend API key for contact form emails |
| `SITE_DOMAIN` | No | Email domain for Resend sender address |
| `R2_ACCESS_KEY_ID` | No | Cloudflare R2 access key for file uploads |
| `R2_SECRET_ACCESS_KEY` | No | Cloudflare R2 secret key |
| `R2_BUCKET_NAME` | No | R2 bucket name |
| `R2_ENDPOINT` | No | R2 endpoint URL |
| `REVALIDATION_TOKEN` | No | Token for ISR revalidation webhooks |

Admin sessions use a random, server-generated token stored (hashed) in the database — there is no JWT signing secret to configure.

---

## Database Setup

### Option A: Managed PostgreSQL (Recommended)

Use a managed service that provides connection pooling:

| Provider | Free Tier | Pooling |
|---|---|---|
| [Neon](https://neon.tech) | 0.5 GB | Yes (`?pgbouncer=true`) |
| [Supabase](https://supabase.com) | 500 MB | Yes (via Supavisor) |
| [Railway](https://railway.app) | $5 credit | Yes |
| [Render](https://render.com) | 90 days | Yes |

Connection string format:

```
postgresql://user:password@host:5432/dbname?pgbouncer=true
```

### Option B: Self-Hosted PostgreSQL

```bash
# Install and start PostgreSQL
brew install postgresql@16   # macOS
sudo apt install postgresql   # Ubuntu

# Create database
sudo -u postgres psql
CREATE DATABASE personal_site;
CREATE USER siteuser WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE personal_site TO siteuser;
\q
```

Connection string:

```
postgresql://siteuser:secure_password@localhost:5432/personal_site
```

### Run Migrations

```bash
# Set DATABASE_URL in .env
echo 'DATABASE_URL="postgresql://..."' > .env

# Apply all migrations
npx prisma migrate deploy

# Seed initial data (admin user, sample content)
npm run db:seed
```

---

## Deployment Options

### Fully Free Deployment (Recommended Path)

Total cost: **$0/month, permanent.** No credit card required for the core stack.

#### Why a static free host will not work

GitHub Pages, Netlify's static tier, Cloudflare Pages in static mode, and
Surge serve **static files only**. This application cannot run on any of them.
It requires a Node.js runtime *and* a PostgreSQL database, because it has:

- 35 API routes (`src/app/api/**/route.ts`)
- 28 admin pages behind session-based auth
- Middleware/proxy for admin-path rewriting
- 21 Prisma models backed by PostgreSQL

#### The free stack

| Layer | Service | Free tier | Why this one |
|---|---|---|---|
| Runtime | **Vercel Hobby** | Free, no card, non-commercial | Built by the Next.js team; zero-config for this framework |
| Database | **Neon** | 0.5 GB, scales to zero | Serverless-native Postgres with a built-in connection pooler |
| Domain | **`*.vercel.app`** | Free, automatic, SSL included | Issued on first deploy — see §6 for nicer free domains |
| File storage *(optional)* | **Cloudflare R2** | 10 GB, no egress fees | Only needed if you upload media via the admin panel |
| Email *(optional)* | **Resend** | 3,000 emails/month | Only needed for contact-form notifications |

Vercel's Hobby plan is restricted to non-commercial use. A personal academic
portfolio qualifies.

#### Step 1 — Create the database (Neon)

1. Sign up at <https://neon.tech> and create a project
2. Copy the **pooled** connection string — the host contains `-pooler`

> **Important:** use the pooled string, not the direct one. `src/lib/db/prisma.ts`
> only caches the client on `globalThis` outside production, so each serverless
> invocation may open a new connection. The direct endpoint will exhaust
> connections under load; the pooler will not.

```
postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require
```

#### Step 2 — Apply schema and seed data

Run locally, pointed at Neon:

```bash
DATABASE_URL="<neon-pooled-url>" npx prisma migrate deploy
DATABASE_URL="<neon-pooled-url>" npm run db:seed
```

#### Step 3 — Deploy to Vercel

```bash
npx vercel login      # interactive — opens a browser
npx vercel link       # link this directory to a Vercel project
npx vercel --prod     # deploy
```

Or import the repository at <https://vercel.com/new> for automatic
deploy-on-push.

#### Step 4 — Environment variables

Set in Vercel Dashboard → Settings → Environment Variables, or via
`npx vercel env add <NAME> production`.

**Required:**

| Key | Value | Notes |
|---|---|---|
| `DATABASE_URL` | Neon **pooled** URL | See step 1 |
| `ADMIN_PATH` | your secret admin segment | Keep it non-obvious; it is the only thing hiding the admin route |
| `NEXT_PUBLIC_SITE_URL` | `https://<project>.vercel.app` | Drives canonical URLs, `sitemap.xml`, `robots.txt` |

**Optional — the site runs correctly without all of these:**

| Key | Effect if unset |
|---|---|
| `RESEND_API_KEY` | Contact form still works and still stores messages in the database; only the email notification is skipped |
| `SITE_DOMAIN` | Defaults to `parsaoryani.me` in email templates |
| `R2_ENDPOINT`, `R2_BUCKET_NAME`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` | Admin uploads fall back to local disk — **see the warning below** |
| `REVALIDATION_TOKEN` | ISR webhook endpoint is unused |

**Do not set `JWT_SECRET`.** It remains in `.env` from an earlier auth
implementation but is no longer referenced anywhere in the codebase.

#### Known constraints on the free tier

**0. `NEXT_PUBLIC_SITE_URL` must exactly match the origin you browse.**
`src/middleware.ts` performs a CSRF origin check: in production, any
`POST`/`PUT`/`PATCH`/`DELETE` carrying a `session_token` cookie is rejected with
`403 Invalid origin` unless the request's `Origin` header matches
`NEXT_PUBLIC_SITE_URL`. It defaults to `https://parsaoryani.me`, so **leaving it
unset breaks every admin write on a `.vercel.app` domain.** Set it to the exact
production origin.

Note this also means admin writes will 403 on Vercel *preview* deployment URLs
(`<project>-<hash>.vercel.app`), since those differ from the production alias.
Use the production URL for admin work. Public pages and the contact form are
unaffected — they carry no session cookie.

**0b. The build requires a reachable database.**
Verified: `next build` exits `1` without a live `DATABASE_URL`. The homepage and
several other routes call Prisma during prerendering without a fallback. Create
and migrate the Neon database **before** the first Vercel deployment, and make
sure `DATABASE_URL` is present for the Build step, not just at runtime.

**1. Admin file uploads need R2 on Vercel.**
`src/app/api/upload/route.ts` writes to `./uploads` when R2 is not configured.
Vercel's filesystem is ephemeral and read-only outside `/tmp`, so uploaded files
will not persist. Either configure Cloudflare R2 (free tier: 10 GB) or commit
media to `public/` instead of uploading through the admin panel.

**2. Contact-form email needs a real domain.**
Resend requires DNS verification of the sending domain, which is impossible on
`*.vercel.app`. Until a custom domain is attached, leave `RESEND_API_KEY` unset —
the contact form still records every message, readable in the admin inbox.

**3. Neon free tier scales to zero.**
The first request after idle incurs a short cold start. Acceptable for a
portfolio; no configuration needed.

#### Alternative free runtimes

| Service | Free tier | Trade-off |
|---|---|---|
| **Render** | Free web service | Spins down after ~15 min idle; cold starts can reach ~50s |
| **Fly.io** | Limited free allowance | Needs Docker — a `Dockerfile` already exists in this repo |
| **Netlify** | Free | Next.js runtime supported but less seamless than Vercel |
| **Railway** | Trial credit only | No longer a genuinely free tier |

---

### Vercel (Recommended)

Zero-config Next.js hosting with edge functions, analytics, and automatic SSL.

#### 1. Connect Repository

1. Push code to GitHub/GitLab
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repository
4. Framework preset: **Next.js** (auto-detected)

#### 2. Configure Settings

- **Build Command:** `prisma generate && next build`
- **Install Command:** `npm install`
- **Node.js Version:** 20 (in Project Settings → General)

#### 3. Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

| Key | Value | Environment |
|---|---|---|
| `DATABASE_URL` | `postgresql://...` | Production, Preview |
| `NEXT_PUBLIC_SITE_URL` | `https://parsaoryani.me` | Production |
| `NEXT_PUBLIC_SITE_URL` | `https://<preview-url>.vercel.app` | Preview |
| `ADMIN_PATH` | `x7k2-console` | Production, Preview |

#### 4. Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Or deploy preview
vercel
```

#### 5. Run Migrations (First Deploy)

```bash
# Connect to your production DB
npx prisma migrate deploy
npm run db:seed
```

Or add a **Vercel Post-Build Hook** in Project Settings → Git:

```bash
npx prisma migrate deploy && npm run db:seed
```

#### 6. Domain

All three options below are free. See
[Fully Free Deployment](#fully-free-deployment-recommended-path) for the
hosting and database side.

##### Free option A — Vercel subdomain (immediate, zero setup)

Every Vercel project gets a free public domain automatically on first deploy:

```
https://<project-name>.vercel.app
```

No DNS, no configuration, automatic SSL, free forever. This is live the moment
the first deployment succeeds, and it is the fallback that every option below
builds on top of.

##### Free option B — free `.me` via GitHub Student Developer Pack (recommended)

As an enrolled student you can claim a **free one-year `.me` domain** from
Namecheap through the [GitHub Student Developer Pack](https://education.github.com/pack).
This is the most appropriate option for a site sent to professors and research
labs — `parsaoryani.me` reads as a personal academic domain, whereas a
`.vercel.app` address reads as a deployment preview.

1. Verify student status at <https://education.github.com/pack> (Sharif email)
2. Claim the Namecheap `.me` offer
3. Register `parsaoryani.me`
4. Attach it to Vercel using the DNS records in the table below

Note: free for the first year; renewal is paid. Set a calendar reminder.

##### Free option C — developer subdomain (free, permanent, no student status)

Community-run registries that grant free subdomains via a pull request:

| Registry | Result | Notes |
|---|---|---|
| [is-a.dev](https://github.com/is-a-dev/register) | `parsaoryani.is-a.dev` | Developer-oriented, active, usually merged in days |
| [js.org](https://github.com/js-org/js.org) | `parsaoryani.js.org` | For JavaScript projects |
| [eu.org](https://nic.eu.org) | `parsaoryani.eu.org` | Free and permanent, but manual approval can take weeks |

Each requires opening a PR that points the subdomain at the Vercel deployment
(`CNAME` → `cname.vercel-dns.com`).

##### Attaching any custom domain to Vercel

1. Vercel Dashboard → Settings → Domains → Add
2. Configure DNS at the registrar:

| Type | Name | Value |
|---|---|---|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

3. Update `NEXT_PUBLIC_SITE_URL` in Vercel to the new origin and redeploy, so
   canonical URLs, `sitemap.xml`, and `robots.txt` emit the correct host.

**Recommended sequence:** deploy first and take the free `.vercel.app` domain
(option A) so the site is live, then attach option B or C later without any
redeployment risk.

---

### Docker

For self-hosted or cloud VM deployments.

#### 1. Build Image

```bash
docker build -t personal-site .
```

#### 2. Run Container

```bash
docker run -d \
  --name personal-site \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e NEXT_PUBLIC_SITE_URL="https://parsaoryani.me" \
  -e NODE_ENV=production \
  personal-site
```

#### 3. Docker Compose

```yaml
# docker-compose.yml
version: "3.8"

services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: personal_site
      POSTGRES_USER: siteuser
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U siteuser -d personal_site"]
      interval: 5s
      timeout: 5s
      retries: 5

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: "postgresql://siteuser:${DB_PASSWORD}@db:5432/personal_site"
      NEXT_PUBLIC_SITE_URL: "https://parsaoryani.me"
      NODE_ENV: production
    depends_on:
      db:
        condition: service_healthy
    command: >
      sh -c "npx prisma migrate deploy && node server.js"

volumes:
  pgdata:
```

```bash
# Create .env file
cat > .env.docker <<EOF
DB_PASSWORD=$(openssl rand -base64 24)
EOF

# Start
docker compose --env-file .env.docker up -d

# Run seed (one-time)
docker compose exec app npx tsx scripts/seed.ts
```

---

### Railway

Simple deployment with managed PostgreSQL.

1. Go to [railway.app](https://railway.app) → New Project
2. Add **PostgreSQL** service
3. Add **Next.js** service (from GitHub repo)
4. Set environment variables:
   - `DATABASE_URL` → Use Railway's PostgreSQL variable
   - `NEXT_PUBLIC_SITE_URL` → Your Railway domain or custom domain
5. Railway auto-runs `npm install` and `npm run build`
6. Add deploy command: `npx prisma migrate deploy && npm start`

---

### Render

1. Go to [render.com](https://render.com) → New Web Service
2. Connect GitHub repo
3. Settings:
   - **Runtime:** Node
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npx prisma migrate deploy && npm start`
4. Add PostgreSQL database from Render dashboard
5. Set `DATABASE_URL` from the database connection info
6. Set remaining environment variables

---

### Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Initialize
fly launch

# Set secrets
fly secrets set DATABASE_URL="postgresql://..."
fly secrets set NEXT_PUBLIC_SITE_URL="https://parsaoryani.me"

# Deploy
fly deploy

# Run migrations
fly ssh console -C "npx prisma migrate deploy"

# Seed
fly ssh console -C "npx tsx scripts/seed.ts"
```

---

### Self-Hosted (VPS)

For DigitalOcean, Linode, Hetzner, AWS EC2, etc.

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2 (process manager)
sudo npm install -g pm2
```

#### 2. Configure Database

```bash
sudo -u postgres psql
CREATE DATABASE personal_site;
CREATE USER siteuser WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE personal_site TO siteuser;
\q
```

#### 3. Deploy Application

```bash
# Clone repository
git clone <repo-url> /var/www/personal-site
cd /var/www/personal-site

# Install dependencies
npm install

# Configure environment
cat > .env <<EOF
DATABASE_URL="postgresql://siteuser:secure_password@localhost:5432/personal_site"
NEXT_PUBLIC_SITE_URL="https://parsaoryani.me"
ADMIN_PATH="x7k2-console"
NODE_ENV=production
EOF

# Run migrations and seed
npx prisma migrate deploy
npm run db:seed

# Build
npm run build

# Start with PM2
pm2 start npm --name "personal-site" -- start
pm2 save
pm2 startup
```

#### 4. Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/personal-site
server {
    listen 80;
    server_name parsaoryani.me www.parsaoryani.me;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name parsaoryani.me www.parsaoryani.me;

    ssl_certificate /etc/letsencrypt/live/parsaoryani.me/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/parsaoryani.me/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/personal-site /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL with Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d parsaoryani.me -d www.parsaoryani.me
```

---

## Post-Deployment Checklist

### First Deploy

- [ ] Database migrations applied (`npx prisma migrate deploy`)
- [ ] Seed data loaded (`npm run db:seed`) — creates admin user
- [ ] Admin login works at `/<ADMIN_PATH>`
- [ ] Default credentials changed (admin@parsaoryani.com / admin123456)
- [ ] `NEXT_PUBLIC_SITE_URL` set to production domain
- [ ] SSL certificate active (auto with Vercel/Railway/Render; manual with Certbot)
- [ ] Custom domain configured and resolving
- [ ] Google Scholar links updated (replace `YOUR_ID` in publications)

### Ongoing

- [ ] Contact form emails delivering (if Resend configured)
- [ ] File uploads working (if R2 configured)
- [ ] Admin 2FA enabled
- [ ] Database backups scheduled
- [ ] Monitoring/alerting configured

### Security

- [ ] HSTS header active (`Strict-Transport-Security`)
- [ ] CSP headers present (check browser console)
- [ ] Admin path changed from default `x7k2-console` (optional)
- [ ] Rate limiting configured at reverse proxy level
- [ ] `.env` file not exposed publicly

---

## Troubleshooting

### Build Fails with Prisma Error

```
Error: @prisma/client did not initialize yet
```

**Fix:** Ensure `prisma generate` runs before build:

```bash
npx prisma generate
npm run build
```

The `postinstall` script handles this automatically on `npm install`.

### Database Connection Refused

```
Can't reach database server at localhost:5432
```

**Fix:**
1. Verify `DATABASE_URL` in `.env` points to the correct host
2. For managed databases, ensure IP allowlisting includes your deploy server
3. For PgBouncer connections, add `?pgbouncer=true` to the URL

### Hydration Mismatch Warning

```
Warning: Text content did not match Server and Client
```

**Fix:** The particle background (`FloatingParticles`) generates its `Math.random()` positions inside a `useEffect`, so the server renders an empty container and the client fills it in after mount — no mismatch. If you see this warning elsewhere, look for `Math.random()`, `Date.now()`, or other non-deterministic values used directly during render.

### Admin Page Returns 404

**Fix:**
1. Verify `ADMIN_PATH` env var matches the URL path
2. Clear `.next` cache: `rm -rf .next && npm run build`
3. Check middleware is not blocking the route

### Stale Server After Deploy

**Fix:**
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build

# Restart
pm2 restart personal-site  # or equivalent
```

---

## Architecture Reference

```
personalWebsite/
├── prisma/
│   ├── schema.prisma          # Database schema (17 models)
│   └── migrations/            # Migration history
├── scripts/
│   └── seed.ts                # Initial data seeding
├── src/
│   ├── app/
│   │   ├── (public)/          # Public routes (SSR)
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── about/         # About page
│   │   │   ├── cv/            # CV page
│   │   │   ├── research/      # Publications
│   │   │   ├── projects/      # Projects
│   │   │   ├── teaching/      # Teaching experience
│   │   │   ├── research-assistance/  # Research assistantships
│   │   │   └── contact/       # Contact form
│   │   ├── (admin)/[adminPath]/  # Admin dashboard
│   │   ├── api/               # API routes
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── content/           # Content cards
│   │   └── layout/            # Navigation, footer
│   ├── lib/
│   │   ├── auth/              # JWT + session management
│   │   ├── db/                # Prisma client
│   │   └── validation/        # Zod schemas
│   └── middleware.ts          # Route protection + CSRF
├── public/                    # Static assets
├── next.config.ts             # Security headers, image config
├── Dockerfile                 # Multi-stage Docker build
├── docker-compose.yml         # Full stack with PostgreSQL
└── DEPLOY.md                  # This file
```

### Runtime Requirements

| Component | Purpose | Required? |
|---|---|---|
| PostgreSQL | Primary database | **Yes** |
| Node.js >= 20 | Runtime | **Yes** |
| Resend | Transactional email | No |
| Cloudflare R2 | File storage | No |
| Redis | Session store (future) | No |

### Build Pipeline

```
npm install
  └── postinstall: prisma generate

npm run build
  └── next build → .next/ (standalone output)

npx prisma migrate deploy
  └── Applies pending migrations

npm start
  └── node server.js (port 3000)
```

---

## Environment Variable Reference

| Variable | Format | Example |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` | `postgresql://siteuser:abc123@db.example.com:5432/personal_site` |
| `NEXT_PUBLIC_SITE_URL` | Full URL with protocol | `https://parsaoryani.me` |
| `ADMIN_PATH` | URL slug | `x7k2-console` |
| `RESEND_API_KEY` | `re_` prefix | `re_abc123def456` |
| `SITE_DOMAIN` | Domain name | `parsaoryani.me` |
| `R2_ACCESS_KEY_ID` | Alphanumeric | `abc123def456` |
| `R2_SECRET_ACCESS_KEY` | Alphanumeric | `abc123def456` |
| `R2_BUCKET_NAME` | Bucket name | `personal-site-uploads` |
| `R2_ENDPOINT` | HTTPS URL | `https://abc123.r2.cloudflarestorage.com` |
