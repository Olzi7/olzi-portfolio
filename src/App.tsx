import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Hero } from "./components/Hero";
import { PixelBridge } from "./components/PixelBridge";
import { Briefing } from "./components/Briefing";
import { SplitField } from "./components/SplitField";
import { Archive } from "./components/Archive";
import { Comms } from "./components/Comms";
import { Preloader } from "./components/Preloader";
import { CustomCursor } from "./components/CustomCursor";
import { ScrollProgress } from "./components/ScrollProgress";
import { useLenis } from "./hooks/useLenis";
import { useReducedMotion } from "./hooks/useReducedMotion";
import styles from "./App.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const reducedMotion = useReducedMotion();
  const [booted, setBooted] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const live = booted && !reducedMotion;

  useEffect(() => {
    if (reducedMotion) setBooted(true);
  }, [reducedMotion]);

  useEffect(() => {
    const booting = !booted && !reducedMotion;
    document.documentElement.classList.toggle("is-booting", booting);
    return () => document.documentElement.classList.remove("is-booting");
  }, [booted, reducedMotion]);

  useLenis(live);

  useEffect(() => {
    if (!booted) return;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set("[data-reveal], [data-comms-item]", {
          clearProps: "all",
          opacity: 1,
          y: 0,
        });
        return;
      }

      const mobile = window.matchMedia("(max-width: 720px)").matches;
      const outline = document.querySelector("[data-hero-outline]");
      const portrait = document.querySelector("[data-hero-portrait]");

      if (outline && portrait && heroRef.current) {
        gsap.set(outline, { xPercent: -50, yPercent: -50 });
        gsap.to(outline, {
          yPercent: -68,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(portrait, {
          yPercent: -8,
          scale: 1.04,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      const pixelPin = document.querySelector<HTMLElement>("[data-pixel-pin]");
      const cells = gsap.utils.toArray<HTMLElement>("[data-pixel-cell]");
      const status = document.querySelector("[data-pixel-status]");
      const caption = document.querySelector("[data-pixel-caption]");
      const mask = document.querySelector<HTMLElement>("[data-pixel-mask]");

      if (pixelPin && cells.length) {
        gsap.to(cells, {
          opacity: 0,
          scale: 0.12,
          ease: "none",
          stagger: { amount: 0.9, from: "random" },
          scrollTrigger: {
            trigger: pixelPin,
            start: "top top",
            end: mobile ? "+=110%" : "+=175%",
            pin: true,
            scrub: 0.65,
            anticipatePin: 1,
            onUpdate: (self) => {
              const p = self.progress;
              if (status) {
                status.textContent =
                  p < 0.18
                    ? "ENCRYPTED"
                    : p < 0.72
                      ? "DECODING"
                      : "ACCESS GRANTED";
              }
              if (caption) {
                caption.textContent =
                  p < 0.18
                    ? "SIGNAL / LOCKED"
                    : p < 0.72
                      ? "SIGNAL / DECODE"
                      : "SIGNAL / OPEN";
              }
              if (mask) {
                mask.style.opacity =
                  p > 0.9 ? String(Math.max(0, 1 - (p - 0.9) / 0.1)) : "1";
              }
            },
          },
        });
      }

      gsap.from("[data-reveal]", {
        y: 36,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-briefing]",
          start: "top 75%",
        },
      });

      const splitPin = document.querySelector<HTMLElement>("[data-split-pin]");
      const beam = document.querySelector<HTMLElement>("[data-split-beam]");
      const brand = document.querySelector<HTMLElement>("[data-split-brand]");
      const gfx = document.querySelector<HTMLElement>("[data-split-gfx]");
      const splitStatus = document.querySelector("[data-split-status]");

      if (splitPin && beam && brand && gfx) {
        gsap.set(brand, { opacity: 0.3 });
        gsap.set(gfx, { opacity: 0.18 });

        const webWord = document.querySelector<HTMLElement>("[data-split-web] h2");
        if (webWord) {
          const dim = {
            color: "rgba(245, 245, 245, 0.22)",
            textShadow: "0 0 0 rgba(255, 72, 146, 0)",
          };
          const lit = {
            color: "#ff4892",
            textShadow: "0 0 24px rgba(255, 72, 146, 0.45)",
          };
          gsap.set(webWord, dim);

          const flicker = gsap.timeline({
            paused: true,
            defaults: { ease: "none" },
          });
          flicker.to(webWord, { ...lit, duration: 0.08 });
          flicker.to(webWord, { ...lit, duration: 0.18 });
          flicker.to(webWord, { ...dim, duration: 0.08 });
          flicker.to(webWord, { ...dim, duration: 0.2 });
          flicker.to(webWord, { ...lit, duration: 0.14, ease: "power2.out" });

          ScrollTrigger.create({
            trigger: splitPin,
            start: "top 52%",
            once: true,
            onEnter: () => flicker.play(0),
          });
        }

        const splitTl = gsap.timeline({
          scrollTrigger: {
            trigger: splitPin,
            start: "top top",
            end: mobile ? "+=50%" : "+=150%",
            pin: !mobile,
            scrub: 0.7,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (!splitStatus) return;
              const p = self.progress;
              splitStatus.textContent =
                p < 0.28
                  ? "CLEARANCE · WEB LOCKED"
                  : p < 0.64
                    ? "CLEARANCE · BRAND ONLINE"
                    : "CLEARANCE · FULL ACCESS";
            },
          },
        });

        splitTl.to(
          beam,
          mobile
            ? { scaleX: 1, ease: "none", duration: 0.45 }
            : { scaleY: 1, ease: "none", duration: 0.45 },
          0,
        );
        splitTl.to(brand, { opacity: 1, duration: 0.22 }, 0.3);
        splitTl.to(gfx, { opacity: 1, duration: 0.22 }, 0.58);
      }

      const track = document.querySelector<HTMLElement>("[data-archive-track]");
      const pin = document.querySelector<HTMLElement>("[data-archive-pin]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-archive-card]");
      const canPinArchive = window.matchMedia("(min-width: 768px)").matches;

      if (track && pin && canPinArchive) {
        const getScroll = () =>
          Math.max(0, track.scrollWidth - window.innerWidth);
        let metrics = cards.map((card) => ({
          left: card.offsetLeft,
          width: card.offsetWidth,
        }));

        gsap.to(track, {
          x: () => -getScroll(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${getScroll()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onRefresh: () => {
              metrics = cards.map((card) => ({
                left: card.offsetLeft,
                width: card.offsetWidth,
              }));
            },
            onUpdate: () => {
              const origin = track.getBoundingClientRect().left;
              const cx = window.innerWidth / 2;
              const span = window.innerWidth * 0.55;
              for (let i = 0; i < cards.length; i += 1) {
                const m = metrics[i];
                const mid = origin + m.left + m.width / 2;
                const dist = Math.abs(mid - cx) / span;
                cards[i].style.transform = `scale(${1.05 - Math.min(1, dist) * 0.08})`;
              }
            },
          },
        });
      }

      gsap.from("[data-comms-item]", {
        y: 28,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-comms]",
          start: "top 75%",
        },
      });
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, [booted, reducedMotion]);

  return (
    <div className={styles.app}>
      {!booted && !reducedMotion ? (
        <Preloader onDone={() => setBooted(true)} />
      ) : null}
      <CustomCursor />
      <ScrollProgress enabled={live} />
      <a className={styles.skip} href="#decode">
        Skip to content
      </a>
      <Hero heroRef={heroRef} />
      <PixelBridge />
      <Briefing />
      <SplitField />
      <Archive />
      <Comms />
    </div>
  );
}
