import { getSingleModeIntroImageUrl } from "@/lib/game/assets";
import type { SingleIntroSlide } from "@/lib/game/types";

export const SINGLE_MODE_INTRO_SLIDES: SingleIntroSlide[] = [
  {
    id: "kingdom-of-veyrune",
    title: "The Kingdom of Veyrune",
    body: "Veyrune was once a radiant kingdom, full of light and celebration. Princess Carolyn stood at the heart of a land its people loved.",
    imageUrl: getSingleModeIntroImageUrl("kingdom_of_veyrune"),
  },
  {
    id: "the-night-everything-burned",
    title: "The Night Everything Burned",
    body: "Then the End-Bringer descended. In a single catastrophe, Veyrune was consumed by fire and left scarred by ash, fear, and grief.",
    imageUrl: getSingleModeIntroImageUrl("night_everything_burned"),
  },
  {
    id: "carolyn-was-taken",
    title: "Carolyn Was Taken",
    body: "As Veyrune burned, the End-Bringer stole Princess Carolyn and vanished toward Blackwake Keep. From that moment on, the journey became a rescue.",
    imageUrl: getSingleModeIntroImageUrl("carolyn_was_taken"),
  },
  {
    id: "your-journey-begins",
    title: "Your Journey Begins",
    body: "Cross the ruined kingdom and rescue Carolyn by overcoming each encounter with written prompts. Clear, creative prompts move you forward; failure resets only the current chapter.",
    imageUrl: getSingleModeIntroImageUrl("your_journey_begins"),
  },
];
