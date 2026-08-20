import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, PageHero, Section, SectionHeading, breadcrumbSchema } from "@/components/site/Sections";
import { Counter, Reveal, SectionLabel } from "@/components/site/Motion";
import { Cta } from "@/components/site/Cta";
import { BrandLogoGrid } from "@/components/site/BrandLogoGrid";

export const Route = createFileRoute("/brands")({
  component: Brands,
  head: () => ({
    meta: [
      { title: "For Brands | Influencer Marketing Agency Ahmedabad & Gujarat" },
      {
        name: "description",
        content:
          "Why brands choose Dreamweave Digital for influencer marketing in Gujarat — ROI-led creator campaigns, in-house shoots, transparent pricing and a 14-day launch timeline.",
      },
      { property: "og:title", content: "For Brands — Creator Campaigns That Convert" },
      { property: "og:description", content: "ROI, process, industries and pricing for brand campaigns with Dreamweave Digital." },
      { property: "og:url", content: "/brands" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/brands" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(breadcrumbSchema("Brands", "/brands")) }],
  }),
});

const WHY_CHOOSE_US = [
  "10,000+ Verified Influencers Across India",
  "Every Niche Covered",
  "Campaign Strategy & Execution",
  "Dedicated Campaign Manager",
  "Transparent Pricing",
  "Fast Turnaround Time",
  "Performance Reports",
  "Pan India Campaign Management",
];

const INDUSTRIES_WE_SERVE = [
  "Real Estate",
  "Education",
  "Healthcare",
  "Food & Restaurants",
  "Beauty & Skincare",
  "Fashion",
  "Jewellery",
  "Finance",
  "Automobile",
  "Travel",
  "Fitness",
  "Technology",
  "E-commerce",
  "Hospitality",
];

const WHY_INFLUENCER_MARKETING = [
  "Build Trust Faster",
  "Reach Target Audience",
  "Increase Brand Awareness",
  "Generate Quality Leads",
  "Boost Sales",
  "Better ROI than Traditional Advertising",
];

const BRAND_PROCESS = [
  { step: "01", title: "Understand Your Brand", copy: "We learn your goals, audience, category and growth targets." },
  { step: "02", title: "Campaign Planning", copy: "We shape the strategy, creative direction, timeline and deliverables." },
  { step: "03", title: "Influencer Shortlisting", copy: "We shortlist creators based on fit, audience quality and engagement." },
  { step: "04", title: "Content Creation", copy: "We develop platform-ready content with our creators and production team." },
  { step: "05", title: "Campaign Execution", copy: "We manage approvals, publishing and campaign coordination end to end." },
  { step: "06", title: "Reporting & Analytics", copy: "We track performance, share learnings and identify the next growth opportunity." },
];

const PRICING = [
  {
    name: "Starter Burst",
    price: "₹1.5L+",
    copy: "A focused micro-creator wave to validate hooks and category fit.",
    items: ["6–8 micro creators", "12 reels", "Hook testing", "Performance readout"],
  },
  {
    name: "Growth Campaign",
    price: "₹5L+",
    copy: "Our most-booked scope: creators plus an in-house production day.",
    items: ["15–20 creators", "Studio or location shoot", "30+ owned assets", "Live dashboard"],
    featured: true,
  },
  {
    name: "Brand Studio",
    price: "₹15L+",
    copy: "Multi-city production with always-on creator programming.",
    items: ["Multi-city shoots", "Drone + hero film", "Quarterly strategy", "Dedicated campaign lead"],
  },
];

function Brands() {
  return (
    <>
      <PageHero
        crumb="Brands"
        label="For Brands"
        title="Creator campaigns measured like media, crafted like film."
        copy="We plan for CPM, watch-time and conversions — then shoot it well enough that your team wants to run it as an ad."
      />

      <BrandLogoGrid />

      <Section>
        <SectionHeading label="ROI" title="What our brand partners typically see." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { v: 4.6, s: "x", l: "Median campaign ROAS" },
            { v: 41, s: "%", l: "Lower CPM vs paid social" },
            { v: 14, s: " days", l: "Brief to first publish" },
            { v: 60, s: "+", l: "Owned assets per shoot day" },
          ].map((m, i) => (
            <Reveal key={m.l} delay={i * 0.07}>
              <div className="glass-panel rounded-2xl p-7">
                <p className="text-ember font-display text-4xl sm:text-5xl">
                  <Counter to={m.v} suffix={m.s} />
                </p>
                <p className="mt-3 text-sm text-muted-foreground">{m.l}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading label="Why Choose Us" title="A campaign partner built around your growth." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_CHOOSE_US.map((item, i) => (
            <Reveal key={item} delay={(i % 4) * 0.06}>
              <div className="glass-panel flex h-full min-h-32 items-end rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:border-primary/40">
                <div>
                  <span className="text-ember font-display text-2xl">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-5 text-base leading-snug">{item}</h3>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-white/[0.015]">
        <SectionHeading label="Our Process" title="Six steps. One accountable team." />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {BRAND_PROCESS.map((p, i) => (
            <Reveal key={p.step} delay={(i % 4) * 0.06}>
              <div className="glass-panel h-full rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:border-primary/40">
                <span className="font-display text-3xl text-white/12">{p.step}</span>
                <h3 className="mt-4 text-base">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading label="Industries We Serve" title="Creator campaigns for every category that matters." />
        <div className="mt-10 flex flex-wrap gap-3">
          {INDUSTRIES_WE_SERVE.map((ind, i) => (
            <Reveal key={ind} delay={(i % 6) * 0.04}>
              <span className="glass-panel inline-block rounded-full px-5 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
                {ind}
              </span>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-white/[0.015]">
        <SectionHeading label="Why Influencer Marketing?" title="Attention people trust, action they remember." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_INFLUENCER_MARKETING.map((item, i) => (
            <Reveal key={item} delay={(i % 3) * 0.07}>
              <div className="glass-panel flex min-h-36 items-center rounded-2xl p-7 transition-all duration-500 hover:-translate-y-2 hover:border-primary/40">
                <div className="flex items-center gap-4">
                  <span className="bg-ember grid h-10 w-10 shrink-0 place-items-center rounded-full font-display text-sm text-primary-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-base leading-snug">{item}</h3>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading label="Pricing" title="Transparent starting points." copy="Final scope is priced by creator tier, deliverable volume and production days. No retainers you can't exit." />
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {PRICING.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.09}>
              <div
                className={`glass-panel flex h-full flex-col rounded-[1.6rem] p-8 transition-all duration-500 hover:-translate-y-2 ${
                  p.featured ? "glow-ring border-primary/45" : ""
                }`}
              >
                {p.featured && <SectionLabel>Most booked</SectionLabel>}
                <h3 className="mt-4 text-xl">{p.name}</h3>
                <p className="text-ember font-display mt-2 text-4xl">{p.price}</p>
                <p className="mt-3 text-sm text-muted-foreground">{p.copy}</p>
                <ul className="mt-6 flex-1 space-y-2.5 text-sm text-muted-foreground">
                  {p.items.map((it) => (
                    <li key={it} className="flex gap-2.5">
                      <span className="bg-ember mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
                      {it}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Cta to="/book-campaign" variant={p.featured ? "primary" : "ghost"}>
                    Book this scope
                  </Cta>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
