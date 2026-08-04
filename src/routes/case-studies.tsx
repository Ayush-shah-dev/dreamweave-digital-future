import { createFileRoute, Link } from "@tanstack/react-router";
import { CtaBand, PageHero, Section, breadcrumbSchema } from "@/components/site/Sections";
import { Reveal, SectionLabel } from "@/components/site/Motion";
import { CASE_STUDIES } from "@/lib/site";

export const Route = createFileRoute("/case-studies")({
  component: CaseStudies,
  head: () => ({
    meta: [
      { title: "Case Studies | Creator Marketing Results in India" },
      {
        name: "description",
        content:
          "Real creator marketing results from Dreamweave Digital — reach, CPM and ROAS before and after campaigns for beauty, automotive and footwear brands.",
      },
      { property: "og:title", content: "Case Studies — Dreamweave Digital" },
      { property: "og:description", content: "Before-and-after metrics from creator campaigns run across Gujarat and India." },
      { property: "og:url", content: "/case-studies" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/case-studies" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(breadcrumbSchema("Case Studies", "/case-studies")) }],
  }),
});

function CaseStudies() {
  return (
    <>
      <PageHero
        crumb="Case Studies"
        label="Case Studies"
        title="The numbers behind the campaigns."
        copy="Every engagement ships with a measured readout. Here are three we're allowed to publish."
      />

      {CASE_STUDIES.map((cs, i) => (
        <Section key={cs.slug} id={cs.slug} className={i % 2 === 1 ? "bg-white/[0.015]" : ""}>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <SectionLabel>{cs.industry}</SectionLabel>
              <h2 className="mt-5 text-3xl sm:text-4xl">{cs.title}</h2>
              <p className="mt-5 leading-relaxed text-muted-foreground">{cs.summary}</p>
              <p className="mt-6 text-sm text-muted-foreground">
                <span className="text-primary">{cs.brand}</span> · {cs.creators} creators · {cs.duration}
              </p>
              <p className="mt-6 text-sm text-muted-foreground">
                Related:{" "}
                <Link to="/services" className="text-primary hover:underline">
                  our services
                </Link>{" "}
                and{" "}
                <Link to="/portfolio" className="text-primary hover:underline">
                  campaign portfolio
                </Link>
                .
              </p>
            </div>
            <Reveal delay={0.1}>
              <div className="glass-panel rounded-[1.6rem] p-8">
                <h3 className="text-lg">Before vs After</h3>
                <div className="mt-6 space-y-6">
                  {(["reach", "cpm", "roas"] as const).map((k) => (
                    <div key={k}>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground uppercase">{k}</span>
                        <span>
                          <span className="text-muted-foreground line-through">{cs.before[k]}</span>{" "}
                          <span className="text-ember font-display">{cs.after[k]}</span>
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
                        <div className="bg-ember h-full w-[18%] rounded-full" />
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/8">
                        <div className="bg-ember h-full w-[92%] rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Section>
      ))}

      <CtaBand title="Let's write your case study next." />
    </>
  );
}
