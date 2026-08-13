import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { CtaBand, Section, breadcrumbSchema } from "@/components/site/Sections";
import { Reveal } from "@/components/site/Motion";
import { BRAND, POSTS } from "@/lib/site";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { getPublishedBlogBySlug, listRelatedBlogs } from "@/lib/public-content";

interface RelatedPost {
  slug: string;
  title: string;
  category: string;
}

interface BlogDetailData {
  title: string;
  category: string;
  authorName: string;
  date: string | null;
  readLabel: string;
  coverImage: string | null;
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
  related: RelatedPost[];
}

async function loadBlog(slug: string): Promise<BlogDetailData> {
  if (!isSupabaseConfigured) {
    // Local development without a Supabase project — serve the static fallback content.
    const post = POSTS.find((p) => p.slug === slug);
    if (!post) throw notFound();
    return {
      title: post.title,
      category: post.category,
      authorName: BRAND.name,
      date: post.date,
      readLabel: `${post.read} read`,
      coverImage: null,
      content: post.excerpt,
      seoTitle: null,
      seoDescription: null,
      related: POSTS.filter((p) => p.category === post.category && p.slug !== post.slug)
        .slice(0, 3)
        .map((p) => ({ slug: p.slug, title: p.title, category: p.category })),
    };
  }

  // /blog only links to a slug after successfully listing published posts, so a failure here
  // is an unexpected/transient one (not "doesn't exist"). Prefer a 404 for that single URL
  // over letting the error propagate and fail the whole prerender (vite.config.ts has
  // prerender.failOnError: true, which would take every other page down with it).
  let blog;
  try {
    blog = await getPublishedBlogBySlug(slug);
  } catch (error) {
    console.error(`Failed to load blog "${slug}":`, error);
    throw notFound();
  }
  if (!blog) throw notFound();

  const related = blog.category
    ? await listRelatedBlogs(blog.category, blog.slug).catch(() => [])
    : [];

  return {
    title: blog.title,
    category: blog.category || "General",
    authorName: blog.author_name || "Dreamweave Digital",
    date: blog.published_date,
    readLabel: blog.reading_time ? `${blog.reading_time} min read` : "",
    coverImage: blog.featured_image,
    content: blog.content,
    seoTitle: blog.seo_title,
    seoDescription: blog.seo_description,
    related: related.map((r) => ({
      slug: r.slug,
      title: r.title,
      category: r.category || "General",
    })),
  };
}

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => loadBlog(params.slug),
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.seoTitle || loaderData.title} | Dreamweave Digital Blog` },
          {
            name: "description",
            content: loaderData.seoDescription || loaderData.content.slice(0, 155),
          },
          { property: "og:title", content: loaderData.title },
          { property: "og:type", content: "article" },
          { property: "og:url", content: `/blog/${params.slug}` },
        ]
      : [{ title: "Post not found — Dreamweave Digital" }],
    links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
    scripts: loaderData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify(breadcrumbSchema(loaderData.title, `/blog/${params.slug}`)),
          },
        ]
      : [],
  }),
  component: BlogDetail,
});

function BlogDetail() {
  const data = Route.useLoaderData();

  return (
    <>
      <section className="noise relative overflow-hidden pt-36 pb-16 sm:pt-44">
        <div className="relative mx-auto max-w-3xl px-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to blog
          </Link>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-primary">{data.category}</p>
          <h1 className="mt-4 text-3xl leading-[1.05] font-semibold sm:text-5xl">{data.title}</h1>
          <p className="mt-5 text-xs text-muted-foreground">
            {data.authorName}
            {data.date && (
              <>
                {" "}
                ·{" "}
                {new Date(data.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </>
            )}
            {data.readLabel && <> · {data.readLabel}</>}
          </p>
        </div>
      </section>

      {data.coverImage && (
        <div className="mx-auto max-w-5xl px-6">
          <img
            src={data.coverImage}
            alt=""
            className="w-full rounded-[1.6rem] object-cover"
            loading="lazy"
          />
        </div>
      )}

      <Section>
        <Reveal>
          {/* Content is stored and rendered as plain text (no dangerouslySetInnerHTML) — safe
              by construction until a sanitized rich-text pipeline replaces the textarea editor. */}
          <div className="prose prose-neutral mx-auto max-w-3xl whitespace-pre-wrap text-base leading-relaxed text-foreground/90">
            {data.content}
          </div>
        </Reveal>
      </Section>

      {data.related.length > 0 && (
        <Section className="pt-0">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">More like this</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {data.related.map((post) => (
                <Link
                  key={post.slug}
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="glass-panel rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
                >
                  <p className="text-[0.65rem] uppercase tracking-wide text-primary">
                    {post.category}
                  </p>
                  <p className="mt-2 text-sm font-medium leading-snug">{post.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </Section>
      )}

      <CtaBand title="Enjoyed the read? Let's build your next campaign." />
    </>
  );
}
