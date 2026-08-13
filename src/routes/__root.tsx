import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AdminAuthProvider } from "@/hooks/useAdminAuth";
import { Nav } from "@/components/site/Nav";
import { NotFound } from "@/components/site/NotFound";
import { Footer } from "@/components/site/Footer";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { CursorGlow, ScrollProgress } from "@/components/site/Chrome";
import { LoadingScreen } from "@/components/site/LoadingScreen";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { Toaster } from "@/components/ui/sonner";
import { useRouterState } from "@tanstack/react-router";

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dreamweave Digital — Creator Marketing Agency in Gujarat" },
      {
        name: "description",
        content:
          "Dreamweave Digital connects brands with India's top creators — influencer marketing, campaign management and cinematic content shoots from Gandhinagar.",
      },
      { name: "author", content: "Dreamweave Digital" },
      { property: "og:site_name", content: "Dreamweave Digital" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#050505" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://api.fontshare.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://api.fontshare.com/v2/css?f[]=clash-display@600,500,700&f[]=satoshi@500,700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Dreamweave Digital",
          description:
            "Creator marketing agency connecting brands with premium content creators — influencer marketing, campaign management, content shoots and reel production.",
          slogan: "Crafting Your Vision. Digitally.",
          founder: { "@type": "Person", name: "Meet Bhai" },
          telephone: "+91 63541 18698",
          areaServed: ["Gujarat", "India"],
          address: {
            "@type": "PostalAddress",
            streetAddress: "508, President Complex, Sector 11",
            addressLocality: "Gandhinagar",
            addressRegion: "Gujarat",
            postalCode: "382011",
            addressCountry: "IN",
          },
          geo: { "@type": "GeoCoordinates", latitude: 23.2156, longitude: 72.6369 },
          openingHours: "Mo-Sa 10:00-19:00",
          priceRange: "₹₹₹",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        {!isAdminRoute && <LoadingScreen />}
        {!isAdminRoute && <SmoothScroll />}
        {!isAdminRoute && <ScrollProgress />}
        {!isAdminRoute && <CursorGlow />}
        {!isAdminRoute && <Nav />}
        {isAdminRoute ? (
          <Outlet />
        ) : (
          <main>
            <Outlet />
          </main>
        )}
        {!isAdminRoute && <Footer />}
        {!isAdminRoute && <WhatsAppFloat />}
        <Toaster position="bottom-center" />
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}
