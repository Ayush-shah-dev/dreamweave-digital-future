import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, PageHero, Section, SectionHeading, breadcrumbSchema } from "@/components/site/Sections";
import { Counter, Reveal, SectionLabel, TiltCard } from "@/components/site/Motion";
import { BRAND, STATS } from "@/lib/site";
import founderImg from "@/assets/founder.jpg";
import studioImg from "@/assets/studio.jpg";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About Dreamweave Digital | Creator Agency in Gandhinagar" },
      {
        name: "description",
        content:
          "The story of Dreamweave Digital — founded by Mit Prajapati in Gandhinagar, building a creator-first marketing agency with an in-house studio serving brands across Gujarat and India.",
      },
      { property: "og:title", content: "About Dreamweave Digital — Creator-First Since Day One" },
      {
        property: "og:description",
        content: "Founder story, mission, values and the in-house studio behind 500+ campaign shoots.",
      },
      { property: "og:url", content: "/about" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(breadcrumbSchema("About", "/about")) }],
  }),
});

const VALUES = [
  { title: "Creator First", copy: "Fair rates, signed scopes, 15-day payouts. Creators are partners, not line items." },
  { title: "Craft Over Volume", copy: "We would rather ship six unforgettable assets than sixty forgettable ones." },
  { title: "Data With Taste", copy: "Numbers guide the plan. Taste decides the frame." },
  { title: "Radical Ownership", copy: "One team owns the campaign from brief to reporting. No handoff excuses." },
];

const TIMELINE = [
  { year: "2021", title: "Two people, one camera", copy: "Started shooting reels for local Gandhinagar cafés and boutiques." },
  { year: "2022", title: "First creator network", copy: "Built our first 50-creator roster across Gujarat categories." },
  { year: "2023", title: "Full-stack campaigns", copy: "Added strategy, contracting, publishing and reporting in-house." },
  { year: "2024", title: "The studio", copy: "Opened our own studio with lighting, drone and post-production." },
  { year: "2026", title: "India's creator engine", copy: "500+ shoots, 10,000+ creators, 50+ brands, 20M+ views." },
];

function About() {
  return (
    <>
      <PageHero
        crumb="About"
        label="About Us"
        title="Built by creators, for the brands who work with them."
        copy={`${BRAND.name} started in Gandhinagar with a camera and a conviction: creator marketing deserves the craft of a film set and the discipline of a media plan.`}
      />

      <Section>
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <TiltCard>
              <div className="glass-panel overflow-hidden rounded-[1.8rem]">
                <img
                  src={founderImg}
                  alt="Mit Prajapati, founder of Dreamweave Digital"
                  width={1024}
                  height={1280}
                  loading="lazy"
                  className="h-[34rem] w-full object-cover"
                />
              </div>
            </TiltCard>
          </Reveal>
          <div>
            <SectionHeading
              label={`The ${BRAND.founder} Story`}
              title="From one camera in Sector 11 to Gujarat's creator engine."
              copy="Mit Prajapati began as an editor cutting reels overnight for local brands. The pattern was obvious: brands had budgets but no creative system, and creators had audiences but no reliable partners. Dreamweave Digital was built to be the bridge — with production quality good enough to stand next to national campaigns."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <Reveal>
                <div className="glass-panel rounded-2xl p-6">
                  <h3 className="text-lg">Mission</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Make creator marketing measurable, cinematic and fair for everyone involved.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="glass-panel rounded-2xl p-6">
                  <h3 className="text-lg">Vision</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    To be the creator infrastructure every serious Indian brand builds on.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading label="Timeline" title="Five years, one obsession." align="center" />
        <div className="mt-14 grid gap-4 md:grid-cols-5">
          {TIMELINE.map((t, i) => (
            <Reveal key={t.year} delay={i * 0.08}>
              <div className="glass-panel h-full rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:border-primary/40">
                <p className="text-ember font-display text-2xl">{t.year}</p>
                <h3 className="mt-4 text-base">{t.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <SectionHeading
            label="Studio & BTS"
            title="An office in Gandhinagar. A studio that never sleeps."
            copy="Our head office at 508, President Complex, Sector 11 doubles as a production base — lighting grid, product tabletop, edit bays and a drone kit that travels across Gujarat."
          />
          <Reveal delay={0.1}>
            <div className="glass-panel overflow-hidden rounded-[1.8rem]">
              <img
                src={studioImg}
                alt="Behind the scenes at the Dreamweave Digital studio in Gandhinagar"
                width={1600}
                height={900}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section>
        <SectionHeading label="Values" title="The four rules we don't break." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.07}>
              <div className="glass-panel h-full rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:border-primary/40">
                <SectionLabel>{String(i + 1).padStart(2, "0")}</SectionLabel>
                <h3 className="mt-5 text-lg">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s) => (
            <Reveal key={s.label}>
              <div className="glass-panel rounded-2xl p-6 text-center">
                <p className="text-ember font-display text-4xl">
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-xs tracking-wide text-muted-foreground uppercase">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand title="Work with the team behind the frames." />
    </>
  );
}
