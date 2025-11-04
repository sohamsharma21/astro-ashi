# AstroAshi Deployment Guide

## Prerequisites

Before deploying, ensure you have:
- A Vercel account
- A Supabase project set up
- Resend API key for email functionality
- Google Gemini API key for AI features

## Environment Variables

### Supabase Configuration

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the following values:
   - Project URL → `VITE_SUPABASE_URL`
   - Project API Key (anon/public) → `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Project Reference ID → `VITE_SUPABASE_PROJECT_ID`

### Email Configuration (Resend)

1. Sign up at [Resend.com](https://resend.com)
2. Verify your domain at https://resend.com/domains
3. Create an API key at https://resend.com/api-keys
4. Add `RESEND_API_KEY` to Supabase Edge Function Secrets

### AI Configuration (Google Gemini)

1. Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Add `GEMINI_API_KEY` to Supabase Edge Function Secrets

### Supabase Authentication Setup

1. Go to Supabase Dashboard > Authentication > URL Configuration
2. Set **Site URL** to your deployed URL (e.g., `https://astroashi.vercel.app`)
3. Add **Redirect URLs**:
   - `https://astroashi.vercel.app`
   - `https://astroashi.vercel.app/**`
   - Your preview URLs if needed

### Supabase SMTP Configuration (Optional - for custom email templates)

1. Go to Supabase Dashboard > Authentication > SMTP Settings
2. Configure Resend SMTP:
   - Host: `smtp.resend.com`
   - Port: `587`
   - Username: `resend`
   - Password: Your `RESEND_API_KEY`
   - From: `"AstroAshi" <onboarding@resend.dev>`

### Supabase Auth Hooks (for Magic Link Emails)

1. Go to Supabase Dashboard > Authentication > Hooks
2. Add a hook for "Send Magic Link":
   - Method: `POST`
   - URL: `https://your-project-id.supabase.co/functions/v1/send-magic-link`

## Deploying to Vercel

### Method 1: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Add environment variables:
   ```bash
   vercel env add VITE_SUPABASE_PROJECT_ID
   vercel env add VITE_SUPABASE_PUBLISHABLE_KEY
   vercel env add VITE_SUPABASE_URL
   ```

### Method 2: Using Vercel Dashboard

1. Push your code to GitHub/GitLab/Bitbucket

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)

3. Click "New Project"

4. Import your repository

5. Add Environment Variables:
   - `VITE_SUPABASE_PROJECT_ID`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_URL`

6. Click "Deploy"

## Post-Deployment Checklist

### 1. Update Supabase URLs
- Update Site URL and Redirect URLs in Supabase with your Vercel URL

### 2. Test All Features
- [ ] User authentication (sign up, login, logout)
- [ ] Google OAuth login
- [ ] Daily horoscope generation
- [ ] Kundli generator with AI insights
- [ ] Ask Astro AI chat
- [ ] Consultation booking with email verification
- [ ] Profile updates and preferences
- [ ] Navigation icon preferences with Apply button

### 3. Verify Email Functionality
- [ ] Welcome emails on signup
- [ ] Magic link emails for passwordless login
- [ ] Booking confirmation emails
- [ ] Booking verification emails

### 4. SEO Verification
- [ ] Check meta tags on all pages
- [ ] Verify sitemap.xml is accessible at `/sitemap.xml`
- [ ] Verify robots.txt is accessible at `/robots.txt`
- [ ] Test Open Graph tags with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)

### 5. Performance Testing
- [ ] Run Lighthouse audit
- [ ] Check mobile responsiveness
- [ ] Test loading speeds
- [ ] Verify all images are optimized

## Google Search Console Setup

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property (your Vercel URL)
3. Verify ownership (use DNS or HTML file method)
4. Submit sitemap: `https://astroashi.vercel.app/sitemap.xml`
5. Request indexing for important pages

## Monitoring

### Vercel Analytics
- Enable Vercel Analytics in your project settings
- Monitor page views, performance, and user engagement

### Supabase Monitoring
- Check edge function logs for errors
- Monitor database queries and performance
- Review authentication metrics

## Troubleshooting

### Common Issues

**Issue: Authentication not working**
- Verify Site URL and Redirect URLs in Supabase
- Check that environment variables are correctly set
- Ensure magic link hook is configured

**Issue: Emails not sending**
- Verify RESEND_API_KEY is added to Supabase secrets
- Check that email domain is verified in Resend
- Review edge function logs for errors

**Issue: AI features not working**
- Verify GEMINI_API_KEY is added to Supabase secrets
- Check edge function logs for API errors
- Ensure sufficient API quota in Google AI Studio

**Issue: 404 on dynamic routes**
- Verify `vercel.json` is properly configured
- Check that routing is set up correctly in `App.tsx`

## Support

For issues or questions:
- Check Supabase logs: Project Dashboard > Edge Functions > Logs
- Review Vercel deployment logs
- Verify all environment variables are set correctly

## Security Notes

- Never commit `.env` file to version control
- Keep API keys secure in Supabase Edge Function Secrets
- Regularly rotate API keys
- Monitor for suspicious activity in Supabase Auth logs
- Keep dependencies updated for security patches
