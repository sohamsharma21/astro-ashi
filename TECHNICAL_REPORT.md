# AstroAshi — Complete Technical Report

**Generated:** 2026-03-11  
**Purpose:** Enable any developer to understand, debug, and deploy the AstroAshi application.

---

## 1. Project Overview

AstroAshi is a full-stack **astrology SaaS platform** built for Indian users. It provides AI-powered horoscopes, Kundli (birth chart) generation, spiritual tools, and community features — all with bilingual (English/Hindi) support.

### Core Features

| Feature | Description |
|---------|-------------|
| **Daily Horoscope** | AI-generated daily predictions for all 12 zodiac signs |
| **Kundli Generator** | Birth chart calculation with planetary positions and AI insights |
| **Ask AstroAshi** | AI chatbot for personalized astrological guidance |
| **Compatibility Checker** | Love/relationship compatibility analysis |
| **Palm Reading** | AI-based palm line analysis via image upload |
| **Face Reading** | AI-based face analysis via image upload |
| **Panchang** | Daily Hindu calendar with tithi, nakshatra, yoga, karana |
| **Spiritual Guide** | Religion-aware AI spiritual counselor |
| **Karma Tracker** | Daily good deeds tracking with points |
| **Meditation & Sleep** | Guided meditation sessions and sleep stories |
| **Sacred Calendar** | Hindu festival calendar |
| **Devotional Music** | Curated devotional audio content |
| **Community** | Posts, comments, likes, anonymous posting |
| **Gratitude Journal** | Daily gratitude entries with mood tracking |
| **Spiritual Challenges** | Multi-day spiritual practice challenges |
| **Life Path Planner** | Goal setting with religious guidance |
| **PWA Support** | Installable progressive web app |

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 5 |
| **Styling** | Tailwind CSS 3 + shadcn/ui (Radix primitives) |
| **Animation** | Framer Motion |
| **State/Data** | TanStack React Query v5 |
| **Routing** | React Router v6 |
| **Backend** | Supabase Edge Functions (Deno runtime) |
| **Database** | Supabase PostgreSQL |
| **Authentication** | Supabase Auth (Email/Password + Google OAuth) |
| **File Storage** | Supabase Storage (avatars bucket) |
| **AI Provider** | Google Gemini (via direct API + Lovable AI Gateway) |
| **Email Service** | Resend API |
| **Hosting** | Vercel (frontend) + Supabase (backend) |
| **PWA** | vite-plugin-pwa (Workbox) |

---

## 3. Project Structure

```
astroashi/
├── public/                          # Static assets
│   ├── astroashi-logo.png
│   ├── favicon.ico / favicon.png
│   ├── pwa-192x192.png / pwa-512x512.png
│   ├── robots.txt
│   ├── sitemap.xml
│   └── lovable-uploads/             # User-uploaded assets
│
├── src/
│   ├── App.tsx                      # Root component with routes
│   ├── main.tsx                     # Entry point
│   ├── index.css                    # Global styles + design tokens
│   ├── App.css                      # App-level styles
│   │
│   ├── components/
│   │   ├── AuthProvider.tsx         # Auth context provider
│   │   ├── Navigation.tsx           # Main navigation
│   │   ├── ProtectedRoute.tsx       # Auth guard
│   │   ├── SEOHead.tsx              # Dynamic meta tags
│   │   ├── StarBackground.tsx       # Cosmic background effect
│   │   ├── FloatingPlanets.tsx      # Decorative planets
│   │   ├── Preloader.tsx            # Loading screen
│   │   ├── Footer.tsx
│   │   ├── ProfileManager.tsx
│   │   ├── OptimizedImage.tsx
│   │   ├── PWAInstallPrompt.tsx
│   │   │
│   │   ├── ui/                      # shadcn/ui components (40+ files)
│   │   ├── navigation/              # Nav sub-components
│   │   ├── dashboard/               # Dashboard widgets
│   │   ├── home/                    # Landing page sections
│   │   ├── horoscope/               # Horoscope UI
│   │   ├── kundli/                  # Kundli chart UI
│   │   ├── compatibility/           # Compatibility UI
│   │   ├── astro-love/              # Love compatibility UI
│   │   ├── community/               # Community posts/comments
│   │   ├── contact/                 # Contact form
│   │   ├── education/               # Astrology learning
│   │   ├── notifications/           # Push notification bell
│   │   ├── onboarding/              # Kundli onboarding modal
│   │   ├── profile/                 # Profile management
│   │   └── reading-history/         # Reading history UI
│   │
│   ├── pages/                       # 30+ route pages
│   │   ├── Index.tsx                # Landing page
│   │   ├── Auth.tsx                 # Login/Signup
│   │   ├── DailyHoroscope.tsx
│   │   ├── KundliGenerator.tsx
│   │   ├── AskAstroAshi.tsx
│   │   ├── Compatibility.tsx
│   │   ├── PalmReading.tsx
│   │   ├── FaceReading.tsx
│   │   ├── Panchang.tsx
│   │   ├── Community.tsx
│   │   ├── Meditation.tsx
│   │   ├── SpiritualGuide.tsx
│   │   ├── Profile.tsx
│   │   ├── Settings.tsx
│   │   └── ... (15+ more pages)
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useHoroscope.ts
│   │   ├── useKundli.ts
│   │   ├── useCompatibility.ts
│   │   ├── useAstroLove.ts
│   │   ├── useUserProfile.ts
│   │   ├── useReadingHistory.ts
│   │   ├── useZodiacPreference.ts
│   │   ├── useNavPreference.ts
│   │   ├── useAvatarUpload.ts
│   │   ├── usePushNotifications.ts
│   │   └── use-mobile.tsx
│   │
│   ├── services/
│   │   ├── api.ts                   # Supabase API helpers
│   │   └── swissEphemerisService.ts # Horoscope data service
│   │
│   ├── lib/                         # Utilities & data
│   │   ├── utils.ts                 # cn() helper
│   │   ├── constants.ts             # Zodiac signs, etc.
│   │   ├── auth.tsx                 # Auth context
│   │   ├── translations.ts          # i18n strings
│   │   ├── globalTranslations.ts
│   │   ├── navigationConfig.ts
│   │   ├── faithModules.ts
│   │   ├── meditationData.ts
│   │   ├── sleepStoriesData.ts
│   │   ├── devotionalMusicData.ts
│   │   ├── festivalData.ts
│   │   ├── inspirationData.ts
│   │   ├── karmaData.ts
│   │   ├── challengesData.ts
│   │   ├── lifeGoalsData.ts
│   │   ├── personalityTestData.ts
│   │   ├── spiritualBadgesData.ts
│   │   ├── spiritualKnowledgeData.ts
│   │   ├── spiritualRoutineData.ts
│   │   └── ambientSoundEngine.ts
│   │
│   └── integrations/
│       └── supabase/
│           ├── client.ts            # Supabase client init
│           └── types.ts             # Auto-generated DB types (READ-ONLY)
│
├── supabase/
│   ├── config.toml                  # Project config (project_id)
│   ├── functions/
│   │   ├── _shared/
│   │   │   ├── cors.ts              # CORS headers
│   │   │   ├── security.ts          # Rate limiting, logging
│   │   │   └── types.ts             # Shared types
│   │   │
│   │   ├── ai-life-insights/        # Personalized AI life insights
│   │   ├── ask-astroashi/           # AI chatbot
│   │   ├── calculate-kundli/        # Kundli planetary calculations
│   │   ├── generate-horoscope/      # Daily horoscope generation
│   │   ├── generate-kundli/         # Full kundli report
│   │   ├── generate-kundli-insights/# AI insights for kundli
│   │   ├── generate-personalized-prediction/ # User-specific predictions
│   │   ├── get-astro-insight/       # General astro Q&A
│   │   ├── get-panchang/            # Hindu calendar data
│   │   ├── face-reading/            # AI face analysis
│   │   ├── palm-reading/            # AI palm analysis
│   │   ├── spiritual-guide/         # Spiritual counselor AI
│   │   ├── send-welcome-email/      # Welcome email via Resend
│   │   ├── send-auth-email/         # Auth emails
│   │   ├── send-verification-email/ # Email verification
│   │   ├── send-push-notification/  # Push notifications
│   │   ├── verify-email/            # Email token verification
│   │   └── delete-account/          # Account deletion
│   │
│   └── migrations/                  # SQL migrations (READ-ONLY)
│
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── vercel.json
├── postcss.config.js
├── eslint.config.js
├── components.json                  # shadcn/ui config
├── index.html                       # HTML entry
├── .env                             # Environment variables
├── .env.example
├── DEPLOYMENT.md
├── IMPLEMENTATION_SUMMARY.md
├── GOOGLE_OAUTH_SETUP.md
└── README.md
```

---

## 4. Dependencies

### Production Dependencies

| Package | Version | Category |
|---------|---------|----------|
| `react` | ^18.3.1 | Core |
| `react-dom` | ^18.3.1 | Core |
| `react-router-dom` | ^6.26.2 | Routing |
| `@supabase/supabase-js` | ^2.98.0 | Backend |
| `@supabase/storage-js` | ^2.7.2 | File Storage |
| `@tanstack/react-query` | ^5.56.2 | Data Fetching |
| `framer-motion` | ^12.23.24 | Animation |
| `lucide-react` | ^0.462.0 | Icons |
| `react-helmet-async` | ^2.0.5 | SEO |
| `react-hook-form` | ^7.53.0 | Forms |
| `@hookform/resolvers` | ^3.9.0 | Form Validation |
| `zod` | ^3.23.8 | Schema Validation |
| `react-markdown` | ^10.1.0 | Markdown Rendering |
| `recharts` | ^2.12.7 | Charts |
| `date-fns` | ^3.6.0 | Date Utilities |
| `sonner` | ^1.5.0 | Toast Notifications |
| `next-themes` | ^0.3.0 | Theme Switching |
| `dompurify` | ^3.3.2 | XSS Protection |
| `class-variance-authority` | ^0.7.1 | Component Variants |
| `clsx` | ^2.1.1 | Class Merging |
| `tailwind-merge` | ^2.5.2 | Tailwind Merging |
| `tailwindcss-animate` | ^1.0.7 | CSS Animations |
| `cmdk` | ^1.0.0 | Command Menu |
| `input-otp` | ^1.2.4 | OTP Input |
| `vaul` | ^0.9.3 | Drawer |
| `embla-carousel-react` | ^8.3.0 | Carousel |
| `react-day-picker` | ^8.10.1 | Date Picker |
| `react-resizable-panels` | ^2.1.3 | Resizable Panels |
| `vite-plugin-pwa` | 0.19.8 | PWA Support |
| `resend` | ^2.0.0 | Email (⚠️ see note below) |
| `serialize-javascript` | 7.0.4 | Serialization |
| **`@radix-ui/*`** | various | 20+ Radix UI primitives |

### ⚠️ Problematic Dependencies (Removed / To Remove)

| Package | Status | Issue |
|---------|--------|-------|
| `swisseph` | **MUST BE REMOVED** | Native C++ module requiring `node-gyp`. Causes build failures on Vercel. |
| `resend` | **Should be removed** | Server-side only SDK. Not usable in browser. Only used in Edge Functions (which import it via Deno/npm). |

### Dev Dependencies

| Package | Version |
|---------|---------|
| `vite` | ^5.4.1 |
| `@vitejs/plugin-react-swc` | ^3.5.0 |
| `typescript` | ^5.5.3 |
| `tailwindcss` | ^3.4.11 |
| `postcss` | ^8.4.47 |
| `autoprefixer` | ^10.4.20 |
| `eslint` | ^9.9.0 |
| `@tailwindcss/typography` | ^0.5.15 |
| `lovable-tagger` | ^1.1.7 |

---

## 5. Build Configuration

### package.json Scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "build:dev": "vite build --mode development",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

### Vite Configuration (`vite.config.ts`)

- **Dev server:** Port 8080, host `::`
- **Plugins:** `@vitejs/plugin-react-swc`, `lovable-tagger` (dev only), `VitePWA`
- **Build target:** `esnext`
- **Minifier:** `esbuild`
- **Code splitting:** Manual chunks for react, UI libs, supabase, react-query
- **Path alias:** `@` → `./src`

### Vercel Configuration (`vercel.json`)

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    { "source": "/sitemap.xml", "headers": [{ "key": "Content-Type", "value": "application/xml" }] },
    { "source": "/robots.txt", "headers": [{ "key": "Content-Type", "value": "text/plain" }] }
  ]
}
```

### Vercel Deployment Settings

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Build Command** | `vite build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |
| **Node.js Version** | Should be pinned to **20.x** (see Known Issues) |

---

## 6. Astrology Engine

### Architecture

All astrology calculations run on **Supabase Edge Functions (Deno)** — NOT in the browser.

```
Browser (React)
  │
  ├─→ swissEphemerisService.ts  (API client, NO native code)
  │     └─→ supabase.functions.invoke('generate-horoscope')
  │
  └─→ useKundli.ts hook
        ├─→ supabase.functions.invoke('calculate-kundli')
        └─→ supabase.functions.invoke('generate-kundli-insights')
```

### Horoscope Flow

1. `useHoroscope` hook calls `swissEphemerisService.getDailyHoroscope(sign)`
2. Service checks `daily_horoscopes` table in Supabase for cached data
3. If not found, invokes `generate-horoscope` Edge Function
4. Edge Function uses **simplified Julian Day calculations** (pure math, no native libs)
5. Result cached in `daily_horoscopes` table and returned

### Kundli Flow

1. `useKundli` hook inserts birth data into `kundli_data` table
2. Invokes `calculate-kundli` Edge Function
3. Edge Function computes: Julian Day → planetary longitudes → ascendant → houses
4. Optionally invokes `generate-kundli-insights` for AI analysis (Gemini)
5. Results returned and optionally saved to user profile

### Where `swisseph` Is Referenced

| File | Usage |
|------|-------|
| `src/services/swissEphemerisService.ts` | **Name only** — service wrapper calling Supabase Edge Functions |
| `src/hooks/useHoroscope.ts` | Imports `swissEphemerisService` (no native code) |
| `supabase/functions/generate-horoscope/index.ts` | Comment mentioning Swiss Ephemeris (uses pure JS calculations) |
| `supabase/functions/calculate-kundli/index.ts` | Pure JS Julian Day calculations |
| `supabase/functions/generate-kundli/index.ts` | Pure JS with Ayanamsa corrections |

**⚠️ CRITICAL:** The `swisseph` npm package is NOT actually imported or used anywhere in the codebase. It was listed in `package.json` but causes build failures. It must be removed.

---

## 7. Environment Variables

### Frontend (Vite — exposed to browser)

| Variable | Source | Description |
|----------|--------|-------------|
| `VITE_SUPABASE_URL` | Supabase Dashboard → Settings → API | Project API URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase Dashboard → Settings → API | Anon/public key (safe for browser) |
| `VITE_SUPABASE_PROJECT_ID` | Supabase Dashboard → Settings → General | Project reference ID |

### Supabase Edge Function Secrets

| Secret | Source | Used By |
|--------|--------|---------|
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/app/apikey) | get-astro-insight, generate-horoscope, face-reading, palm-reading |
| `LOVABLE_API_KEY` | Lovable AI Gateway | ai-life-insights, generate-kundli-insights, spiritual-guide, ask-astroashi |
| `RESEND_API_KEY` | [Resend Dashboard](https://resend.com/api-keys) | send-welcome-email, send-auth-email, send-verification-email |
| `SUPABASE_URL` | Auto-provided | All Edge Functions |
| `SUPABASE_ANON_KEY` | Auto-provided | All Edge Functions |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-provided | Edge Functions needing admin access |
| `SUPABASE_DB_URL` | Auto-provided | Direct DB connections |

---

## 8. Database Schema

### Tables (17 tables)

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles (name, birth data, preferences, kundli) |
| `daily_horoscopes` | Cached daily horoscope content (en/hi) |
| `kundli_data` | Saved birth chart input data |
| `kundli_reports` | Generated chart + AI insights |
| `user_predictions` | Personalized predictions |
| `user_mahadasha` | Dasha period data |
| `user_zodiac_preferences` | Saved zodiac sign preference |
| `reading_history` | Content reading log |
| `ai_questions` | AI Q&A history |
| `astro_conversations` | Chat conversation history |
| `community_posts` | Community forum posts |
| `community_comments` | Post comments |
| `community_likes` | Post likes |
| `community_reports` | Content reports |
| `gratitude_entries` | Gratitude journal entries |
| `karma_deeds` | Karma tracker deeds |
| `spiritual_challenges_progress` | Challenge progress |
| `spiritual_routine_logs` | Routine completion logs |
| `spiritual_growth_logs` | Growth activity logs |
| `spiritual_badges` | Earned badges |
| `spiritual_personality_results` | Personality test results |
| `life_goals` | Life goals with milestones |
| `notifications` | User notifications |
| `push_subscriptions` | Push notification subscriptions |
| `panchang_cache` | Cached panchang data |
| `email_verifications` | Email verification tokens |
| `audit_events` | Security audit log |
| `articles` | Published articles |
| `astrological_events` | Upcoming astro events |
| `saved_inspirations` | Saved quotes |

### Views

- `community_posts_safe` — Posts without exposing user_id for anonymous posts
- `community_comments_safe` — Comments without exposing user_id for anonymous comments

### Database Functions

- `handle_new_user()` — Trigger: auto-creates profile on signup
- `award_spiritual_badge()` — SECURITY DEFINER: awards badges
- `record_karma_deed()` — SECURITY DEFINER: records karma deeds with validation

---

## 9. Edge Functions (19 functions)

| Function | Purpose | AI Provider |
|----------|---------|-------------|
| `generate-horoscope` | Daily horoscope generation | Gemini |
| `calculate-kundli` | Planetary position calculation | None (pure math) |
| `generate-kundli` | Full kundli report | None (pure math) |
| `generate-kundli-insights` | AI insights for kundli | Lovable AI Gateway |
| `get-astro-insight` | General astro Q&A | Gemini |
| `ai-life-insights` | Personalized life insights | Lovable AI Gateway |
| `ask-astroashi` | AI chatbot | Lovable AI Gateway |
| `spiritual-guide` | Spiritual counselor | Lovable AI Gateway |
| `generate-personalized-prediction` | User-specific predictions | Gemini/Lovable |
| `get-panchang` | Hindu calendar data | None (pure math) |
| `face-reading` | AI face analysis | Gemini |
| `palm-reading` | AI palm analysis | Gemini |
| `send-welcome-email` | Welcome email | Resend |
| `send-auth-email` | Auth emails | Resend |
| `send-verification-email` | Verification emails | Resend |
| `verify-email` | Email token verification | None |
| `send-push-notification` | Push notifications | None |
| `delete-account` | Account deletion | None |

---

## 10. Known Issues & Build Errors

### ❌ Issue 1: `swisseph` causes Vercel build failure

**Error:**
```
npm error code 1
npm error path /vercel/path0/node_modules/swisseph
npm error command failed: node-gyp rebuild
gyp ERR! stack SyntaxError: Missing parentheses in call to 'print'
```

**Root Cause:** `swisseph` is a native C++ addon requiring `node-gyp` + Python 2.x. Vercel's build environment uses Python 3, which breaks `node-gyp`'s version detection.

**Fix:** Remove `swisseph` from `package.json`. It is NOT imported or used anywhere in the frontend code. All astrology calculations are done in Edge Functions using pure JavaScript.

```bash
npm uninstall swisseph
```

### ⚠️ Issue 2: `resend` in frontend dependencies

**Issue:** The `resend` npm package is a server-side SDK. Including it in frontend `dependencies` adds unnecessary bundle weight. It should only be used in Edge Functions (which import via Deno's npm: specifier).

**Fix:** Remove from `package.json`:
```bash
npm uninstall resend
```

### ⚠️ Issue 3: Deprecated dependencies

Multiple transitive dependencies show deprecation warnings (`rimraf`, `glob`, `request`, `tar`, etc.). These come from `swisseph`'s dependency tree and will disappear when `swisseph` is removed.

### ⚠️ Issue 4: No Node.js version pin

Vercel may use Node 24.x which has stricter `node-gyp` requirements. Pin to Node 20.x:

Add to `package.json`:
```json
{
  "engines": {
    "node": "20.x"
  }
}
```

---

## 11. Fix Suggestions

### Immediate Fixes (Required for Deployment)

1. **Remove `swisseph`** from `package.json` — not used in frontend
2. **Remove `resend`** from `package.json` — server-side only, used via Deno in Edge Functions
3. **Pin Node.js to 20.x** in `package.json` engines field
4. **Clear Vercel build cache** on next deployment

### Architecture Recommendations

| Current | Recommended |
|---------|-------------|
| Simplified JS planetary calculations | Consider [astronomia](https://github.com/nicoptere/astronomia) (pure JS, no native deps) |
| Multiple AI providers (Gemini + Lovable Gateway) | Consolidate to single provider for consistency |
| `serialize-javascript` in frontend | Remove if not actively used |
| 40+ Radix UI packages | Tree-shaking handles this, but audit unused ones |

### If You Need Swiss Ephemeris

If accurate Swiss Ephemeris calculations are needed in the future:
1. **Option A:** Use a hosted Swiss Ephemeris API service (e.g., [astro.com API](https://www.astro.com/))
2. **Option B:** Run a separate Node.js microservice on a platform that supports native modules (Railway, Render, AWS Lambda with Docker)
3. **Option C:** Use WebAssembly build of Swiss Ephemeris (community WASM ports exist)

---

## 12. Deployment Checklist

```
□ Remove swisseph from package.json
□ Remove resend from package.json  
□ Add "engines": { "node": "20.x" } to package.json
□ Push to GitHub
□ Clear Vercel build cache
□ Redeploy
□ Verify VITE_SUPABASE_URL is set in Vercel env vars
□ Verify VITE_SUPABASE_PUBLISHABLE_KEY is set in Vercel env vars
□ Verify VITE_SUPABASE_PROJECT_ID is set in Vercel env vars
□ Update Supabase Auth redirect URLs to match Vercel domain
□ Test: Auth flow (signup, login, Google OAuth)
□ Test: Daily horoscope loads
□ Test: Kundli generation works
□ Test: AI chatbot responds
□ Test: PWA installs correctly
```

---

## 13. Quick Reference

### Supabase Dashboard Links

- [SQL Editor](https://supabase.com/dashboard/project/czpumlrofurdktvjtibl/sql/new)
- [Auth Users](https://supabase.com/dashboard/project/czpumlrofurdktvjtibl/auth/users)
- [Edge Functions](https://supabase.com/dashboard/project/czpumlrofurdktvjtibl/functions)
- [Edge Function Secrets](https://supabase.com/dashboard/project/czpumlrofurdktvjtibl/settings/functions)
- [Storage Buckets](https://supabase.com/dashboard/project/czpumlrofurdktvjtibl/storage/buckets)

### Key Files for Debugging

| Issue | Check These Files |
|-------|------------------|
| Auth not working | `src/components/AuthProvider.tsx`, `src/lib/auth.tsx` |
| Horoscope failing | `src/hooks/useHoroscope.ts`, `src/services/swissEphemerisService.ts`, Edge Function logs |
| Kundli failing | `src/hooks/useKundli.ts`, `supabase/functions/calculate-kundli/index.ts` |
| Build failing | `package.json` (check for native modules), `vite.config.ts` |
| Routing 404s | `vercel.json`, `src/App.tsx` |
| Email not sending | Edge Function logs for `send-welcome-email` |
