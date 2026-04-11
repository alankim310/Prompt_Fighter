# PromptFighter - Codex Agent Instructions

## Your Scope: Single Mode Only
You are responsible for single mode (story campaign). Do NOT modify multi mode files.

## Your Files
- /app/single/**
- /components/game/BattleScreen.tsx (single mode only)
- /components/game/StageResult.tsx
- /components/game/StageMap.tsx
- /lib/game/stages.ts (stage definitions)
- /lib/claude/prompts-single.ts (single mode system prompt builder)
- /public/backgrounds/{stageId}.png (stage background images)
- /public/characters/hero.png

## Do NOT Touch
- /app/multi/**
- /components/game/MatchmakingQueue.tsx, CharacterRoulette.tsx, MultiRound.tsx, VSScreen.tsx, RoundResult.tsx, MatchResult.tsx
- /lib/claude/prompts-multi.ts
- /lib/claude/characters.ts
- /lib/supabase/** (already set up)
- /middleware.ts
- /app/api/multi-battle/**
- /public/backgrounds/arena.png
- /public/characters/{characterId}.png (multi mode roster)

## Tech Stack
- Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- Supabase for DB (game_progress table) and Auth
- Claude API (Sonnet 4.6) via /app/api/battle/route.ts with structured outputs
- Static images in /public, no runtime image generation

## Single Mode Architecture
- Fixed generic hero character (no character selection, no config, no traits)
- Hero image: /public/characters/hero.png (transparent PNG)
- Background images: /public/backgrounds/{stageId}.png (boss/obstacle on right, left side empty for hero overlay)
- Stages are NOT just battles: battle, obstacle, social, puzzle, boss types
- Player types prompt (no time limit) -> POST /api/battle { prompt, stageId } -> Claude judges -> win/lose
- Win: stage added to cleared_stages, advance if furthest uncleared stage
- Lose: retry same stage with feedback hint
- Previous stages always replayable without affecting progress

## Database: game_progress
- user_id (unique per user)
- substory (int, current furthest)
- stage (int, current furthest)
- cleared_stages (jsonb, array of stage IDs like ["s1-stage1", "s1-stage2"])
- completed (bool)

## Claude API Pattern
All calls through /app/api/battle/route.ts (server-side only).
Use structured outputs (output_config.format with json_schema).
Response schema: { outcome: "win"|"lose", score: int, narrative: string, feedback: string }

## Stage Definition Template
```typescript
interface Stage {
  id: string;                   // e.g. "s1-stage1", used in cleared_stages
  substoryId: number;
  stageNumber: number;
  type: "battle" | "obstacle" | "social" | "puzzle" | "boss";
  title: string;
  description: string;          // Story context shown to player
  backgroundImage: string;      // /public/backgrounds/{stageId}.png
  enemyOrChallenge: string;
  difficulty: number;
  systemPromptContext: string;
}
```

## Judge Logic & Scoring: TBD
System prompts, scoring rubrics, difficulty scaling to be defined separately.
