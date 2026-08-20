import { useClock } from "../hooks/useClock";
import { Magnetic } from "./Magnetic";
import styles from "./Comms.module.css";

export function Comms() {
  const time = useClock();

  return (
    <section className={styles.section} id="comms" data-comms>
      <div className={styles.inner}>
        <p className={styles.label} data-comms-item>
          <span>04</span> COMMS
        </p>
        <h2 className={styles.title} data-comms-item>
          Нужен сайт
          <br />
          с характером?
        </h2>
        <p className={styles.body} data-comms-item>
          Напишите — обсудим задачу, структуру и визуальный язык. Open for
          freelance &amp; full-time.
        </p>

        <div className={styles.actions} data-comms-item>
          <Magnetic strength={0.34}>
            <a
              className={styles.cta}
              href="https://t.me/olzi7"
              target="_blank"
              rel="noreferrer"
              data-cursor="hover"
            >
              Обсудить сайт
              <span className={styles.ctaPulse} aria-hidden="true" />
            </a>
          </Magnetic>
          <Magnetic>
            <a
              className={styles.secondary}
              href="https://www.behance.net/13a2b995"
              target="_blank"
              rel="noreferrer"
              data-cursor="hover"
            >
              Behance
            </a>
          </Magnetic>
        </div>

        <p className={styles.foot} data-comms-item>
          CONNECTION OPEN // olzi · SEMENOVA · {time}
        </p>
      </div>
    </section>
  );
}
