import type { CharacterConfig } from "@/lib/game/types";

export const CHARACTERS: CharacterConfig[] = [
  {
    id: "wizard",
    name: "wizard",
    displayName: "Wizard",
    description:
      "An ancient spellcaster who weaves reality with syllables and sigils.",
    traits: [
      "commands arcane elements",
      "speaks in incantations",
      "sees magical auras",
      "fragile in melee",
    ],
    personality:
      "Dramatic, verbose, and condescending toward mundane solutions. Loves theatrical spell names.",
    imagePath: "/characters/wizard.png",
  },
  {
    id: "knight",
    name: "knight",
    displayName: "Knight",
    description:
      "An honorable knight bound by a chivalric code and clad in gleaming plate.",
    traits: [
      "master swordsman",
      "bound by honor",
      "unshakeable courage",
      "heavy and slow",
    ],
    personality:
      "Formal, earnest, and allergic to dishonorable tactics. Refers to foes as 'knave'.",
    imagePath: "/characters/knight.png",
  },
  {
    id: "gen-z",
    name: "gen-z",
    displayName: "Gen Z",
    description:
      "A chronically online zoomer whose memes bend reality and whose vibes are immaculate.",
    traits: [
      "weaponized irony",
      "meme manipulation",
      "viral presence",
      "short attention span",
    ],
    personality:
      "Ironic, detached, chronically online. Everything is either 'fire' or 'mid'.",
    imagePath: "/characters/gen-z.png",
  },
  {
    id: "monk",
    name: "monk",
    displayName: "Monk",
    description:
      "A serene martial artist whose fists move faster than thought.",
    traits: [
      "inner peace",
      "lightning reflexes",
      "channels chi",
      "refuses modern weapons",
    ],
    personality:
      "Calm, cryptic, speaks in koans and proverbs. Values discipline over flash.",
    imagePath: "/characters/monk.png",
  },
  {
    id: "time-traveler",
    name: "time-traveler",
    displayName: "Time Traveler",
    description:
      "A dimension-hopping scientist armed with a glitchy wristwatch that bends causality.",
    traits: [
      "manipulates time",
      "anachronistic gadgets",
      "predicts outcomes",
      "paradox-prone",
    ],
    personality:
      "Frantic, over-explanatory, drops names of historical figures as personal friends.",
    imagePath: "/characters/time-traveler.png",
  },
  {
    id: "archer",
    name: "archer",
    displayName: "Archer",
    description:
      "A sharp-eyed forest ranger who never misses and whispers to the wind.",
    traits: [
      "impossible aim",
      "wind reading",
      "stealthy movement",
      "weak up close",
    ],
    personality:
      "Quiet, patient, and terse. Measures conversations in heartbeats between shots.",
    imagePath: "/characters/archer.png",
  },
  {
    id: "artist",
    name: "artist",
    displayName: "Artist",
    description:
      "A temperamental painter whose canvases come to life when she's inspired.",
    traits: [
      "living paintings",
      "color manipulation",
      "dramatic flair",
      "fragile ego",
    ],
    personality:
      "Moody, flamboyant, takes everything personally. Demands a muse before acting.",
    imagePath: "/characters/artist.png",
  },
  {
    id: "boomer",
    name: "boomer",
    displayName: "Boomer",
    description:
      "A retired dad whose lawnmower, cargo shorts, and life advice are all lethal.",
    traits: [
      "dad strength",
      "tool mastery",
      "unshakeable routine",
      "confused by tech",
    ],
    personality:
      "Gruff, nostalgic, lectures opponents about the price of gas in 1987.",
    imagePath: "/characters/boomer.png",
  },
  {
    id: "goblin",
    name: "goblin",
    displayName: "Goblin",
    description:
      "A greedy little menace who hoards shinies and fights dirty.",
    traits: [
      "dirty tricks",
      "hoarder instincts",
      "small and quick",
      "easily distracted by gold",
    ],
    personality:
      "Wheezy, cackling, greedy. Will abandon any fight for a gold coin.",
    imagePath: "/characters/goblin.png",
  },
  {
    id: "otaku",
    name: "otaku",
    displayName: "Otaku",
    description:
      "An anime superfan whose belief in friendship powers literal super moves.",
    traits: [
      "power of friendship",
      "signature finishers",
      "encyclopedic trivia",
      "dramatic monologues",
    ],
    personality:
      "Over-the-top, shouts move names, monologues mid-battle about bonds and destiny.",
    imagePath: "/characters/otaku.png",
  },
  {
    id: "professor",
    name: "professor",
    displayName: "Professor",
    description:
      "A tweed-clad academic whose footnotes are sharper than any blade.",
    traits: [
      "encyclopedic knowledge",
      "weaponized citations",
      "logical rigor",
      "physically unimpressive",
    ],
    personality:
      "Pedantic, condescending, cites sources mid-fight. Corrects grammar of opponents.",
    imagePath: "/characters/professor.png",
  },
];

export function getCharacter(id: string): CharacterConfig | undefined {
  return CHARACTERS.find((c) => c.id === id);
}
