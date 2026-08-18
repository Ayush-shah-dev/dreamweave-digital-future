import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { PageHero, Section, breadcrumbSchema } from "@/components/site/Sections";
import { WhatsAppCta } from "@/components/site/Cta";
import { waLink } from "@/lib/site";
import { logToGoogleSheet } from "@/lib/google-sheets";
import { submitLead } from "@/lib/leads";

export const Route = createFileRoute("/apply")({
  component: Apply,
  head: () => ({
    meta: [
      { title: "Apply as a Creator | Dreamweave Digital Creator Network" },
      {
        name: "description",
        content:
          "Join the Dreamweave Digital creator network — apply with your Instagram, category and city to receive paid brand collaborations across India.",
      },
      { property: "og:title", content: "Apply as a Creator — Dreamweave Digital" },
      { property: "og:description", content: "A two-minute application for paid brand deals and shoots." },
      { property: "og:url", content: "/apply" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/apply" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(breadcrumbSchema("Apply as Creator", "/apply")) }],
  }),
});

const steps = [
  { title: "About you", fields: ["name", "city", "whatsapp"] },
  { title: "Your audience", fields: ["instagram", "followers", "category"] },
  { title: "Your work", fields: ["portfolio", "mediakit"] },
] as const;

const labels: Record<string, string> = {
  name: "Full name",
  city: "City",
  whatsapp: "WhatsApp number",
  instagram: "Instagram handle",
  followers: "Follower count",
  category: "Primary category",
  portfolio: "Portfolio or top reel link",
  mediakit: "Media kit link (optional)",
};

export const schema = z.object({
  name: z.string().trim().min(2).max(100),
  city: z.string().trim().min(2).max(80),
  whatsapp: z.string().trim().min(8).max(20),
  instagram: z.string().trim().min(2).max(60),
  followers: z.string().trim().min(1).max(20),
  category: z.string().trim().min(2).max(60),
  portfolio: z.string().trim().max(300),
  mediakit: z.string().trim().max(300),
});

function Apply() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const current = steps[step]!;

  const validateStep = () => {
    const next: Record<string, string> = {};
    for (const f of current.fields) {
      if (f === "mediakit") continue;
      if (!(form[f] ?? "").trim()) next[f] = "This field is required";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  return (
    <>
      <PageHero
        crumb="Apply as Creator"
        label="Creator Application"
        title="Apply to join the creator network."
        copy="Three short steps. Reviewed within five working days."
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
                <h2 className="mt-6 text-3xl">Application received.</h2>
                <p className="mt-3 text-muted-foreground">
                  Our creator team will review your profile and reach out on WhatsApp within five working days.
                </p>
                <div className="mt-8 flex justify-center">
                  <WhatsAppCta message="Hi Dreamweave Digital 👋 I just submitted my creator application.">
                    Continue on WhatsApp
                  </WhatsAppCta>
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
                    if (!validateStep()) {
                      toast.error("Please complete the required fields");
                      return;
                    }
                    if (step < steps.length - 1) {
                      setStep(step + 1);
                      return;
                    }
                    const parsed = schema.safeParse({ portfolio: "", mediakit: "", ...form });
                    if (!parsed.success) {
                      toast.error("Please check your details");
                      return;
                    }
                    setDone(true);
                    logToGoogleSheet("Apply", parsed.data);
                    submitLead("apply", parsed.data);
                    toast.success("Application submitted");
                    window.open(
                      waLink(
                        `Hi Dreamweave Digital 👋\n\nCreator application:\nName: ${parsed.data.name}\nCity: ${parsed.data.city}\nInstagram: ${parsed.data.instagram}\nFollowers: ${parsed.data.followers}\nCategory: ${parsed.data.category}\nPortfolio: ${parsed.data.portfolio}`,
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
                        maxLength={300}
                        onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                        className="mt-2 w-full rounded-xl border border-input bg-white/5 px-4 py-3 text-sm outline-none transition-colors focus:border-primary/60"
                      />
                      {errors[f] && <span className="mt-1.5 block text-xs text-destructive">{errors[f]}</span>}
                    </label>
                  ))}
                  <div className="flex gap-3 pt-2">
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className="glass-panel rounded-full px-6 py-3 text-sm"
                      >
                        Back
                      </button>
                    )}
                    <button
                      type="submit"
                      className="bg-ember flex-1 rounded-full py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
                    >
                      {step === steps.length - 1 ? "Submit application" : "Continue"}
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
