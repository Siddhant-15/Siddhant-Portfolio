import { useRef } from "react";
import { gsap } from "../lib/gsap";
import { bus } from "../lib/bus";
import { useApp } from "../context";
import { useRunway } from "../hooks/useRunway";
import { LEN } from "../lib/layout";
import { intelligenceWords } from "../data/principles";
import styles from "./Intelligence.module.css";

const N = intelligenceWords.length;

/**
 * "How it comes together" — the major 3D moment. Ambient particles form each
 * word of the build lifecycle in turn, disperse, then settle into a calm
 * field that carries straight into Contact. Driven entirely through bus.intel.
 */
export default function Intelligence() {
  const { env } = useApp();
  const ref = useRef<HTMLDivElement>(null);

  useRunway(ref, LEN.intelligence, env.reduced, (tl, { el, L }) => {
    const labels = gsap.utils.toArray<HTMLElement>("[data-cap]", el);
    const kicker = el.querySelector("[data-kicker]");
    const formSpan = 60;
    const holdSpan = N === 0 ? 0 : (L - 220) / N;

    tl.set(bus.intel, { form: 0, word: 0, disp: 0, conv: 0 });
    tl.fromTo(kicker, { autoAlpha: 0 }, { autoAlpha: 1, duration: 30 }, 10)
      .to(bus.intel, { form: 1, duration: formSpan, ease: "power2.out" }, 20)
      .to(kicker, { autoAlpha: 0, duration: 20 }, 40);

    intelligenceWords.forEach((_, i) => {
      const s = 90 + i * holdSpan;
      tl.fromTo(labels[i], { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 24 }, s);
      if (i < N - 1) {
        tl.to(labels[i], { autoAlpha: 0, y: -16, duration: 24 }, s + holdSpan - 30)
          .to(bus.intel, { word: i + 1, duration: holdSpan - 20, ease: "power1.inOut" }, s + 8);
      }
    });

    const disperseAt = L - 130;
    tl.to(labels[N - 1], { autoAlpha: 0, duration: 20 }, disperseAt - 10)
      .to(bus.intel, { disp: 1, duration: 60, ease: "power2.in" }, disperseAt)
      .to(bus.intel, { disp: 0, conv: 1, duration: 60, ease: "power2.inOut" }, disperseAt + 70)
      .fromTo(el.querySelector("[data-mark]"), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 40, ease: "back.out(2)" }, L - 60);
  });

  return (
    <div ref={ref} className={styles.wrap}>
      <p data-kicker className={styles.kicker}>From idea to production</p>
      {intelligenceWords.map((w) => (
        <div key={w.word} data-cap className={styles.cap}>
          <span className={styles.word}>{w.word}</span>
          <span className={styles.caption}>{w.caption}</span>
        </div>
      ))}
      <span data-mark className={styles.mark} aria-hidden="true" />
    </div>
  );
}
