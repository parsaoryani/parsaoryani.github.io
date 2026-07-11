# Usage Guide

## Quick Start

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push

# Seed database with sample admin + content
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

---

## External Access (Tunnel / Sharing Dev Server)

While the dev server runs on `localhost:3001`, use **localtunnel** to share it with anyone:

```bash
# Install once
npm install -g localtunnel

# Start tunnel (run in a separate terminal)
npx localtunnel --port 3001
```

This prints a URL like `https://rare-bananas-happen.loca.lt`. Share this URL.

**Note:**
- The tunnel URL **changes every time** you restart the tunnel process
- If the tunnel stops responding, restart it with:
  ```bash
  pkill -f localtunnel
npx localtunnel --port 3001
  ```
- First visit may show a captcha interstitial — click through
- Admin path is appended: `https://rare-bananas-happen.loca.lt/x7k2-console/login`
- Cookie uses **`Secure` + `SameSite=Lax`** — works with HTTPS tunnels

### Alternative Tunnels

```bash
# localhost.run (no install)
ssh -R 80:localhost:3001 nokey@localhost.run

# ngrok (free account required)
ngrok http 3001
```

### Production Deployment (Vercel)

```bash
npx vercel login
npx vercel deploy --prod
```

Set environment variables in Vercel dashboard. Use a managed PostgreSQL (Neon, Supabase, etc.).

---

## Admin Panel

The admin panel is at an obscured route defined by `ADMIN_PATH` in `.env`.

**Default credentials (from seed):**
- URL: `http://localhost:3001/x7k2-console` (or tunnel URL + `/x7k2-console`)
- Email: `admin@parsaoryani.com`
- Password: `admin123456`

### Public Nav Link

The site header has an **"Admin"** link alongside Publications, Projects, TA, RA, About, Contact. Click it from any public page to reach the admin login.

### Sidebar Navigation

The admin sidebar is visible on every admin page and contains:

| Section | Description |
|---------|-------------|
| **Dashboard** | Overview with content counts per section |
| **Publications** | Manage research papers |
| **Projects** | Manage portfolio projects |
| **Timeline** | Events grouped by type (Education, Experience, Awards, Talks, Service) |
| **Tags** | Categorize publications & projects |
| **Skills** | Manage skill categories + items |
| **TA** | Teaching assistance positions (course, university, professor) |
| **RA** | Researching assistance positions (lab, supervisor, topic) |
| **Messages** | View contact form submissions |
| **Contact** | Edit contact page content (emails, links, description, location) |
| **Profile Photo** | Set profile photo URL for About page |
| **Mail Dev** | View locally captured emails (dev mode only — no RESEND_API_KEY) |
| **Settings** | Raw JSON editor for site settings |
| **Security** | Active sessions & audit log |
| **View Site** (bottom) | Opens homepage in new tab |
| **Logout** (bottom) | Destroys session |

---

## CRUD: All Sections

### 1. Publications

**List:** `[ADMIN_PATH]/publications`
Shows all publications with status badge, venue, year. Edit icon opens edit form. Delete button soft-deletes.

**Create:** `[ADMIN_PATH]/publications/new`
Fill in the form. Required fields: Title, Slug, Venue, Venue Type, Year, Status, Authors (comma-separated).

**Edit:** `[ADMIN_PATH]/publications/[id]`
Pre-filled form. "Save Changes" updates. "Delete" button below form.

### 2. Projects

**List:** `[ADMIN_PATH]/projects`
Shows all projects with status badge, summary. Edit/delete icons.

**Create:** `[ADMIN_PATH]/projects/new`
Required: Title, Slug, Summary, Year, Status. Tech Stack is comma-separated.

**Edit:** `[ADMIN_PATH]/projects/[id]`
Pre-filled form with update/delete.

### 3. Timeline

**List:** `[ADMIN_PATH]/timeline`
Shows events grouped by type (Education, Experience, Awards, Talks, Service) in separate sections. Quick-jump badges at top link to each section. Each section has its own "New [Type]" button.

**Create:** `[ADMIN_PATH]/timeline/new?type=experience`
Form auto-selects the type from the query param (or choose manually). Fields: Type, Title, Organization, Location, Start Date, End Date, Description, URL, Visible.

**Edit:** `[ADMIN_PATH]/timeline/[id]`
Pre-filled form with update/delete.

### 4. Tags

**List:** `[ADMIN_PATH]/tags`
Shows all tags as badges. Click edit icon to rename.

**Create:** `[ADMIN_PATH]/tags/new`
Fields: Label (display name), Slug (URL-friendly), Color, Description.

**Edit:** `[ADMIN_PATH]/tags/[id]`
Pre-filled form with update/delete.

### 5. Skills

**List:** `[ADMIN_PATH]/skills`
Shows skill categories as expandable sections with skills underneath. Inline management:
- Add category, rename category (click name), delete category
- Add skill to category (name + level 1-5), delete skill

### 6. Messages

**List:** `[ADMIN_PATH]/messages`
Shows contact form submissions with name, email, subject, body preview, date.
- Click message to view full detail
- Change status: New → Read / Archived / Spam
- Delete message

### 7. Contact Page Content

**Page:** `[ADMIN_PATH]/contact`

Edit all contact page content without touching code:

| Field | What it controls |
|-------|-----------------|
| **Description** | The intro text on `/contact` |
| **Email Addresses** | Email links shown on contact page (add/remove rows) |
| **Social Links** | GitHub, LinkedIn, Scholar links (add/remove rows) |
| **Location** | City name and availability note |

Changes are saved immediately. **Click "Save All"** to persist. The public contact page (`/contact`) reads from these settings on every request (dynamic rendering).

### 8. Settings

**Page:** `[ADMIN_PATH]/settings`

Raw JSON editor for all `SiteSetting` records. Useful for advanced changes:
- `hero_thesis` — Homepage thesis text
- `contact_*` — Contact page content (also editable via Contact section above)

Click "Edit" on any setting, modify JSON, click "Save".

---

## Public Pages

| Route | Content |
|-------|---------|
| `/` | Hero with research thesis, featured publications/projects, skills |
| `/research` | All publications grouped by year |
| `/research/[slug]` | Publication detail (abstract, BibTeX, links) |
| `/projects` | Filterable gallery (`?tag=zk`) |
| `/projects/[slug]` | Full case study |
| `/teaching` | TA positions with course, university, professor, dates |
| `/research-assistance` | RA positions with lab, supervisor, topic, outcomes |
| `/about` | Bio, profile photo, timeline grouped by category, skills |
| `/cv` | Interactive HTML CV + PDF download |
| `/contact` | Contact form + social/location (dynamic from settings) |

---

## API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/login` | Login with email + password |
| POST | `/api/auth/verify-2fa` | Verify TOTP code |
| POST | `/api/auth/logout` | Destroy session (redirects to /) |

### Publications (admin only)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/publications` | List all |
| POST | `/api/publications` | Create |
| GET | `/api/publications/[id]` | Get by ID |
| PUT | `/api/publications/[id]` | Update |
| DELETE | `/api/publications/[id]` | Soft-delete |

### Projects (admin only)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/projects` | List all |
| POST | `/api/projects` | Create |
| GET | `/api/projects/[id]` | Get by ID |
| PUT | `/api/projects/[id]` | Update |
| DELETE | `/api/projects/[id]` | Soft-delete |

### Timeline (admin only)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/timeline` | List all |
| POST | `/api/timeline` | Create |
| GET | `/api/timeline/[id]` | Get by ID |
| PUT | `/api/timeline/[id]` | Update |
| DELETE | `/api/timeline/[id]` | Delete |

### Tags (admin only)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/tags` | List all |
| POST | `/api/tags` | Create |
| GET | `/api/tags/[id]` | Get by ID |
| PUT | `/api/tags/[id]` | Update |
| DELETE | `/api/tags/[id]` | Delete |

### Skills (admin only)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/skills` | List categories with items |
| POST | `/api/skills` | Create category |
| PUT | `/api/skills/[id]` | Rename category |
| DELETE | `/api/skills/[id]` | Delete category + its items |
| POST | `/api/skills/items` | Create skill item |
| PUT | `/api/skills/items/[id]` | Update skill item |
| DELETE | `/api/skills/items/[id]` | Delete skill item |

### Messages (admin only)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/messages/` | List all |
| GET | `/api/messages/[id]` | Get by ID |
| PUT | `/api/messages/[id]` | Update status |
| DELETE | `/api/messages/[id]` | Delete |

### Settings (admin only)
| Method | Route | Description |
|--------|-------|-------------|
| PUT | `/api/settings/[id]` | Update setting value |

### Public
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/contact` | Submit contact form |

---

---

## Email Setup

The site uses **Resend** to send emails from the contact form. Two emails are sent on each submission:
- **Notification** — sent to you (`parsa@yourdomain.com`) with the message details
- **Confirmation** — sent to the visitor thanking them for reaching out

### 1. Set up Resend

1. Sign up at [resend.com](https://resend.com)
2. Add your domain (e.g., `parsaoryani.me`) — follow their DNS verification steps
3. Create an API key and set it in `.env`:
   ```
   RESEND_API_KEY="re_..."
   SITE_DOMAIN="parsaoryani.me"
   ```

### 2. DNS Records

Resend requires these DNS records for domain verification:

| Type | Name | Value |
|------|------|-------|
| TXT | `resend._domainkey.yourdomain` | (provided by Resend) — DKIM |
| TXT | `yourdomain` | `"v=spf1 include:spf.resend.com ~all"` — SPF |
| CNAME | `bounce.yourdomain` | `feedback-smtp.us-east-1.amazonses.com` — bounce handling |

### 3. Receiving Email (optional)

If you want to receive replies at `contact@yourdomain.com`:

**Cloudflare Email Routing (free):**
1. Add your domain to Cloudflare DNS
2. Go to **Email → Email Routing**
3. Create a catch-all or rule: `contact@yourdomain.com` → your personal email
4. MX records are auto-managed by Cloudflare

**ImprovMX (free):**
1. Sign up at [improvmx.com](https://improvmx.com)
2. Add your domain, follow MX record instructions
3. Forward `contact@yourdomain.com` to your Gmail

### 4. Verify

Go to `/contact` on your live site, submit a test message. You should receive a notification email, and the submitter gets a confirmation.

### Local Testing Without a Domain

You can fully test the email flow locally **without buying a domain or setting up DNS**:

1. **Leave `RESEND_API_KEY` empty** (or set it to `re_placeholder`) in `.env`
2. The site will **capture all emails to `.mail-dev/`** instead of sending them
3. Go to **Admin → Mail Dev** to view captured emails (notification + confirmation)
4. Emails are also logged to the server console

**Test flow:**
1. Start the dev server: `npm run dev`
2. Open `/contact`, fill and submit the form
3. Open Admin → **Messages** — the submission is stored in the database ✓
4. Open Admin → **Mail Dev** — both the notification and confirmation emails appear ✓
5. Check your terminal — email contents are also logged there

This confirms the full pipeline works before you buy a domain and configure Resend.

---

## Scripts

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (localhost:3001) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma db push` | Push schema to DB |
| `npx prisma generate` | Regenerate Prisma client |
| `npx prisma studio` | Open Prisma Studio (DB browser) |
| `npm run db:seed` | Seed database with sample data |
| `npx localtunnel --port 3001` | Share dev server externally |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | *required* | PostgreSQL connection string |
| `JWT_SECRET` | `dev-secret-change-in-production` | Secret for JWT signing |
| `ADMIN_PATH` | `x7k2-console` | Obscured admin route segment |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3001` | Public site URL for SEO/metadata |
| `RESEND_API_KEY` | - | **Required for email.** Resend API key (sign up at resend.com, verify domain) |
| `SITE_DOMAIN` | `parsaoryani.me` | Your custom domain — used to derive email addresses (`contact@`, `parsa@`) |
| `R2_ACCESS_KEY_ID` | - | (Optional) Cloudflare R2 access key |
| `R2_SECRET_ACCESS_KEY` | - | (Optional) Cloudflare R2 secret key |
| `R2_BUCKET_NAME` | - | (Optional) Cloudflare R2 bucket name |
| `R2_ENDPOINT` | - | (Optional) Cloudflare R2 endpoint |

---

## Security

- **Admin route** is obscured by `ADMIN_PATH` env var (never linked from public pages directly in source, only shown in nav when admin is logged in)
- **robots.txt** disallows `/x7k2-console` and `/api`
- **Cookie** is `httpOnly`, `Secure`, `SameSite=Lax` — works over HTTPS tunnels
- **Password** stored with bcrypt (12 rounds)
- **Account lockout:** 5 failed attempts → 15-minute lock
- **TOTP 2FA** can be enabled (generate secret via `generateTotpSecret`)
- **Sessions** expire after 7 days
- **All auth events** logged to `AuditLog` table (login, logout, 2FA, failures)
- **API routes** require valid session token

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Admin login succeeds but redirects back to login | Cookie rejected by browser (missing `Secure` flag on HTTPS) | Run `pkill -f "next dev"` and restart — cookie now uses `Secure=true` |
| Admin panel shows "Loading..." indefinitely | Tunnel dropped | Restart localtunnel: `pkill -f localtunnel && npx localtunnel --port 3001` |
| Contact page shows old data after editing settings | Page is using cached version | Static generation — rebuild with `npm run build` or set `force-dynamic` (already done) |
| "New Publication" form shows "Validation failed" | Missing required field | Ensure Title, Slug, Venue, Year are all filled |
| Delete button does nothing | API error (console shows 401) | Session expired — re-login |
| Prisma error on startup | Database not running or schema not pushed | Start PostgreSQL, run `npx prisma db push` |
| `npm run db:seed` fails | Database already has data with conflicts | Run `npm run db:reset` (if available) or clear tables manually |

---

## Project Structure

```
src/
├── app/
│   ├── (admin)/[adminPath]/    # Admin panel pages
│   │   ├── contact/            # Contact page editor
│   │   ├── login/              # Admin login
│   │   ├── messages/           # Contact form submissions
│   │   ├── photo/              # Profile photo editor
│   │   ├── projects/           # Project CRUD
│   │   ├── publications/       # Publication CRUD
│   │   ├── researching-assistance/  # RA CRUD
│   │   ├── security/           # Sessions + audit log
│   │   ├── settings/           # Site settings editor
│   │   ├── skills/             # Skill manager
│   │   ├── tags/               # Tag CRUD
│   │   ├── teaching-assistance/     # TA CRUD
│   │   ├── timeline/           # Timeline CRUD (grouped by type)
│   │   ├── layout.tsx          # Admin layout with sidebar
│   │   └── page.tsx            # Dashboard
│   ├── (public)/               # Public pages
│   ├── api/                    # API routes (all CRUD)
│   └── layout.tsx              # Root layout
├── components/
│   ├── admin/                  # Admin components
│   │   ├── contact-editor.tsx
│   │   ├── dashboard-cards.tsx
│   │   ├── delete-button.tsx
│   │   ├── profile-photo-editor.tsx
│   │   └── sidebar.tsx
│   ├── layout/                 # Nav, Footer, Container
│   ├── ui/                     # Button, Input, Badge, etc.
│   └── content/                # Public page sections
├── lib/
│   ├── auth/auth.ts            # Sessions, passwords, 2FA
│   ├── db/prisma.ts            # Prisma client singleton
│   ├── utils/cn.ts             # clsx + tailwind-merge
│   └── validation/schemas.ts   # Zod schemas
└── middleware.ts               # Auth gating
```
