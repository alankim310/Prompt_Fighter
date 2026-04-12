const SUPABASE_STORAGE_PUBLIC_SEGMENT = "/storage/v1/object/public";

export const SUPABASE_S3_ENDPOINT =
  "https://tamjskfeocohiboeuuwu.storage.supabase.co/storage/v1/s3";
export const SINGLE_CHARACTER_BUCKET = "single-characters";
export const SINGLE_BACKGROUND_BUCKET = "single-backgrounds";
export const SINGLE_MODE_HERO_OBJECT_PATH = "hero.png";

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
