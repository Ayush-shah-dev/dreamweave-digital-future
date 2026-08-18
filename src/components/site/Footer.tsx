import { Link } from "@tanstack/react-router";
import { Instagram, Youtube, Linkedin, MapPin, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BRAND, NAV_LINKS, SERVICES } from "@/lib/site";
import { Logo } from "./Nav";
import { WhatsAppCta } from "./Cta";
import { MeshBackdrop } from "./Motion";

export function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="noise relative overflow-hidden border-t border-border bg-background pt-20 pb-10">
      <MeshBackdrop className="opacity-50" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {BRAND.tagline} A creator marketing agency from Gandhinagar building cinematic campaigns for brands across
            Gujarat and India.
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { icon: Instagram, label: "Instagram", href: BRAND.social.instagram },
              { icon: Youtube, label: "YouTube", href: BRAND.social.youtube },
              { icon: Linkedin, label: "LinkedIn", href: BRAND.social.linkedin },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${BRAND.name} on ${label}`}
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer pages">
          <h3 className="text-sm font-semibold">Explore</h3>
          <ul className="mt-4 space-y-2.5">
            {[...NAV_LINKS, { to: "/apply", label: "Apply as Creator" }, { to: "/book-campaign", label: "Book Campaign" }].map(
              (l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <nav aria-label="Footer services">
          <h3 className="text-sm font-semibold">Services</h3>
          <ul className="mt-4 space-y-2.5">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link
                  to="/services"
                  hash={s.slug}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-semibold">Head Office</h3>
          <address className="mt-4 space-y-3 text-sm text-muted-foreground not-italic">
            <span className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              508, President Complex, Sector 11, Gandhinagar
            </span>
            <a href={`tel:+${BRAND.phoneRaw}`} className="flex gap-2.5 hover:text-primary">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {BRAND.phoneDisplay}
            </a>
            <a href={`mailto:${BRAND.email}`} className="flex gap-2.5 hover:text-primary">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {BRAND.email}
            </a>
          </address>

          <form
            className="mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (!/^\S+@\S+\.\S+$/.test(email)) {
                toast.error("Enter a valid email address");
                return;
              }
              setEmail("");
              toast.success("You're on the list. Creator marketing notes, monthly.");
            }}
          >
            <label htmlFor="newsletter" className="text-sm font-semibold text-foreground">
              Newsletter
            </label>
            <div className="mt-3 flex gap-2">
              <input
                id="newsletter"
                type="email"
                value={email}
                maxLength={255}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@brand.com"
                className="w-full rounded-full border border-input bg-white/5 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
              />
              <button
                type="submit"
                className="bg-ember rounded-full px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-105"
              >
                Join
              </button>
            </div>
          </form>
          <div className="mt-5">
            <WhatsAppCta />
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-14 flex max-w-7xl flex-col gap-3 border-t border-border px-6 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {BRAND.name}. Founded by {BRAND.founder}.
        </p>
        <div className="flex items-center gap-4">
          <p>Influencer Marketing Gujarat · Creator Agency Gandhinagar · Content Shoot Ahmedabad</p>
          <Link to="/admin/login" className="shrink-0 transition-colors hover:text-primary">Admin login</Link>
        </div>
      </div>
    </footer>
  );
}
