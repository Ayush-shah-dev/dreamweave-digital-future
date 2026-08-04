import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  Clapperboard,
  LineChart,
  Scissors,
  Sparkles,
  Users,
} from "lucide-react";
import { ReelOrbit } from "@/components/site/ReelOrbit";
import { Counter, MeshBackdrop, Reveal, SectionLabel, TiltCard, WordReveal } from "@/components/site/Motion";
import { Cta, WhatsAppCta } from "@/components/site/Cta";
import { Marquee } from "@/components/site/Marquee";
import { CtaBand, FaqSection, Section, SectionHeading, faqSchema } from "@/components/site/Sections";
import { BRAND, CAMPAIGNS, CREATORS, FAQS, PROCESS, SERVICES, STATS, TESTIMONIALS } from "@/lib/site";
import founderImg from "@/assets/founder.jpg";
import studioImg from "@/assets/studio.jpg";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Creator Marketing Agency in Gujarat | Dreamweave Digital" },
      {
        name: "description",
        content:
          "Dreamweave Digital is a creator marketing agency in Gandhinagar connecting brands with India's top creators — influencer marketing, content shoots and reel production across Gujarat.",
      },
      { property: "og:title", content: "Where Brands Meet India's Top Creators | Dreamweave Digital" },
      {
        property: "og:description",
        content:
          "Cinematic campaigns, viral reels and creator collaborations from Gujarat's leading creator marketing agency.",
      },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Dreamweave Digital — Creator Marketing Agency" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(faqSchema(FAQS)) }],
  }),
});

const SERVICE_ICONS = [Users, Clapperboard, Camera, Scissors, Sparkles, LineChart];

function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.35]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const heroBlur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(10px)"]);

  return (
    <>
      {/* HERO */}
      <section ref={heroRef} className="noise relative flex min-h-[100svh] items-center overflow-hidden">
        <MeshBackdrop />
        <motion.div style={{ scale: heroScale, opacity: heroOpacity, filter: heroBlur }} className="absolute inset-0">
          <ReelOrbit />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_5%,var(--background)_72%)]" />

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative mx-auto w-full max-w-4xl px-6 pt-28 pb-16 text-center"
        >
          <Reveal y={12}>
            <SectionLabel>{BRAND.tagline}</SectionLabel>
          </Reveal>
          <h1 className="mt-7 text-[2.6rem] leading-[1.02] font-semibold sm:text-7xl">
            <WordReveal text="Where Brands Meet" />
            <br />
            <span className="text-ember">
              <WordReveal text="India's Top Creators." />
            </span>
          </h1>
          <Reveal delay={0.25}>
            <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Create cinematic campaigns, viral reels, creator collaborations and premium social storytelling that
              actually converts.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Cta to="/book-campaign">
                Start Your Campaign <ArrowRight className="h-4 w-4" />
              </Cta>
              <Cta to="/apply" variant="ghost">
                Become a Creator
              </Cta>
            </div>
          </Reveal>

          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={0.1 * i}>
                <div className="glass-panel rounded-2xl px-4 py-5">
                  <p className="text-ember font-display text-3xl font-semibold sm:text-4xl">
                    <Counter to={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-1.5 text-[0.72rem] tracking-wide text-muted-foreground uppercase">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </motion.div>
      </section>

      {/* WHO WE ARE */}
      <Section>
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              label="Who We Are"
              title="A creator-first agency built inside a production studio."
              copy="Dreamweave Digital is a creator marketing agency headquartered in Gandhinagar. We sit between brands and India's most watched creators — running discovery, contracting, shoots, edits, publishing and reporting under one roof."
            />
            <div className="mt-10 space-y-6 border-l border-border pl-6">
              {[
                { year: "2021", text: "Started as a two-person reel production unit in Gandhinagar." },
                { year: "2023", text: "Crossed 250 verified creators across Gujarat and India." },
                { year: "2024", text: "Built our in-house studio, drone and post-production team." },
                { year: "2026", text: "500+ campaign shoots and 20M+ views generated for 50+ brands." },
              ].map((t, i) => (
                <Reveal key={t.year} delay={i * 0.08}>
                  <div className="relative">
                    <span className="bg-ember absolute top-2 -left-[1.87rem] h-2.5 w-2.5 rounded-full" />
                    <p className="font-display text-primary">{t.year}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{t.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={0.15}>
            <TiltCard className="relative">
              <div className="bg-ember absolute -inset-4 rounded-[2rem] opacity-25 blur-3xl" />
              <div className="glass-panel relative overflow-hidden rounded-[1.8rem]">
                <img
                  src={founderImg}
                  alt="Meet Bhai, founder of Dreamweave Digital, on a film set in Gandhinagar"
                  width={1024}
                  height={1280}
                  loading="lazy"
                  className="h-[32rem] w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                  <p className="font-display text-xl">{BRAND.founder}</p>
                  <p className="text-sm text-muted-foreground">Founder & Creative Director</p>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </Section>

      {/* MEET BHAI */}
      <Section className="overflow-hidden">
        <SectionHeading
          align="center"
          label={`Meet ${BRAND.founder}`}
          title="The director behind 500+ campaign shoots."
          copy="Camera, lights, drone, creators, fashion sets, BTS, studio — every frame we ship passes through his eye."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["Camera & Lenses", "Lighting Design", "Drone Cinematography", "Creator Direction", "Fashion Shoots", "Behind The Scenes", "In-House Studio", "Post & Grade"].map(
            (item, i) => (
              <Reveal key={item} delay={(i % 4) * 0.07}>
                <div className="glass-panel group flex h-36 flex-col justify-between rounded-2xl p-5 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/40">
                  <span className="font-display text-2xl text-white/15 transition-colors group-hover:text-primary/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-display text-lg">{item}</p>
                </div>
              </Reveal>
            ),
          )}
        </div>
        <Reveal delay={0.1}>
          <div className="glass-panel mt-6 overflow-hidden rounded-[1.8rem]">
            <img
              src={studioImg}
              alt="Dreamweave Digital production crew on a cinema shoot set with lighting and camera rig"
              width={1600}
              height={900}
              loading="lazy"
              className="h-[22rem] w-full object-cover sm:h-[30rem]"
            />
          </div>
        </Reveal>
      </Section>

      {/* PROCESS */}
      <ProcessRail />

      {/* SERVICES */}
      <Section id="services">
        <SectionHeading
          label="Services"
          title="Six panels. One end-to-end creator engine."
          copy="Hover a panel to open it. Every service is delivered by the same in-house team, so nothing gets lost between strategy and publish."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => {
            const Icon = SERVICE_ICONS[i]!;
            return (
              <Reveal key={s.slug} delay={(i % 3) * 0.08}>
                <TiltCard className="h-full">
                  <Link
                    to="/services"
                    hash={s.slug}
                    className="glass-panel group relative flex h-full flex-col overflow-hidden rounded-[1.6rem] p-7 transition-all duration-500 hover:-translate-y-2 hover:border-primary/45"
                  >
                    <div className="bg-ember absolute -top-24 -right-24 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40" />
                    <span className="bg-ember relative grid h-12 w-12 place-items-center rounded-2xl text-primary-foreground transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="relative mt-6 text-xl">{s.title}</h3>
                    <p className="relative mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{s.blurb}</p>
                    <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm text-primary">
                      Explore service
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </span>
                  </Link>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* CREATOR UNIVERSE */}
      <section className="noise relative overflow-hidden py-24 sm:py-32">
        <MeshBackdrop />
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle,rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:34px_34px]" />
        <div className="relative mx-auto max-w-7xl px-6">
          <SectionHeading
            align="center"
            label="Creator Universe"
            title="250+ verified creators orbiting one network."
            copy="Fashion, food, beauty, travel, tech, fitness, lifestyle and auto — vetted for engagement quality, not follower vanity."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CREATORS.map((c, i) => (
              <Reveal key={c.name} delay={(i % 4) * 0.06}>
                <div className="glass-panel group relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:-translate-y-2 hover:border-primary/45">
                  <div className="bg-ember absolute -bottom-16 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-50" />
                  <div className="bg-ember relative grid h-14 w-14 place-items-center rounded-full font-display text-lg text-primary-foreground">
                    {c.name.charAt(0)}
                  </div>
                  <p className="relative mt-5 font-display text-lg">{c.name}</p>
                  <p className="relative text-xs tracking-wide text-primary uppercase">
                    {c.category} · {c.city}
                  </p>
                  <dl className="relative mt-5 grid grid-cols-3 gap-2 text-center">
                    {[
                      ["Followers", c.followers],
                      ["Engmt.", c.er],
                      ["Brands", `${c.brands}`],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-xl bg-white/5 py-2">
                        <dd className="font-display text-sm">{v}</dd>
                        <dt className="text-[0.6rem] text-muted-foreground uppercase">{k}</dt>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-12 flex justify-center">
              <Cta to="/creators" variant="ghost">
                See the creator network
              </Cta>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHY BRANDS CHOOSE US — bento */}
      <Section>
        <SectionHeading label="Why Brands Choose Us" title="Production quality of an agency. Speed of a creator." />
        <div className="mt-14 grid auto-rows-[minmax(11rem,auto)] gap-4 md:grid-cols-3">
          <Reveal className="md:col-span-2 md:row-span-2">
            <div className="glass-panel flex h-full flex-col justify-between rounded-[1.6rem] p-8">
              <SectionLabel>Reach</SectionLabel>
              <div>
                <p className="text-ember font-display text-6xl font-semibold sm:text-8xl">
                  <Counter to={20} suffix="M+" />
                </p>
                <p className="mt-3 max-w-md text-muted-foreground">
                  Organic views generated across creator campaigns in the last 24 months — before a rupee of paid
                  amplification.
                </p>
              </div>
            </div>
          </Reveal>
          {[
            { big: "48h", label: "Creator shortlist turnaround" },
            { big: "4.6x", label: "Median campaign ROAS" },
            { big: "100%", label: "In-house shoot & post" },
            { big: "15d", label: "Creator payout cycle" },
          ].map((b, i) => (
            <Reveal key={b.label} delay={i * 0.07}>
              <div className="glass-panel group flex h-full flex-col justify-between rounded-[1.6rem] p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/45">
                <p className="font-display text-4xl group-hover:text-ember sm:text-5xl">{b.big}</p>
                <p className="mt-3 text-sm text-muted-foreground">{b.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* FEATURED CAMPAIGNS */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading label="Featured Campaigns" title="Campaigns that behaved like content, not ads." />
        </div>
        <Marquee className="mt-12 [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]" speed={50}>
          {CAMPAIGNS.map((c) => (
            <article
              key={c.title}
              className="glass-panel group relative h-64 w-[20rem] shrink-0 overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:-translate-y-2 hover:border-primary/45 sm:w-[24rem]"
            >
              <div className="bg-ember absolute inset-x-0 -bottom-24 h-40 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40" />
              <p className="relative text-xs tracking-[0.2em] text-primary uppercase">{c.category}</p>
              <h3 className="relative mt-3 text-2xl">{c.title}</h3>
              <p className="relative text-sm text-muted-foreground">{c.brand}</p>
              <dl className="relative absolute right-6 bottom-6 left-6 mt-8 grid grid-cols-3 gap-2 text-center">
                {[
                  ["Views", c.views],
                  ["Creators", `${c.creators}`],
                  ["Platform", c.platform.split(" ")[0]!],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-white/5 py-2.5">
                    <dd className="font-display text-sm">{v}</dd>
                    <dt className="text-[0.6rem] text-muted-foreground uppercase">{k}</dt>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </Marquee>
        <div className="mx-auto mt-12 flex max-w-7xl justify-center px-6">
          <Cta to="/case-studies" variant="ghost">
            Read the case studies
          </Cta>
        </div>
      </section>

      {/* VIDEO / STATEMENT */}
      <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden">
        <img
          src={studioImg}
          alt="Cinema camera capturing a brand story on a Dreamweave Digital set"
          width={1600}
          height={900}
          loading="lazy"
          className="absolute inset-0 -z-10 h-full w-full scale-105 object-cover opacity-35"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/70 to-background" />
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl leading-[1.1] font-semibold sm:text-6xl">
            <WordReveal text="Our cameras don't shoot videos." />
            <br />
            <span className="text-ember">
              <WordReveal text="They capture brand stories." />
            </span>
          </h2>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading align="center" label="Testimonials" title="What brands and creators say." />
        </div>
        <div className="mt-12 space-y-4">
          {[0, 1].map((row) => (
            <Marquee
              key={row}
              reverse={row === 1}
              speed={row === 1 ? 62 : 52}
              className="[mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]"
            >
              {TESTIMONIALS.slice(row * 3, row * 3 + 3).map((t) => (
                <figure
                  key={t.quote}
                  className="glass-panel w-[22rem] shrink-0 rounded-3xl p-7 transition-colors duration-500 hover:border-primary/40 sm:w-[28rem]"
                >
                  <blockquote className="text-sm leading-relaxed text-foreground/90">"{t.quote}"</blockquote>
                  <figcaption className="mt-5 text-xs text-muted-foreground">
                    <span className="text-primary">{t.name}</span> · {t.org}
                  </figcaption>
                </figure>
              ))}
            </Marquee>
          ))}
        </div>
      </section>

      {/* CREATOR CTA */}
      <section className="noise relative overflow-hidden py-24">
        <MeshBackdrop />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-2">
          <Reveal>
            <div className="glass-panel glow-ring flex h-full flex-col justify-between rounded-[1.8rem] p-9">
              <div>
                <SectionLabel>For Creators</SectionLabel>
                <h2 className="mt-5 text-3xl sm:text-4xl">Get paid brand deals every month.</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Join 250+ verified creators receiving briefs that fit their category, signed scopes before the shoot
                  and payouts within 15 days.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Cta to="/apply">Apply Now</Cta>
                <WhatsAppCta variant="ghost" message="Hi Dreamweave Digital 👋 I'm a creator and I'd like to join your network." >
                  Message us
                </WhatsAppCta>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="glass-panel flex h-full flex-col justify-between rounded-[1.8rem] p-9">
              <div>
                <SectionLabel>For Brands</SectionLabel>
                <h2 className="mt-5 text-3xl sm:text-4xl">Launch your next campaign in 14 days.</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Strategy, creator matching, shoot, edit, publish and reporting — one team, one timeline, one invoice.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Cta to="/book-campaign">Book a Campaign</Cta>
                <Cta to="/brands" variant="ghost">
                  How we work
                </Cta>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <FaqSection />
      <CtaBand />
    </>
  );
}

function ProcessRail() {
  const [active, setActive] = useState(0);
  return (
    <Section className="overflow-hidden">
      <SectionHeading
        label="Our Process"
        title="Seven steps from inquiry to analytics."
        copy="Drag or scroll the rail. Every stage has an owner, a deadline and a deliverable."
      />
      <div className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PROCESS.map((p, i) => (
          <button
            key={p.step}
            type="button"
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            className={`glass-panel group w-[17rem] shrink-0 snap-start rounded-[1.5rem] p-7 text-left transition-all duration-500 ${
              active === i ? "-translate-y-2 border-primary/50" : ""
            }`}
          >
            <span className={`font-display text-5xl transition-colors ${active === i ? "text-ember" : "text-white/12"}`}>
              {p.step}
            </span>
            <h3 className="mt-6 text-xl">{p.title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{p.copy}</p>
          </button>
        ))}
      </div>
      <div className="h-px w-full overflow-hidden bg-white/8">
        <motion.div
          className="bg-ember h-full"
          animate={{ width: `${((active + 1) / PROCESS.length) * 100}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 24 }}
        />
      </div>
    </Section>
  );
}
