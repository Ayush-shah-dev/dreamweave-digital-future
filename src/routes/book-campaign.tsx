import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { PageHero, Section, breadcrumbSchema } from "@/components/site/Sections";
import { WhatsAppCta } from "@/components/site/Cta";
import { waLink } from "@/lib/site";

export const Route = createFileRoute("/book-campaign")({
  component: BookCampaign,
  head: () => ({
    meta: [
      { title: "Book a Campaign | Influencer Marketing for Brands" },
      {
        name: "description",
        content:
          "Book a creator marketing campaign with Dreamweave Digital — share your industry, budget, goal and timeline and get a creator shortlist within 48 hours.",
      },
      { property: "og:title", content: "Book a Campaign — Dreamweave Digital" },
      { property: "og:description", content: "A short brief form that ends in a WhatsApp conversation with our campaign team." },
      { property: "og:url", content: "/book-campaign" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/book-campaign" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(breadcrumbSchema("Book Campaign", "/book-campaign")) }],
  }),
});

const steps = [
  { title: "Your business", fields: ["business", "industry"] },
  { title: "Campaign scope", fields: ["budget", "goal"] },
  { title: "Where and when", fields: ["location", "timeline"] },
] as const;

const labels: Record<string, string> = {
  business: "Business name",
  industry: "Industry",
  budget: "Budget range",
  goal: "Campaign goal",
  location: "Location",
  timeline: "Timeline",
};

function BookCampaign() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const current = steps[step]!;

  return (
    <>
      <PageHero
        crumb="Book Campaign"
        label="Book a Campaign"
        title="Tell us the brief. Get a plan in 48 hours."
        copy="Three quick steps, then we continue on WhatsApp with a creator shortlist and production plan."
      />

      <Section>
        <div className="mx-auto max-w-2xl">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel glow-ring rounded-[1.8rem] p-12 text-center"
              >
                <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
                <h2 className="mt-6 text-3xl">Brief received.</h2>
                <p className="mt-3 text-muted-foreground">
                  Our campaign team will respond within one working day with a shortlist and scope.
                </p>
                <div className="mt-8 flex justify-center">
                  <WhatsAppCta>Continue on WhatsApp</WhatsAppCta>
                </div>
              </motion.div>
            ) : (
              <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
                <div className="mb-8 flex gap-2">
                  {steps.map((s, i) => (
                    <div key={s.title} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-ember" : "bg-white/10"}`} />
                  ))}
                </div>
                <form
                  className="glass-panel space-y-5 rounded-[1.8rem] p-8"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const next: Record<string, string> = {};
                    for (const f of current.fields) if (!(form[f] ?? "").trim()) next[f] = "This field is required";
                    setErrors(next);
                    if (Object.keys(next).length) {
                      toast.error("Please complete the required fields");
                      return;
                    }
                    if (step < steps.length - 1) {
                      setStep(step + 1);
                      return;
                    }
                    setDone(true);
                    toast.success("Brief submitted");
                    window.open(
                      waLink(
                        `Hi Dreamweave Digital 👋\n\nCampaign brief:\nBusiness: ${form["business"]}\nIndustry: ${form["industry"]}\nBudget: ${form["budget"]}\nGoal: ${form["goal"]}\nLocation: ${form["location"]}\nTimeline: ${form["timeline"]}`,
                      ),
                      "_blank",
                    );
                  }}
                >
                  <h2 className="text-2xl">{current.title}</h2>
                  {current.fields.map((f) => (
                    <label key={f} className="block">
                      <span className="text-sm text-muted-foreground">{labels[f]}</span>
                      <input
                        value={form[f] ?? ""}
                        maxLength={200}
                        onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                        className="mt-2 w-full rounded-xl border border-input bg-white/5 px-4 py-3 text-sm outline-none transition-colors focus:border-primary/60"
                      />
                      {errors[f] && <span className="mt-1.5 block text-xs text-destructive">{errors[f]}</span>}
                    </label>
                  ))}
                  <div className="flex gap-3 pt-2">
                    {step > 0 && (
                      <button type="button" onClick={() => setStep(step - 1)} className="glass-panel rounded-full px-6 py-3 text-sm">
                        Back
                      </button>
                    )}
                    <button
                      type="submit"
                      className="bg-ember flex-1 rounded-full py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
                    >
                      {step === steps.length - 1 ? "Submit brief" : "Continue"}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Section>
    </>
  );
}
