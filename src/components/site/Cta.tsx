import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Magnetic } from "./Motion";
import { waLink } from "@/lib/site";

const base =
  "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const styles = {
  primary:
    "bg-ember text-primary-foreground shadow-[0_18px_40px_-18px_oklch(0.72_0.19_47/0.85)] hover:shadow-[0_22px_60px_-16px_oklch(0.72_0.19_47/0.95)] hover:brightness-110",
  ghost: "glass-panel text-foreground hover:border-primary/40 hover:text-primary",
  whatsapp:
    "bg-ember text-primary-foreground shadow-[0_18px_40px_-18px_oklch(0.72_0.19_47/0.85)] hover:brightness-110",
};

type Variant = keyof typeof styles;

export function Cta({
  to,
  href,
  children,
  variant = "primary",
  className,
}: {
  to?: string;
  href?: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const inner = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-500 group-hover:translate-x-0" />
    </>
  );
  const cls = cn("group", base, styles[variant], className);

  return (
    <Magnetic>
      {href ? (
        <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={cls}>
          {inner}
        </a>
      ) : (
        <Link to={to ?? "/"} className={cls}>
          {inner}
        </Link>
      )}
    </Magnetic>
  );
}

export function WhatsAppCta({
  children = "Chat on WhatsApp",
  message,
  variant = "whatsapp",
  className,
}: {
  children?: ReactNode;
  message?: string;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Cta href={waLink(message)} variant={variant} className={className}>
      <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.09c-.24.68-1.4 1.3-1.94 1.35-.5.05-.98.23-3.3-.69-2.77-1.09-4.53-3.94-4.67-4.13-.13-.19-1.11-1.48-1.11-2.82 0-1.34.7-2 .95-2.28.24-.27.53-.34.71-.34.18 0 .35 0 .5.01.16.01.38-.06.59.45.24.57.8 1.98.87 2.12.07.14.12.3.02.49-.1.19-.14.3-.29.47-.14.16-.3.36-.43.49-.14.14-.29.29-.13.57.16.28.72 1.18 1.54 1.91 1.06.94 1.95 1.24 2.23 1.38.28.14.44.12.6-.07.16-.19.69-.8.88-1.08.19-.28.37-.23.62-.14.25.09 1.6.75 1.87.89.28.14.46.21.53.32.07.12.07.66-.17 1.34Z" />
      </svg>
      {children}
    </Cta>
  );
}
