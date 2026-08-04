import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CtaBand, PageHero, Section, breadcrumbSchema } from "@/components/site/Sections";
import { Reveal } from "@/components/site/Motion";
import { POSTS } from "@/lib/site";

export const Route = createFileRoute("/blog")({
  component: Blog,
  head: () => ({
    meta: [
      { title: "Blog | Creator Marketing, Reels & Instagram Growth Tips" },
      {
        name: "description",
        content:
          "Creator tips, influencer marketing strategy, Instagram growth, branding and photography notes from the Dreamweave Digital team in Gujarat.",
      },
      { property: "og:title", content: "Dreamweave Digital Blog" },
      { property: "og:description", content: "Playbooks on creator marketing, reels, Instagram growth and brand collaborations." },
      { property: "og:url", content: "/blog" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(breadcrumbSchema("Blog", "/blog")) }],
  }),
});

function Blog() {
  const categories = ["All", ...Array.from(new Set(POSTS.map((p) => p.category)))];
  const [cat, setCat] = useState("All");
  const posts = POSTS.filter((p) => cat === "All" || p.category === cat);

  return (
    <>
      <PageHero
        crumb="Blog"
        label="Blog"
        title="Notes from inside a creator marketing studio."
        copy="What's working on Reels this month, how we brief creators, and the production habits behind consistent output."
      />

      <Section>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`rounded-full px-5 py-2.5 text-sm transition-all ${
                cat === c ? "bg-ember text-primary-foreground" : "glass-panel text-muted-foreground hover:text-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.06}>
              <article className="glass-panel flex h-full flex-col rounded-[1.4rem] p-7 transition-all duration-500 hover:-translate-y-2 hover:border-primary/40">
                <p className="text-xs tracking-[0.2em] text-primary uppercase">{p.category}</p>
                <h2 className="mt-4 text-xl leading-snug">{p.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{p.excerpt}</p>
                <p className="mt-6 text-xs text-muted-foreground">
                  {new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} ·{" "}
                  {p.read} read
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand title="Prefer a strategy call over a blog post?" />
    </>
  );
}
