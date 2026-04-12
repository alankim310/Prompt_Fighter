import Anthropic from "@anthropic-ai/sdk";
import type { SingleBattleResult, MultiBattleResult } from "@/lib/game/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODEL = "claude-sonnet-4-6";

const singleSchema = {
  type: "object",
  properties: {
    result: { type: "integer", enum: [0, 1] },
    narrative: { type: "string" },
  },
  required: ["result", "narrative"],
  additionalProperties: false,
} as const;

const multiSchema = {
  type: "object",
  properties: {
    winner: { type: "string", enum: ["player1", "player2"] },
    player1_score: { type: "integer" },
    player2_score: { type: "integer" },
    narrative: { type: "string" },
    reasoning: { type: "string" },
  },
  required: [
    "winner",
    "player1_score",
    "player2_score",
    "narrative",
    "reasoning",
  ],
  additionalProperties: false,
} as const;

type StructuredRequest = {
  system: string;
  userContent: string;
  schema: Record<string, unknown>;
};

async function callStructured<T>({
  system,
  userContent,
  schema,
}: StructuredRequest): Promise<T> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system,
    messages: [{ role: "user", content: userContent }],
    output_config: {
      format: {
        type: "json_schema",
        schema,
      },
    },
  } as Parameters<typeof client.messages.create>[0]);

  const message = response as Anthropic.Message;
  const block = message.content.find((b) => b.type === "text");
  if (!block || block.type !== "text") {
    throw new Error("Claude returned no text block");
  }
  return JSON.parse(block.text) as T;
}

export async function judgeSingleBattle(args: {
  system: string;
  userContent: string;
}): Promise<SingleBattleResult> {
  return callStructured<SingleBattleResult>({
    system: args.system,
    userContent: args.userContent,
    schema: singleSchema,
  });
}

export async function judgeMultiBattle(args: {
  system: string;
  userContent: string;
}): Promise<MultiBattleResult> {
  return callStructured<MultiBattleResult>({
    system: args.system,
    userContent: args.userContent,
    schema: multiSchema,
  });
}
