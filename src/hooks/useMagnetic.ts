import { useEffect, type RefObject } from "react";
import gsap from "gsap";

export function useMagnetic(
  ref: RefObject<HTMLElement | null>,
  strength = 0.3,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });

    const restCenter = () => {
      const x = Number(gsap.getProperty(el, "x")) || 0;
      const y = Number(gsap.getProperty(el, "y")) || 0;
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 - x,
        y: rect.top + rect.height / 2 - y,
      };
    };

    const onMove = (e: MouseEvent) => {
      const center = restCenter();
      xTo((e.clientX - center.x) * strength);
      yTo((e.clientY - center.y) * strength);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [ref, strength]);
}
