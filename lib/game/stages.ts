import {
  getSingleModeStageBackgroundUrl,
  getSingleModeSubstoryBackgroundUrl,
} from "@/lib/game/assets";
import type { GameProgress, Stage, Substory } from "@/lib/game/types";

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
      "A burned border town lies before a massive sealed gate of black iron. Charred banners flap in the wind while ruined homes and guard posts show how fast Veyrune fell.",
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
      "A vast forest of black vines, carnivorous flowers, and shifting trails where moonlight, scent, reflection, and sleep all become parts of the maze.",
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
      "A hidden market lit by floating lanterns, where ghosts, thieves, monsters, and forgotten nobles trade secrets, names, and years of their lives.",
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
      "Deep beneath the ruined kingdom lies a sprawling industrial temple of iron, chain lifts, molten channels, broken furnaces, and half-buried royal machinery.",
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
      "A volcanic fortress built into the mountain itself, where corridors rewrite themselves and dragon magic distorts memory, time, and language.",
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
      "The cracked stone bridge into town is haunted by echoes of fleeing villagers and reacts violently to fear and hesitation.",
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
    backgroundImage: "s1-stage1.png",
    enemyOrChallenge: "Cross the haunted Weeping Bridge",
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
      "Inside the ruined chapel sits a chest-like reliquary holding the Gatekeeper's Key, sealed by living chains that punish reckless force.",
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
    backgroundImage: "s1-stage2.png",
    enemyOrChallenge: "Unlock the reliquary without triggering its living chains",
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
      "The watchtower that controls the Ashen Gate is frozen by ash magic and patrolled by skeletal guards who survive only in darkness.",
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
    backgroundImage: "s1-stage3.png",
    enemyOrChallenge: "Restore the watchtower while surviving ash-cursed skeletal guards",
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
      "The kingdom's once-greatest defender now stands scorched and oath-bound, judging whether the hero's resolve is worthy to pass.",
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
    backgroundImage: "s1-stage4.png",
    enemyOrChallenge: "An oath-bound knight who punishes hesitation",
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
      "Every visible trail loops back to the start. The only creature that truly knows the path is Blueberry, a shy blue cat who will only guide someone it trusts.",
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
    backgroundImage: "s2-stage1.png",
    enemyOrChallenge: "Earn Blueberry's trust to escape the looping forest",
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
      "A gigantic sleeping beast blocks the only real pass. Waking it leads to an unwinnable disaster, so the challenge is stealth and environmental control.",
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
    backgroundImage: "s2-stage2.png",
    enemyOrChallenge: "Slip past a giant sleeping beast without triggering a fight",
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
      "A pond at the labyrinth's center shows a false Princess Carolyn who begs the hero to turn back, using emotional manipulation to hide the Moonlit Compass.",
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
    backgroundImage: "s2-stage3.png",
    enemyOrChallenge: "Expose an emotionally manipulative illusion hiding the Moonlit Compass",
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
      "A blind killer who senses only sound and kills anything he touches. The only reliable win condition is silent approach and a final sword strike to the heart.",
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
    backgroundImage: "s2-stage4.png",
    enemyOrChallenge: "A blind assassin who hunts by sound and kills on touch",
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
      "The Hollow Market demands something meaningful as entry payment, but the hero must avoid sacrificing their core identity, artifacts, voice, or memories.",
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
    backgroundImage: "s3-stage1.png",
    enemyOrChallenge: "Satisfy a meaning-based toll without losing anything essential",
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
      "The Name-Flame Lantern is being sold in an auction where memories are currency. The hero can win by bidding, stealing, disrupting the sale, or challenging ownership itself.",
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
    backgroundImage: "s3-stage2.png",
    enemyOrChallenge: "Secure the Name-Flame Lantern inside a memory-fueled auction",
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
      "After taking the lantern, the hero is hunted through the market until they discover the Constitution Book, whose written amendments instantly become binding law.",
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
    backgroundImage: "s3-stage3.png",
    enemyOrChallenge: "Rewrite market law before the debt collector catches you",
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
      "A smiling aristocrat-demon who mirrors every direct action the hero takes, turning ordinary combat into a trap unless imitation itself is weaponized.",
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
    backgroundImage: "s3-stage4.png",
    enemyOrChallenge: "A perfect imitator in an arena full of exploitable hazards",
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
      "The entrance to the Sunken Forge is blocked by a fused blast door, broken chain lifts, jammed gears, pressure pipes, and molten runoff.",
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
    backgroundImage: "s4-stage1.png",
    enemyOrChallenge: "Break into the Sunken Forge through its failed industrial entrance",
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
      "The giant furnace core that once powered the forge has gone dark, but the chamber still contains fuel, fire, steam, vents, oil, and broken machinery.",
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
    backgroundImage: "s4-stage2.png",
    enemyOrChallenge: "Restore the dead furnace core that powers the forge",
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
      "With the Forge-Heart alive, the hero must temper their sword in Dragon-Piercing Fire without warping, cracking, or misenchanting the blade.",
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
    backgroundImage: "s4-stage3.png",
    enemyOrChallenge: "Reforge the sword into an anti-dragon weapon without destroying it",
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
      "A colossal royal smithing guardian awakens as the tempering completes, drawing its power directly from the still-active forge around it.",
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
    backgroundImage: "s4-stage4.png",
    enemyOrChallenge: "A forge-powered iron colossus sustained by the room itself",
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
      "The outer gate of Blackwake Keep opens only to the Ember Sigil, but crossing it without protection erases the hero's purpose and memory of Carolyn.",
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
    backgroundImage: "s5-stage1.png",
    enemyOrChallenge: "Open the keep and survive a curse that erases purpose",
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
      "Princess Carolyn is alive and physically reachable, but the End-Bringer's magic has stolen her memories, leaving her unable to recognize the hero or herself.",
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
    backgroundImage: "s5-stage2.png",
    enemyOrChallenge: "Restore Carolyn's identity, not just her freedom",
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
      "Before the dragon gives any opening to attack, he drowns the chamber in ember, dragonfire, and impossible heat, making survival the only priority.",
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
    backgroundImage: "s5-stage3.png",
    enemyOrChallenge: "Survive the dragon's overwhelming fire without trying to force offense",
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
      "After exhausting a wave of destruction, the End-Bringer finally leaves a narrow opening where the dragon-piercing sword can matter.",
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
    backgroundImage: "s5-stage4.png",
    enemyOrChallenge: "A final opening against the dragon after surviving the storm",
    difficulty: 10,
    systemPromptContext:
      "Reward decisive final offense with the tempered sword, positional awareness, and use of all the journey's earned momentum.",
  },
];

export const STAGES_PER_SUBSTORY = 4;

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

export function getSubstoryById(substoryId: number): Substory | undefined {
  return SUBSTORIES.find((substory) => substory.id === substoryId);
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
