

# AstroAshi Global Spiritual Wellness Upgrade — Implementation Plan

This plan covers 5 major features to transform AstroAshi into a global spiritual wellness platform. Given the scale, I'll implement them incrementally with a focus on working functionality and clean architecture.

---

## Overview of Features

1. **AI Spiritual Guide** — New edge function + chat page for faith-personalized spiritual Q&A
2. **Karma / Good Deeds Tracker** — Daily deeds with streaks, points, and progress
3. **Devotional Music & Chant Library** — Multi-faith audio library with player
4. **Sleep Stories & Relaxation** — Sleep timer, ambient audio, spiritual stories
5. **Global Spiritual Community** — Discussion posts, comments, likes, groups

---

## Database Changes (Single Migration)

New tables:
- **`karma_deeds`** — Tracks completed good deeds per user (user_id, deed_key, points, completed_date)
- **`community_posts`** — Forum posts (user_id, title, content, category, group_name, likes_count, is_anonymous)
- **`community_comments`** — Comments on posts (user_id, post_id FK, content, is_anonymous)
- **`community_likes`** — Like tracking (user_id, post_id FK, unique constraint)
- **`community_reports`** — Content moderation reports (reporter_id, post_id, comment_id, reason)

RLS policies on all tables scoped to `auth.uid()`. Community posts/comments readable by all authenticated users; writeable only by owner.

No new tables needed for music/sleep stories (static data files) or AI Spiritual Guide (reuses existing `ai_questions` table).

---

## Feature 6: AI Spiritual Guide

### Backend
- **New edge function: `spiritual-guide/index.ts`** — Similar to `ask-astroashi` but with a spiritual wellness system prompt instead of astrological. Fetches user's religion from profile, builds a faith-specific system prompt with sacred text references. Uses Lovable AI (`google/gemini-3-flash-preview`).

### Frontend
- **New page: `src/pages/SpiritualGuide.tsx`** — Chat interface modeled after `AskAstroAshi.tsx` but with spiritual suggestion buttons ("How to find peace?", "Prayer for strength", etc.) personalized by religion. Includes voice input, save conversation, markdown rendering.

---

## Feature 7: Karma / Good Deeds Tracker

### Data
- **`src/lib/karmaData.ts`** — Static deed suggestions per religion with points, bilingual labels, categories (kindness, charity, prayer, service).

### Frontend
- **New page: `src/pages/KarmaTracker.tsx`** — Daily deed cards with checkmarks, streak counter, karma points display, weekly/monthly progress charts (recharts). Religion-specific deed suggestions.

---

## Feature 8: Devotional Music & Chant Library

### Data
- **`src/lib/devotionalMusicData.ts`** — Static catalog of audio entries with title, artist, religion, category, duration, and audio URL (placeholder URLs for now — will use free/royalty-free sources or user can add their own).

### Frontend
- **New page: `src/pages/DevotionalMusic.tsx`** — Grid/list of tracks filtered by religion and category. HTML5 audio player with play/pause, favorite toggle, background play support. Categories: Meditation, Prayer, Relaxation.

---

## Feature 9: Sleep Stories & Relaxation

### Data
- **`src/lib/sleepStoriesData.ts`** — Static catalog of sleep stories and ambient sounds per faith tradition.

### Frontend
- **New page: `src/pages/SleepRelaxation.tsx`** — Dark-themed UI with sleep timer, story cards, nature sounds player, soothing CSS animations (floating particles). Integrates with existing `ambientSoundEngine.ts`.

---

## Feature 10: Global Spiritual Community

### Frontend
- **New page: `src/pages/Community.tsx`** — Tab-based layout: Feed, Groups, My Posts. Create post dialog, comment threads, like buttons, anonymous toggle. Report button for moderation.
- **New component: `src/components/community/PostCard.tsx`** — Single post display with like/comment/report actions.
- **New component: `src/components/community/CreatePostDialog.tsx`** — Form for new posts.

---

## Navigation Updates

### Bottom Tab Bar
Update to: **Home | Guide | Music | Community | Profile** (5 tabs)

### Routes in App.tsx
Add 4 new protected routes: `/spiritual-guide`, `/karma-tracker`, `/devotional-music`, `/sleep-relaxation`, `/community`

### Services Section (Home page)
Add all 5 new features to the Cosmic Services grid.

### Navigation Config
Add all new pages to `navigationConfig.ts`.

---

## File Changes Summary

| Action | File |
|--------|------|
| Create | `supabase/migrations/..._spiritual_features.sql` |
| Create | `supabase/functions/spiritual-guide/index.ts` |
| Create | `src/lib/karmaData.ts` |
| Create | `src/lib/devotionalMusicData.ts` |
| Create | `src/lib/sleepStoriesData.ts` |
| Create | `src/pages/SpiritualGuide.tsx` |
| Create | `src/pages/KarmaTracker.tsx` |
| Create | `src/pages/DevotionalMusic.tsx` |
| Create | `src/pages/SleepRelaxation.tsx` |
| Create | `src/pages/Community.tsx` |
| Create | `src/components/community/PostCard.tsx` |
| Create | `src/components/community/CreatePostDialog.tsx` |
| Edit | `src/App.tsx` — Add 5 new routes |
| Edit | `src/lib/navigationConfig.ts` — Add new nav items |
| Edit | `src/components/navigation/BottomTabBar.tsx` — Update tabs |
| Edit | `src/components/home/ServicesSection.tsx` — Add new services |
| Edit | `supabase/config.toml` — Add spiritual-guide function |

---

## Implementation Order

1. Database migration (community tables + karma table)
2. Edge function for Spiritual Guide
3. Static data files (karma, music, sleep)
4. All 5 new pages
5. Navigation and routing updates

All pages follow the existing cosmic design system with glass cards, framer-motion animations, mobile-first layout, and bilingual EN/HI support.

