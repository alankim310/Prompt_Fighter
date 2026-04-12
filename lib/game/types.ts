export type StageType = "battle" | "obstacle" | "social" | "puzzle" | "boss";

export interface Stage {
  id: string;
  substoryId: number;
  stageNumber: number;
  type: StageType;
  title: string;
  description: string;
  objective: string;
  solutionDirections: string[];
  promptIdeas: string[];
  failureState: string;
  backgroundImage: string;
  enemyOrChallenge: string;
  difficulty: number;
  systemPromptContext: string;
}

export interface Substory {
  id: number;
  title: string;
  theme: string;
  description: string;
  mapImage: string;
  narrativeGoal: string;
  setting: string;
  rewardArtifact: string;
  chapterEndingBeat: string;
  unlockLabel: string;
  accentClassName: string;
}

export interface GameProgress {
  substory: number;
  stage: number;
  cleared_stages: string[];
  completed: boolean;
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

export type MultiRoundWinner = "player1" | "player2" | "void";

export interface MultiRoundRecord {
  roundNumber: number;
  character1Id: string;
  character2Id: string;
  prompt1: string;
  prompt2: string;
  winner: MultiRoundWinner;
  player1_score: number;
  player2_score: number;
  narrative: string;
  reasoning: string;
  voidReason?: string;
}

export type MultiMatchStatus = "in_progress" | "completed" | "abandoned";
