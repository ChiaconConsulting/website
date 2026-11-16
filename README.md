# Chiacon website

Marketing website and content admin for chiacon.com. Replaces the Wix site.

- **Framework:** Next.js 16 (App Router, React 19, TypeScript), Tailwind CSS 4
- **Database:** PostgreSQL through Drizzle ORM
- **Admin panel:** `/admin` for insights, case studies, services, clients, jobs, job applications and leads
- **Hosting:** runs on Vercel, Azure App Service, or any server with Docker

## What is managed where

| Content | Where to change it |
| --- | --- |
| Insights (blog), case studies, services, client names and logos, jobs | Admin panel at `/admin` |
| Leads and job applications | Admin panel (leads export to CSV in Zoho CRM import format) |
| Navigation, offices, founders, credentials, stats, industries, solutions, FAQs, homepage copy | `src/lib/site.ts` and the page files in `src/app/(site)` |
| Colours, fonts, component styles | `src/app/globals.css` |
| Logo files | `public/brand/` |

## Run locally

Requires Node.js 20.9 or later and a PostgreSQL database.

```bash
cp .env.example .env        # then fill in DATABASE_URL, AUTH_SECRET, ADMIN_PASSWORD
npm install
npm run db:setup            # creates tables and loads starter content + the first admin user
npm run dev                 # http://localhost:3000  (admin at /admin)
```

`npm run db:seed` is safe to re-run: it never overwrites existing rows.

## Deploy option A: Vercel + managed Postgres (least effort)

1. Push this folder to a private GitHub repository.
2. Create a Postgres database (Neon, Supabase or Vercel Postgres) and copy its connection string.
3. In Vercel, import the repository and set the environment variables from `.env.example`
   (`DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`, admin and SMTP values).
4. From your machine, with `DATABASE_URL` pointing at the production database, run `npm run db:setup` once.
5. Add `www.chiacon.com` and `chiacon.com` as domains in Vercel, then change the DNS records at your
   registrar from Wix to the values Vercel shows. Keep the Wix site live until the new one is verified.

## Deploy option B: Docker on your own server or Azure

```bash
cp .env.example .env        # set AUTH_SECRET, ADMIN_PASSWORD, POSTGRES_PASSWORD, NEXT_PUBLIC_SITE_URL
docker compose up -d --build
```

This starts PostgreSQL, runs migrations and the seed once, and serves the site on port 3000.
Put Nginx, Caddy or a cloud load balancer in front for HTTPS. For Azure, build the image from the
`Dockerfile`, push it to Azure Container Registry and run it on App Service or Container Apps with
Azure Database for PostgreSQL as `DATABASE_URL`.

## Before go-live

- [ ] Set a strong `AUTH_SECRET` (`openssl rand -base64 48`) and change the admin password at `/admin/account`.
- [ ] Review every seeded case study and service page for accuracy and client confidentiality.
- [ ] In `/admin/clients`, publish only the names you have permission to show, and upload logo files.
- [ ] Paste the nine legacy article bodies from Wix into the draft posts and publish them. Their slugs
      match the old URLs, so `/post/<slug>` links redirect to `/insights/<slug>`.
- [ ] Replace `public/brand/chiacon-logo-white.png` with the official white logo file.
- [ ] Have the privacy notice in `src/app/(site)/privacy/page.tsx` reviewed by your legal adviser.
- [ ] Set the SMTP variables so new leads and applications are emailed to the team.
- [ ] Set `NEXT_PUBLIC_GTM_ID` if you want to keep Google Tag Manager, and resubmit the sitemap
      (`/sitemap.xml`) in Google Search Console after the DNS switch.

## Redirects from the old site

`next.config.ts` permanently redirects every old Wix URL (`/aboutus`, `/rpa`, `/data-and-analytics`,
`/quality-assurance`, `/project-catalysts`, `/power-platform-ai`, `/rpa-qdbs`, `/career`, `/blogs`,
`/post/*`, `/faqs`, `/contact-us`) to its new page.

## Security notes

- Admin sessions are signed, HTTP-only cookies valid for 8 hours. Every admin page, action and
  download checks the session on the server.
- Public forms validate on the server, use a honeypot field and are rate limited per IP. The rate
  limiter is in memory: on serverless or multi-instance hosting, add Cloudflare Turnstile or a
  Redis-backed limiter (`src/lib/ratelimit.ts`).
- CVs are stored in the database, limited to PDF/DOC/DOCX up to 5 MB, and are only ever served as
  downloads to a signed-in admin.
- Article and case study content is Markdown; raw HTML is not rendered.

## Changing the database schema

Edit `src/db/schema.ts`, then run `npm run db:generate` to create a migration and `npm run db:migrate`
to apply it. Commit the generated files in `drizzle/`.

## Adding another admin user

There is no user-management screen. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `ADMIN_NAME` to the new
person's details and run `npm run db:seed`; it adds the user if that email does not exist yet.
