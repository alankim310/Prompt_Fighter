import type { CharacterConfig } from "@/lib/game/types";

function describeCharacter(label: string, c: CharacterConfig): string {
  return `${label}: ${c.displayName} (${c.id})
- Description: ${c.description}
- Personality: ${c.personality}
- Traits: ${c.traits.join(", ")}
- Positive keywords (reward prompts that evoke these): ${c.positiveKeywords.join(", ")}
- Negative keywords (penalize prompts that use these): ${c.negativeKeywords.join(", ")}`;
}

export function buildMultiSystemPrompt(
  char1: CharacterConfig,
  char2: CharacterConfig,
): string {
  return `You are the judge of a 1v1 prompt-battle game called PromptFighter.

Each player is roleplaying as their OWN randomly assigned character. The two characters may be different (or occasionally the same). Evaluate each player against THEIR OWN character, then decide who wins the clash.

${describeCharacter("Player 1 character", char1)}

${describeCharacter("Player 2 character", char2)}

Each player submits a prompt describing an attack, tactic, or action their character performs in the battle against the opponent.

Judge each prompt on:
1. How well it fits THAT PLAYER'S character (traits, personality, positive keywords).
2. Creativity, specificity, and vividness (generic prompts score lower).
3. Tactical effectiveness within the character's strengths — and how well it counters or exploits the opponent's character.
4. Penalize prompts that contradict their own character (use negative keywords, break personality, out-of-character tools).

Score each player from 0-100. Then output:
- winner: "player1" or "player2" (NEVER a draw — if tied, pick the more creative prompt)
- player1_score, player2_score: integers 0-100
- narrative: a vivid 2-3 sentence play-by-play of the clash between the two characters, in-character
- reasoning: a short explanation of why the winner won (1-2 sentences)

You MUST always pick a winner. Draws are forbidden.`;
}

export function buildMultiUserContent(args: {
  prompt1: string;
  prompt2: string;
}): string {
  return `Player 1 prompt:\n"""${args.prompt1}"""\n\nPlayer 2 prompt:\n"""${args.prompt2}"""\n\nJudge this round.`;
}
