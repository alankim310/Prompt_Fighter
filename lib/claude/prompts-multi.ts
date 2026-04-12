import type { CharacterConfig } from "@/lib/game/types";

function describeCharacter(label: string, c: CharacterConfig): string {
  return `${label}: ${c.displayName} (${c.id})
- Description: ${c.description}
- Personality: ${c.personality}
- Traits: ${c.traits.join(", ")}`;
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
1. How well it fits THAT PLAYER'S character traits and personality. Players have full creative freedom — any approach is valid as long as it feels true to the character.
2. Creativity, specificity, and vividness. Reward imaginative, detailed prompts. Penalize generic, lazy, or low-effort prompts.
3. Tactical effectiveness — how well the action plays to the character's strengths and counters or exploits the opponent's character.

Do NOT penalize unusual word choices or unexpected approaches. Judge intent and fit, not vocabulary.

IMPORTANT: Never use em dashes in any output. Use commas or periods instead.

Output:
- winner: "player1" or "player2" (NEVER a draw. If tied, pick the more creative prompt)
- narrative: a short, vivid 1-2 sentence play-by-play of the clash. Keep it punchy and concise.
- reasoning: 1-2 sentences explaining why the winner won

You MUST always pick a winner. Draws are forbidden.`;
}

export function buildMultiUserContent(args: {
  prompt1: string;
  prompt2: string;
}): string {
  return `Player 1 prompt:\n"""${args.prompt1}"""\n\nPlayer 2 prompt:\n"""${args.prompt2}"""\n\nJudge this round.`;
}
