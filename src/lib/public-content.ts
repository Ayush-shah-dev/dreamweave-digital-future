// Public-facing reads only — every query here relies on the RLS policies in
// supabase/migrations/0001_admin_content.sql restricting anonymous access to
// status = 'published' rows, with an explicit .eq("status", "published") added as
// defense in depth. Never select admin-only columns beyond what these functions return.
import { requireSupabase, SupabaseNotConfiguredError } from "@/integrations/supabase/client";
import type { Blog, Testimonial } from "@/integrations/supabase/types";

export { SupabaseNotConfiguredError };

export async function listPublishedBlogs(): Promise<Blog[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("blogs")
    .select("*")
    .eq("status", "published")
    .order("published_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getPublishedBlogBySlug(slug: string): Promise<Blog | null> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("blogs")
    .select("*")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function listRelatedBlogs(
  category: string,
  excludeSlug: string,
  limit = 3,
): Promise<Blog[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("blogs")
    .select("*")
    .eq("status", "published")
    .eq("category", category)
    .neq("slug", excludeSlug)
    .order("published_date", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function listFeaturedTestimonials(limit = 6): Promise<Testimonial[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("testimonials")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}
