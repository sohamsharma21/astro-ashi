

# Enhance Ask AstroAshi AI Chat

## Current Issues
- ScrollArea has `max-h-[60vh]` but auto-scroll may not work reliably with Radix ScrollArea
- UI could be more polished with avatars, better message bubbles, typing animation

## Plan

### 1. Fix Scrollable Chat Area
- Replace Radix `ScrollArea` with a plain `div` using `overflow-y-auto` and proper `flex` layout so the chat area fills available space and scrolls reliably
- Set the card to a fixed height (`h-[calc(100vh-280px)]`) so it fills the viewport
- Fix auto-scroll using `scrollIntoView` on the inner div

### 2. Enhanced Message Bubbles
- Add avatar icons: AstroAshi logo for assistant, user initial for user messages
- Add subtle gradient backgrounds to message bubbles
- Improve timestamp styling
- Add a "typing" dots animation instead of just a spinner

### 3. Better Empty State
- Add a gradient glow behind the sparkles icon
- Improve suggestion card hover effects with scale animation

### 4. Input Area Improvements
- Auto-grow textarea
- Add a subtle glow effect on the send button when input is present
- Voice-like modern rounded input area

### 5. Visual Polish
- Add cosmic gradient header with animated sparkle
- Message appear animation with stagger
- Smooth fade-in for the loading indicator with animated dots

### Files to Edit
- `src/pages/AskAstroAshi.tsx` — all changes in this single file

