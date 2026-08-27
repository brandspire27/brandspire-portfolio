# BrandSpire Portfolio

A responsive React + Vite portfolio for BrandSpire with services, deployed project case studies, process section, and an email-enabled contact form.

## 1. Install

```bash
npm install
```

## 2. Configure contact-form email

1. Create/login to your Formspree account.
2. Create a new form and set the target email where BrandSpire should receive enquiries.
3. Copy the Form ID from the Formspree endpoint. For an endpoint like `https://formspree.io/f/abcxyz12`, the form ID is `abcxyz12`.
4. Duplicate `.env.example` and rename it to `.env`.
5. Replace the placeholder:

```env
VITE_FORMSPREE_ID=abcxyz12
```

Never put private email-account passwords or SMTP secrets in the React frontend.

## 3. Run locally

```bash
npm run dev
```

## 4. Production build

```bash
npm run build
```

## 5. Deploy on Vercel

Push the project to GitHub or import the folder/repository into Vercel. Add `VITE_FORMSPREE_ID` to the Vercel project's Environment Variables, then deploy.

## Included projects

- BrandSpire CRM — https://brandspire-crm.vercel.app/dashboard
- Demon's Biller — https://demon-s-biller.vercel.app/create-bill
- KisanSetu — https://kisan-setu-gamma.vercel.app/
