# PromptFighter - WildHacks 2026

## Project Overview
AI-powered prompt battle game for WildHacks 2026 (Track 1: Childhood Games).
Players write creative prompts as attacks/actions; Claude API judges outcomes via structured outputs.
Single mode: fixed generic hero, story campaign. Multi mode: 1v1 PvP with character roster.
English only. Deploy to promptfighter.tech.

## Tech Stack
- **Framework**: Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend/DB/Auth/Realtime**: Supabase (PostgreSQL, Auth with Email + Google OAuth, Realtime Broadcast & Presence)
- **AI Judge**: Claude API (Sonnet 4.6) with structured outputs (output_config.format, json_schema)
- **Images**: Pre-generated static assets in /public (no runtime image API calls)
- **Deploy**: Vercel + promptfighter.tech domain

## Architecture

```
/app
  /page.tsx                   # Landing (login or mode select)
  /auth/callback/route.ts     # OAuth redirect handler
  /single
    /page.tsx                 # Stage map (fixed hero, no character select)
    /play/[substoryId]/[stageId]/page.tsx  # Battle/challenge screen
  /multi
    /page.tsx                 # Matchmaking queue
    /battle/[matchId]/page.tsx # PvP battle screen
  /api
    /battle/route.ts          # Single mode Claude judge
    /multi-battle/route.ts    # Multi mode Claude judge
/lib
  /supabase
    /client.ts                # Browser Supabase client
    /server.ts                # Server-side Supabase client
  /claude
    /judge.ts                 # Claude API call helper with structured outputs
    /characters.ts            # Multi mode character configs (TBD)
    /prompts-single.ts        # Single mode system prompt builder (TBD)
    /prompts-multi.ts         # Multi mode system prompt builder (TBD)
  /game
    /stages.ts                # Stage/substory definitions (TBD)
    /types.ts                 # Shared TypeScript types
/components
  /ui                         # shadcn/ui components
  /game
    /BattleScreen.tsx          # Single mode only
    /StageResult.tsx           # Single mode
    /StageMap.tsx              # Single mode
    /MatchmakingQueue.tsx      # Multi mode
    /CharacterRoulette.tsx     # Multi mode roulette animation
    /MultiRound.tsx            # Multi mode only
    /VSScreen.tsx              # Multi mode
    /RoundResult.tsx           # Multi mode
    /MatchResult.tsx           # Multi mode
/public
  /characters
    /hero.png                 # Single mode fixed hero (transparent PNG)
    /{id}.png                 # Multi mode character roster (transparent PNGs)
  /backgrounds
    /{stageId}.png            # Single mode stage backgrounds
    /arena.png                # Multi mode arena background
```

## Key Commands
- `npm run dev` - local dev server
- `npm run build` - production build
- `npx supabase gen types --lang=typescript --project-id <id> > lib/supabase/database.types.ts`

## Database Tables

### game_progress (single mode)
- id (uuid PK), user_id (uuid FK unique), substory (int), stage (int), cleared_stages (jsonb array of stage IDs), completed (bool), created_at

### matches (multi mode)
- id (uuid PK), player1_id (uuid FK), player2_id (uuid FK), rounds (jsonb, each round has characterId + result), winner_id (uuid nullable), status (text), created_at
- No top-level character column. Character is per-round inside rounds jsonb.

## Critical Rules

IMPORTANT: All Claude API calls MUST use structured outputs with output_config.format of type json_schema.

IMPORTANT: Never expose API keys client-side. All Claude API calls go through /app/api/ routes only.

IMPORTANT: Use Supabase Realtime Broadcast for multiplayer game events. Use Presence for matchmaking queue only.

IMPORTANT: Images are static assets in /public. No runtime image generation. Characters are transparent PNGs overlaid on backgrounds via CSS position: absolute.

IMPORTANT: Use @supabase/ssr for server-side auth with cookies. Auth supports Email/Password AND Google OAuth.

IMPORTANT: Single mode uses a FIXED GENERIC HERO. No character selection, no config, no traits. Multi mode characters (with configs/traits) are completely separate.

IMPORTANT: Single mode is NOT just battles. Stages include obstacles, social challenges, puzzles, and boss fights.

IMPORTANT: Multi mode assigns a NEW random character each round (not per match). Player 1's client picks the character and broadcasts "round_start". No draws; Claude always picks a winner.

IMPORTANT: Matchmaking race condition prevention: compare both userIds alphabetically. The userId that sorts first creates the match and becomes player1.

## Realtime Multiplayer Pattern

### Matchmaking
1. Player joins "matchmaking-queue" channel with Presence
2. When 2 players detected, compare userIds alphabetically
3. User with alphabetically-first userId creates match in DB (becomes player1)
4. Broadcasts "match_found" with matchId
5. Both join "match:{matchId}" channel

### Battle (best of 3, no draws)
1. Player 1's client randomly picks character from roster and broadcasts "round_start"
2. Both players see character roulette animation (portraits cycle fast, slow down, land on selected)
3. Both type prompts and broadcast "prompt_submit"
4. Player 1's client calls /api/multi-battle when both submitted
5. Result broadcast as "round_result" (always a winner)
6. Each round gets a NEW random character with roulette
7. First to 2 wins -> "match_complete"

## Claude API Call Pattern
```typescript
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  system: systemPrompt, // TBD
  messages: [{ role: "user", content: playerPrompt }],
  output_config: {
    format: {
      type: "json_schema",
      schema: resultSchema
    }
  }
});
```

## Judge Logic: TBD
- **Single mode**: Claude evaluates prompt vs stage challenge. No character config. Exact system prompt, scoring, difficulty scaling TBD.
- **Multi mode**: Claude evaluates both prompts against the round's character config. Characters have traits, positive keywords (score higher), negative keywords (score lower). Always a winner, no draws. Exact weights, thresholds, system prompt TBD.

## Custom Skills

### .claude/skills/battle-judge/SKILL.md
```
---
name: battle-judge
description: Use when building or modifying the Claude API judge system.
---

# Battle Judge System

Claude API (Sonnet 4.6) judges player prompts via structured outputs.
Single mode: player vs stage challenge. Multi mode: player vs player.

## API Requirements
- Model: claude-sonnet-4-6
- Always use output_config.format with json_schema
- All calls through /app/api/ routes only

## Single Mode Schema: { outcome, score, narrative, feedback }
## Multi Mode Schema: { winner, player1_score, player2_score, narrative, reasoning }
## Multi mode has no "draw" option. Always a winner.

## Character configs, system prompts, scoring rubrics: TBD
```

### .claude/skills/multiplayer/SKILL.md
```
---
name: multiplayer
description: Use when building matchmaking or real-time battle sync.
---

# Multiplayer Architecture

## Matchmaking
- Presence on "matchmaking-queue" channel
- Race condition fix: alphabetically-first userId creates match
- Broadcast "match_found" with matchId

## Battle Rounds (best of 3)
- Player 1 randomly picks character and broadcasts "round_start"
- Both players see character roulette animation (slot machine style)
- Both players broadcast "prompt_submit"
- Player 1 calls /api/multi-battle when both submitted
- Result broadcast as "round_result"
- Always a winner per round (no draws)
- Each round gets a NEW random character with roulette
- First to 2 wins -> "match_complete"

## Channels
- "matchmaking-queue" (Presence)
- "match:{matchId}" (Broadcast)
```

## Style & Design Direction
Use frontend-design plugin. Aesthetic: retro-game inspired but modern, bold, playful.
Dark background, vibrant accents, game-like UI (health bars, stage maps, VS screens).
shadcn/ui base, heavily customized.
