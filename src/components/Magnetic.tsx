import { useRef, type ReactNode } from "react";
import { useMagnetic } from "../hooks/useMagnetic";
import styles from "./Magnetic.module.css";

type Props = {
  children: ReactNode;
  strength?: number;
};

export function Magnetic({ children, strength = 0.3 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  useMagnetic(ref, strength);

  return (
    <span className={styles.wrap} ref={ref}>
      {children}
    </span>
  );
}
