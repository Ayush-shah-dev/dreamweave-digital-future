import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MeshBackdrop, Reveal, SectionLabel, WordReveal } from "./Motion";
import { Cta, WhatsAppCta } from "./Cta";
import { FAQS } from "@/lib/site";

export function PageHero({
  label,
  title,
  copy,
  crumb,
}: {
  label: string;
  title: string;
  copy: string;
  crumb: string;
}) {
  return (
    <section className="noise relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
      <MeshBackdrop />
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span className="px-2">/</span>
          <span className="text-foreground">{crumb}</span>
        </nav>
        <SectionLabel>{label}</SectionLabel>
        <h1 className="mt-6 text-4xl leading-[1.03] font-semibold sm:text-6xl">
          <WordReveal text={title} />
        </h1>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{copy}</p>
        </Reveal>
      </div>
    </section>
  );
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`relative py-20 sm:py-28 ${className}`}>
      <div className="mx-auto max-w-7xl px-6">{children}</div>
    </section>
  );
}

export function SectionHeading({
  label,
  title,
  copy,
  align = "left",
}: {
  label: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <SectionLabel>{label}</SectionLabel>
      <h2 className="mt-5 text-3xl leading-[1.08] font-semibold sm:text-5xl">
        <WordReveal text={title} />
      </h2>
      {copy && (
        <Reveal delay={0.1}>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">{copy}</p>
        </Reveal>
      )}
    </div>
  );
}

export function FaqSection({
  items = FAQS,
  title = "Questions brands and creators ask us",
}: {
  items?: { q: string; a: string }[];
  title?: string;
}) {
  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeading label="FAQ" title={title} copy="Everything about scope, pricing, timelines and payouts — answered upfront." />
        <Reveal>
          <Accordion type="single" collapsible className="glass-panel rounded-3xl px-6">
            {items.map((f) => (
              <AccordionItem key={f.q} value={f.q} className="border-border">
                <AccordionTrigger className="text-left text-base font-medium hover:text-primary hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </Section>
  );
}

export function CtaBand({
  title = "Let's build your next viral campaign.",
  copy = "Tell us your category, budget and timeline. We'll come back with a creator shortlist and a production plan within 48 hours.",
  primaryTo = "/book-campaign",
  primaryLabel = "Book a Campaign",
}: {
  title?: string;
  copy?: string;
  primaryTo?: string;
  primaryLabel?: string;
}) {
  return (
    <section className="noise relative overflow-hidden py-24 sm:py-32">
      <MeshBackdrop />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-4xl leading-[1.05] font-semibold sm:text-6xl">
          <WordReveal text={title} />
        </h2>
        <Reveal delay={0.12}>
          <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">{copy}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Cta to={primaryTo}>{primaryLabel}</Cta>
            <WhatsAppCta variant="ghost" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name, item: path },
    ],
  };
}
