import { WhatsAppCta } from "./Cta";

export function WhatsAppFloat() {
  return (
    <div className="fixed right-4 bottom-4 z-[85] sm:right-6 sm:bottom-6">
      <WhatsAppCta className="shadow-[0_20px_50px_-18px_oklch(0.72_0.19_47/0.9)]">
        <span className="hidden sm:inline">WhatsApp Us</span>
      </WhatsAppCta>
    </div>
  );
}
