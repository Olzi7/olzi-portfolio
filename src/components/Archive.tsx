import { useEffect, useRef } from "react";
import { projects } from "../data/projects";
import styles from "./Archive.module.css";

export function Archive() {
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = pinRef.current;
    if (!el) return;

    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => {
      if (mq.matches) el.setAttribute("data-lenis-prevent", "");
      else el.removeAttribute("data-lenis-prevent");
    };

    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <section className={styles.section} id="archive" data-archive>
      <div className={styles.head}>
        <p className={styles.label}>
          <span>03</span> ARCHIVE
        </p>
        <div className={styles.headRow}>
          <h2 className={styles.title}>Selected missions</h2>
        </div>
      </div>

      <div className={styles.pin} data-archive-pin ref={pinRef}>
        <div className={styles.track} data-archive-track>
          {projects.map((project) => (
            <a
              key={project.id}
              className={styles.card}
              href={project.href}
              target="_blank"
              rel="noreferrer"
              data-archive-card
              data-cursor="hover"
              style={{ ["--accent" as string]: project.accent }}
            >
              <div className={styles.cardMeta}>
                <span>{project.id}</span>
                <span className={styles.type}>{project.type}</span>
              </div>
              <div className={styles.preview}>
                <img
                  className={styles.cover}
                  src={project.cover}
                  alt=""
                  width={680}
                  height={850}
                />
                <span className={styles.previewMark}>{project.type}</span>
              </div>
              <h3 className={styles.cardTitle}>{project.title}</h3>
              <p className={styles.cardText}>{project.blurb}</p>
              <span className={styles.link}>
                {project.href.includes("behance.net")
                  ? "OPEN FILE →"
                  : "OPEN SITE →"}
              </span>
            </a>
          ))}
        </div>
      </div>

      <p className={styles.hint} data-archive-hint>
        Scroll to unlock archive
      </p>
      <p className={styles.hintMobile}>Swipe →</p>
    </section>
  );
}
