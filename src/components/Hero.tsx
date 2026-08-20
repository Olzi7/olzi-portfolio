import { useEffect, useRef, useState, type RefObject } from "react";
import { useClock } from "../hooks/useClock";
import { Magnetic } from "./Magnetic";
import styles from "./Hero.module.css";

type HeroProps = {
  heroRef: RefObject<HTMLElement | null>;
};

export function Hero({ heroRef }: HeroProps) {
  const time = useClock();
  const tiltRef = useRef<HTMLDivElement>(null);
  const [egg, setEgg] = useState(false);
  const clicks = useRef(0);

  useEffect(() => {
    const el = tiltRef.current;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || !fine || reduced) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      el.style.transform = `translate3d(${dx * 16}px, ${dy * 12}px, 0) rotate(${dx * 2.4}deg)`;
    };

    const onLeave = () => {
      el.style.transform = "translate3d(0,0,0) rotate(0deg)";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const onHearts = () => {
    clicks.current += 1;
    if (clicks.current >= 3) setEgg(true);
  };

  return (
    <section className={styles.hero} ref={heroRef} id="top" aria-label="Hero">
      <div className={styles.hudTop}>
        <span className={styles.hudLabel}>SEMENOVA</span>
        <span className={styles.hudMark} aria-hidden="true" />
        <span className={styles.hudClock} aria-live="polite">
          {time}
        </span>
      </div>

      <div className={styles.main}>
        <div className={styles.copy}>
          <p className={styles.kicker}>WEB FIRST</p>
          <h1 className={styles.headline}>
            <span className={styles.solid}>Сайты.</span>
            <span className={styles.outlineWord}>Которые</span>
            <span className={styles.outlineWord}>запоминают.</span>
          </h1>
          <div className={styles.actions}>
            <Magnetic>
              <a
                className={styles.primary}
                href="https://www.behance.net/13a2b995"
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
              >
                СМОТРЕТЬ РАБОТЫ
              </a>
            </Magnetic>
            <Magnetic>
              <a
                className={styles.secondary}
                href="https://t.me/olzi7"
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
              >
                ОБСУДИТЬ САЙТ
              </a>
            </Magnetic>
          </div>
        </div>

        <div className={styles.stage}>
          <p className={styles.outline} data-hero-outline aria-hidden="true">
            olzi
          </p>
          <div className={styles.portraitWrap} data-hero-portrait>
            <div className={styles.portraitTilt} ref={tiltRef}>
              <img
                className={styles.portrait}
                src="/hero.png"
                alt="Olga Cemenova"
                width={900}
                height={1200}
              />
              <div className={styles.portraitFade} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.hudBottom}>
        <button
          type="button"
          className={styles.hearts}
          onClick={onHearts}
          aria-label="Signal hearts"
        >
          <span />
          <span />
          <span />
          {egg ? <em className={styles.egg}>SIGNAL LOCKED</em> : null}
        </button>
        <a className={styles.scrollCue} href="#decode">
          SCROLL
        </a>
      </div>
    </section>
  );
}
