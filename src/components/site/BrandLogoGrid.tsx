import decathlonLogo from "@/assets/LOGO_COLLECTIONS/Decathlon_Group-Logo.wine.svg";
import fashionFactoryLogo from "@/assets/LOGO_COLLECTIONS/Fashion-factory.png";
import hyundaiLogo from "@/assets/LOGO_COLLECTIONS/Hyundai_Motor_Company_logo.svg";
import lenskartLogo from "@/assets/LOGO_COLLECTIONS/Lenskart_logo.svg";
import masterChefLogo from "@/assets/LOGO_COLLECTIONS/MasterChef_Logo.svg";
import poojaraLogo from "@/assets/LOGO_COLLECTIONS/Poojara_Telecom.png";
import tvsLogo from "@/assets/LOGO_COLLECTIONS/TVS_Motor_Company.svg";
import vMartLogo from "@/assets/LOGO_COLLECTIONS/V-Mart Logo SVG.svg";
import vivoLogo from "@/assets/LOGO_COLLECTIONS/vivo-mobile-logo-icon.svg";

const BRAND_LOGOS = [
  { name: "Decathlon", src: decathlonLogo },
  { name: "Fashion Factory", src: fashionFactoryLogo },
  { name: "Hyundai", src: hyundaiLogo },
  { name: "Lenskart", src: lenskartLogo },
  { name: "MasterChef", src: masterChefLogo },
  { name: "Poojara Telecom", src: poojaraLogo },
  { name: "TVS Motor Company", src: tvsLogo },
  { name: "V-Mart", src: vMartLogo },
  { name: "vivo", src: vivoLogo },
];

export function BrandLogoGrid() {
  return (
    <section aria-labelledby="brand-logo-heading" className="border-y border-border bg-white/[0.02] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-primary">Brand network</p>
          <h2 id="brand-logo-heading" className="mt-4 text-3xl font-semibold sm:text-4xl">
            Brands we create with.
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {BRAND_LOGOS.map((logo) => (
            <div
              key={logo.name}
              className="flex h-28 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] px-6 transition-colors hover:border-primary/40 lg:[&:nth-child(n+6)]:translate-x-1/2"
            >
              <img
                src={logo.src}
                alt={`${logo.name} logo`}
                loading="lazy"
                className={`max-h-12 max-w-full object-contain opacity-75 transition-opacity hover:opacity-100 ${
                  logo.name === "Decathlon"
                    ? "scale-[4]"
                    : logo.name === "Lenskart"
                    ? "h-20 w-20 max-h-none max-w-none grayscale brightness-0 invert"
                    : logo.name === "Poojara Telecom"
                      ? ""
                      : "grayscale brightness-0 invert"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
