import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { ready } from "../lib/ready";
import { portfolio } from "../data/portfolio";
import styles from "./PageLoader.module.css";

type Props = { reduced: boolean; onReveal: () => void; onDone: () => void };

/** Percentage is driven by real readiness (fonts, window load, first WebGL frame, text sampling). */
export default function PageLoader({ reduced, onReveal, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const t0 = performance.now();
    let shown = 0;
    let exiting = false;

    const exit = () => {
      exiting = true;
      gsap.ticker.remove(tick);
      const tl = gsap.timeline({ onComplete: onDone });
      if (reduced) {
        tl.call(onReveal).to(root.current, { autoAlpha: 0, duration: 0.3 });
        return;
      }
      tl.to(pct.current, { scale: 9, autoAlpha: 0, duration: 0.85, ease: "power4.in", transformOrigin: "100% 100%" })
        .to(`.${styles.meta}`, { autoAlpha: 0, duration: 0.3 }, 0)
        .call(onReveal, [], 0.45)
        .to(root.current, { yPercent: -100, duration: 1.0, ease: "expo.inOut" }, 0.45);
    };

    const tick = () => {
      if (exiting) return;
      const elapsed = performance.now() - t0;
      const real = elapsed > 4500 ? 1 : ready.progress(); // failsafe: never trap the visitor
      const target = Math.min(real, elapsed / 800);          // never faster than 0.8s
      shown += (target - shown) * 0.16;
      if (pct.current) pct.current.textContent = String(Math.round(shown * 100)).padStart(2, "0");
      if (bar.current) bar.current.style.transform = `scaleX(${shown})`;
      if (target >= 1 && shown > 0.985) {
        if (pct.current) pct.current.textContent = "100";
        if (bar.current) bar.current.style.transform = "scaleX(1)";
        exit();
      }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={root} className={styles.loader} role="status" aria-live="polite" aria-label="Loading">
      <span ref={bar} className={styles.bar} />
      <div className={styles.meta}>
        <strong>{portfolio.name}</strong>
        <span>{portfolio.role}</span>
      </div>
      <span ref={pct} className={styles.pct}>00</span>
    </div>
  );
}
