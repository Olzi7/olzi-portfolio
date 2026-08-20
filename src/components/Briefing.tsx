import { EncryptedText, useInViewOnce } from "./EncryptedText";
import styles from "./Briefing.module.css";

export function Briefing() {
  const { ref, active } = useInViewOnce<HTMLElement>(0.35);

  return (
    <section className={styles.section} id="briefing" data-briefing ref={ref}>
      <div className={styles.inner}>
        <p className={styles.label} data-reveal>
          <span>01</span> BRIEFING
        </p>
        <h2 className={styles.title}>
          <EncryptedText
            text="Olga Cemenova — сайты, которые держат характер."
            active={active}
          />
        </h2>
        <p className={styles.body} data-reveal>
          Визуальный дизайнер с фокусом на веб: лендинги, портфолио и промо со
          scroll-experience. Рядом — брендинг и графика, чтобы сайт и система
          выглядели как одна миссия.
        </p>
        <div className={styles.meta} data-reveal>
          <span className={styles.chip}>STATUS: AVAILABLE</span>
          <span className={styles.chip}>BASE: TURKEY</span>
          <span className={styles.chip}>FOCUS: WEB FIRST</span>
        </div>
      </div>
    </section>
  );
}
