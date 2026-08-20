import { useMemo } from "react";
import styles from "./PixelBridge.module.css";

export function PixelBridge() {
  const cells = useMemo(() => Array.from({ length: 160 }, (_, i) => i), []);

  return (
    <section className={styles.section} id="decode" data-pixel-bridge>
      <div className={styles.pin} data-pixel-pin>
        <div className={styles.reveal} data-pixel-reveal>
          <p className={styles.status} data-pixel-status>
            ENCRYPTED
          </p>
          <h2 className={styles.title}>
            Главный сигнал —
            <span> сайты.</span>
          </h2>
          <p className={styles.body}>
            Лендинги, портфолио и промо со scroll-experience. Брендинг и графика
            держат тот же характер офлайн.
          </p>
          <ul className={styles.chips}>
            <li>
              <strong>01 WEB</strong>
              <span>sites · motion · UI</span>
            </li>
            <li>
              <strong>02 BRAND</strong>
              <span>identity · systems</span>
            </li>
            <li>
              <strong>03 GFX</strong>
              <span>key visual · print</span>
            </li>
          </ul>
        </div>

        <div className={styles.mask} data-pixel-mask aria-hidden="true">
          <div className={styles.grid}>
            {cells.map((i) => (
              <span key={i} className={styles.cell} data-pixel-cell />
            ))}
          </div>
          <p className={styles.caption} data-pixel-caption>
            SIGNAL / LOCKED
          </p>
        </div>
      </div>
    </section>
  );
}
