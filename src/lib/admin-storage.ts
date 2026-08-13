// Admin image uploads. Storage policies (supabase/migrations/0001_admin_content.sql) enforce
// admin-only writes and a 5MB / image-mime-type limit server-side — the checks here exist so
// the UI can show a fast, specific error instead of waiting on a rejected upload.
import { requireSupabase } from "@/integrations/supabase/client";

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

export type ImageBucket = "blog-images" | "testimonial-images";

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return "Please choose a JPEG, PNG, or WebP image.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Image must be 5MB or smaller.";
  }
  return null;
}

function extensionFor(file: File): string {
  const fromName = file.name.split(".").pop();
  if (fromName && /^[a-z0-9]+$/i.test(fromName)) return fromName.toLowerCase();
  return file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
}

async function uploadImage(bucket: ImageBucket, file: File, userId: string): Promise<string> {
  const validationError = validateImageFile(file);
  if (validationError) throw new Error(validationError);

  const client = requireSupabase();
  const path = `${userId}/${crypto.randomUUID()}.${extensionFor(file)}`;
  const { error } = await client.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;
  return getPublicStorageUrl(bucket, path);
}

export function uploadBlogImage(file: File, userId: string): Promise<string> {
  return uploadImage("blog-images", file, userId);
}

export function uploadTestimonialImage(file: File, userId: string): Promise<string> {
  return uploadImage("testimonial-images", file, userId);
}

export async function removeStorageObject(bucket: ImageBucket, path: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.storage.from(bucket).remove([path]);
  if (error) throw error;
}

export function getPublicStorageUrl(bucket: ImageBucket, path: string): string {
  const client = requireSupabase();
  return client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

/** Extracts the `{userId}/{file}` storage path back out of a public storage URL, if it is one. */
export function storagePathFromPublicUrl(
  bucket: ImageBucket,
  url: string | null | undefined,
): string | null {
  if (!url) return null;
  const marker = `/object/public/${bucket}/`;
  const index = url.indexOf(marker);
  return index === -1 ? null : url.slice(index + marker.length);
}
