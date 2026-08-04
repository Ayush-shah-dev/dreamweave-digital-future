import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Mail, MapPin, Phone } from "lucide-react";
import { CtaBand, PageHero, Section, SectionHeading, breadcrumbSchema } from "@/components/site/Sections";
import { Reveal } from "@/components/site/Motion";
import { WhatsAppCta } from "@/components/site/Cta";
import { BRAND, waLink } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact | Creator Marketing Agency in Gandhinagar" },
      {
        name: "description",
        content:
          "Talk to Dreamweave Digital — head office at 508, President Complex, Sector 11, Gandhinagar. WhatsApp +91 63541 18698 or send us your campaign brief.",
      },
      { property: "og:title", content: "Contact Dreamweave Digital" },
      { property: "og:description", content: "Office, map, WhatsApp, email and a direct campaign enquiry form." },
      { property: "og:url", content: "/contact" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(breadcrumbSchema("Contact", "/contact")) }],
  }),
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(8, "Enter a valid phone number").max(20),
  message: z.string().trim().min(10, "Tell us a bit more").max(1000),
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const field = (name: keyof typeof form, label: string, type = "text") => (
    <label className="block">
      <span className="text-sm text-muted-foreground">{label}</span>
      <input
        type={type}
        value={form[name]}
        maxLength={255}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        className="mt-2 w-full rounded-xl border border-input bg-white/5 px-4 py-3 text-sm outline-none transition-colors focus:border-primary/60"
      />
      {errors[name] && <span className="mt-1.5 block text-xs text-destructive">{errors[name]}</span>}
    </label>
  );

  return (
    <>
      <PageHero
        crumb="Contact"
        label="Contact"
        title="Let's talk about your next campaign."
        copy="Fastest reply is on WhatsApp. Or send the brief below and we'll come back within one working day."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <SectionHeading label="Head Office" title="508, President Complex, Sector 11, Gandhinagar." />
            <div className="mt-8 space-y-4 text-sm">
              <p className="flex gap-3 text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {BRAND.address}
              </p>
              <a href={`tel:+${BRAND.phoneRaw}`} className="flex gap-3 text-muted-foreground hover:text-primary">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {BRAND.phoneDisplay}
              </a>
              <a href={`mailto:${BRAND.email}`} className="flex gap-3 text-muted-foreground hover:text-primary">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {BRAND.email}
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <WhatsAppCta />
            </div>
            <Reveal>
              <div className="glass-panel mt-8 overflow-hidden rounded-[1.4rem]">
                <iframe
                  title="Dreamweave Digital office location in Gandhinagar"
                  src="https://www.google.com/maps?q=Sector%2011%2C%20Gandhinagar%2C%20Gujarat&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-72 w-full border-0 grayscale-[0.4]"
                />
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <form
              className="glass-panel space-y-5 rounded-[1.6rem] p-8"
              onSubmit={(e) => {
                e.preventDefault();
                const result = schema.safeParse(form);
                if (!result.success) {
                  const next: Record<string, string> = {};
                  for (const issue of result.error.issues) next[String(issue.path[0])] = issue.message;
                  setErrors(next);
                  toast.error("Please fix the highlighted fields");
                  return;
                }
                setErrors({});
                toast.success("Brief received — opening WhatsApp to continue.");
                window.open(
                  waLink(
                    `Hi Dreamweave Digital 👋\n\nName: ${result.data.name}\nEmail: ${result.data.email}\nPhone: ${result.data.phone}\n\n${result.data.message}`,
                  ),
                  "_blank",
                );
                setForm({ name: "", email: "", phone: "", message: "" });
              }}
            >
              <h2 className="text-2xl">Send your brief</h2>
              {field("name", "Full name")}
              {field("email", "Email", "email")}
              {field("phone", "WhatsApp number", "tel")}
              <label className="block">
                <span className="text-sm text-muted-foreground">What are you planning?</span>
                <textarea
                  rows={5}
                  maxLength={1000}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-input bg-white/5 px-4 py-3 text-sm outline-none transition-colors focus:border-primary/60"
                />
                {errors["message"] && <span className="mt-1.5 block text-xs text-destructive">{errors["message"]}</span>}
              </label>
              <button
                type="submit"
                className="bg-ember w-full rounded-full py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                Send & continue on WhatsApp
              </button>
            </form>
          </Reveal>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
