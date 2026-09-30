# BrandSpire Public Website Redesign

The public website has been redesigned in a high-contrast SaaS/digital-agency direction inspired by the supplied Dribbble reference. The implementation is original and keeps BrandSpire's existing backend, Supabase admin panel, service detail routes and chatbot.

## Main public pages
- `/` — Home
- `/about` — About
- `/services` — Services
- `/work` — Projects / Work
- `/blog` — Blog foundation
- `/contact` — Contact

Existing service detail pages remain:
- `/web-development`
- `/app-development`
- `/software-development`
- `/saas-development`

Admin remains at `/admin`.

## Run locally
```bash
npm install
npm run dev
```
In another terminal:
```bash
npm run server
```

Keep your local `.env` file in the project root. It is intentionally not included in this distribution ZIP.
