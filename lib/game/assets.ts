const SUPABASE_STORAGE_PUBLIC_SEGMENT = "/storage/v1/object/public";

export const SUPABASE_S3_ENDPOINT =
  "https://tamjskfeocohiboeuuwu.storage.supabase.co/storage/v1/s3";
export const SINGLE_CHARACTER_BUCKET = "single-characters";
export const SINGLE_BACKGROUND_BUCKET = "single-backgrounds";
export const SINGLE_ARTIFACT_BUCKET = "single-artifacts";
export const SINGLE_MODE_HERO_OBJECT_PATH = "hero.png";
export const WILLIE_THE_WILDCAT_KEY = "willie_the_wildcat";

const SUBSTORY_BACKGROUND_OBJECT_PATHS: Record<number, string> = {
  1: "chapter_1_The_Ashen_Gate.png",
  2: "chapter_2_The_Thornwild_Labyrinth.png",
  3: "chapter_3_The_Hollow_Market.png",
  4: "chapter_4_The_Sunken_Forge.png",
  5: "chapter_5_Blackwake_Keep.png",
};
const SINGLE_MODE_WORLD_MAP_OBJECT_PATH = "map.png";
export const SINGLE_MODE_INTRO_OBJECT_PATHS = {
  kingdom_of_veyrune: "preslide1.png",
  night_everything_burned: "preslide2.png",
  carolyn_was_taken: "preslide3.png",
  your_journey_begins: "preslide4.png",
} as const;

export const SINGLEPLAY_CHARACTER_OBJECT_PATHS = {
  blueberry_the_cat: "Blueberry_the_cat.png",
  debt_collector: "Debt_collector.png",
  debt_spirit: "Debt_spirit.png",
  end_bringer: "end-bringer.png",
  false_carolyn: "false_carolyn.png",
  forge_guardian: "Forge_guardian.png",
  ghost_npcs: "Ghost_NPCs.png",
  living_chain: "living_chain.png",
  marquis_grin: "marquis_grin.png",
  princess: "princess.png",
  sir_dreadhelm: "Sir_Dreadhelm.png",
  skeleton_guard: "skeleton_guard.png",
  sleeping_grove_beast: "Sleeping_Grove_Beast.png",
  soul_stealer: "soul_stealer.png",
  willie_the_wildcat: "willie_the_wildcat.png",
  fleeing_npcs: "fleeing_npcs.png",
} as const;

export const SINGLEPLAY_ARTIFACT_OBJECT_PATHS = {
  ember_sigil: "ember_sigil.png",
  moonlit_compass: "moonlit_compass.png",
  name_flame_lantern: "name_flame_lantern.png",
  sword_tempered_in_dragon_piercing_fire:
    "sword_tempered_in_dragon-piercing_fire.png",
} as const;

function normalizeObjectPath(objectPath: string): string {
  return objectPath.replace(/^\/+/, "");
}

export function getSupabaseStoragePublicUrl(
  bucket: string,
  objectPath: string,
): string {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured");
  }

  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  const normalizedObjectPath = normalizeObjectPath(objectPath);

  return `${normalizedBaseUrl}${SUPABASE_STORAGE_PUBLIC_SEGMENT}/${bucket}/${normalizedObjectPath}`;
}

export function getSingleCharacterImageUrl(objectPath: string): string {
  return getSupabaseStoragePublicUrl(SINGLE_CHARACTER_BUCKET, objectPath);
}

export function getSinglePlayCharacterImageUrl(
  characterKey: keyof typeof SINGLEPLAY_CHARACTER_OBJECT_PATHS,
): string {
  return getSingleCharacterImageUrl(
    SINGLEPLAY_CHARACTER_OBJECT_PATHS[characterKey],
  );
}

export function getSinglePlayArtifactImageUrl(
  artifactKey: keyof typeof SINGLEPLAY_ARTIFACT_OBJECT_PATHS,
): string {
  return getSupabaseStoragePublicUrl(
    SINGLE_ARTIFACT_BUCKET,
    SINGLEPLAY_ARTIFACT_OBJECT_PATHS[artifactKey],
  );
}

export function getSingleModeHeroImageUrl(): string {
  return getSingleCharacterImageUrl(SINGLE_MODE_HERO_OBJECT_PATH);
}

export function getWillieTheWildcatImageUrl(): string {
  return getSinglePlayCharacterImageUrl(WILLIE_THE_WILDCAT_KEY);
}

export function getSingleModeStageBackgroundUrl(stageId: string): string {
  return getSupabaseStoragePublicUrl(
    SINGLE_BACKGROUND_BUCKET,
    `${stageId}.png`,
  );
}

export function getSingleModeSubstoryBackgroundUrl(substoryId: number): string {
  const objectPath = SUBSTORY_BACKGROUND_OBJECT_PATHS[substoryId];

  if (!objectPath) {
    throw new Error(`No substory background configured for substory ${substoryId}`);
  }

  return getSupabaseStoragePublicUrl(SINGLE_BACKGROUND_BUCKET, objectPath);
}

export function getSingleModeWorldMapUrl(): string {
  return getSupabaseStoragePublicUrl(
    SINGLE_BACKGROUND_BUCKET,
    SINGLE_MODE_WORLD_MAP_OBJECT_PATH,
  );
}

export function getSingleModeIntroImageUrl(
  introKey: keyof typeof SINGLE_MODE_INTRO_OBJECT_PATHS,
): string {
  return getSupabaseStoragePublicUrl(
    SINGLE_BACKGROUND_BUCKET,
    SINGLE_MODE_INTRO_OBJECT_PATHS[introKey],
  );
}

export async function fetchAssetFromUrl(
  assetUrl: string,
  init?: RequestInit,
): Promise<Response> {
  const response = await fetch(assetUrl, init);

  if (!response.ok) {
    throw new Error(`Failed to fetch asset: ${response.status} ${response.statusText}`);
  }

  return response;
}
