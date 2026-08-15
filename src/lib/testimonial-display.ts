const DEMO_TESTIMONIALS_KEY = "dreamweave.include-demo-testimonials";
export const DEMO_TESTIMONIALS_EVENT = "dreamweave:testimonial-display-change";

export function getIncludeDemoTestimonials() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(DEMO_TESTIMONIALS_KEY) === "true";
}

export function setIncludeDemoTestimonials(value: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DEMO_TESTIMONIALS_KEY, String(value));
  window.dispatchEvent(new Event(DEMO_TESTIMONIALS_EVENT));
}
