import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ScrollProgress.module.css";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  enabled: boolean;
};

export function ScrollProgress({ enabled }: Props) {
  const barRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const bar = barRef.current;
    const label = labelRef.current;
    if (!bar || !label) return;

    const mobile = window.matchMedia("(max-width: 720px)").matches;

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const p = Math.round(self.progress * 100);
        if (mobile) {
          bar.style.transform = `scaleX(${self.progress})`;
        } else {
          bar.style.transform = `scaleY(${self.progress})`;
        }
        label.textContent = `${String(p).padStart(3, "0")}%`;
      },
    });

    return () => st.kill();
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.track}>
        <div className={styles.bar} ref={barRef} />
      </div>
      <span className={styles.label} ref={labelRef}>
        000%
      </span>
    </div>
  );
}
