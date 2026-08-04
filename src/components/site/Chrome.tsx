import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useScroll, useSpring as useSpringScroll } from "motion/react";

export function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 260, damping: 30, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 30, mass: 0.4 });
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      setActive(Boolean(el?.closest("a, button, [data-magnetic]")));
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[90] hidden h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full md:block"
        style={{
          x: sx,
          y: sy,
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--primary) 16%, transparent) 0%, transparent 62%)",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[91] hidden rounded-full border border-primary/70 md:block"
        style={{ x: sx, y: sy }}
        animate={{ width: active ? 46 : 14, height: active ? 46 : 14, marginLeft: active ? -23 : -7, marginTop: active ? -23 : -7 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      />
    </>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpringScroll(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="bg-ember fixed inset-x-0 top-0 z-[95] h-[3px] origin-left"
    />
  );
}
