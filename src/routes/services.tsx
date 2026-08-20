import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { CtaBand, FaqSection, PageHero, Section, SectionHeading, breadcrumbSchema, faqSchema } from "@/components/site/Sections";
import { Reveal, SectionLabel } from "@/components/site/Motion";
import { Cta, WhatsAppCta } from "@/components/site/Cta";
import { PROCESS, SERVICES } from "@/lib/site";

const SERVICE_FAQS = [
  { q: "Can we book only a content shoot without creators?", a: "Yes. Studio, location, product and drone shoots can be booked standalone, with edited masters delivered in 9:16, 1:1 and 16:9." },
  { q: "Do you provide scripts and hooks?", a: "Every campaign includes scripted hooks and a shot list. We usually test three hook variants per creator." },
  { q: "Which platforms do you publish on?", a: "Instagram Reels first, plus YouTube Shorts, Snapchat Spotlight and Meta paid amplification when it fits the goal." },
  { q: "Do you sign exclusivity or usage rights?", a: "Standard scopes include 30-day organic usage. Paid whitelisting and extended usage are priced per creator." },
];

export const Route = createFileRoute("/services")({
  component: Services,
  head: () => ({
    meta: [
      { title: "Influencer Marketing & Content Shoot Services | Dreamweave Digital" },
      {
        name: "description",
        content:
          "Influencer discovery, campaign management, content shoots in Ahmedabad, reel production, social strategy and analytics — full-stack creator marketing services in Gujarat.",
      },
      { property: "og:title", content: "Creator Marketing Services — Dreamweave Digital" },
      {
        property: "og:description",
        content: "Eleven services, one in-house team: discovery, campaigns, shoots, editing, strategy, analytics and creator growth.",
      },
      { property: "og:url", content: "/services" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(faqSchema(SERVICE_FAQS)) },
      { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema("Services", "/services")) },
    ],
  }),
});

const BENEFITS: Record<string, string[]> = {
  "influencer-discovery": ["Zero fake-follower risk", "Category-fit creators", "Negotiated rates"],
  "campaign-management": ["Single point of contact", "Predictable timelines", "Approval clarity"],
  "content-shoots": ["Cinema-grade output", "Owned asset library", "Multi-format masters"],
  editing: ["Higher watch-time", "Hook variants for testing", "Platform-native cuts"],
  "social-strategy": ["Compounding content system", "Category positioning", "Funnel design"],
  analytics: ["Cost efficiency clarity", "Creator-level performance", "Confident scaling"],
  "ugc-content-creation": ["Authentic creator voice", "Ad-ready content", "Multi-channel formats"],
  "celebrity-macro-influencer-campaigns": ["High-reach talent access", "Negotiated partnerships", "Maximum visibility"],
  "social-media-management": ["Consistent publishing", "Community response", "Growth-led content"],
  "product-photoshoot-video-production": ["Production-ready sets", "Commercial quality", "Multi-format deliverables"],
  "talent-management": ["Creator positioning", "Premium brand access", "Long-term deal support"],
};

function Services() {
  return (
    <>
      <PageHero
        crumb="Services"
        label="Services"
        title="Everything a creator campaign needs, under one roof."
        copy="Discovery, contracting, production, post, publishing and reporting — delivered by the same team, on one timeline."
      />

      {SERVICES.map((s, i) => (
        <Section key={s.slug} id={s.slug} className={i % 2 === 1 ? "bg-white/[0.015]" : ""}>
          <div className={`grid items-start gap-12 lg:grid-cols-2 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <div>
              <SectionLabel>{`Service ${String(i + 1).padStart(2, "0")}`}</SectionLabel>
              <h2 className="mt-5 text-3xl sm:text-5xl">{s.title}</h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">{s.blurb}</p>
              <ul className="mt-8 grid gap-2.5">
                {(BENEFITS[s.slug] ?? []).map((b) => (
                  <li key={b} className="flex items-center gap-3 text-sm">
                    <span className="bg-ember grid h-6 w-6 shrink-0 place-items-center rounded-full text-primary-foreground">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-9 flex flex-wrap gap-3">
                <Cta to="/book-campaign">Get pricing</Cta>
                <WhatsAppCta variant="ghost" message={`Hi Dreamweave Digital 👋 I'd like to discuss your ${s.title} service for my brand.`}>
                  WhatsApp us
                </WhatsAppCta>
              </div>
            </div>
            <Reveal delay={0.1}>
              <div className="glass-panel rounded-[1.8rem] p-8">
                <h3 className="text-lg">Deliverables</h3>
                <ul className="mt-6 divide-y divide-border">
                  {s.deliverables.map((d, j) => (
                    <li key={d} className="flex items-center gap-4 py-4 text-sm text-muted-foreground">
                      <span className="font-display text-xl text-white/15">{String(j + 1).padStart(2, "0")}</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Section>
      ))}

      <Section>
        <SectionHeading label="Timeline" title="How a typical engagement runs." align="center" />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.slice(0, 4).map((p, i) => (
            <Reveal key={p.step} delay={i * 0.07}>
              <div className="glass-panel h-full rounded-2xl p-6">
                <p className="text-ember font-display text-3xl">{p.step}</p>
                <h3 className="mt-4 text-base">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <FaqSection items={SERVICE_FAQS} title="Service questions, answered." />
      <CtaBand title="Pick a service. We'll scope it in 48 hours." primaryLabel="Request a quote" />
    </>
  );
}
