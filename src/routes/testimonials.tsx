import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AlertCircle, Quote, Sparkles, Star } from "lucide-react";
import { CtaBand, PageHero, Section, SectionHeading, breadcrumbSchema } from "@/components/site/Sections";
import { Reveal } from "@/components/site/Motion";
import { TESTIMONIALS } from "@/lib/site";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { listFeaturedTestimonials } from "@/lib/public-content";
import type { Testimonial } from "@/integrations/supabase/types";

type PublicTestimonial = { quote: string; name: string; org: string; rating?: number; image?: string | null };

async function loadTestimonials(): Promise<{ source: "static" | "live" | "error"; items: PublicTestimonial[] }> {
  if (!isSupabaseConfigured) {
    return { source: "static", items: TESTIMONIALS };
  }
  try {
    const testimonials = await listFeaturedTestimonials(12);
    return {
      source: "live",
      items: testimonials.map((item: Testimonial) => ({
        quote: item.quote,
        name: item.name,
        org: [item.designation, item.company].filter(Boolean).join(" · "),
        rating: item.rating,
        image: item.profile_image,
      })),
    };
  } catch {
    return { source: "error", items: [] };
  }
}

export const Route = createFileRoute("/testimonials")({
  loader: loadTestimonials,
  head: () => ({
    meta: [
      { title: "Testimonials | Dreamweave Digital" },
      { name: "description", content: "What brands and creators say about working with Dreamweave Digital." },
      { property: "og:title", content: "Testimonials | Dreamweave Digital" },
      { property: "og:description", content: "Stories from brands and creators who have worked with Dreamweave Digital." },
    ],
    links: [{ rel: "canonical", href: "/testimonials" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(breadcrumbSchema("Testimonials", "/testimonials")) }],
  }),
  component: TestimonialsPage,
});

function TestimonialsPage() {
  const result = Route.useLoaderData();
  const router = useRouter();

  return (
    <>
      <PageHero
        crumb="Testimonials"
        label="Testimonials"
        title="Good work leaves a feeling behind."
        copy="A few words from the brands and creators who have trusted Dreamweave with their next frame."
      />
      <Section>
        {result.source === "error" ? (
          <div className="glass-panel flex flex-col items-center gap-3 rounded-[1.4rem] p-12 text-center">
            <AlertCircle className="h-6 w-6 text-primary" />
            <p className="text-sm text-muted-foreground">Testimonials could not be loaded right now.</p>
            <button type="button" onClick={() => router.invalidate()} className="rounded-full border border-primary/40 px-5 py-2 text-sm text-primary hover:bg-primary hover:text-primary-foreground">Try again</button>
          </div>
        ) : result.items.length === 0 ? (
          <div className="glass-panel flex flex-col items-center gap-3 rounded-[1.4rem] p-12 text-center">
            <Sparkles className="h-6 w-6 text-primary" />
            <p className="text-sm text-muted-foreground">No testimonials published yet — check back soon.</p>
          </div>
        ) : (
          <>
            <SectionHeading align="center" label="Client voices" title="The work, in their words." copy="From first brief to final report, these are the relationships behind the results." />
            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {result.items.map((item, index) => (
                <Reveal key={`${item.name}-${item.quote}`} delay={(index % 3) * 0.06}>
                  <figure className="glass-panel relative flex h-full flex-col rounded-[1.6rem] p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/40">
                    <Quote className="h-7 w-7 text-primary/70" />
                    {item.rating && <div className="mt-5 flex gap-1" aria-label={`${item.rating} out of 5 stars`}>{Array.from({ length: item.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />)}</div>}
                    <blockquote className="mt-5 flex-1 text-base leading-relaxed text-foreground/90">“{item.quote}”</blockquote>
                    <figcaption className="mt-7 border-t border-border pt-5 text-xs text-muted-foreground">
                      <span className="text-primary">{item.name}</span>{item.org && <> · {item.org}</>}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </Section>
      <CtaBand title="Ready to make work worth talking about?" primaryLabel="Start a campaign" primaryTo="/book-campaign" />
    </>
  );
}
