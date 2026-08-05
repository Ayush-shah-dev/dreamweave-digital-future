import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, BRAND } from "@/lib/site";
import { Cta } from "./Cta";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <img
        src="/logo.jpg"
        alt={`${BRAND.name} logo`}
        className="h-8 w-8 rounded-[10px] object-cover"
      />
      
      </span>
    </span>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[80] transition-all duration-500",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <nav
        aria-label="Primary"
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-6 rounded-full px-4 py-2.5 transition-all duration-500 sm:px-5",
          scrolled ? "glass-panel w-[calc(100%-1.5rem)]" : "w-[calc(100%-2rem)] border border-transparent",
        )}
      >
        <Link to="/" aria-label={`${BRAND.name} home`}>
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={cn(
                  "relative rounded-full px-3 py-2 text-[0.83rem] text-muted-foreground transition-colors hover:text-foreground",
                  pathname === l.to && "text-foreground",
                )}
              >
                {l.label}
                {pathname === l.to && (
                  <motion.span
                    layoutId="nav-active"
                    className="bg-ember absolute inset-x-3 -bottom-0.5 h-px"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Cta to="/book-campaign" className="hidden px-5 py-2.5 text-[0.82rem] sm:inline-flex">
            Book Campaign
          </Cta>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground lg:hidden"
          >
            {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel mx-4 mt-2 rounded-3xl p-4 lg:hidden"
          >
            <ul className="grid gap-1">
              {[...NAV_LINKS, { to: "/apply", label: "Apply as Creator" }, { to: "/book-campaign", label: "Book Campaign" }].map(
                (l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="block rounded-xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
