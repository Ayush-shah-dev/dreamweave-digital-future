import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { AlertCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import { CtaBand, PageHero, Section, breadcrumbSchema } from "@/components/site/Sections";
import { Reveal } from "@/components/site/Motion";
import { POSTS } from "@/lib/site";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { listPublishedBlogs } from "@/lib/public-content";
import type { Blog } from "@/integrations/supabase/types";

interface BlogListItem {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string | null;
  read: string;
}

function fromBlog(blog: Blog): BlogListItem {
  return {
    slug: blog.slug,
    title: blog.title,
    category: blog.category || "General",
    excerpt: blog.short_summary || "",
    date: blog.published_date,
    read: blog.reading_time ? `${blog.reading_time} min` : "",
  };
}

type BlogListResult =
  | { source: "static"; posts: BlogListItem[] }
  | { source: "live"; posts: BlogListItem[] }
  | { source: "error"; posts: BlogListItem[]; message: string };

async function loadBlogList(): Promise<BlogListResult> {
  if (!isSupabaseConfigured) {
    // Local development without a Supabase project — keep the page usable with static content.
    return {
      source: "static",
      posts: POSTS.map((p) => ({
        slug: p.slug,
        title: p.title,
        category: p.category,
        excerpt: p.excerpt,
        date: p.date,
        read: p.read,
      })),
    };
  }
  try {
    const blogs = await listPublishedBlogs();
    return { source: "live", posts: blogs.map(fromBlog) };
  } catch (error) {
    return {
      source: "error",
      posts: [],
      message: error instanceof Error ? error.message : "Failed to load blogs.",
    };
  }
}

export const Route = createFileRoute("/blog")({
  component: Blog,
  loader: loadBlogList,
  head: () => ({
    meta: [
      { title: "Blog | Creator Marketing, Reels & Instagram Growth Tips" },
      {
        name: "description",
        content:
          "Creator tips, influencer marketing strategy, Instagram growth, branding and photography notes from the Dreamweave Digital team in Gujarat.",
      },
      { property: "og:title", content: "Dreamweave Digital Blog" },
      {
        property: "og:description",
        content:
          "Playbooks on creator marketing, reels, Instagram growth and brand collaborations.",
      },
      { property: "og:url", content: "/blog" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema("Blog", "/blog")) },
    ],
  }),
});

function Blog() {
  const result = Route.useLoaderData();
  const router = useRouter();
  const categories = ["All", ...Array.from(new Set(result.posts.map((p) => p.category)))];
  const [cat, setCat] = useState("All");
  const posts = result.posts.filter((p) => cat === "All" || p.category === cat);

  return (
    <>
      <PageHero
        crumb="Blog"
        label="Blog"
        title="Notes from inside a creator marketing studio."
        copy="What's working on Reels this month, how we brief creators, and the production habits behind consistent output."
      />

      <Section>
        {result.source === "error" ? (
          <div className="glass-panel flex flex-col items-center gap-3 rounded-[1.4rem] p-12 text-center">
            <AlertCircle className="h-6 w-6 text-primary" />
            <p className="text-sm text-muted-foreground">
              We couldn't load the blog right now. Please try again shortly.
            </p>
            <button
              type="button"
              onClick={() => router.invalidate()}
              className="rounded-full border border-primary/40 px-5 py-2 text-sm text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Try again
            </button>
          </div>
        ) : result.posts.length === 0 ? (
          <div className="glass-panel flex flex-col items-center gap-3 rounded-[1.4rem] p-12 text-center">
            <Sparkles className="h-6 w-6 text-primary" />
            <p className="text-sm text-muted-foreground">
              No posts published yet — check back soon.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCat(c)}
                  className={`rounded-full px-5 py-2.5 text-sm transition-all ${
                    cat === c
                      ? "bg-ember text-primary-foreground"
                      : "glass-panel text-muted-foreground hover:text-primary"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) * 0.06}>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="glass-panel flex h-full flex-col rounded-[1.4rem] p-7 transition-all duration-500 hover:-translate-y-2 hover:border-primary/40"
                  >
                    <p className="text-xs tracking-[0.2em] text-primary uppercase">{p.category}</p>
                    <h2 className="mt-4 text-xl leading-snug">{p.title}</h2>
                    {p.excerpt && (
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {p.excerpt}
                      </p>
                    )}
                    <p className="mt-6 text-xs text-muted-foreground">
                      {p.date && (
                        <>
                          {new Date(p.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          ·{" "}
                        </>
                      )}
                      {p.read} read
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </Section>

      <CtaBand title="Prefer a strategy call over a blog post?" />
    </>
  );
}
