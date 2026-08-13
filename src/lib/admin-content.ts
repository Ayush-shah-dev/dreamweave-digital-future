// Admin-only reads/writes. RLS requires an authenticated admin session for anything beyond
// published rows, so these are only ever called from components rendered inside
// <AdminShell> (after useAdminAuth confirms isAdmin) — never from a route loader that could
// run during the unauthenticated build-time prerender.
import { requireSupabase } from "@/integrations/supabase/client";
import type {
  Blog,
  BlogStatus,
  Testimonial,
  TestimonialStatus,
} from "@/integrations/supabase/types";

// Every field is required (never an omitted/`undefined` key) so the object literals built in
// AdminEditorPage's buildPayload() type-check cleanly under `exactOptionalPropertyTypes` —
// "no value" is always spelled `null`, never "leave the key out".
export interface BlogFormInput {
  title: string;
  slug: string | null;
  short_summary: string | null;
  content: string;
  category: string | null;
  author_name: string | null;
  reading_time: number | null;
  featured_image: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: BlogStatus;
  published_date: string | null;
}

export interface TestimonialFormInput {
  name: string;
  designation: string | null;
  company: string | null;
  quote: string;
  profile_image: string | null;
  rating: number;
  status: TestimonialStatus;
  featured: boolean;
  display_order: number;
}

// ---------------------------------------------------------------------------
// Blogs
// ---------------------------------------------------------------------------

export async function listBlogs(): Promise<Blog[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getBlogById(id: string): Promise<Blog | null> {
  const client = requireSupabase();
  const { data, error } = await client.from("blogs").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

function resolvePublishedDate(input: BlogFormInput): string | null {
  return input.status === "published"
    ? (input.published_date ?? new Date().toISOString())
    : input.published_date;
}

export async function createBlog(input: BlogFormInput): Promise<Blog> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("blogs")
    .insert({ ...input, published_date: resolvePublishedDate(input) })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateBlog(id: string, input: BlogFormInput): Promise<Blog> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("blogs")
    .update({ ...input, published_date: resolvePublishedDate(input) })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteBlog(id: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.from("blogs").delete().eq("id", id);
  if (error) throw error;
}

export async function publishBlog(id: string): Promise<Blog> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("blogs")
    .update({ status: "published", published_date: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function unpublishBlog(id: string): Promise<Blog> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("blogs")
    .update({ status: "draft" })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export async function listTestimonials(): Promise<Testimonial[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("testimonials")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  const client = requireSupabase();
  const { data, error } = await client.from("testimonials").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function createTestimonial(input: TestimonialFormInput): Promise<Testimonial> {
  const client = requireSupabase();
  const { data, error } = await client.from("testimonials").insert(input).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateTestimonial(
  id: string,
  input: TestimonialFormInput,
): Promise<Testimonial> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("testimonials")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTestimonial(id: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.from("testimonials").delete().eq("id", id);
  if (error) throw error;
}

export async function publishTestimonial(id: string): Promise<Testimonial> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("testimonials")
    .update({ status: "published" })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function unpublishTestimonial(id: string): Promise<Testimonial> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("testimonials")
    .update({ status: "draft" })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
