# ioannisandromidas.gr — new site

Next.js 16 (React 19, App Router, Cache Components) + Tailwind CSS 4. Greek (`/el`) and English (`/en`).

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Where things live

| What | File |
| --- | --- |
| Phones, email, address, hours, service areas (edited from `/admin`) | `src/content/clinic.json` |
| Name, title, site URL | `src/content/site.ts` |
| UI texts (EL/EN) | `src/content/dictionary.ts` |
| Services | `src/content/services.ts` |
| Articles (edited from `/admin`) | `src/content/articles.json` |
| Home-page announcements (edited from `/admin`) | `src/content/announcements.json` |
| Doctor bio | `src/content/doctor.ts` |
| Terms of use | `src/content/terms.ts` |
| Images | `public/images/` |
| Appointment request API (Node, nodemailer) | `src/app/api/appointment/route.ts` |
| Language redirect + old WordPress `?page_id=` redirects | `src/proxy.ts` |

## Admin panel (`/admin`)

The doctor logs in with `ADMIN_EMAIL` + `ADMIN_PASSWORD` (the only account allowed) to add, edit or delete articles, photos and home-page announcements
(optional end date, after which they hide themselves).
On Vercel each save is a commit to this repo through the GitHub API (`GITHUB_TOKEN`), which triggers a redeploy.
Locally (`npm run dev`) changes are written straight to `src/content/*.json` and `public/images/articles/`.
UI: `src/components/admin/AdminApp.tsx` · API: `src/app/api/admin/*` · storage: `src/lib/article-store.ts`.

## Static version

`../web-static/` is the same site exported to plain HTML + PHP for Apache hosting such as Papaki.
Code is identical except `src/lib/runtime-config.ts`, `next.config.ts`, and the PHP files in `public/api/`.

## Appointment emails

Copy `.env.example` to `.env.local` and fill in SMTP settings. Without them, requests are only
logged in development and the API returns 503 in production.

## Deploy

Vercel (recommended) or any Node host. Set the SMTP env vars, then point the domain's DNS to the host.

## Handover

Step-by-step delivery guide (Greek): [`docs/PARADOSI.md`](docs/PARADOSI.md) — Vercel setup, SMTP, domain/DNS, post-launch checklist.
