import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, FaqSection, PageHero, Section, SectionHeading, breadcrumbSchema, faqSchema } from "@/components/site/Sections";
import { Reveal } from "@/components/site/Motion";
import { Cta, WhatsAppCta } from "@/components/site/Cta";
import { CREATORS } from "@/lib/site";

const CREATOR_FAQS = [
  { q: "How do I join the Dreamweave creator network?", a: "Submit the application form with your Instagram handle, category and city. Our team reviews every profile within 5 working days." },
  { q: "Is there a minimum follower count?", a: "No hard minimum. We onboard nano creators from 5K when engagement and content quality are strong." },
  { q: "When do creators get paid?", a: "Within 15 days of approved deliverables, directly to your bank account, against a scope signed before the shoot." },
  { q: "Do I need my own equipment?", a: "Not always. For branded shoots we provide crew, lighting and camera at our studio or on location." },
];

export const Route = createFileRoute("/creators")({
  component: Creators,
  head: () => ({
    meta: [
      { title: "For Creators | Paid Brand Collaborations Across India" },
      {
        name: "description",
        content:
          "Join 250+ verified creators working with Dreamweave Digital — paid brand collaborations, clear briefs, in-house shoots and payouts within 15 days.",
      },
      { property: "og:title", content: "For Creators — Paid Brand Deals with Dreamweave Digital" },
      { property: "og:description", content: "Benefits, payout process, creator gallery and success stories." },
      { property: "og:url", content: "/creators" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/creators" }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(faqSchema(CREATOR_FAQS)) },
      { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema("Creators", "/creators")) },
    ],
  }),
});

const BENEFITS = [
  { t: "Briefs that make sense", c: "Scripted hooks, shot lists and reference frames — never a vague one-line ask." },
  { t: "Paid on time, every time", c: "15-day payout cycle with a signed scope before you shoot." },
  { t: "Production support", c: "Studio, lighting, drone and edit support when the brand scope includes it." },
  { t: "Long-term partnerships", c: "We build repeat programmes with brands, not one-off posts." },
];

const PAYOUT = [
  { s: "01", t: "Apply", c: "Share your handle, category and rates." },
  { s: "02", t: "Get matched", c: "We send briefs that fit your audience." },
  { s: "03", t: "Sign the scope", c: "Deliverables, usage and fee agreed upfront." },
  { s: "04", t: "Shoot & deliver", c: "With or without our production crew." },
  { s: "05", t: "Get paid", c: "Bank transfer within 15 days of approval." },
];

function Creators() {
  return (
    <>
      <PageHero
        crumb="Creators"
        label="For Creators"
        title="Turn your audience into a monthly income."
        copy="Dreamweave Digital works with 250+ creators across India — matching them with brands that pay well, brief clearly and come back for more."
      />

      <Section>
        <SectionHeading label="Benefits" title="Why creators stay with us." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.t} delay={i * 0.07}>
              <div className="glass-panel h-full rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:border-primary/40">
                <h3 className="text-lg">{b.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.c}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-white/[0.015]">
        <SectionHeading label="Payout Process" title="Five steps from application to payment." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PAYOUT.map((p, i) => (
            <Reveal key={p.s} delay={i * 0.06}>
              <div className="glass-panel h-full rounded-2xl p-6">
                <span className="text-ember font-display text-3xl">{p.s}</span>
                <h3 className="mt-4 text-base">{p.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.c}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading label="Creator Gallery" title="A few of the creators in our network." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CREATORS.map((c, i) => (
            <Reveal key={c.name} delay={(i % 4) * 0.05}>
              <div className="glass-panel h-full rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:border-primary/40">
                <div className="bg-ember font-display grid h-12 w-12 place-items-center rounded-full text-primary-foreground">
                  {c.name.charAt(0)}
                </div>
                <p className="font-display mt-4 text-lg">{c.name}</p>
                <p className="text-xs tracking-wide text-primary uppercase">
                  {c.category} · {c.city}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {c.followers} followers · {c.er} engagement · {c.brands} brands
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <Cta to="/apply">Apply as a Creator</Cta>
          <WhatsAppCta variant="ghost" message="Hi Dreamweave Digital 👋 I'm a creator and I'd like to join your network." />
        </div>
      </Section>

      <FaqSection items={CREATOR_FAQS} title="Creator questions, answered." />
      <CtaBand title="Your next brand deal starts here." primaryTo="/apply" primaryLabel="Apply as Creator" copy="Tell us your category, city and rates. We'll match you with brands actively looking for creators like you." />
    </>
  );
}
