import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { CtaBand, PageHero, Section, breadcrumbSchema } from "@/components/site/Sections";
import { Reveal } from "@/components/site/Motion";
import { PORTFOLIO } from "@/lib/site";
import fashion from "@/assets/reel-fashion.jpg";
import food from "@/assets/reel-food.jpg";
import beauty from "@/assets/reel-beauty.jpg";
import travel from "@/assets/reel-travel.jpg";
import tech from "@/assets/reel-tech.jpg";
import lifestyle from "@/assets/reel-lifestyle.jpg";

const IMAGES = [fashion, beauty, food, travel, lifestyle, tech, food, travel, tech];

export const Route = createFileRoute("/portfolio")({
  component: Portfolio,
  head: () => ({
    meta: [
      { title: "Portfolio | Reel Production & Content Shoots in Gujarat" },
      {
        name: "description",
        content:
          "Campaign work from Dreamweave Digital — reel production, content shoots and creator collaborations across fashion, beauty, food, auto and D2C brands in Gujarat.",
      },
      { property: "og:title", content: "Portfolio — Dreamweave Digital" },
      { property: "og:description", content: "Selected creator campaigns, shoots and reels with views, creators and platforms." },
      { property: "og:url", content: "/portfolio" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(breadcrumbSchema("Portfolio", "/portfolio")) }],
  }),
});

const FILTERS = ["All", "Instagram", "YouTube", "Reels Ads"];

function Portfolio() {
  const [filter, setFilter] = useState("All");
  const items = PORTFOLIO.map((p, i) => ({ ...p, img: IMAGES[i % IMAGES.length]! })).filter(
    (p) => filter === "All" || p.platform === filter,
  );

  return (
    <>
      <PageHero
        crumb="Portfolio"
        label="Portfolio"
        title="Frames that made brands unmissable."
        copy="A selection of campaign work — shot, edited and published by our in-house team across Gujarat and India."
      />

      <Section>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-5 py-2.5 text-sm transition-all ${
                filter === f ? "bg-ember text-primary-foreground" : "glass-panel text-muted-foreground hover:text-primary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {items.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 0.06}>
              <motion.figure
                layout
                className="glass-panel group relative overflow-hidden rounded-[1.4rem] break-inside-avoid"
              >
                <img
                  src={p.img}
                  alt={`${p.title} campaign for ${p.brand} — creator content shoot by Dreamweave Digital`}
                  width={512}
                  height={896}
                  loading="lazy"
                  className={`w-full object-cover transition-transform duration-700 group-hover:scale-[1.07] ${
                    p.tall ? "h-[30rem]" : "h-[21rem]"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/25 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-3 p-6 transition-transform duration-500 group-hover:translate-y-0">
                  <p className="text-xs tracking-[0.2em] text-primary uppercase">{p.brand}</p>
                  <h2 className="font-display mt-1.5 text-2xl">{p.title}</h2>
                  <dl className="mt-4 flex gap-5 text-xs text-white/75 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div>
                      <dd className="font-display text-sm text-white">{p.views}</dd>
                      <dt>Views</dt>
                    </div>
                    <div>
                      <dd className="font-display text-sm text-white">{p.creators}</dd>
                      <dt>Creators</dt>
                    </div>
                    <div>
                      <dd className="font-display text-sm text-white">{p.platform}</dd>
                      <dt>Platform</dt>
                    </div>
                  </dl>
                </figcaption>
              </motion.figure>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand title="Your brand deserves frames like these." />
    </>
  );
}
