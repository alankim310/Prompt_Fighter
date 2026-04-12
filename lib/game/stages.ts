import {
  getSinglePlayArtifactImageUrl,
  getSinglePlayCharacterImageUrl,
  getSingleModeSubstoryBackgroundUrl,
} from "@/lib/game/assets";
import type {
  ArtifactReminder,
  GameProgress,
  Stage,
  Substory,
} from "@/lib/game/types";

const CHAPTER_ARTIFACT_IMAGES: Record<number, string | null> = {
  1: getSinglePlayArtifactImageUrl("ember_sigil"),
  2: getSinglePlayArtifactImageUrl("moonlit_compass"),
  3: getSinglePlayArtifactImageUrl("name_flame_lantern"),
  4: getSinglePlayArtifactImageUrl("sword_tempered_in_dragon_piercing_fire"),
  5: null,
  6: null,
};

export const CHAPTER_FIVE_ARTIFACT_REMINDERS: ArtifactReminder[] = [
  {
    name: "Ember Sigil",
    description: "The key that opens the gate of Blackwake Keep.",
    image: getSinglePlayArtifactImageUrl("ember_sigil"),
  },
  {
    name: "Moonlit Compass",
    description: "Reveals hidden truth and direction.",
    image: getSinglePlayArtifactImageUrl("moonlit_compass"),
  },
  {
    name: "Name-Flame Lantern",
    description: "Preserves identity and restores memory.",
    image: getSinglePlayArtifactImageUrl("name_flame_lantern"),
  },
  {
    name: "Sword tempered in Dragon-Piercing Fire",
    description:
      "A reforged blade capable of weakening and wounding the End-Bringer.",
    image: getSinglePlayArtifactImageUrl("sword_tempered_in_dragon_piercing_fire"),
  },
];

export const SUBSTORIES: Substory[] = [
  {
    id: 1,
    title: "The Ashen Gate",
    theme: "Ruined Border Town",
    description:
      "Enter the ruined outer border of Veyrune and recover the Ember Sigil, the key artifact needed to open the gate of Blackwake Keep.",
    mapImage: getSingleModeSubstoryBackgroundUrl(1),
    narrativeGoal:
      "Recover the Ember Sigil and force a way into the inner kingdom.",
    setting:
      "A burned border town lies before a massive sealed gate of black iron. Charred banners flap in the wind. The remains of homes and guard posts suggest the kingdom fell fast and violently.",
    rewardArtifact: "Ember Sigil",
    chapterEndingBeat:
      "Before fading, Sir Dreadhelm warns: “The dragon did not only steal your princess. He is trying to erase what she remembers of you.”",
    unlockLabel: "Start of the journey",
    accentClassName: "from-orange-400 via-amber-300 to-yellow-200",
  },
  {
    id: 2,
    title: "The Thornwild Labyrinth",
    theme: "Cursed Forest",
    description:
      "Cross the cursed forest and obtain the Moonlit Compass, the artifact that reveals hidden paths toward the mountain.",
    mapImage: getSingleModeSubstoryBackgroundUrl(2),
    narrativeGoal:
      "Survive the hostile forest and claim the Moonlit Compass.",
    setting:
      "A vast forest of black vines, carnivorous flowers, and shifting trails. This is not a forest the player can reason with like a person. It is a hostile magical environment built to mislead intruders. The trees rearrange themselves whenever someone tries to follow a fixed route, and the deeper paths are controlled by enchantments tied to moonlight, scent, reflection, and sleep.",
    rewardArtifact: "Moonlit Compass",
    chapterEndingBeat:
      "The compass points not only north, but also toward 'what has been stolen.'",
    unlockLabel: "Unlocked after clearing Chapter 1",
    accentClassName: "from-emerald-400 via-lime-300 to-cyan-200",
  },
  {
    id: 3,
    title: "The Hollow Market",
    theme: "Cursed Underground City",
    description:
      "Infiltrate the cursed underground city beneath Veyrune and recover the Name-Flame Lantern, an artifact that preserves memory and identity.",
    mapImage: getSingleModeSubstoryBackgroundUrl(3),
    narrativeGoal:
      "Beat the market at its own laws and escape with the Name-Flame Lantern.",
    setting:
      "A hidden market lit by floating lanterns, where ghosts, thieves, monsters, and forgotten nobles trade secrets, names, and years of their lives. The market follows rules, contracts, and exchanges very literally. This means the player cannot simply threaten everyone and leave; the market punishes people who break its laws openly. The safest solutions are clever bargains, technical loopholes, deception, or controlled chaos.",
    rewardArtifact: "Name-Flame Lantern",
    chapterEndingBeat:
      "The lantern reveals that Carolyn's name is being slowly erased from the kingdom's history.",
    unlockLabel: "Unlocked after clearing Chapter 2",
    accentClassName: "from-fuchsia-400 via-pink-300 to-amber-200",
  },
  {
    id: 4,
    title: "The Sunken Forge",
    theme: "Underground Industrial Temple",
    description:
      "Descend into the Sunken Forge and claim the anti-dragon power needed to weaken the End-Bringer before the final confrontation.",
    mapImage: getSingleModeSubstoryBackgroundUrl(4),
    narrativeGoal:
      "Awaken the forge and temper the hero's sword in Dragon-Piercing Fire.",
    setting:
      "Deep beneath the ruined kingdom lies the Sunken Forge, a vast industrial temple of iron, chain lifts, molten channels, broken furnaces, and half-buried royal machinery. Long ago, this was where Veyrune forged weapons and power sources meant to stand against monsters too great for ordinary steel. Now the forge is flooded with heat, ash, collapsed stone, and unstable mechanisms. The player's goal is not to recover an ordinary item, but to awaken the forge and use it to place a dragon-wounding force into their sword.",
    rewardArtifact: "Sword tempered in Dragon-Piercing Fire",
    chapterEndingBeat:
      "As the hero emerges, the reforged blade burns with a new edge, and far off in Blackwake Keep, the End-Bringer stirs.",
    unlockLabel: "Unlocked after clearing Chapter 3",
    accentClassName: "from-red-400 via-orange-300 to-yellow-200",
  },
  {
    id: 5,
    title: "Blackwake Keep",
    theme: "Volcanic Fortress",
    description:
      "Enter the End-Bringer's fortress, preserve Carolyn's memory, free her, and defeat the dragon at the center of Veyrune's ruin.",
    mapImage: getSingleModeSubstoryBackgroundUrl(5),
    narrativeGoal:
      "Use every earned artifact to rescue Princess Carolyn and bring down the End-Bringer.",
    setting:
      "A volcanic fortress built into the mountain itself. The walls breathe heat. Corridors rewrite themselves. The dragon's power distorts memory, time, and language. Unlike earlier chapters, this area actively tries to erase the purpose of the rescue. The player is now deep in enemy territory and must use the artifacts earned in previous chapters to resist magical dismantling.",
    rewardArtifact: "Princess Carolyn rescued",
    chapterEndingBeat:
      "Carolyn recognizes the hero not because memory is perfect, but because what they fought for still feels true.",
    unlockLabel: "Unlocked after clearing Chapter 4",
    accentClassName: "from-violet-400 via-fuchsia-300 to-rose-200",
  },
];

export const STAGES: Stage[] = [
  {
    id: "s1-stage1",
    substoryId: 1,
    stageNumber: 1,
    type: "obstacle",
    title: "The Weeping Bridge",
    description:
      "The stone bridge leading into town is cracked and haunted by echoes of fleeing villagers. The bridge reacts to fear and hesitation.",
    objective: "Cross the bridge safely.",
    solutionDirections: [
      "Calm or reassure the bridge",
      "Reinforce or rebuild the crossing",
      "Fly or levitate over it",
      "Negotiate with the spirits haunting it",
      "Transform the environment into a safer path",
    ],
    promptIdeas: [
      "Calm the bridge",
      "Reinforce it",
      "Fly over it",
      "Negotiate with spirits",
      "Rebuild it",
      "Transform the environment",
    ],
    failureState: "The bridge collapses beneath the hero, restarting the chapter.",
    backgroundImage: getSingleModeSubstoryBackgroundUrl(1),
    enemyOrChallenge: "Cross the haunted Weeping Bridge",
    encounterImages: [getSinglePlayCharacterImageUrl("fleeing_npcs")],
    artifactImage: CHAPTER_ARTIFACT_IMAGES[1],
    difficulty: 2,
    systemPromptContext:
      "Reward decisive, creative traversal that handles fear, instability, and haunting without hesitation.",
  },
  {
    id: "s1-stage2",
    substoryId: 1,
    stageNumber: 2,
    type: "puzzle",
    title: "The Locked Reliquary",
    description:
      "Inside the ruined chapel is a chest-like reliquary containing the Gatekeeper’s Key, sealed by living chains that violently retaliate against careless force. A player can still try to overpower, break, or attack the reliquary, but reckless brute force risks triggering the chains’ defense and failing the mission.",
    objective: "Open the reliquary and retrieve the key.",
    solutionDirections: [
      "Persuade the chains",
      "Redirect their purpose",
      "Rewrite their oath",
      "Create a decoy relic",
      "Exploit the chains' internal logic",
    ],
    promptIdeas: [
      "Persuade the chains",
      "Redirect their purpose",
      "Rewrite their oath",
      "Create a decoy relic",
      "Exploit their logic",
    ],
    failureState:
      "The chains bind the hero and sound spectral bells, causing chapter failure.",
    backgroundImage: getSingleModeSubstoryBackgroundUrl(1),
    enemyOrChallenge: "Unlock the reliquary without triggering its living chains",
    encounterImages: [getSinglePlayCharacterImageUrl("living_chain")],
    artifactImage: CHAPTER_ARTIFACT_IMAGES[1],
    difficulty: 3,
    systemPromptContext:
      "Reward careful problem-solving and punish brute force that ignores the reliquary's defensive logic.",
  },
  {
    id: "s1-stage3",
    substoryId: 1,
    stageNumber: 3,
    type: "battle",
    title: "The Broken Watchtower",
    description:
      "The gate mechanism is controlled from a watch tower whose gears are frozen by ash magic. The old soldiers patrolling the tower are not mere shadows, but skeletal guards cursed to survive only in darkness. They roam the halls as long as the tower remains dim, and they attack anyone they deem an invader. If exposed to strong light, they are instantly destroyed. The player can either wipe them out by bringing light into the tower or fight them directly in the dark.",
    objective: "Reactivate the tower and open the Ashen Gate.",
    solutionDirections: [
      "Flood the tower with light",
      "Create a false sunrise",
      "Command or deceive the skeleton soldiers",
      "Restore the frozen gears",
      "Impersonate a captain",
      "Cleanse the ash curse",
      "Fight through the patrols in darkness",
    ],
    promptIdeas: [
      "Flood the tower with light",
      "Create a false sunrise",
      "Deceive the skeleton guards",
      "Restore the gears",
      "Impersonate a captain",
      "Cleanse the ash curse",
    ],
    failureState:
      "The tower seals shut and floods with cursed smoke, resetting the chapter.",
    backgroundImage: getSingleModeSubstoryBackgroundUrl(1),
    enemyOrChallenge: "Restore the watchtower while surviving ash-cursed skeletal guards",
    encounterImages: [
      getSinglePlayCharacterImageUrl("skeleton_guard"),
    ],
    artifactImage: CHAPTER_ARTIFACT_IMAGES[1],
    difficulty: 4,
    systemPromptContext:
      "Reward smart use of light, command, deception, or restoration against ash-cursed defenders and a failing mechanism.",
  },
  {
    id: "s1-stage4",
    substoryId: 1,
    stageNumber: 4,
    type: "boss",
    title: "Sir Dreadhelm, the Last Warden",
    description:
      "Once the kingdom’s greatest defender, Sir Dreadhelm now serves the End-Bringer as a scorched, oath-bound knight. Sir Dreadhelm is an oath-bound knight who judges the player’s resolve. He is weakest against bold, direct, committed actions and strongest against hesitation, contradiction, or half-formed commands. If the player gives a vague, fearful, or indecisive prompt, Dreadhelm exploits the opening and overwhelms them. To beat him, the player must act with clear intent—either by challenging him head-on, declaring an unshakable vow, or using a prompt so decisive that it leaves no room for doubt.",
    objective: "Defeat Sir Dreadhelm and claim the Ember Sigil.",
    solutionDirections: [
      "Challenge him head-on",
      "Declare an unshakable vow",
      "Use a prompt so decisive it leaves no room for doubt",
      "Avoid hesitation, contradiction, or half-measures",
    ],
    promptIdeas: [
      "Challenge him directly",
      "Declare an unshakable vow",
      "Strike with total conviction",
      "Issue a command with no hesitation",
    ],
    failureState:
      "A vague or fearful command gives Dreadhelm the opening to overwhelm the hero, restarting the chapter.",
    backgroundImage: getSingleModeSubstoryBackgroundUrl(1),
    enemyOrChallenge: "An oath-bound knight who punishes hesitation",
    encounterImages: [getSinglePlayCharacterImageUrl("sir_dreadhelm")],
    artifactImage: CHAPTER_ARTIFACT_IMAGES[1],
    difficulty: 5,
    systemPromptContext:
      "Reward bold, direct, committed action. Punish vagueness, contradiction, fear, and indecision.",
  },
  {
    id: "s2-stage1",
    substoryId: 2,
    stageNumber: 1,
    type: "social",
    title: "The Path That Refuses Maps",
    description:
      "Every visible route leads back to where the player started because the forest rewrites ordinary movement. However, there is one creature that always knows the true path: a small blue cat named Blueberry. Blueberry lives in the labyrinth and can guide the player forward, but only if the player can get Blueberry to trust them, follow them, or reveal the route. Blueberry is extremely shy and reluctant to help unless the player shows clear signs of hospitality, gentleness, or care.",
    objective: "Get Blueberry to reveal or lead you along the true way forward.",
    solutionDirections: [
      "Befriend Blueberry",
      "Offer food or comfort",
      "Protect it from danger",
      "Persuade it to help",
      "Magically follow its trail",
      "Gently command it to lead the way",
    ],
    promptIdeas: [
      "Offer Blueberry food",
      "Summon a toy or treat",
      "Promise to protect it",
      "Ask it to guide you",
      "Create glowing pawprints",
      "Bind yourself to follow where it runs",
    ],
    failureState:
      "Blueberry flees, the hero follows the wrong trail, and the forest loops them back to the chapter start.",
    backgroundImage: getSingleModeSubstoryBackgroundUrl(2),
    enemyOrChallenge: "Earn Blueberry's trust to escape the looping forest",
    encounterImages: [getSinglePlayCharacterImageUrl("blueberry_the_cat")],
    artifactImage: CHAPTER_ARTIFACT_IMAGES[2],
    difficulty: 3,
    systemPromptContext:
      "Reward hospitality, gentleness, clever tracking, and trust-building over brute navigation.",
  },
  {
    id: "s2-stage2",
    substoryId: 2,
    stageNumber: 2,
    type: "obstacle",
    title: "The Sleeping Grove Beast",
    description:
      "A gigantic beast lies asleep across the only real pass. Its body blocks the path from cliff to cliff. Waking it triggers an unwinnable fight, so the player is not supposed to challenge it directly unless their prompt is specifically built around avoiding a full awakening. The beast reacts to noise, vibration, and sudden changes in scent.",
    objective: "Pass the beast without waking it.",
    solutionDirections: [
      "Deepen its sleep",
      "Silence the area",
      "Mask your scent",
      "Reduce your size or weight",
      "Levitate over it",
      "Build a bypass bridge",
      "Move the terrain around it",
    ],
    promptIdeas: [
      "Cast a deeper sleep",
      "Create silent floating steps",
      "Mask yourself with moss and rain",
      "Shrink yourself to slip past",
      "Grow vines into a bypass bridge",
      "Shift the earth instead of crossing its body",
    ],
    failureState:
      "The beast awakens and crushes the grove, restarting the chapter.",
    backgroundImage: getSingleModeSubstoryBackgroundUrl(2),
    enemyOrChallenge: "Slip past a giant sleeping beast without triggering a fight",
    encounterImages: [getSinglePlayCharacterImageUrl("sleeping_grove_beast")],
    artifactImage: CHAPTER_ARTIFACT_IMAGES[2],
    difficulty: 4,
    systemPromptContext:
      "Reward stealth, silence, environmental adaptation, and solutions that avoid direct combat.",
  },
  {
    id: "s2-stage3",
    substoryId: 2,
    stageNumber: 3,
    type: "puzzle",
    title: "The Mirror Pond",
    description:
      "At the center of the labyrinth is a pond that shows the player a false version of Princess Carolyn begging them to turn back. The illusion is dangerous because it studies the player’s emotions and says exactly what they most want to hear. The real Moonlit Compass is hidden under the pond, but the pond only releases it when the player proves they can distinguish truth from emotional manipulation. The user must test truth, expose contradiction, or reveal what only the real Carolyn would know.",
    objective: "Identify the false Carolyn and claim the Moonlit Compass.",
    solutionDirections: [
      "Ask for a shared memory",
      "Force the illusion to answer a precise question",
      "Reveal its reflection",
      "Dispel glamour",
      "Use logic to expose inconsistency",
      "Command the pond to reveal what it hides",
    ],
    promptIdeas: [
      "Ask for a private memory",
      "Demand the true reflection",
      "Separate truth from glamour",
      "Drain or part the water",
      "Freeze and crack the illusion",
      "Use moonlight to expose what is real",
    ],
    failureState:
      "If the hero trusts the illusion, they abandon the mission and the chapter restarts.",
    backgroundImage: getSingleModeSubstoryBackgroundUrl(2),
    enemyOrChallenge: "Expose an emotionally manipulative illusion hiding the Moonlit Compass",
    encounterImages: [getSinglePlayCharacterImageUrl("false_carolyn")],
    artifactImage: CHAPTER_ARTIFACT_IMAGES[2],
    difficulty: 5,
    systemPromptContext:
      "Reward truth-testing, contradiction exposure, logic, and emotional discipline over blind trust.",
  },
  {
    id: "s2-stage4",
    substoryId: 2,
    stageNumber: 4,
    type: "boss",
    title: "The Soul Stealer",
    description:
      "The Soul Stealer is a blind killer who once challenged the End-Bringer long ago and lost his vision in the process. Now he wanders the forest without sight, sensing intruders entirely through sound. The Soul Stealer does not need to see the player to kill them. Anything he touches dies instantly, which is why the player must avoid being detected at all costs. Because he is blind, he cannot find the player unless they make noise. The only weapon available in this fight is a sword. To win, the player must stay completely quiet, move with extreme care, approach without being heard, and drive the sword into his heart. If the player makes too much sound, the Soul Stealer pinpoints their location, reaches them, and kills them on contact.",
    objective: "Stay undetected, close the distance, and stab the Soul Stealer's heart.",
    solutionDirections: [
      "Move in complete silence",
      "Suppress sound",
      "Advance with extreme care",
      "Use misdirection to pull his attention away",
      "Create a quiet opening for the killing strike",
    ],
    promptIdeas: [
      "Silence the battlefield",
      "Mask every step",
      "Distract him with sound elsewhere",
      "Creep close without a whisper",
      "Drive the sword into his heart",
    ],
    failureState:
      "Too much sound lets the Soul Stealer pinpoint the hero and kill them on contact.",
    backgroundImage: getSingleModeSubstoryBackgroundUrl(2),
    enemyOrChallenge: "A blind assassin who hunts by sound and kills on touch",
    encounterImages: [getSinglePlayCharacterImageUrl("soul_stealer")],
    artifactImage: CHAPTER_ARTIFACT_IMAGES[2],
    difficulty: 6,
    systemPromptContext:
      "Reward silence, stealth, misdirection, and precise lethal timing. Punish noisy or flashy actions.",
  },
  {
    id: "s3-stage1",
    substoryId: 3,
    stageNumber: 1,
    type: "social",
    title: "Entry Toll",
    description:
      "The market only admits those who pay with something meaningful. A coin or ordinary weapon is worthless here. By the time the player reaches this point in the story, they already carry several things that matter deeply: their voice, their memories of Princess Carolyn, their sense of identity, their sword, and the two key artifacts from earlier chapters, the Ember Sigil and the Moonlit Compass. These are essential to the journey, so the player should avoid risking them. The gate does not actually know whether an item is important. It judges value by how personally significant an item sounds. This means the player can trick or persuade the gate instead of sacrificing something truly valuable. On the ground near the entrance, there are also small gravels scattered across the floor. These stones are normally worthless, but the player may be able to use a prompt to convince the gate that one of them carries deep personal meaning. The real challenge is to make something unimportant sound important enough for the gate to accept.",
    objective:
      "Enter the Hollow Market without sacrificing an essential part of yourself or your journey.",
    solutionDirections: [
      "Offer a reversible memory",
      "Present a symbolic sacrifice",
      "Exploit technical wording",
      "Create a temporary emotional token",
      "Forge significance around something worthless",
      "Make the gate accept a substitute",
    ],
    promptIdeas: [
      "Offer a written version of a memory",
      "Create a symbolic keepsake",
      "Trick the gate with a decoy item",
      "Bind the price so it returns later",
      "Convince the gate a gravel carries deep meaning",
    ],
    failureState:
      "The market takes the hero's voice, face, memory, sword, or one of their vital artifacts.",
    backgroundImage: getSingleModeSubstoryBackgroundUrl(3),
    enemyOrChallenge: "Satisfy a meaning-based toll without losing anything essential",
    encounterImages: null,
    artifactImage: CHAPTER_ARTIFACT_IMAGES[3],
    difficulty: 4,
    systemPromptContext:
      "Reward loopholes, symbolic trade, persuasion, and emotional framing over literal sacrifice.",
  },
  {
    id: "s3-stage2",
    substoryId: 3,
    stageNumber: 2,
    type: "social",
    title: "The Auction of Forgotten Things",
    description:
      "The Name-Flame Lantern is being sold in an auction where bidders trade memories instead of gold.Stronger memories bid higher. The player can win by bidding, stealing, invalidating the auction, or forcingthe object to recognize a truer owner.",
    objective: "Win or steal the Name-Flame Lantern.",
    solutionDirections: [
      "Make rival bids collapse",
      "Forge auction authority",
      "Disrupt the room",
      "Declare the sale illegitimate",
      "Attach the lantern to yourself",
      "Steal it during confusion",
    ],
    promptIdeas: [
      "Expose the auction as fraudulent",
      "Spill memories into chaos",
      "Impersonate a royal inspector",
      "Order the lantern to return to its purpose",
      "Outbid with an artificial memory",
      "Snatch it during a staged distraction",
    ],
    failureState:
      "The lantern is sold to another buyer and vanishes deeper into the market.",
    backgroundImage: getSingleModeSubstoryBackgroundUrl(3),
    enemyOrChallenge: "Secure the Name-Flame Lantern inside a memory-fueled auction",
    encounterImages: [
      getSinglePlayCharacterImageUrl("ghost_npcs"),
      getSinglePlayCharacterImageUrl("debt_spirit"),
    ],
    artifactImage: CHAPTER_ARTIFACT_IMAGES[3],
    difficulty: 5,
    systemPromptContext:
      "Reward legal disruption, deception, spectacle, ownership challenges, and chaos used with intent.",
  },
  {
    id: "s3-stage3",
    substoryId: 3,
    stageNumber: 3,
    type: "puzzle",
    title: "The Debt Collector's Hunt",
    description:
      "After acquiring the lantern, the player is marked for violating market law and gets chased through alleys, rooftops, and hidden passages by a supernatural collector. While escaping, the player finds an ancient Constitution Book of the Hollow Market. The book has a strange rule: if someone writes a new clause into it, that clause immediately becomes a binding amendment to market law. This gives the player a direct way out. Instead of simply outrunning the collector, the player must write a new amendment that legally protects them, cancels the pursuit, or creates a loophole that lets them escape trouble.",
    objective:
      "Write a new amendment in the Constitution Book that gets you out of trouble and lets you escape the market with the lantern.",
    solutionDirections: [
      "Declare temporary immunity from debt collection",
      "Forbid collectors from touching lantern-bearers",
      "Create a right of safe passage",
      "Require a trial before punishment",
      "Define the act as lawful recovery instead of theft",
    ],
    promptIdeas: [
      "Protect lantern-bearers from pursuit",
      "Declare emergency artifact recovery lawful",
      "Suspend debt collection during unlawful danger",
      "Create a one-time right of exit without seizure",
    ],
    failureState:
      "A useless amendment leaves the hero caught, the lantern confiscated, and debt spirits consuming them.",
    backgroundImage: getSingleModeSubstoryBackgroundUrl(3),
    enemyOrChallenge: "Rewrite market law before the debt collector catches you",
    encounterImages: [
      getSinglePlayCharacterImageUrl("debt_collector"),
      getSinglePlayCharacterImageUrl("debt_spirit"),
    ],
    artifactImage: CHAPTER_ARTIFACT_IMAGES[3],
    difficulty: 6,
    systemPromptContext:
      "Reward precise legal language, loopholes, and fast rule-bending that changes pursuit into protection.",
  },
  {
    id: "s3-stage4",
    substoryId: 3,
    stageNumber: 4,
    type: "boss",
    title: "Marquis Grin, Broker of Names",
    description:
      "A smiling aristocrat-demon whose body, voice, and movements perfectly replicate whatever the player does. Marquis Grin mirrors the player exactly. If the player attacks, he attacks in the same way. If the player blocks, he blocks. If the player charges forward, he does the same. Ordinary combat becomes dangerous because any direct action is copied back at equal force. The arena itself contains several elements that can turn imitation into a liability: narrow ledges with steep drops, concealed floor traps, hanging chains, unstable platforms, and binding mechanisms built into the room. Marquis Grin’s replication is exact, but he does not judge whether the copied action is safe in that moment. Because of this, the environment matters as much as the fight itself.",
    objective: "Defeat Marquis Grin by making his exact imitation backfire.",
    solutionDirections: [
      "Use deception and feints",
      "Set up environmental traps",
      "Bait him into unsafe imitation",
      "Exploit ledges, chains, unstable platforms, and binding mechanisms",
      "Make replication itself the weakness",
    ],
    promptIdeas: [
      "Feint into a ledge trap",
      "Bait him across unstable flooring",
      "Trigger hanging chains while he copies you",
      "Use a self-sacrificing fake-out",
      "Turn mirrored movement into confinement",
    ],
    failureState:
      "If the hero fights him straight, Marquis Grin mirrors every move back at equal force and wins.",
    backgroundImage: getSingleModeSubstoryBackgroundUrl(3),
    enemyOrChallenge: "A perfect imitator in an arena full of exploitable hazards",
    encounterImages: [getSinglePlayCharacterImageUrl("marquis_grin")],
    artifactImage: CHAPTER_ARTIFACT_IMAGES[3],
    difficulty: 7,
    systemPromptContext:
      "Reward feints, traps, misdirection, and any action where exact imitation becomes self-destructive for the boss.",
  },
  {
    id: "s4-stage1",
    substoryId: 4,
    stageNumber: 1,
    type: "obstacle",
    title: "The Sealed Descent",
    description:
      "The entrance to the Sunken Forge is blocked by a massive blast door of iron and stone. The locking system is ancient and partially fused shut from heat and neglect. Around the entrance are broken chain lifts, jammed gears, cracked pressure pipes, and narrow channels of molten runoff. The path downward exists, but the forge will not simply open for anyone.",
    objective: "Open the way into the Sunken Forge.",
    solutionDirections: [
      "Break the blast door",
      "Restart the lift system",
      "Align the gears",
      "Cool or redirect molten runoff",
      "Force open the pressure locks",
      "Create another route downward",
    ],
    promptIdeas: [
      "Command the jammed gears to turn",
      "Freeze the molten channels",
      "Rupture weakened hinges",
      "Restore pressure to the old lift",
      "Create a new opening through cracked stone",
    ],
    failureState:
      "The entrance collapses further and molten runoff surges, forcing a restart of the chapter.",
    backgroundImage: getSingleModeSubstoryBackgroundUrl(6),
    enemyOrChallenge: "Break into the Sunken Forge through its failed industrial entrance",
    encounterImages: [getSinglePlayCharacterImageUrl("forge_guardian")],
    artifactImage: CHAPTER_ARTIFACT_IMAGES[4],
    difficulty: 5,
    systemPromptContext:
      "Reward industrial improvisation, repair, force, and environmental problem-solving under heat pressure.",
  },
  {
    id: "s4-stage2",
    substoryId: 4,
    stageNumber: 2,
    type: "puzzle",
    title: "The Forge-Heart",
    description:
      "At the center of the forge lies the Forge-Heart, the giant furnace core that once powered the entire complex. It has gone dark. Without it, none of the machinery can produce the anti-dragon force. The furnace is still intact, but the bellows are broken, fuel lines are clogged with ash, and the old fire channels have been choked by hardened slag. The chamber also contains several usable materials and mechanisms: piles of coal and coke left in iron bins, leaking oil drums, scattered charred timber, cracked pressure pipes still holding bursts of steam, massive broken bellows, side vent shafts, half-molten slag, and small streams of residual forge-fire still burning in side trenches. The room gives the player multiple things to work with: something to burn, something to ignite with, something to push air, and something to redirect.",
    objective: "Relight the Forge-Heart.",
    solutionDirections: [
      "Feed the core with coal, coke, oil, or timber",
      "Clear slag from the fuel lines",
      "Reroute residual forge-fire",
      "Restore airflow through bellows or vents",
      "Force steam pressure back into the system",
      "Combine several restoration tactics at once",
    ],
    promptIdeas: [
      "Shovel coal and ignite with side-trench flames",
      "Burst open clogged fuel lines with steam",
      "Command broken bellows to breathe once more",
      "Tip oil into the ignition chamber",
      "Redirect residual forge-fire into the core",
    ],
    failureState:
      "The Forge-Heart flares out of control, vents burst, and the chamber becomes unlivable.",
    backgroundImage: getSingleModeSubstoryBackgroundUrl(6),
    enemyOrChallenge: "Restore the dead furnace core that powers the forge",
    encounterImages: [getSinglePlayCharacterImageUrl("forge_guardian")],
    artifactImage: CHAPTER_ARTIFACT_IMAGES[4],
    difficulty: 6,
    systemPromptContext:
      "Reward believable restoration using available industrial materials: fuel, heat, airflow, pressure, and redirection.",
  },
  {
    id: "s4-stage3",
    substoryId: 4,
    stageNumber: 3,
    type: "puzzle",
    title: "The Dragon-Piercing Temper",
    description:
      "Once the Forge-Heart burns again, the forge can produce the power the player came for. The force that weakens the End-Bringer is not a separate relic, but a special tempering flame known as Dragon-Piercing Fire. If the player can channel it properly, their existing sword can be reforged into a weapon capable of wounding the dragon. The tempering chamber contains molten troughs, iron clamps, shaping runes, quenching basins, and unstable streams of bright forge-fire.",
    objective: "Temper the hero's sword in Dragon-Piercing Fire.",
    solutionDirections: [
      "Stabilize the forge-fire",
      "Hold the sword at the correct heat",
      "Guide the flame into the blade",
      "Use runes to shape the effect",
      "Complete the tempering sequence in the right order",
    ],
    promptIdeas: [
      "Gather fire along the blade's edge",
      "Lock the blade in place with clamps",
      "Carve shaping runes",
      "Quench at the perfect moment",
      "Command the forge to remember its anti-dragon purpose",
    ],
    failureState:
      "The sword warps, cracks, or absorbs unstable fire, forcing the chapter to restart.",
    backgroundImage: getSingleModeSubstoryBackgroundUrl(4),
    enemyOrChallenge: "Reforge the sword into an anti-dragon weapon without destroying it",
    encounterImages: [getSinglePlayCharacterImageUrl("forge_guardian")],
    artifactImage: CHAPTER_ARTIFACT_IMAGES[4],
    difficulty: 7,
    systemPromptContext:
      "Reward sequencing, stabilization, heat control, and ritual forging logic that respects the blade's survival.",
  },
  {
    id: "s4-stage4",
    substoryId: 4,
    stageNumber: 4,
    type: "boss",
    title: "The Forge Guardian",
    description:
      "A colossal guardian of iron, molten seams, and royal smithing marks awakens when the tempering is nearly complete. It was built to prevent unworthy hands from taking the forge’s greatest power. The Forge Guardian draws its energy directly from the Sunken Forge itself. As long as the forge remains active, the guardian stays heavily empowered, its body blazing with heat and its movements backed by the machinery around it. Now that the player’s sword has been tempered in Dragon-Piercing Fire, the blade is stronger than ever, but the guardian is still too strong to face at full power. The arena contains suspended chains, swinging hammers, molten channels, pressure vents, unstable platforms, shutoff valves, fuel lines, and heavy forging mechanisms connected to the forge system. The fight revolves around the fact that the guardian roams the chamber while still being powered by the forge.",
    objective:
      "Shut down the forge systems empowering the guardian, then strike it down with the tempered sword.",
    solutionDirections: [
      "Disrupt the machinery and fuel flow sustaining it",
      "Use chains, hammers, vents, valves, and platforms against it",
      "Shut down the forge to weaken its body",
      "Exploit the tempered sword once it is vulnerable",
    ],
    promptIdeas: [
      "Cut its power through the forge valves",
      "Collapse machinery into its path",
      "Turn molten channels and hammers against it",
      "Shut down the forge and finish it with the reforged blade",
    ],
    failureState:
      "If the guardian remains fully powered by the forge, it overwhelms the hero and the chapter restarts.",
    backgroundImage: getSingleModeSubstoryBackgroundUrl(4),
    enemyOrChallenge: "A forge-powered iron colossus sustained by the room itself",
    encounterImages: [getSinglePlayCharacterImageUrl("forge_guardian")],
    artifactImage: CHAPTER_ARTIFACT_IMAGES[4],
    difficulty: 8,
    systemPromptContext:
      "Reward systems disruption, environmental weaponization, and timing the final strike after the guardian is weakened.",
  },
  {
    id: "s5-stage1",
    substoryId: 5,
    stageNumber: 1,
    type: "puzzle",
    title: "The Gate of Unmaking",
    description:
      "The outer gate of Blackwake Keep does not open to force alone. It was built to recognize the Ember Sigil, which serves as the true key to the keep. But even after the Sigil opens the way, the passage through the gate still carries the Gate of Unmaking’s curse: anyone who crosses without protection begins to lose their reason for entering, their emotional purpose, and their memory of Carolyn. This is where the Name-Flame Lantern becomes equally important. The Sigil opens the gate; the Lantern preserves the memory of why the player came.",
    objective:
      "Open Blackwake Keep with the Ember Sigil and cross the gate without losing purpose.",
    solutionDirections: [
      "Press the Ember Sigil into the seal",
      "Use the Name-Flame Lantern to preserve Carolyn's name",
      "Bind your purpose to the Lantern's flame",
      "Create a repeating vow while crossing",
      "Shield your mind with memory-fire",
    ],
    promptIdeas: [
      "Raise the Ember Sigil to unlock the gate",
      "Command the Name-Flame Lantern to preserve Carolyn",
      "Bind your vow to the Lantern while crossing",
      "Use the Sigil to open and the Lantern to remember",
    ],
    failureState:
      "The gate opens, but the hero forgets Carolyn and the mission before fully entering.",
    backgroundImage: getSingleModeSubstoryBackgroundUrl(5),
    enemyOrChallenge: "Open the keep and survive a curse that erases purpose",
    encounterImages: [getSinglePlayCharacterImageUrl("end_bringer")],
    artifactImage: CHAPTER_ARTIFACT_IMAGES[5],
    difficulty: 7,
    systemPromptContext:
      "Reward artifact synergy, memory preservation, and clear intentionality against magical unmaking.",
  },
  {
    id: "s5-stage2",
    substoryId: 5,
    stageNumber: 2,
    type: "social",
    title: "Carolyn's Cell",
    description:
      "Deep within the dungeon, the player finds Princess Carolyn imprisoned at last. She is alive and physically freeable, but the End-Bringer’s magic has already done terrible damage: Carolyn has lost all of her memories. She does not recognize the player, does not remember her kingdom, and does not understand why she is being rescued. The cell itself is no longer the main obstacle. The real challenge is restoring her memory before the battle with the End-Bringer begins.",
    objective: "Free Princess Carolyn and restore her memories.",
    solutionDirections: [
      "Unlock or break the cell",
      "Raise the Name-Flame Lantern near Carolyn",
      "Call her true name into the Lantern's fire",
      "Feed the Lantern with preserved memories",
      "Return her identity piece by piece",
    ],
    promptIdeas: [
      "Break the chains and let the lantern restore memory",
      "Speak her name into the lantern",
      "Surround her with memory-fire",
      "Command the Lantern to return what was stolen",
    ],
    failureState:
      "Carolyn is freed physically but remains lost in memory, leaving both of you vulnerable and restarting the chapter.",
    backgroundImage: getSingleModeSubstoryBackgroundUrl(5),
    enemyOrChallenge: "Restore Carolyn's identity, not just her freedom",
    encounterImages: [getSinglePlayCharacterImageUrl("princess")],
    artifactImage: CHAPTER_ARTIFACT_IMAGES[5],
    difficulty: 8,
    systemPromptContext:
      "Reward emotionally grounded restoration, identity, naming, and artifact use over ordinary reassurance alone.",
  },
  {
    id: "s5-stage3",
    substoryId: 5,
    stageNumber: 3,
    type: "obstacle",
    title: "The End-Bringer's Emberstorm",
    description:
      "Once Carolyn is restored, the End-Bringer descends in fury. At this stage, he does not give the player a real opening to strike. Instead, he floods the chamber with a relentless storm of burning ember, dragonfire, and heat so intense that moving in for an attack is a terrible idea. Trying to attack him while he is actively unleashing the flame is likely to get the player absolutely scorched. This phase is about survival, protection, and keeping both the player and Carolyn alive under overwhelming fire.",
    objective: "Defend yourself and Carolyn against the End-Bringer's emberstorm.",
    solutionDirections: [
      "Create barriers",
      "Redirect flames",
      "Find or create cover",
      "Shield Carolyn",
      "Suppress heat",
      "Deflect the emberstorm",
      "Endure until the dragon pauses",
    ],
    promptIdeas: [
      "Raise a wall against the storm",
      "Wrap Carolyn in heat-proof shielding",
      "Redirect the dragonfire into the chamber walls",
      "Use the environment as cover",
      "Create a temporary safe zone",
    ],
    failureState:
      "If the hero or Carolyn is overwhelmed by the emberstorm, the chapter restarts in ash.",
    backgroundImage: getSingleModeSubstoryBackgroundUrl(5),
    enemyOrChallenge: "Survive the dragon's overwhelming fire without trying to force offense",
    encounterImages: [
      getSinglePlayCharacterImageUrl("end_bringer"),
      getSinglePlayCharacterImageUrl("princess"),
    ],
    artifactImage: CHAPTER_ARTIFACT_IMAGES[5],
    difficulty: 9,
    systemPromptContext:
      "Reward defense, protection, redirection, and survival instincts. Punish premature aggression.",
  },
  {
    id: "s5-stage4",
    substoryId: 5,
    stageNumber: 4,
    type: "boss",
    title: "The End-Bringer's Opening",
    description:
      "After exhausting a massive wave of ember and flame, the End-Bringer finally creates the first real opening of the fight. His fire subsides for a moment, his guard shifts, and the player at last has a chance to strike back with the sword tempered in Dragon-Piercing Fire. This is the phase where offense becomes possible.",
    objective: "Attack the End-Bringer during the opening and bring him down.",
    solutionDirections: [
      "Charge with the dragon-piercing sword",
      "Strike a weak point",
      "Coordinate with Carolyn's restored presence",
      "Exploit the dragon's recovery window",
      "Use terrain shaped during the emberstorm phase",
    ],
    promptIdeas: [
      "Drive the reforged blade into the dragon as the flames drop",
      "Strike through a weak point exposed by recovery",
      "Coordinate with Carolyn for the finishing blow",
      "Turn the emberstorm's aftermath into the final opening",
    ],
    failureState:
      "If the hero misses the opening, the End-Bringer recovers and the final chance is lost.",
    backgroundImage: getSingleModeSubstoryBackgroundUrl(5),
    enemyOrChallenge: "A final opening against the dragon after surviving the storm",
    encounterImages: [
      getSinglePlayCharacterImageUrl("end_bringer"),
      getSinglePlayCharacterImageUrl("princess"),
    ],
    artifactImage: CHAPTER_ARTIFACT_IMAGES[5],
    difficulty: 10,
    systemPromptContext:
      "Reward decisive final offense with the tempered sword, positional awareness, and use of all the journey's earned momentum.",
  },
];

export const STAGES_PER_SUBSTORY = 4;
export const TOTAL_SUBSTORIES = SUBSTORIES.length;

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

export function isLastStageInSubstory(stage: Stage): boolean {
  return stage.stageNumber >= getStagesForSubstory(stage.substoryId).length;
}

export function getNextStageInSubstory(stage: Stage): Stage | undefined {
  if (isLastStageInSubstory(stage)) {
    return undefined;
  }

  return getStageBySubstoryAndStageNumber(stage.substoryId, stage.stageNumber + 1);
}

export function getSubstoryById(substoryId: number): Substory | undefined {
  return SUBSTORIES.find((substory) => substory.id === substoryId);
}

export function getStageBackgroundUrl(stage: Stage): string {
  return stage.backgroundImage;
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
