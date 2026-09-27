import { useRef } from "react";
import { gsap } from "../lib/gsap";
import { useApp } from "../context";
import { useRunway } from "../hooks/useRunway";
import { ACCENT, LEN, RAIL_X, ROLE_STEP, railY } from "../lib/layout";
import { experiences } from "../data/experience";
import styles from "./Experience.module.css";

/**
 * Experience → Skills: a pinned timeline that grows down its rail as you scroll,
 * one role at a time. On exit the rail dots fly to the centre of the orbital
 * universe that assembles in the next section.
 */
export default function Experience() {
  const { env } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  const N = experiences.length;
  const top = railY(0, N) * 100;
  const height = (railY(N - 1, N) - railY(0, N)) * 100;

  useRunway(ref, LEN.experience, env.reduced, (tl, { el, stage, desktop, L }) => {
    const line = el.querySelector("[data-line]");
    const fill = el.querySelector("[data-fill]");
    const dots = gsap.utils.toArray<HTMLElement>("[data-dot]", el);
    const marks = gsap.utils.toArray<HTMLElement>("[data-mark]", el);
    const roles = gsap.utils.toArray<HTMLElement>("[data-role]", el);
    gsap.set(fill, { scaleY: 0, transformOrigin: "50% 0%" });
    gsap.set(line, { transformOrigin: "50% 0%" });

    tl.fromTo(line, { scaleY: 0 }, { scaleY: 1, duration: 100, ease: "power2.out" }, 0)
      .fromTo(dots, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 30, stagger: 5 }, 60);

    roles.forEach((r, i) => {
      const s = 40 + ROLE_STEP * i;
      tl.fromTo(r, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 30, ease: "power2.out" }, s)
        .to(marks[i], { backgroundColor: ACCENT, scale: 1.6, duration: 15 }, s - 8);
      if (i > 0) tl.to(fill, { scaleY: i / (N - 1), duration: 40, ease: "power2.inOut" }, s - 25);
      if (i < N - 1) {
        tl.to(r, { autoAlpha: 0, y: -50, duration: 30, ease: "power2.in" }, s + ROLE_STEP - 30)
          .to(marks[i], { scale: 1, duration: 20 }, s + ROLE_STEP - 10);
      }
    });

    tl.to(roles[N - 1], { autoAlpha: 0, y: -50, duration: 50, ease: "power2.in" }, L - 100)
      .to(fill, { autoAlpha: 0, duration: 40 }, L - 100)
      .to(line, { scaleY: 0, transformOrigin: "50% 100%", duration: 80, ease: "power3.in" }, L - 100);

    if (desktop) {
      dots.forEach((d, i) => {
        tl.to(d, {
          x: () => stage.offsetWidth * (0.68 - RAIL_X),
          y: () => stage.offsetHeight * (0.5 - railY(i, N)),
          scale: 0.3,
          autoAlpha: 0,
          duration: 80,
          ease: "power3.in"
        }, L - 100 + i * 5);
      });
    } else {
      tl.to(dots, { autoAlpha: 0, duration: 60 }, L - 100);
    }
  });

  return (
    <div ref={ref} className={styles.exp}>
      <div className={styles.rail} aria-hidden="true">
        <span data-line className={styles.line} />
        <span data-fill className={styles.fill} style={{ top: `${top}%`, height: `${height}%` }} />
        {experiences.map((r, i) => (
          <span key={r.role} data-dot className={styles.dot} style={{ top: `${railY(i, N) * 100}%` }}>
            <i data-mark />
          </span>
        ))}
      </div>
      <div className={styles.panels}>
        {experiences.map((r, i) => (
          <article key={r.role} data-role className={styles.role}>
            <p className={styles.step}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {i === N - 1 && <em>Now</em>}
            </p>
            <h3>{r.role}</h3>
            {r.company && <p className={styles.company}>{r.company}</p>}
            {r.period && <p className={styles.period}>{r.period}</p>}
            <p className={styles.summary}>{r.summary}</p>
            <ul className={styles.stack} aria-label="Stack">
              {r.stack.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
