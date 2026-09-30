# BrandSpire — Full Stack Website + Admin + Chatbot

This final build combines all requested modifications:

- Existing BrandSpire public website retained.
- Full Node.js + Express backend for public and admin operations.
- Supabase PostgreSQL is the persistent database.
- Supabase Auth is used for secure admin login.
- Admin dashboard at `/admin`.
- Projects CRUD (add/edit/delete/publish/order).
- Services CRUD.
- Contact messages stored in Supabase and visible in admin.
- Live chatbot on the public website.
- Automatic FAQ answers for common BrandSpire questions.
- Optional OpenAI-powered answers when `OPENAI_API_KEY` is configured.
- Unknown/unsupported questions automatically escalate to a human agent.
- Admin sees waiting customer chats with a repeating browser sound notification.
- Ringing continues while the conversation is waiting for an agent.
- Admin can Accept & Connect, message the customer, and close the chat.
- Customer can leave the chat.
- Chat messages and conversation status persist in Supabase.
- Production server can serve the Vite `dist` build.

## Setup

1. Copy `.env.example` to `.env`.
2. Create a Supabase project.
3. Put the Supabase project URL, server service-role key, and public anon/publishable key into `.env`.
4. Open Supabase SQL Editor and run `supabase-schema.sql`.
5. In Supabase Authentication, create an admin user with email/password.
6. Insert that auth user's UUID into `public.admin_profiles`, for example:

```sql
insert into public.admin_profiles (id, role, active)
values ('YOUR_AUTH_USER_UUID', 'owner', true)
on conflict (id) do update set active = true, role = 'owner';
```

7. Install dependencies:

```bash
npm install
```

8. Development:

```bash
npm run dev:full
```

Vite runs on `http://localhost:5173` and the API runs on `http://localhost:3000`. In development, `/api` is proxied automatically to the Express server, so review submissions do not require a separate browser CORS URL.

9. Production:

```bash
npm run build
NODE_ENV=production npm start
```

Set `VITE_API_URL` to the deployed API URL before building if the API is hosted separately.

## Security

Never put `SUPABASE_SERVICE_ROLE_KEY` in frontend code or expose it to visitors. Only `VITE_SUPABASE_ANON_KEY` belongs in the browser. Keep `.env` out of Git.

## Chatbot

Without an OpenAI key, the bot uses the included BrandSpire FAQ/intent rules and escalates unknown questions to an agent. To enable LLM answers, set `OPENAI_API_KEY` and optionally `OPENAI_MODEL` in the server `.env`.

## Admin route

Open `/admin`. Sign in using the Supabase Auth user that has an active row in `admin_profiles`.

## Public reviews

The homepage includes a **Write a review** form with a 0–5 rating. Reviews are posted through the Express API and stored in the `public.reviews` Supabase table. Run `supabase-schema.sql` before publishing reviews.
