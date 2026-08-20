import { useEffect, useRef } from "react";
import styles from "./CustomCursor.module.css";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("has-cursor");

    let x = 0;
    let y = 0;
    let rx = 0;
    let ry = 0;
    let hovering = false;
    let raf = 0;
    let running = false;

    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${hovering ? 1.85 : 1})`;
      ring.classList.toggle(styles.active, hovering);
      if (Math.abs(x - rx) > 0.15 || Math.abs(y - ry) > 0.15) {
        raf = requestAnimationFrame(tick);
        return;
      }
      running = false;
      raf = 0;
    };

    const kick = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      kick();
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      hovering = Boolean(target?.closest("a, button, [data-cursor=hover]"));
      kick();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.ring} ref={ringRef} />
      <div className={styles.dot} ref={dotRef} />
    </div>
  );
}
