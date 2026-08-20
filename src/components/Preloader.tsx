import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./Preloader.module.css";

type PreloaderProps = {
  onDone: () => void;
};

export function Preloader({ onDone }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const accessRef = useRef<HTMLParagraphElement>(null);
  const brandRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const access = accessRef.current;
    const brand = brandRef.current;
    if (!root || !access || !brand) return;

    const ctx = gsap.context(() => {
      gsap.set(brand, { autoAlpha: 0, scale: 1.16 });
      gsap.set(root, { yPercent: 0, backgroundColor: "#000000" });

      const tl = gsap.timeline({ onComplete: onDone });
      tl.to(
        root,
        { backgroundColor: "#ff4892", duration: 0.12, ease: "none" },
        0.42,
      );
      tl.to(access, { color: "#000000", duration: 0.08, ease: "none" }, 0.42);
      tl.set(access, { autoAlpha: 0 }, 0.64);
      tl.set(root, { backgroundColor: "#000000" }, 0.64);
      tl.to(
        brand,
        { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.6)" },
        0.64,
      );
      tl.to(
        root,
        { yPercent: -108, duration: 0.48, ease: "power3.in" },
        1.42,
      );
    }, root);

    return () => ctx.revert();
  }, [onDone]);

  return (
    <div ref={rootRef} className={styles.preloader} aria-hidden="true">
      <p ref={accessRef} className={styles.access}>
        ACCESSING FILE // SEMENOVA
      </p>
      <p ref={brandRef} className={styles.brand}>
        OLZI
      </p>
    </div>
  );
}
