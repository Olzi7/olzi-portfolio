import { useEffect, useState } from "react";
import styles from "./Preloader.module.css";

type PreloaderProps = {
  onDone: () => void;
};

export function Preloader({ onDone }: PreloaderProps) {
  const [phase, setPhase] = useState<"access" | "flash" | "brand" | "leave">(
    "access",
  );

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      onDone();
      return;
    }

    const t1 = window.setTimeout(() => setPhase("flash"), 420);
    const t2 = window.setTimeout(() => setPhase("brand"), 620);
    const t3 = window.setTimeout(() => setPhase("leave"), 1180);
    const t4 = window.setTimeout(onDone, 1550);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [onDone]);

  return (
    <div
      className={`${styles.preloader} ${phase === "leave" ? styles.leave : ""} ${
        phase === "flash" ? styles.flash : ""
      }`}
      aria-hidden="true"
    >
      {phase === "access" || phase === "flash" ? (
        <p className={styles.access}>ACCESSING FILE // SEMENOVA</p>
      ) : (
        <p className={styles.brand}>OLZI</p>
      )}
    </div>
  );
}
