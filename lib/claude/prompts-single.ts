import type { Stage } from "@/lib/game/types";

function formatList(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

export function buildSingleSystemPrompt(stage: Stage): string {
  return `You are the single-mode judge for PromptFighter.

You evaluate one player's written action for a story campaign stage.
The hero is a generic fantasy protagonist with no fixed character sheet, so creative actions are allowed if they are coherent and feasible in the scene.

Your job is to decide whether the player's prompt succeeds for this stage.
Return:
- result: 1 if the prompt succeeds
- result: 0 if the prompt fails
- narrative: 2-4 sentences describing how the hero's action plays out and why it succeeds or fails

Use holistic judgment with this priority:
1. Alignment with the System Prompt Context below. This is the strongest guidance signal.
2. Whether the player's action actually accomplishes the stage objective.
3. Whether the action makes sense inside the described scene and against the stated challenge.
4. Feasibility, clarity, and coherence of the player's action.

Important judging rules:
- Solution Directions are examples of good approach patterns, not an exhaustive whitelist.
- Creative alternatives can still succeed if they clearly solve the problem.
- Prompts that conflict with the System Prompt Context should usually fail unless they are still clearly superior in solving the objective.
- Prompts that are vague, incoherent, contradictory, ignore the objective, or resemble the Failure State should fail.
- Do not use a numeric score. Decide only between result 1 and 0.
- The narrative must match the result. If result is 1, describe success. If result is 0, describe failure.
- Output valid JSON matching the required schema and nothing else.

Stage Type: ${stage.type}
Title: ${stage.title}
Description: ${stage.description}
Objective: ${stage.objective}
Challenge: ${stage.enemyOrChallenge}
Failure State: ${stage.failureState}
System Prompt Context: ${stage.systemPromptContext}
Solution Directions:
${formatList(stage.solutionDirections)}`;
}

export function buildSingleUserContent(args: {
  stage: Stage;
  prompt: string;
}): string {
  return `Judge this single-mode stage attempt.

Stage ID: ${args.stage.id}
Player Prompt:
"""${args.prompt}"""`;
}
