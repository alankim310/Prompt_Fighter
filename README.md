# PromptFighter

> **Write your words. Win your battles.**

An AI-powered prompt battle game where players craft creative natural language prompts as attacks and actions. Claude AI judges every outcome in real time through structured outputs — no dice rolls, no RNG, just the power of your words.

Built for **WildHacks 2026** (Track 1: Childhood Games).

**Live at [https://prompt-fighter-sage.vercel.app/]**

---

## Table of Contents

- [Game Overview](#game-overview)
- [Single Mode — Story Campaign](#single-mode--story-campaign)
- [Multi Mode — 1v1 PvP](#multi-mode--1v1-pvp)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [AI Judge System](#ai-judge-system)
- [Realtime Multiplayer](#realtime-multiplayer)
- [Character Roster](#character-roster)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Team](#team)

---

## Game Overview

PromptFighter reimagines childhood RPGs and fighting games for the AI era. Instead of button combos or stat sheets, **your creativity is your weapon**. Write a prompt describing your character's action, and Claude AI evaluates the outcome — judging creativity, tactical thinking, and how well your words fit the situation.

Two modes, one core mechanic:

| | Single Mode | Multi Mode |
|---|---|---|
| **Format** | 5-chapter story campaign (20 stages) | 1v1 PvP, best of 3 rounds |
| **Character** | Fixed hero (Willie the Wildcat) | Random character each round via roulette |
| **Challenge** | Battles, puzzles, social encounters, bosses | Head-to-head prompt duel |
| **Judge** | Claude evaluates prompt vs. stage objective | Claude compares both prompts, always picks a winner |

---

## Single Mode — Story Campaign

Journey through the **Kingdom of Veyrune** across 5 chapters, each with 4 stages of escalating difficulty. Stages aren't just battles — you'll face puzzles, obstacles, social challenges, and boss fights that all require different creative approaches.

### Chapters

| # | Chapter | Setting | Reward Artifact |
|---|---------|---------|-----------------|
| 1 | **The Ashen Gate** | Ruined Border Town | Ember Sigil |
| 2 | **The Thornwild Labyrinth** | Cursed Forest | Moonlit Compass |
| 3 | **The Hollow Market** | Underground City | Name-Flame Lantern |
| 4 | **The Sunken Forge** | Industrial Temple | Dragon-Piercing Sword |
| 5 | **Blackwake Keep** | Volcanic Fortress | — (Final Chapter) |

Each chapter culminates in a boss encounter. The final chapter requires all four artifacts collected throughout the journey.

**Stage Types:** `battle` | `obstacle` | `puzzle` | `social` | `boss`

---

## Multi Mode — 1v1 PvP

Real-time 1v1 matches with a twist: **every round assigns a new random character** through a slot-machine-style roulette animation. You must adapt your prompt strategy to each character's personality and traits.

### Match Flow

```
Queue up → Match found → Round starts
    ↓
Character Roulette (random pick per round)
    ↓
VS Screen reveal
    ↓
Both players write prompts (30s timer)
    ↓
Claude judges → Winner declared (no draws)
    ↓
Repeat until best of 3 → Match complete
```

### Key Mechanics

- **No draws** — Claude always picks a winner
- **New character each round** — prevents meta-gaming, forces adaptation
- **30-second prompt timer** — synced across both clients
- **Timeout = auto-loss** — both timeout = void round
- **Disconnect protection** — 10-second grace period before forfeit

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) + React 19 + TypeScript |
| **Styling** | Tailwind CSS 4 + shadcn/ui + custom animations |
| **AI Judge** | Claude Sonnet 4.6 via Anthropic SDK (structured outputs) |
| **Database** | Supabase PostgreSQL |
| **Auth** | Supabase Auth (Email/Password + Google OAuth) |
| **Realtime** | Supabase Realtime (Broadcast + Presence) |
| **Deployment** | Vercel |

---

## Architecture

```
app/
├── page.tsx                                    # Landing / mode select
├── auth/callback/route.ts                      # OAuth redirect handler
├── single/
│   ├── intro/page.tsx                          # Story intro slides
│   ├── page.tsx                                # Chapter & stage map
│   └── play/[substoryId]/[stageId]/page.tsx    # Battle screen
├── multi/
│   ├── page.tsx                                # Matchmaking queue
│   └── battle/[matchId]/page.tsx               # PvP battle screen
└── api/
    ├── battle/route.ts                         # Single mode judge endpoint
    └── multi-battle/route.ts                   # Multi mode judge endpoint

lib/
├── claude/
│   ├── judge.ts              # Claude API calls with structured outputs
│   ├── characters.ts         # 11-character roster with traits & personality
│   ├── prompts-single.ts     # Single mode system prompt builder
│   └── prompts-multi.ts      # Multi mode system prompt builder
├── game/
│   ├── types.ts              # Shared TypeScript interfaces
│   ├── stages.ts             # 20 stages across 5 chapters
│   ├── assets.ts             # Supabase storage URL helpers
│   └── intro.ts              # Intro slide content
└── supabase/
    ├── server.ts             # Server-side auth (SSR + cookies)
    └── client.ts             # Browser-side client

components/
├── auth/
│   └── AuthForm.tsx          # Sign-in / sign-up with OAuth
└── game/
    ├── BattleScreen.tsx      # Single mode battle UI
    ├── StageMap.tsx           # Chapter & stage selector
    ├── StageResult.tsx        # Chapter completion + artifact reward
    ├── MatchmakingQueue.tsx   # Realtime matchmaking with timeout
    ├── MultiBattle.tsx        # PvP match state machine
    ├── CharacterRoulette.tsx  # Spinning character reveal animation
    ├── VSScreen.tsx           # PvP matchup intro screen
    ├── MultiRound.tsx         # PvP prompt input with synced timer
    ├── RoundResult.tsx        # Round victory/defeat display
    └── MatchResult.tsx        # Final match summary with replay
```

---

## AI Judge System

All game outcomes are determined by **Claude Sonnet 4.6** using structured outputs (`output_config.format` with `json_schema`). This guarantees valid, parseable JSON responses with zero runtime parsing errors.

### Single Mode Schema

```json
{
  "result": 0 | 1,
  "narrative": "2-4 sentence description of the outcome"
}
```

**Judging Priority:**
1. Alignment with stage context and narrative
2. Whether the action accomplishes the stage objective
3. Coherence with the scene and challenge type
4. Feasibility and clarity of the described action

Creative solutions are encouraged — the judge evaluates intent and context fit, not keyword matching.

### Multi Mode Schema

```json
{
  "winner": "player1" | "player2",
  "narrative": "Vivid 1-2 sentence play-by-play",
  "reasoning": "1-2 sentence explanation of why the winner won"
}
```

**Judging Criteria:**
- How well the prompt fits the assigned character's personality and traits
- Creativity and tactical effectiveness
- Always a definitive winner — no draws

---

## Realtime Multiplayer

### Matchmaking (Supabase Presence)

1. Player joins the `matchmaking-queue` channel
2. Presence state tracks all online users
3. When 2+ players detected, userIds are sorted alphabetically
4. The alphabetically-first userId creates the match record (becomes Player 1)
5. `match_found` broadcast redirects both players to the battle room
6. 3-minute timeout if no opponent found

**Race condition prevention:** Alphabetical userId comparison ensures exactly one player creates the match — no duplicates.

### Battle Sync (Supabase Broadcast)

Channel: `match:{matchId}`

| Event | Sender | Payload |
|-------|--------|---------|
| `round_start` | Player 1 | Character IDs for both players |
| `prompt_submitted` | Either | Signal that prompt is ready |
| `round_complete` | Player 1 | Full round result from Claude |
| `match_complete` | Player 1 | Final match result |

Player 1 acts as the coordinator — their client calls the judge API and broadcasts results. An 8-second fallback ensures Player 2 can take over if Player 1 disconnects.

---

## Character Roster

11 unique characters, each with distinct traits and personality that influence how Claude judges prompts:

| Character | Description | Key Traits |
|-----------|-------------|------------|
| **Wizard** | Ancient spellcaster weaving reality with sigils | Arcane elements, dramatic, fragile in melee |
| **Knight** | Honorable warrior bound by chivalric code | Master swordsman, unshakeable courage, slow |
| **Gen Z** | Chronically online zoomer with reality-bending memes | Weaponized irony, viral presence, short attention span |
| **Monk** | Serene martial artist with lightning reflexes | Inner peace, chi channeling, refuses modern weapons |
| **Time Traveler** | Dimension-hopping scientist with a glitchy watch | Manipulates time, paradox-prone, frantic |
| **Archer** | Sharp-eyed forest ranger who never misses | Impossible aim, stealthy, weak up close |
| **Artist** | Temperamental painter whose canvases come alive | Living paintings, color manipulation, fragile ego |
| **Boomer** | Retired dad with lethal lawnmower and life advice | Dad strength, tool mastery, confused by tech |
| **Goblin** | Greedy little menace who fights dirty | Dirty tricks, quick, easily distracted by gold |
| **Otaku** | Anime superfan powered by friendship | Signature finishers, dramatic monologues, over-the-top |
| **Professor** | Tweed-clad academic with weaponized footnotes | Encyclopedic knowledge, logical rigor, physically weak |

Each character has **positive traits** (prompts leveraging these score higher) and **weaknesses** (exploitable by opponents).

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project
- An [Anthropic API key](https://console.anthropic.com)

### Installation

```bash
git clone https://github.com/your-org/promptfighter.git
cd promptfighter
npm install
```

### Development

```bash
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Production build
npm run lint       # Run ESLint
```

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Claude AI
ANTHROPIC_API_KEY=your_anthropic_api_key
```

All Claude API calls are server-side only (via `/api/` routes). No API keys are exposed to the client.

---

## Database Schema

### `game_progress` (Single Mode)

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Row ID |
| `user_id` | uuid (FK, unique) | One row per user |
| `substory` | int | Current chapter index |
| `stage` | int | Current stage index |
| `cleared_stages` | jsonb | Array of completed stage IDs |
| `completed` | bool | Campaign finished |
| `created_at` | timestamp | Created at |

### `matches` (Multi Mode)

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Match ID |
| `player1_id` | uuid (FK) | Player 1 |
| `player2_id` | uuid (FK) | Player 2 |
| `rounds` | jsonb | Array of round records (character, prompts, result) |
| `winner_id` | uuid | Match winner (null if in progress) |
| `status` | text | `in_progress` / `completed` / `abandoned` |
| `created_at` | timestamp | Created at |

---

## Team

Built with intensity and sleep deprivation at **WildHacks 2026**, Northwestern University.
