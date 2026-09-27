import { useRef } from "react";
import { gsap } from "../lib/gsap";
import { useApp } from "../context";
import { useRunway } from "../hooks/useRunway";
import { LEN } from "../lib/layout";
import { layoutIn } from "../lib/dom";
import { aboutLines, aboutNote } from "../data/principles";
import styles from "./About.module.css";

export default function About() {
  const { env } = useApp();
  const ref = useRef<HTMLDivElement>(null);

  useRunway(ref, LEN.about, env.reduced, (tl, { el, stage, desktop }) => {
    const title = el.querySelector<HTMLElement>("[data-title]");
    const lines = gsap.utils.toArray<HTMLElement>("[data-line]", el);
    const note = el.querySelector<HTMLElement>("[data-note]");

    // Initial hidden state
    gsap.set(title, {
      autoAlpha: 0,
      y: 20,
    });

    gsap.set(lines, {
      autoAlpha: 0,
      y: 60,
      scale: 1.04,
      transformOrigin: "50% 50%",
    });

    gsap.set(note, {
      autoAlpha: 0,
      y: 30,
    });

    // Same title entrance as "How I think"
    tl.fromTo(
      title,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 40 },
      60
    );

    // About statements appear after the title
    tl.fromTo(
      lines,
      { autoAlpha: 0, y: 60, scale: 1.04 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 45,
        stagger: 8,
        ease: "power3.out",
      },
      90
    );

    // Supporting text
    tl.fromTo(
      note,
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 30,
        ease: "power3.out",
      },
      120
    );

    // Title fades before transition to Philosophy
    tl.to(
      title,
      {
        autoAlpha: 0,
        duration: 30,
      },
      160
    );

    tl.to(
      note,
      {
        autoAlpha: 0,
        y: -20,
        duration: 25,
        ease: "power2.in",
      },
      160
    );

    if (desktop) {
      lines.forEach((line, i) => {
        const at = 170 + i * 6;

        tl.to(
          line,
          {
            x: () =>
              stage.offsetWidth * (0.125 + 0.25 * i) -
              layoutIn(line, stage).cx,
            y: () =>
              stage.offsetHeight * 0.38 -
              layoutIn(line, stage).cy,
            scaleX: 0.012,
            scaleY: 0.1,
            duration: 70,
            ease: "power3.inOut",
          },
          at
        ).to(
          line,
          {
            autoAlpha: 0,
            duration: 8,
          },
          at + 64
        );
      });
    } else {
      tl.to(
        lines,
        {
          autoAlpha: 0,
          y: -60,
          duration: 70,
          stagger: 6,
          ease: "power2.in",
        },
        170
      );
    }
  });

  return (
    <div ref={ref} className={styles.about}>
      <h2 data-title className={styles.title}>
        About
      </h2>

      <div className={styles.lines}>
        {aboutLines.map((line) => (
          <p key={line} data-line className={styles.line}>
            {line}
          </p>
        ))}
      </div>

      <p data-note className={styles.note}>
        {aboutNote}
      </p>
    </div>
  );
}