import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import fashion from "@/assets/reel-fashion.jpg";
import food from "@/assets/reel-food.jpg";
import beauty from "@/assets/reel-beauty.jpg";
import travel from "@/assets/reel-travel.jpg";
import tech from "@/assets/reel-tech.jpg";
import lifestyle from "@/assets/reel-lifestyle.jpg";
import { Heart, MessageCircle, Play } from "lucide-react";

const REELS = [
  { src: fashion, label: "Fashion", handle: "@aarohi.styles", views: "1.2M", alt: "Fashion creator reel shot on a neon-lit street" },
  { src: food, label: "Food", handle: "@kabir.eats", views: "860K", alt: "Cinematic food reel of a sizzling Indian dish" },
  { src: beauty, label: "Beauty", handle: "@isha.glow", views: "2.4M", alt: "Beauty creator close-up reel with dramatic lighting" },
  { src: travel, label: "Travel", handle: "@riya.roams", views: "740K", alt: "Aerial drone travel reel of a coastal highway at dusk" },
  { src: tech, label: "Tech", handle: "@dhruv.tech", views: "1.6M", alt: "Product reel of a smartphone lit by orange neon" },
  { src: lifestyle, label: "Lifestyle", handle: "@naina.daily", views: "980K", alt: "Lifestyle reel of a creator filming in a cafe" },
];

const CARDS = Array.from({ length: 12 }, (_, i) => ({ ...REELS[i % REELS.length]!, i }));

export function ReelOrbit() {
  const [mounted, setMounted] = useState(false);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(py, { stiffness: 60, damping: 20 });
  const ry = useSpring(px, { stiffness: 60, damping: 20 });
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const move = (e: MouseEvent) => {
      px.set((e.clientX / window.innerWidth - 0.5) * 18);
      py.set((0.5 - e.clientY / window.innerHeight) * 12);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [px, py]);

  return (
    <div
      ref={wrapper}
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden [perspective:1400px]"
    >
      <motion.div
        className="relative h-[26rem] w-[26rem] [transform-style:preserve-3d]"
        style={{ rotateX: rx, rotateY: ry }}
      >
        <div
          className="orbit-spin absolute inset-0 [transform-style:preserve-3d]"
          style={{ opacity: mounted ? 1 : 0, transition: "opacity 1.2s ease" }}
        >
          {CARDS.map((card, i) => {
            const angle = (360 / CARDS.length) * i;
            const radius = 460;
            const lift = (i % 3) - 1;
            return (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 h-[19rem] w-[10.7rem] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${radius}px) translateY(${lift * 46}px) rotateY(${-angle * 0.15}deg)`,
                }}
              >
                <div
                  className="floaty h-full w-full overflow-hidden rounded-2xl border border-white/12 bg-card shadow-[0_40px_90px_-40px_rgba(0,0,0,0.95)]"
                  style={{ animationDelay: `${(i % 6) * 0.8}s`, filter: i % 4 === 0 ? "blur(2.5px)" : "none" }}
                >
                  <div className="relative h-full w-full">
                    <img
                      src={card.src}
                      alt={card.alt}
                      width={512}
                      height={896}
                      loading={i < 6 ? "eager" : "lazy"}
                      decoding="async"
                      className="h-full w-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/40" />
                    <span className="absolute top-2.5 left-2.5 rounded-full border border-white/20 bg-black/50 px-2 py-0.5 text-[0.6rem] tracking-wide text-white/90">
                      {card.label}
                    </span>
                    <Play className="absolute top-1/2 left-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 fill-white/70 text-white/70" />
                    <div className="absolute inset-x-2.5 bottom-2.5 space-y-1.5">
                      <p className="text-[0.63rem] font-medium text-white/90">{card.handle}</p>
                      <div className="flex items-center gap-2.5 text-[0.58rem] text-white/70">
                        <span className="flex items-center gap-1">
                          <Heart className="h-2.5 w-2.5" /> {card.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-2.5 w-2.5" /> 4.1K
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
