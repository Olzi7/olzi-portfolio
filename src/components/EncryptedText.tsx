import { useEffect, useRef, useState } from "react";
import styles from "./EncryptedText.module.css";

type Props = {
  text: string;
  className?: string;
  active?: boolean;
};

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%*<>/";
const KEEP = /[\s.,—–\-·:/«»!?]/;

export function EncryptedText({ text, className, active = true }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !active) {
      if (el) el.textContent = text;
      return;
    }

    let frame = 0;
    let cancelled = false;
    const duration = Math.max(36, Math.round(text.length * 1.15));
    const tick = () => {
      if (cancelled) return;
      frame += 1;
      const progress = Math.min(1, frame / duration);
      const reveal = Math.floor(progress * text.length);
      let out = "";
      for (let i = 0; i < text.length; i += 1) {
        if (KEEP.test(text[i])) {
          out += text[i];
        } else if (i < reveal) {
          out += text[i];
        } else {
          out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
      }
      el.textContent = out;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = text;
    };

    const id = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [text, active]);

  return (
    <span ref={ref} className={`${styles.text} ${className ?? ""}`}>
      {text}
    </span>
  );
}

export function useInViewOnce<T extends HTMLElement = HTMLElement>(
  threshold = 0.4,
) {
  const ref = useRef<T | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, active };
}
