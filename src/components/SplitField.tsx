import styles from "./SplitField.module.css";

export function SplitField() {
  return (
    <section className={styles.section} id="ops" data-split>
      <div className={styles.pin} data-split-pin>
        <p className={styles.label}>
          <span>02</span> OPERATIONS
        </p>
        <div className={styles.row}>
          <div className={`${styles.side} ${styles.primary}`} data-split-web>
            <p className={styles.code}>OPS.01 · PRIMARY</p>
            <h2 className={styles.word}>WEB</h2>
            <p className={styles.note}>
              Лендинги, портфолио, промо со scroll-сценой. Сайт — главный
              сигнал.
            </p>
          </div>
          <div className={styles.rail} aria-hidden="true">
            <span className={styles.beam} data-split-beam />
          </div>
          <div className={styles.stack}>
            <div className={styles.side} data-split-brand>
              <p className={styles.code}>OPS.02</p>
              <h2 className={styles.word}>BRAND</h2>
              <p className={styles.note}>
                Айдентика и носители — чтобы digital и офлайн говорили одним
                языком.
              </p>
            </div>
            <div className={styles.side} data-split-gfx>
              <p className={styles.code}>OPS.03</p>
              <h2 className={styles.word}>GFX</h2>
              <p className={styles.note}>
                Ключевой кадр, типографика, печать — характер без шаблона.
              </p>
            </div>
          </div>
        </div>
        <p className={styles.status} data-split-status>
          CLEARANCE · STANDBY
        </p>
      </div>
    </section>
  );
}
