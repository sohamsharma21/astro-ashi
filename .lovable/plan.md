

# AstroAshi Advanced Spiritual Growth Features — Implementation Plan

## Overview

5 new features to add: Spiritual Growth Tracker, Personalized Daily Routine, Worship Place Finder, Life Path Planner, and Multi-Faith Learning Library.

---

## Database Changes (Single Migration)

New tables:

- **`spiritual_growth_logs`** — Tracks daily spiritual activities (user_id, activity_type, completed_date). Activity types: meditation, prayer, gratitude, good_deeds, scripture_reading.
- **`spiritual_badges`** — Earned achievement badges (user_id, badge_key, earned_at).
- **`life_goals`** — User-created dharma/life goals (user_id, title, description, category, religion_guidance, milestones JSONB, progress integer 0-100, completed boolean).

No new tables needed for: Worship Place Finder (uses Google Maps API client-side), Learning Library (static data file), or Personalized Routine (extends existing `spiritual_routine_logs` table).

RLS: All tables scoped to `auth.uid()` for SELECT/INSERT/DELETE. life_goals also gets UPDATE.

---

## Feature 11: Spiritual Growth Tracker

**New page: `src/pages/SpiritualProgress.tsx`**

Aggregates data from existing tables:
- `spiritual_routine_logs` → prayer/meditation completions
- `karma_deeds` → good deeds count
- `gratitude_entries` → gratitude journal entries
- New `spiritual_growth_logs` for scripture reading

Plus new `spiritual_badges` table for achievements.

UI: Daily/Weekly/Monthly tabs with progress bars per activity. Streak counter. Badge gallery with milestones (7d, 15d, 30d, 45d, 60d, 90d meditation streak; Kindness Champion at 50 karma deeds; Gratitude Master at 30 journal entries).

**New data file: `src/lib/spiritualBadgesData.ts`** — Badge definitions with icons, thresholds, bilingual labels.

---

## Feature 12: Personalized Daily Spiritual Routine

**Enhance existing `src/pages/SpiritualRoutine.tsx`**

Add sections grouped by time of day (Morning, Afternoon, Evening). Add customization — users can add/remove routine items. Add routine reminders UI (notification preferences).

The existing page already has religion-based routines and completion tracking. Enhancement:
- Group routines by `defaultTime` into Morning/Afternoon/Evening sections
- Add "Add Custom Routine" dialog
- Add reminder toggle per routine item
- Show completion percentage per time block

**Update `src/lib/spiritualRoutineData.ts`** — Add more items per religion covering inspiration reading, mindfulness reminders, good deed suggestions, reflection.

---

## Feature 13: Global Worship Place Finder

**New page: `src/pages/WorshipPlaces.tsx`**

Uses browser Geolocation API + Google Maps Places API (via Google Maps JavaScript SDK loaded from CDN) to find nearby religious places.

Search by religion type (Temple, Mosque, Church, Gurudwara, etc.). Shows name, address, rating, opening hours, and directions button (opens Google Maps).

Map view using embedded Google Maps. List view with cards.

**Requires**: Google Maps API key added as a secret. Will prompt user to add `GOOGLE_MAPS_API_KEY` to `.env` as `VITE_GOOGLE_MAPS_API_KEY`.

---

## Feature 14: Life Goals & Dharma Path Planner

**New page: `src/pages/LifePathPlanner.tsx`**

Uses new `life_goals` table. CRUD for goals with:
- Goal creation dialog (title, description, category)
- Milestone tracking (JSONB array of milestones with done/not-done)
- Progress slider (0-100%)
- Religion-specific spiritual suggestions using `faithModules`

Categories: Patience, Community, Prayer, Inner Peace, Discipline, Compassion.

**New data file: `src/lib/lifeGoalsData.ts`** — Suggested goals per religion with milestones.

---

## Feature 15: Multi-Faith Learning Library

**New page: `src/pages/SpiritualKnowledge.tsx`**

Static content library using a new data file.

**New data file: `src/lib/spiritualKnowledgeData.ts`** — Curated content organized by:
- Sacred Texts Summaries (Gita, Quran, Bible, Dhammapada, etc.)
- Spiritual Teachings
- Stories of Prophets & Saints
- Meditation Knowledge

Each entry: title, content (markdown), religion, category, icon, bilingual.

Features: Search, bookmark (localStorage), share (Web Share API).

---

## Navigation & Routing Updates

### New routes in App.tsx (5 new protected routes):
- `/spiritual-progress`
- `/worship-places`
- `/life-path`
- `/spiritual-knowledge`

### Update `navigationConfig.ts` — Add 4 new nav items.

### Update `ServicesSection.tsx` — Add 4 new service cards.

### Update dashboard shortcuts — Add 4 new shortcuts to `SpiritualQuickAccess`.

### Update BottomTabBar — Change "Music" tab to "Knowledge" (`/spiritual-knowledge`).

---

## File Changes Summary

| Action | File |
|--------|------|
| Create | `supabase/migrations/..._spiritual_growth.sql` |
| Create | `src/lib/spiritualBadgesData.ts` |
| Create | `src/lib/lifeGoalsData.ts` |
| Create | `src/lib/spiritualKnowledgeData.ts` |
| Create | `src/pages/SpiritualProgress.tsx` |
| Create | `src/pages/WorshipPlaces.tsx` |
| Create | `src/pages/LifePathPlanner.tsx` |
| Create | `src/pages/SpiritualKnowledge.tsx` |
| Edit | `src/pages/SpiritualRoutine.tsx` — Add time-of-day grouping, customization |
| Edit | `src/lib/spiritualRoutineData.ts` — Add more routine items |
| Edit | `src/App.tsx` — Add 4 new routes |
| Edit | `src/lib/navigationConfig.ts` — Add new nav items |
| Edit | `src/components/home/ServicesSection.tsx` — Add new services |
| Edit | `src/components/dashboard/PersonalizedDashboard.tsx` — Add shortcuts |
| Edit | `src/components/navigation/BottomTabBar.tsx` — Update tabs |

---

## Implementation Order

1. Database migration (growth logs, badges, life goals)
2. Static data files (badges, goals, knowledge library)
3. All new/updated pages
4. Navigation and routing updates

