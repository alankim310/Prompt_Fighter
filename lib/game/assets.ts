const SUPABASE_STORAGE_PUBLIC_SEGMENT = "/storage/v1/object/public";

export const SUPABASE_S3_ENDPOINT =
  "https://tamjskfeocohiboeuuwu.storage.supabase.co/storage/v1/s3";
export const SINGLE_CHARACTER_BUCKET = "single-characters";
export const SINGLE_BACKGROUND_BUCKET = "single-backgrounds";
export const SINGLE_MODE_HERO_OBJECT_PATH = "hero.png";

const SUBSTORY_BACKGROUND_OBJECT_PATHS: Record<number, string> = {
  1: "chapter_1_The_Ashen_Gate.png",
  2: "chapter_2_The_Thornwild_Labyrinth.png",
  3: "chapter_3_The_Hollow_Market.png",
  4: "chapter_4_The_Sunken_Forge.png",
  5: "chapter_5_Blackwake_Keep.png",
};

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

export function getSingleModeHeroImageUrl(): string {
  return getSingleCharacterImageUrl(SINGLE_MODE_HERO_OBJECT_PATH);
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
