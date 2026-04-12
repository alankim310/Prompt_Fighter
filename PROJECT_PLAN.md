# PromptFighter - Complete Project Plan
## WildHacks 2026 | Track 1: Childhood Games
### Hackathon: April 11-12, 2026 | Deadline: April 12, 11:00 AM CT

---

## Table of Contents
1. [Concept](#1-concept)
2. [Manual Setup (Do First)](#2-manual-setup-do-first)
3. [Claude Code Setup](#3-claude-code-setup)
4. [Architecture](#4-architecture)
5. [Database Schema](#5-database-schema)
6. [Feature Spec: Authentication](#6-feature-spec-authentication)
7. [Feature Spec: Single Mode](#7-feature-spec-single-mode)
8. [Feature Spec: Multi Mode](#8-feature-spec-multi-mode)
9. [Feature Spec: Claude API Judge](#9-feature-spec-claude-api-judge)
10. [Image System](#10-image-system)
11. [UI/UX Pages](#11-uiux-pages)
12. [Deployment & Domain](#12-deployment--domain)
13. [Submission Checklist](#13-submission-checklist)
14. [Multi Mode Characters (TBD)](#14-multi-mode-characters-tbd)
15. [Substories & Stages (TBD)](#15-substories--stages-tbd)

---

## 1. Concept

PromptFighter is a prompt-based battle game inspired by Pokemon turn-based combat. Instead of selecting pre-defined moves, players write creative prompts as their attacks or actions. An AI judge (Claude API) evaluates each prompt to determine outcomes.

**Why it fits Track 1 (Childhood Games):**
- Inspired by shouting cool attack names as kids ("THUNDER SWORD!", "MEGA BEAM!")
- Turn-based combat like Pokemon, but the player creates the moves
- The joy of inventing your own abilities, digitized

**Educational value:**
- Teaches prompt engineering through gameplay
- Character-specific prompts (multi mode) reward understanding of context and specificity

**Two modes:**
- **Single Mode**: Story campaign. The player controls a fixed generic hero character who overcomes various challenges (battles, obstacles, social encounters, puzzles) through creative prompts. No time limit. The hero faces multiple substories on a journey to rescue the princess.
- **Multi Mode**: 1v1 PvP. Clash Royale-style matchmaking. Each round, both players are assigned the same random character (from a roster with defined traits/configs) and write prompts. Claude judges who wins. Best of 3 rounds, no draws.

---

## 2. Manual Setup (Do First)

These steps must be done by hand before coding begins.

### 2.1 Supabase Project
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Name: `promptfighter`
4. Set a database password (save it)
5. Region: US East (closest to Chicago)
6. Wait for project to provision
7. Go to Project Settings > API
8. Copy and save:
   - `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
   - `anon public` key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - `service_role` key (SUPABASE_SERVICE_ROLE_KEY) - keep secret
9. Go to Authentication > Providers
   - Email provider is enabled by default (keep it)
   - Enable **Google OAuth**:
     a. Go to https://console.cloud.google.com
     b. Create a new project (or use existing)
     c. Go to APIs & Services > Credentials
     d. Create OAuth 2.0 Client ID (Web application)
     e. Add authorized redirect URI: `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`
     f. Copy Client ID and Client Secret
     g. Back in Supabase > Authentication > Providers > Google
     h. Toggle on, paste Client ID and Client Secret
10. Go to Authentication > URL Configuration
    - Set Site URL to `http://localhost:3000` (change to `https://promptfighter.space` after deploy)
    - Add `http://localhost:3000/**` and `https://promptfighter.space/**` to Redirect URLs

### 2.2 Supabase Database Tables
Run in SQL Editor (https://supabase.com/dashboard > SQL Editor):

```sql
-- Game progress for single mode
create table public.game_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  substory int not null default 1,
  stage int not null default 1,
  cleared_stages jsonb not null default '[]'::jsonb,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  unique(user_id)
);

alter table public.game_progress enable row level security;

create policy "Users can read own progress"
  on public.game_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.game_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.game_progress for update
  using (auth.uid() = user_id);

-- Matches for multi mode
create table public.matches (
  id uuid primary key default gen_random_uuid(),
  player1_id uuid references auth.users on delete set null,
  player2_id uuid references auth.users on delete set null,
  rounds jsonb not null default '[]'::jsonb,
  winner_id uuid,
  status text not null default 'in_progress',
  created_at timestamptz not null default now()
);

alter table public.matches enable row level security;

create policy "Users can read own matches"
  on public.matches for select
  using (auth.uid() = player1_id or auth.uid() = player2_id);

create policy "Authenticated users can insert matches"
  on public.matches for insert
  with check (auth.uid() = player1_id);

create policy "Players can update own matches"
  on public.matches for update
  using (auth.uid() = player1_id or auth.uid() = player2_id);
```

### 2.3 Supabase Realtime
1. Go to Database > Replication
2. Enable Realtime for `matches` table (toggle on)
3. Broadcast and Presence work by default on the client library - no dashboard config needed

### 2.4 Anthropic API Key
1. Go to https://console.anthropic.com
2. Create API key, name it "promptfighter"
3. Save as ANTHROPIC_API_KEY

### 2.5 Domain
Register `promptfighter.space` through any domain registrar. After Vercel deploy, configure DNS (see Section 12).

### 2.6 GitHub Repository
1. Create new repo: `PromptFighter`
2. Set to **public** (required by WildHacks rules)
3. Do not initialize with README (will push from local)

### 2.7 Vercel Project
1. Go to https://vercel.com/new
2. Import GitHub repo `PromptFighter`
3. Framework: Next.js (auto-detected)
4. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY`
5. Deploy (initial deploy will fail until code is pushed - that's fine)

---

## 3. Claude Code Setup

### 3.1 Initialize Project
```bash
npx create-next-app@latest PromptFighter --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
cd PromptFighter
```

### 3.2 Install Dependencies
```bash
npm install @supabase/supabase-js @supabase/ssr @anthropic-ai/sdk
npx shadcn@latest init
```

### 3.3 Copy CLAUDE.md
Place the CLAUDE.md file (provided separately) in the project root.

### 3.4 Install Plugins
```
/plugin install frontend-design@claude-plugins-official
/plugin install supabase
/plugin install context7
/plugin install vercel
/plugin install github
```

### 3.5 Create Folders and Placeholder Files
```bash
mkdir -p public/characters public/backgrounds
touch public/characters/.gitkeep public/backgrounds/.gitkeep
```

Single mode art is no longer stored in `/public`.
Use Supabase Storage for the single mode hero and stage backgrounds, and keep `/public` for multi mode assets only.

### 3.6 Create Custom Skills
See CLAUDE.md for skill directory structure and contents.

### 3.7 Environment Variables (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=<from Supabase dashboard>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from Supabase dashboard>
SUPABASE_SERVICE_ROLE_KEY=<from Supabase dashboard>
ANTHROPIC_API_KEY=<from Anthropic console>
```

---

## 4. Architecture

### System Overview
```
┌─────────────────────────────────────────────────────┐
│                    Vercel (Frontend + API)           │
│                                                     │
│  Next.js App                                        │
│  ├── Pages (React)                                  │
│  │   ├── Landing / Auth (Email + Google OAuth)      │
│  │   ├── Single Mode (stage map + battle screen)    │
│  │   └── Multi Mode (matchmaking + PvP screen)      │
│  │                                                  │
│  └── API Routes (server-side)                       │
│      ├── /api/battle        ──► Claude API          │
│      └── /api/multi-battle  ──► Claude API          │
│                                                     │
│  Static Assets (/public)                            │
│  ├── Supabase Storage hero/stage assets             │
│  ├── /characters/{id}.png (multi mode roster)       │
│  └── /backgrounds/ (stage bgs + arena bg)           │
└──────────────┬──────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────┐
│                    Supabase                          │
│                                                     │
│  Auth ─── Email/Password + Google OAuth             │
│  Database (PostgreSQL)                              │
│  ├── game_progress (single mode state + clears)     │
│  └── matches (multi mode results)                   │
│  Realtime                                           │
│  ├── Presence: matchmaking queue                    │
│  └── Broadcast: match events                        │
└─────────────────────────────────────────────────────┘
```

### Single Mode Flow
```
Player clicks Single Mode
  → Player sees substory/stage map (fixed hero, no selection)
  → Cleared stages shown as completed on the map
  → Player enters a stage (new or replay)
  → Screen shows: stage background from Supabase Storage (boss/obstacle on right)
                 + hero image from Supabase Storage (left, CSS overlay)
                 + story context text
                 + prompt input field
  → Player types prompt (no time limit)
  → POST /api/battle { prompt, stageId }
  → Claude API judges with structured output
  → Returns { result, narrative }
  → If result = 1:
      → Victory narrative shown
      → Stage added to cleared_stages if not already present
      → If this was the furthest uncleared stage, advance substory/stage counters
      → If all substories done, mark completed
  → If result = 0: defeat narrative shown → retry same stage
  → Previous stages are always replayable without affecting progress
```

### Multi Mode Flow
```
Player clicks Multi Mode
  → Join Supabase Realtime channel "matchmaking-queue" with Presence
  → Wait for another player (matchmaking screen)
  → 2 players detected via Presence sync
  → To prevent both creating a match simultaneously:
      Compare both userIds alphabetically.
      The user whose userId comes first creates the match in DB.
      That user becomes player1.
  → Both players join channel "match:{matchId}"
  → Round 1 of 3:
      → Player 1's client randomly selects a character from the roster
      → Player 1 broadcasts "round_start" with characterId
      → Both players see a character roulette animation:
        Character portraits cycle rapidly through the roster, then slow down
        and land on the selected character (slot machine style)
      → Both players see character + traits
      → Both type prompts fitting that character's style
      → Both broadcast "prompt_submit" { prompt, playerId }
      → Wait until both submitted
      → Player 1's client calls POST /api/multi-battle
        { prompt1, prompt2, characterId, matchId, roundNumber }
      → Claude API judges. Always produces a winner (no draws).
      → Returns { winner, player1_score, player2_score, narrative, reasoning }
      → Result broadcast as "round_result"
      → Narrative displayed
  → Round 2: Player 1 picks NEW random character, same flow with roulette
  → Round 3 (if needed): NEW random character again
  → First to 2 wins takes the match
  → Match result saved to Supabase
  → Winner/loser screen shown
```

---

## 5. Database Schema

### game_progress (single mode)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK auth.users, unique per user |
| substory | int | Current furthest substory (1-based) |
| stage | int | Current furthest stage within substory (1-based) |
| cleared_stages | jsonb | Array of cleared stage IDs, e.g. ["s1-stage1", "s1-stage2"] |
| completed | boolean | True if all substories done |
| created_at | timestamptz | Auto |

### matches (multi mode)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, used in Realtime channel name |
| player1_id | uuid | FK auth.users (userId that sorts first alphabetically) |
| player2_id | uuid | FK auth.users |
| rounds | jsonb | Array of round objects, each includes characterId + result |
| winner_id | uuid | Nullable until match ends |
| status | text | in_progress / completed |
| created_at | timestamptz | Auto |

Note: No top-level `character` column on matches. Each round has its own random character, stored inside the `rounds` jsonb array. Example rounds structure:
```json
[
  {
    "roundNumber": 1,
    "characterId": "wizard",
    "winner": "player1",
    "player1_score": 78,
    "player2_score": 62,
    "narrative": "..."
  },
  {
    "roundNumber": 2,
    "characterId": "goblin",
    "winner": "player2",
    "player1_score": 55,
    "player2_score": 81,
    "narrative": "..."
  }
]
```

Full SQL in Section 2.2.

Also create these **public Supabase Storage buckets** for single mode visuals:
- `single-characters`
- `single-backgrounds`

Known S3 endpoint:
- `https://tamjskfeocohiboeuuwu.storage.supabase.co/storage/v1/s3`

Recommended object paths:
- `single-characters/hero.png`
- `single-backgrounds/{stageId}.png`

---

## 6. Feature Spec: Authentication

### Methods
- Email / Password signup and login
- Google OAuth (one-click login)

### Flow
1. Landing page shows login options (email form + "Sign in with Google" button)
2. On successful auth, redirect to home (mode select: Single / Multi)
3. Session managed via cookies (@supabase/ssr)

### Implementation
- Follow the `with-supabase` template pattern
- `/lib/supabase/client.ts` for browser Supabase client
- `/lib/supabase/server.ts` for server components and API routes
- Middleware at `/middleware.ts` to refresh session on every request
- Auth callback at `/auth/callback/route.ts` for OAuth redirect handling

---

## 7. Feature Spec: Single Mode

### Character
Fixed generic hero. No character selection. No config, no traits. Just a brave adventurer.
One static image in Supabase Storage, in bucket `single-characters` at object path `hero.png`.

### Game Structure
- 1 main story: Hero rescues the princess
- Multiple substories (each a different location/theme)
- Each substory has ~5 stages
- Challenge types (not just battles):
  - **Battle**: Attack a monster/boss
  - **Obstacle**: Overcome a challenge (e.g., "How do you cross this bridge?")
  - **Social**: Convince, negotiate, or deceive an NPC
  - **Puzzle**: Solve a situation with creative thinking
  - **Boss**: Final stage of a substory, harder
- No time limit on prompt input
- Win → stage added to cleared_stages, advance if it was the next uncleared stage
- Lose → retry same stage
- Previous stages are always replayable (replaying doesn't reset progress)
- All substories cleared → princess rescued

### Stage Data Structure
```typescript
interface Stage {
  id: string;                   // e.g. "s1-stage1"
  substoryId: number;
  stageNumber: number;
  type: "battle" | "obstacle" | "social" | "puzzle" | "boss";
  title: string;
  description: string;          // Story context shown to player
  backgroundImage: string;      // Storage object path, e.g. "backgrounds/s1-stage1.png"
  enemyOrChallenge: string;
  difficulty: number;           // TBD
  systemPromptContext: string;  // TBD
}
```

### UI Components
- **StageMap**: Visual map showing substories/stages, cleared stages marked
- **BattleScreen**: Background + hero overlay + story context + prompt input (single mode only)
- **StageResult**: Win/lose display with narrative + next/retry button

---

## 8. Feature Spec: Multi Mode

### Matchmaking
1. Player clicks "Multi Mode"
2. Matchmaking screen with "Searching for opponent..."
3. Supabase Realtime Presence on "matchmaking-queue" channel
4. When 2 players detected:
   - Compare both userIds alphabetically
   - The userId that sorts first creates the match (becomes player1)
   - Broadcasts "match_found" with matchId
5. Both join "match:{matchId}" channel

### Characters (Multi Mode Only)
Roster of characters with configs (traits, keywords, personality). Completely separate from single mode hero. Each ROUND gets a new random character from the roster, assigned to both players.

### Battle
1. 3 rounds, first to 2 wins
2. Each round:
   - Player 1's client randomly picks a character and broadcasts "round_start"
   - Both players see a character roulette animation (portraits cycle fast then slow down, landing on the selected character)
   - Character and traits displayed
   - Both players write prompts fitting the character's style
   - Wait until both submit
   - Claude API judges. Always a winner, no draws.
   - Result shown with narrative
3. Match result saved to Supabase

### Scoring Logic: TBD
Core concept: each character has traits, positive keywords, and negative keywords. Prompts matching the character score higher, unrelated prompts score lower. Claude always picks a winner. Exact weights and system prompt TBD.

### Multi Mode Battle Screen
- Background: arena image (`/public/backgrounds/arena.png`)
- Player 1's character on the LEFT, Player 2's character on the RIGHT
- Both are the same character (same image), just mirrored or positioned differently

### UI Components
- **MatchmakingQueue**: Animated waiting screen + cancel button
- **VSScreen**: "Player 1 vs Player 2" splash
- **CharacterRoulette**: Slot machine style animation cycling through character portraits, slowing to land on the selected one
- **MultiRound**: Character display + prompt inputs + submit (multi mode only)
- **RoundResult**: Winner reveal with narrative
- **MatchResult**: Final scoreboard

---

## 9. Feature Spec: Claude API Judge

### How It Works
- All judge calls go through Next.js API routes (server-side only)
- Model: claude-sonnet-4-6
- Structured outputs via output_config.format with json_schema
- System prompt built dynamically per mode (TBD specifics)

### Single Mode Judge
Evaluates whether the player's prompt succeeds for the stage. No character config (hero is generic). The judge should weigh `systemPromptContext` most heavily, then holistically consider the stage description, objective, challenge, failure state, solution directions, and the feasibility of the player's action.

### Multi Mode Judge
Evaluates both prompts against the round's assigned character config. Characters have traits, positive keywords, negative keywords. Prompts aligning with the character score higher. Claude always picks a winner (no draws). Exact system prompt, weights, thresholds TBD.

### API Routes

**POST /api/battle (Single Mode)**
```
Body: { prompt: string, stageId: string }
Auth: Requires authenticated Supabase session
Returns: { result: 0 | 1, narrative: string }
```

**POST /api/multi-battle (Multi Mode)**
```
Body: { prompt1: string, prompt2: string, characterId: string, matchId: string, roundNumber: number }
Auth: Requires authenticated Supabase session
Returns: { winner, player1_score, player2_score, narrative, reasoning }
Side effect: Appends round result to matches.rounds in Supabase
```

### Structured Output Schemas

**Single Mode:**
```json
{
  "type": "object",
  "properties": {
    "result": { "type": "integer", "enum": [0, 1] },
    "narrative": { "type": "string" }
  },
  "required": ["result", "narrative"],
  "additionalProperties": false
}
```

**Multi Mode:**
```json
{
  "type": "object",
  "properties": {
    "winner": { "type": "string", "enum": ["player1", "player2"] },
    "player1_score": { "type": "integer" },
    "player2_score": { "type": "integer" },
    "narrative": { "type": "string" },
    "reasoning": { "type": "string" }
  },
  "required": ["winner", "player1_score", "player2_score", "narrative", "reasoning"],
  "additionalProperties": false
}
```

### TBD Items
- System prompt templates (single + multi)
- Multi mode character configs (traits, keywords, personality)
- Scoring rubric details and weights
- Difficulty scaling across stages/substories
- How different challenge types are judged in single mode

---

## 10. Image System

### No Runtime API Calls
All images are pre-generated static files. Zero image generation at runtime.

### Single Mode Hero
- One image in Supabase Storage, in bucket `single-characters` at object path `hero.png`
- Transparent PNG, no background
- Displayed on the LEFT side of every single mode stage
- Frontend resolves the public URL with a helper using `NEXT_PUBLIC_SUPABASE_URL`

### Multi Mode Character Images
- Location: `/public/characters/{characterId}.png`
- Transparent PNG per character in the roster
- In multi battle screen: same character image on both LEFT and RIGHT sides

### Background Images
- Single mode stages: Supabase Storage object paths like `{stageId}.png` in bucket `single-backgrounds` (boss/obstacle on right, left empty)
- Multi mode arena: `/public/backgrounds/arena.png` (generic arena/duel background, both sides open for character overlay)

### CSS Overlay (Single Mode)
```css
.battle-scene {
  position: relative;
  width: 100%;
  aspect-ratio: 2/1;
}
.battle-background {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.battle-character {
  position: absolute;
  left: 5%;
  bottom: 0;
  height: 80%;
  object-fit: contain;
}
```

### CSS Overlay (Multi Mode)
```css
.arena-scene {
  position: relative;
  width: 100%;
  aspect-ratio: 2/1;
}
.arena-character-left {
  position: absolute;
  left: 5%;
  bottom: 0;
  height: 80%;
  object-fit: contain;
}
.arena-character-right {
  position: absolute;
  right: 5%;
  bottom: 0;
  height: 80%;
  object-fit: contain;
  transform: scaleX(-1); /* mirror the same character image */
}
```

### Image Generation
All images generated with Gemini during the hackathon. Document prompts used in README.md.

---

## 11. UI/UX Pages

### Page Routing
| Route | Description |
|-------|-------------|
| `/` | Landing: auth (if logged out) or mode select (if logged in) |
| `/single` | Substory/stage map (fixed hero, no character select) |
| `/single/play/[substoryId]/[stageId]` | Battle/challenge screen |
| `/multi` | Matchmaking queue |
| `/multi/battle/[matchId]` | PvP battle screen |
| `/auth/callback` | OAuth redirect handler |

### File Structure
```
/app
  /page.tsx                                    # Landing / mode select
  /auth/callback/route.ts                      # OAuth callback
  /single
    /page.tsx                                  # Stage map (hero is fixed)
    /play/[substoryId]/[stageId]/page.tsx       # Battle/challenge screen
  /multi
    /page.tsx                                  # Matchmaking queue
    /battle/[matchId]/page.tsx                 # PvP battle screen
  /api
    /battle/route.ts                           # Single mode Claude judge
    /multi-battle/route.ts                     # Multi mode Claude judge
/lib
  /supabase
    /client.ts                                 # Browser Supabase client
    /server.ts                                 # Server-side Supabase client
  /claude
    /judge.ts                                  # Claude API call helper
    /characters.ts                             # Multi mode character configs (TBD)
    /prompts-single.ts                         # Single mode system prompt builder (TBD)
    /prompts-multi.ts                          # Multi mode system prompt builder (TBD)
  /game
    /assets.ts                                 # Supabase Storage URL helpers for single mode assets
    /stages.ts                                 # Stage definitions (TBD)
    /types.ts                                  # Shared TypeScript types
/components
  /ui                                          # shadcn/ui base components
  /game
    /BattleScreen.tsx                           # Single mode only
    /StageResult.tsx                            # Single mode
    /StageMap.tsx                               # Single mode
    /MatchmakingQueue.tsx                       # Multi mode
    /CharacterRoulette.tsx                      # Multi mode roulette animation
    /MultiRound.tsx                             # Multi mode only
    /VSScreen.tsx                               # Multi mode
    /RoundResult.tsx                            # Multi mode
    /MatchResult.tsx                            # Multi mode
/public
  /characters
    /{characterId}.png                         # Multi mode roster
  /backgrounds
    /arena.png                                 # Multi mode arena background
Supabase Storage
  bucket: single-characters
    /hero.png                                  # Single mode fixed hero
  bucket: single-backgrounds
    /{stageId}.png                             # Single mode stage backgrounds
```

### Design Direction
- Retro-game inspired but modern (bold, playful)
- Dark background with vibrant accent colors
- Game-like UI elements (health bars, stage maps, VS splash screens)
- shadcn/ui as base, customized for game feel
- frontend-design plugin drives aesthetic choices

---

## 12. Deployment & Domain

### Vercel Deployment
1. Push code to GitHub
2. Vercel auto-deploys from main branch
3. Environment variables set in Section 2.7
4. Verify at `promptfighter.vercel.app`

### Custom Domain Setup
1. Vercel Dashboard > Project > Settings > Domains
2. Add `promptfighter.space`
3. Vercel shows required DNS records (A or CNAME)
4. Go to the domain registrar DNS settings
5. Add the records Vercel specifies
6. Wait for DNS propagation
7. Vercel auto-provisions SSL
8. Update Supabase:
   - Auth > URL Configuration > Site URL: `https://promptfighter.space`
   - Add `https://promptfighter.space/**` to Redirect URLs
   - Update Google OAuth redirect URI in Google Cloud Console if needed

---

## 13. Submission Checklist

- [ ] Public GitHub repo with all source code
- [ ] README.md (description, setup, tech stack, team, track, Claude/Gemini usage, library credits)
- [ ] Showcase video (max 2.5 min, minimal editing)
- [ ] Written description on DevPost
- [ ] All team members listed on DevPost
- [ ] Submitted to exactly 1 track (Past: Childhood Games)

---

## 14. Multi Mode Characters (TBD)

These characters are ONLY used in multi mode. Single mode uses a fixed generic hero.

Candidate list:
1. Wizard
2. Archer
3. Goblin
4. Knight
5. Gen Z
6. Boomer
7. Otaku
8. Time Traveler
9. Professor
10. Artist
11. Monk

Each needs:
```typescript
interface CharacterConfig {
  id: string;
  name: string;
  displayName: string;
  description: string;
  traits: string[];
  positiveKeywords: string[];   // TBD
  negativeKeywords: string[];   // TBD
  personality: string;          // TBD
  imagePath: string;
}
```

---

## 15. Substories & Stages (TBD)

Template:
```typescript
interface Stage {
  id: string;                   // e.g. "s1-stage1", used in cleared_stages tracking
  substoryId: number;
  stageNumber: number;
  type: "battle" | "obstacle" | "social" | "puzzle" | "boss";
  title: string;
  description: string;
  backgroundImage: string;      // Storage object path, e.g. "backgrounds/s1-stage1.png"
  enemyOrChallenge: string;
  difficulty: number;
  systemPromptContext: string;
}
```

Stage types (not just battles):
- Battle: fight a monster
- Obstacle: cross a bridge, navigate a storm
- Social: convince a guard, bargain with a merchant
- Puzzle: solve a riddle
- Boss: harder final fight
