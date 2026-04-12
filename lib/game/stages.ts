import { getSingleModeStageBackgroundUrl } from "@/lib/game/assets";
import type { GameProgress, Stage, Substory } from "@/lib/game/types";

export const SUBSTORIES: Substory[] = [
  {
    id: 1,
    title: "Whispering Woods",
    theme: "Forest Run",
    description:
      "The hero enters an enchanted forest where tricks, riddles, and beasts block the first trail.",
    unlockLabel: "Start of the journey",
    accentClassName: "from-emerald-400 via-lime-300 to-yellow-200",
  },
  {
    id: 2,
    title: "Clockwork Canyon",
    theme: "Desert Ruins",
    description:
      "Ancient machines grind under the sand, and every solved problem opens another gate forward.",
    unlockLabel: "Unlocked after clearing Story 1",
    accentClassName: "from-amber-400 via-orange-300 to-rose-200",
  },
  {
    id: 3,
    title: "Moonlit Harbor",
    theme: "Storm Coast",
    description:
      "Smugglers, sirens, and midnight negotiations test the hero far beyond simple combat.",
    unlockLabel: "Unlocked after clearing Story 2",
    accentClassName: "from-sky-400 via-cyan-300 to-blue-200",
  },
  {
    id: 4,
    title: "Citadel of Thorns",
    theme: "Final Approach",
    description:
      "The princess is near, but the last road winds through elite guards and a cruel final ruler.",
    unlockLabel: "Unlocked after clearing Story 3",
    accentClassName: "from-fuchsia-400 via-pink-300 to-rose-200",
  },
];

export const STAGES: Stage[] = [
  {
    id: "s1-stage1",
    substoryId: 1,
    stageNumber: 1,
    type: "battle",
    title: "Slime Ambush",
    description:
      "A pack of luminous slimes leaps from the brush and blocks the forest road.",
    backgroundImage: "backgrounds/s1-stage1.png",
    enemyOrChallenge: "A swarm of enchanted slimes",
    difficulty: 1,
    systemPromptContext:
      "Reward imaginative attacks that clear a swarm quickly without hurting the forest.",
  },
  {
    id: "s1-stage2",
    substoryId: 1,
    stageNumber: 2,
    type: "obstacle",
    title: "Bridge of Vines",
    description:
      "A broken rope bridge dangles over a deep ravine, held together by living vines.",
    backgroundImage: "backgrounds/s1-stage2.png",
    enemyOrChallenge: "Cross the ravine safely",
    difficulty: 2,
    systemPromptContext:
      "Reward practical, vivid solutions for traversing a dangerous natural obstacle.",
  },
  {
    id: "s1-stage3",
    substoryId: 1,
    stageNumber: 3,
    type: "social",
    title: "The Moss Guard",
    description:
      "A giant bark-skinned guardian refuses to let strangers pass deeper into the woods.",
    backgroundImage: "backgrounds/s1-stage3.png",
    enemyOrChallenge: "Convince the guardian to trust you",
    difficulty: 2,
    systemPromptContext:
      "Reward persuasive prompts that show respect, empathy, and clever diplomacy.",
  },
  {
    id: "s1-stage4",
    substoryId: 1,
    stageNumber: 4,
    type: "puzzle",
    title: "Lantern Riddle",
    description:
      "Four floating lanterns ask a riddle and will only reveal the path to those who answer with action.",
    backgroundImage: "backgrounds/s1-stage4.png",
    enemyOrChallenge: "Solve the lantern puzzle",
    difficulty: 3,
    systemPromptContext:
      "Reward lateral thinking, symbolic actions, and elegant puzzle-solving logic.",
  },
  {
    id: "s1-stage5",
    substoryId: 1,
    stageNumber: 5,
    type: "boss",
    title: "Thornmaw Alpha",
    description:
      "At the forest heart, a monstrous wolf crowned in thorns guards the exit trail.",
    backgroundImage: "backgrounds/s1-stage5.png",
    enemyOrChallenge: "Defeat Thornmaw Alpha",
    difficulty: 4,
    systemPromptContext:
      "Reward cinematic, decisive boss-fight prompts with clear tactics and heroic flair.",
  },
  {
    id: "s2-stage1",
    substoryId: 2,
    stageNumber: 1,
    type: "obstacle",
    title: "Sandfall Pass",
    description:
      "A canyon wall pours sand like a waterfall, burying every path forward in seconds.",
    backgroundImage: "backgrounds/s2-stage1.png",
    enemyOrChallenge: "Pass through the shifting sandfall",
    difficulty: 3,
    systemPromptContext:
      "Reward adaptive plans that account for unstable terrain and timing.",
  },
  {
    id: "s2-stage2",
    substoryId: 2,
    stageNumber: 2,
    type: "battle",
    title: "Scrap Jackals",
    description:
      "Clockwork jackals with rusted jaws sprint between canyon shadows to tear at intruders.",
    backgroundImage: "backgrounds/s2-stage2.png",
    enemyOrChallenge: "A coordinated pack of scrap jackals",
    difficulty: 3,
    systemPromptContext:
      "Reward tactical responses to fast mechanical enemies acting in groups.",
  },
  {
    id: "s2-stage3",
    substoryId: 2,
    stageNumber: 3,
    type: "puzzle",
    title: "Geargate",
    description:
      "A stone vault door covered in rotating gears only opens for someone who understands its rhythm.",
    backgroundImage: "backgrounds/s2-stage3.png",
    enemyOrChallenge: "Unlock the ancient gear mechanism",
    difficulty: 4,
    systemPromptContext:
      "Reward mechanical reasoning, pattern recognition, and creative tool use.",
  },
  {
    id: "s2-stage4",
    substoryId: 2,
    stageNumber: 4,
    type: "social",
    title: "Merchant of Spare Suns",
    description:
      "A traveling tinker offers help, but only to heroes who can strike a clever bargain.",
    backgroundImage: "backgrounds/s2-stage4.png",
    enemyOrChallenge: "Negotiate for the missing power core",
    difficulty: 4,
    systemPromptContext:
      "Reward negotiation that balances charm, wit, and believable leverage.",
  },
  {
    id: "s2-stage5",
    substoryId: 2,
    stageNumber: 5,
    type: "boss",
    title: "The Bronze Colossus",
    description:
      "An ancient war automaton awakens and fills the canyon with heat and thunder.",
    backgroundImage: "backgrounds/s2-stage5.png",
    enemyOrChallenge: "Defeat the Bronze Colossus",
    difficulty: 5,
    systemPromptContext:
      "Reward high-impact boss tactics that exploit scale, weak points, or terrain.",
  },
  {
    id: "s3-stage1",
    substoryId: 3,
    stageNumber: 1,
    type: "social",
    title: "Dockside Deal",
    description:
      "Suspicious sailors know the route to the citadel, but no one shares secrets for free.",
    backgroundImage: "backgrounds/s3-stage1.png",
    enemyOrChallenge: "Earn the sailors' cooperation",
    difficulty: 4,
    systemPromptContext:
      "Reward confident social play that matches a tense harbor full of opportunists.",
  },
  {
    id: "s3-stage2",
    substoryId: 3,
    stageNumber: 2,
    type: "battle",
    title: "Siren Skirmish",
    description:
      "Harbor sirens perch on broken masts, singing chaos into the minds of passing crews.",
    backgroundImage: "backgrounds/s3-stage2.png",
    enemyOrChallenge: "A trio of storm sirens",
    difficulty: 4,
    systemPromptContext:
      "Reward vivid counters to sound-based magic and aerial harassment.",
  },
  {
    id: "s3-stage3",
    substoryId: 3,
    stageNumber: 3,
    type: "obstacle",
    title: "Tempest Crossing",
    description:
      "To leave the harbor, the hero must cross floating wreckage during a violent midnight storm.",
    backgroundImage: "backgrounds/s3-stage3.png",
    enemyOrChallenge: "Cross the storm-torn water",
    difficulty: 5,
    systemPromptContext:
      "Reward momentum, environmental awareness, and believable survival instincts.",
  },
  {
    id: "s3-stage4",
    substoryId: 3,
    stageNumber: 4,
    type: "puzzle",
    title: "Lighthouse Cipher",
    description:
      "A lighthouse beam flashes coded directions, but one wrong interpretation leads to the rocks.",
    backgroundImage: "backgrounds/s3-stage4.png",
    enemyOrChallenge: "Decode the flashing signal",
    difficulty: 5,
    systemPromptContext:
      "Reward smart decoding and concise problem-solving under pressure.",
  },
  {
    id: "s3-stage5",
    substoryId: 3,
    stageNumber: 5,
    type: "boss",
    title: "Captain Noctis",
    description:
      "The pirate-lord of the harbor commands shadow tides from the deck of a ruined flagship.",
    backgroundImage: "backgrounds/s3-stage5.png",
    enemyOrChallenge: "Defeat Captain Noctis",
    difficulty: 6,
    systemPromptContext:
      "Reward dramatic boss-fight ideas that feel dangerous, stylish, and battle-ready.",
  },
  {
    id: "s4-stage1",
    substoryId: 4,
    stageNumber: 1,
    type: "battle",
    title: "Roseguard Line",
    description:
      "Elite thorn-armored sentries stand between the hero and the citadel gates.",
    backgroundImage: "backgrounds/s4-stage1.png",
    enemyOrChallenge: "Break through the Roseguard defenders",
    difficulty: 5,
    systemPromptContext:
      "Reward brave, efficient battle plans against disciplined defenders.",
  },
  {
    id: "s4-stage2",
    substoryId: 4,
    stageNumber: 2,
    type: "social",
    title: "The Last Steward",
    description:
      "Inside the gatehouse, an old steward might help if the hero can awaken his fading loyalty.",
    backgroundImage: "backgrounds/s4-stage2.png",
    enemyOrChallenge: "Win the steward to your side",
    difficulty: 5,
    systemPromptContext:
      "Reward emotional intelligence and persuasive storytelling.",
  },
  {
    id: "s4-stage3",
    substoryId: 4,
    stageNumber: 3,
    type: "puzzle",
    title: "Hall of Thorns",
    description:
      "Living thorn walls shift every few seconds, sealing and reopening different corridors.",
    backgroundImage: "backgrounds/s4-stage3.png",
    enemyOrChallenge: "Find a way through the shifting hall",
    difficulty: 6,
    systemPromptContext:
      "Reward strategic movement and clever interaction with a changing maze.",
  },
  {
    id: "s4-stage4",
    substoryId: 4,
    stageNumber: 4,
    type: "obstacle",
    title: "Tower Ascent",
    description:
      "The final tower spiral is collapsing, and every step upward risks a deadly fall.",
    backgroundImage: "backgrounds/s4-stage4.png",
    enemyOrChallenge: "Reach the top of the tower alive",
    difficulty: 6,
    systemPromptContext:
      "Reward bold movement, urgency, and realistic problem-solving under pressure.",
  },
  {
    id: "s4-stage5",
    substoryId: 4,
    stageNumber: 5,
    type: "boss",
    title: "The Thorn King",
    description:
      "The ruler who stole the princess waits in a chamber of roots and shattered stained glass.",
    backgroundImage: "backgrounds/s4-stage5.png",
    enemyOrChallenge: "Defeat the Thorn King and rescue the princess",
    difficulty: 7,
    systemPromptContext:
      "Reward final-boss prompts that feel climactic, inventive, and worthy of ending the campaign.",
  },
];

export const STAGES_PER_SUBSTORY = 5;

export function getAllStages(): Stage[] {
  return STAGES;
}

export function getSubstories(): Substory[] {
  return SUBSTORIES;
}

export function getStagesForSubstory(substoryId: number): Stage[] {
  return STAGES.filter((stage) => stage.substoryId === substoryId).sort(
    (a, b) => a.stageNumber - b.stageNumber,
  );
}

export function getStageBySubstoryAndStageNumber(
  substoryId: number,
  stageNumber: number,
): Stage | undefined {
  return STAGES.find(
    (stage) =>
      stage.substoryId === substoryId && stage.stageNumber === stageNumber,
  );
}

export function getStageById(stageId: string): Stage | undefined {
  return STAGES.find((stage) => stage.id === stageId);
}

export function getStageBackgroundUrl(stage: Stage): string {
  return getSingleModeStageBackgroundUrl(stage.id);
}

export function getHighestUnlockedSubstory(progress: GameProgress): number {
  if (progress.completed) {
    return SUBSTORIES.at(-1)?.id ?? 1;
  }

  return Math.min(Math.max(progress.substory, 1), SUBSTORIES.length);
}

export function isStageUnlocked(progress: GameProgress, stage: Stage): boolean {
  if (progress.completed) return true;
  if (progress.cleared_stages.includes(stage.id)) return true;
  if (stage.substoryId < progress.substory) return true;
  if (stage.substoryId > progress.substory) return false;
  return stage.stageNumber <= progress.stage;
}

export function isSubstoryUnlocked(
  progress: GameProgress,
  substoryId: number,
): boolean {
  if (progress.completed) return true;
  return substoryId <= getHighestUnlockedSubstory(progress);
}
