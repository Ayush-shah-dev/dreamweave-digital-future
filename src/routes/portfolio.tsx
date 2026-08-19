import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { CtaBand, PageHero, Section, breadcrumbSchema } from "@/components/site/Sections";
import { Reveal } from "@/components/site/Motion";
import { PORTFOLIO } from "@/lib/site";
import decathlonLogo from "@/assets/LOGO_COLLECTIONS/Decathlon_Group-Logo.wine.svg";
import fashionFactoryLogo from "@/assets/LOGO_COLLECTIONS/Fashion-factory.png";
import hyundaiLogo from "@/assets/LOGO_COLLECTIONS/Hyundai_Motor_Company_logo.svg";
import lenskartLogo from "@/assets/LOGO_COLLECTIONS/Lenskart_logo.svg";
import masterChefLogo from "@/assets/LOGO_COLLECTIONS/MasterChef_Logo.svg";
import poojaraLogo from "@/assets/LOGO_COLLECTIONS/Poojara_Telecom.png";
import tvsLogo from "@/assets/LOGO_COLLECTIONS/TVS_Motor_Company.svg";
import vMartLogo from "@/assets/LOGO_COLLECTIONS/V-Mart Logo SVG.svg";
import vivoLogo from "@/assets/LOGO_COLLECTIONS/vivo-mobile-logo-icon.svg";

const LOGOS: Record<string, string> = {
  Decathlon: decathlonLogo,
  "Fashion Factory": fashionFactoryLogo,
  Hyundai: hyundaiLogo,
  Lenskart: lenskartLogo,
  MasterChef: masterChefLogo,
  "Poojara Telecom": poojaraLogo,
  "TVS Motor Company": tvsLogo,
  "V-Mart": vMartLogo,
  vivo: vivoLogo,
};

const CARD_GRADIENTS = [
  "linear-gradient(145deg, #203a43 0%, #0f2027 48%, #091014 100%)",
  "linear-gradient(145deg, #3b1d4a 0%, #171225 52%, #0c0b13 100%)",
  "linear-gradient(145deg, #3f2119 0%, #21130f 52%, #0e0b0a 100%)",
  "linear-gradient(145deg, #1d3b45 0%, #12252f 52%, #0a1014 100%)",
  "linear-gradient(145deg, #4b2c18 0%, #24160f 52%, #100b08 100%)",
  "linear-gradient(145deg, #243b55 0%, #141e30 52%, #0b0f18 100%)",
  "linear-gradient(145deg, #44251d 0%, #25140f 52%, #100a08 100%)",
  "linear-gradient(145deg, #3a3154 0%, #1d1830 52%, #0d0b16 100%)",
  "linear-gradient(145deg, #183c3c 0%, #102727 52%, #091212 100%)",
];

export const Route = createFileRoute("/portfolio")({
  component: Portfolio,
  head: () => ({
    meta: [
      { title: "Portfolio | Reel Production & Content Shoots in Gujarat" },
      {
        name: "description",
        content:
          "Campaign work from Dreamweave Digital — reel production, content shoots and creator collaborations across fashion, beauty, food, auto and D2C brands in Gujarat.",
      },
      { property: "og:title", content: "Portfolio — Dreamweave Digital" },
      { property: "og:description", content: "Selected creator campaigns, shoots and reels with views, creators and platforms." },
      { property: "og:url", content: "/portfolio" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(breadcrumbSchema("Portfolio", "/portfolio")) }],
  }),
});

function Portfolio() {
  const items = PORTFOLIO.map((p, i) => ({
    ...p,
    logo: LOGOS[p.brand],
    gradient: CARD_GRADIENTS[i % CARD_GRADIENTS.length]!,
  }));

  return (
    <>
      <PageHero
        crumb="Portfolio"
        label="Portfolio"
        title="Frames that made brands unmissable."
        copy="A selection of campaign work — shot, edited and published by our in-house team across Gujarat and India."
      />

      <Section>
        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {items.map((p, i) => (
            <Reveal key={p.brand} delay={(i % 3) * 0.06}>
              <motion.figure
                layout
                style={{ background: p.gradient }}
                className={`group relative overflow-hidden rounded-[1.4rem] break-inside-avoid ${p.tall ? "h-[30rem]" : "h-[21rem]"}`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.14),transparent_34%)]" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/65" />
                <div className="relative flex h-full flex-col items-center justify-between p-7">
                  <div className="flex min-h-28 w-full items-center justify-center">
                  <img
                    src={p.logo}
                    alt={`${p.brand} logo`}
                    loading="lazy"
                    className={`h-24 w-auto max-w-[82%] object-contain transition-transform duration-500 ${
                      p.brand === "Decathlon"
                        ? "scale-[4]"
                        : p.brand === "Lenskart"
                          ? "scale-[4] grayscale brightness-0 invert"
                          : ""
                    }`}
                  />
                  </div>
                  <figcaption className="w-full transition-transform duration-500 group-hover:-translate-y-1">
                  <p className="text-xs tracking-[0.2em] text-primary uppercase">{p.category}</p>
                  <h2 className="font-display mt-1.5 text-2xl">{p.brand}</h2>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/80 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    {p.description}
                  </p>
                  </figcaption>
                </div>
              </motion.figure>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand title="Your brand deserves frames like these." />
    </>
  );
}
