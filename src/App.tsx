import { useCallback, useEffect, useRef, useState } from "react";
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
import styles from "./App.module.css";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export default function App() {
  const [booted, setBooted] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const onBooted = useCallback(() => setBooted(true), []);

  useEffect(() => {
    document.documentElement.classList.toggle("is-booting", !booted);
    return () => document.documentElement.classList.remove("is-booting");
  }, [booted]);

  useLenis(booted);

  useEffect(() => {
    if (!booted) return;

    const mobile = window.matchMedia("(max-width: 720px)").matches;
    const observers: IntersectionObserver[] = [];

    const ctx = gsap.context(() => {
      const watch = (el: Element | null, play: () => void) => {
        if (!el) return;
        const io = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            play();
            io.disconnect();
          },
          { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
        );
        io.observe(el);
        observers.push(io);
      };

      const outline = document.querySelector("[data-hero-outline]");
      const portrait = document.querySelector("[data-hero-portrait]");

      if (!mobile && outline && portrait && heroRef.current) {
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
        const revealPixel = (p: number) => {
          if (status) {
            status.textContent =
              p < 0.18 ? "ENCRYPTED" : p < 0.72 ? "DECODING" : "ACCESS GRANTED";
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
        };

        if (mobile) {
          watch(pixelPin, () => {
            const tl = gsap.timeline({
              onUpdate: () => revealPixel(tl.progress()),
            });
            tl.to(cells, {
              opacity: 0,
              scale: 0.12,
              ease: "power2.out",
              duration: 0.7,
              stagger: { amount: 0.85, from: "random" },
            });
            if (mask) tl.to(mask, { opacity: 0, duration: 0.35 }, "-=0.15");
          });
        } else {
          gsap.to(cells, {
            opacity: 0,
            scale: 0.12,
            ease: "none",
            stagger: { amount: 0.9, from: "random" },
            scrollTrigger: {
              trigger: pixelPin,
              start: "top top",
              end: "+=175%",
              pin: true,
              scrub: 0.65,
              anticipatePin: 1,
              onUpdate: (self) => revealPixel(self.progress),
            },
          });
        }
      }

      const briefing = document.querySelector("[data-briefing]");
      if (mobile) {
        watch(briefing, () => {
          gsap.from("[data-reveal]", {
            y: 28,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
          });
        });
      } else {
        gsap.from("[data-reveal]", {
          y: 36,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: "[data-briefing]",
            start: "top 80%",
            once: true,
          },
        });
      }

      const splitPin = document.querySelector<HTMLElement>("[data-split-pin]");
      const beam = document.querySelector<HTMLElement>("[data-split-beam]");
      const brand = document.querySelector<HTMLElement>("[data-split-brand]");
      const gfx = document.querySelector<HTMLElement>("[data-split-gfx]");
      const splitStatus = document.querySelector("[data-split-status]");
      const webWord = document.querySelector<HTMLElement>("[data-split-web] h2");

      if (splitPin && beam && brand && gfx) {
        gsap.set(brand, { opacity: 0.3 });
        gsap.set(gfx, { opacity: 0.18 });

        const dim = {
          color: "rgba(245, 245, 245, 0.22)",
          textShadow: "0 0 0 rgba(255, 72, 146, 0)",
        };
        const lit = {
          color: "#ff4892",
          textShadow: "0 0 24px rgba(255, 72, 146, 0.45)",
        };
        if (webWord) gsap.set(webWord, dim);

        const flickerWeb = () => {
          if (!webWord) return;
          const flicker = gsap.timeline({ defaults: { ease: "none" } });
          flicker.to(webWord, { ...lit, duration: 0.08 });
          flicker.to(webWord, { ...lit, duration: 0.18 });
          flicker.to(webWord, { ...dim, duration: 0.08 });
          flicker.to(webWord, { ...dim, duration: 0.2 });
          flicker.to(webWord, { ...lit, duration: 0.14, ease: "power2.out" });
        };

        if (mobile) {
          watch(splitPin, () => {
            flickerWeb();
            gsap.to(beam, {
              scaleX: 1,
              scaleY: 1,
              duration: 0.55,
              ease: "power2.out",
            });
            gsap.to(brand, { opacity: 1, duration: 0.4, delay: 0.2 });
            gsap.to(gfx, { opacity: 1, duration: 0.4, delay: 0.4 });
            if (splitStatus) splitStatus.textContent = "CLEARANCE · FULL ACCESS";
          });
        } else {
          if (webWord) {
            ScrollTrigger.create({
              trigger: splitPin,
              start: "top 52%",
              once: true,
              onEnter: flickerWeb,
            });
          }

          const splitTl = gsap.timeline({
            scrollTrigger: {
              trigger: splitPin,
              start: "top top",
              end: "+=150%",
              pin: true,
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
          splitTl.to(beam, { scaleY: 1, ease: "none", duration: 0.45 }, 0);
          splitTl.to(brand, { opacity: 1, duration: 0.22 }, 0.3);
          splitTl.to(gfx, { opacity: 1, duration: 0.22 }, 0.58);
        }
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

      const comms = document.querySelector("[data-comms]");
      if (mobile) {
        watch(comms, () => {
          gsap.from("[data-comms-item]", {
            y: 22,
            opacity: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: "power3.out",
          });
        });
      } else {
        gsap.from("[data-comms-item]", {
          y: 28,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: "[data-comms]",
            start: "top 80%",
            once: true,
          },
        });
      }
    });

    const refresh = () => ScrollTrigger.refresh();
    const t1 = window.setTimeout(refresh, 120);
    const t2 = window.setTimeout(refresh, 480);
    const onOrient = () => window.setTimeout(refresh, 280);
    window.addEventListener("orientationchange", onOrient);
    if (!mobile) window.addEventListener("resize", refresh);

    return () => {
      observers.forEach((io) => io.disconnect());
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("orientationchange", onOrient);
      window.removeEventListener("resize", refresh);
      ctx.revert();
    };
  }, [booted]);

  return (
    <div className={styles.app}>
      {!booted ? (
        <Preloader onDone={onBooted} />
      ) : null}
      <CustomCursor />
      <ScrollProgress enabled={booted} />
      <a className={styles.skip} href="#decode">
        Skip to content
      </a>
      <Hero heroRef={heroRef} reveal={booted} />
      <PixelBridge />
      <Briefing />
      <SplitField />
      <Archive />
      <Comms />
    </div>
  );
}
