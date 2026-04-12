export type StageType = "battle" | "obstacle" | "social" | "puzzle" | "boss";

export interface Stage {
  id: string;
  substoryId: number;
  stageNumber: number;
  type: StageType;
  title: string;
  description: string;
  backgroundImage: string;
  enemyOrChallenge: string;
  difficulty: number;
  systemPromptContext: string;
}

export interface CharacterConfig {
  id: string;
  name: string;
  displayName: string;
  description: string;
  traits: string[];
  positiveKeywords: string[];
  negativeKeywords: string[];
  personality: string;
  imagePath: string;
}

export interface SingleBattleResult {
  outcome: "win" | "lose";
  score: number;
  narrative: string;
  feedback: string;
}

export interface MultiBattleResult {
  winner: "player1" | "player2";
  player1_score: number;
  player2_score: number;
  narrative: string;
  reasoning: string;
}

export interface MultiRoundRecord extends MultiBattleResult {
  roundNumber: number;
  character1Id: string;
  character2Id: string;
}
