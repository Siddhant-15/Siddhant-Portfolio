import { useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import { bus } from "../lib/bus";
import { sound } from "../lib/sound";
import { useApp } from "../context";
import { useRunway } from "../hooks/useRunway";
import { LEN, RAIL_X, railY } from "../lib/layout";
import { layoutIn } from "../lib/dom";
import { principles } from "../data/principles";
import { experiences } from "../data/experience";
import styles from "./Philosophy.module.css";

/**
 * Philosophy → Experience: four nodes (a principle each) hover over their own
 * particle clusters, then collapse onto the vertical rail the timeline grows from.
 */
export default function Philosophy() {
  const { env } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);

  const set = (i: number) => {
    setActive(i);
    bus.hoverNode = i;
    if (i >= 0) { bus.pulse = Math.max(bus.pulse, 0.35); sound.play("hover"); }
  };

  useRunway(ref, LEN.philosophy, env.reduced, (tl, { el, stage, desktop }) => {
    const nodes = gsap.utils.toArray<HTMLElement>("[data-node]", el);
    const links = gsap.utils.toArray<SVGPathElement>("[data-link]", el);
    const texts = gsap.utils.toArray<HTMLElement>("[data-ptext]", el);
    const n = experiences.length;

    tl.fromTo(el.querySelector("[data-title]"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 40 }, 60)
      .fromTo(nodes, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 30, stagger: 5, ease: "back.out(2)" }, 62)
      .fromTo(links, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 60, stagger: 10 }, 80);
    texts.forEach((t, i) => tl.fromTo(t, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 36 }, 96 + i * 8));

    tl.to(el.querySelector("[data-title]"), { autoAlpha: 0, duration: 30 }, 160);
    if (desktop) {
      tl.to(texts, { autoAlpha: 0, y: -20, duration: 30, stagger: 4 }, 162)
        .to(links, { autoAlpha: 0, duration: 40 }, 162);
      nodes.forEach((node, i) => {
        tl.to(node, {
          x: () => stage.offsetWidth * RAIL_X - layoutIn(node, stage).cx,
          y: () => stage.offsetHeight * railY(i, n) - layoutIn(node, stage).cy,
          duration: 84,
          ease: "power3.inOut"
        }, 160 + i * 4).to(node, { autoAlpha: 0, duration: 10 }, 246 + i * 2);
      });
    } else {
      tl.to([...texts, ...nodes, ...links], { autoAlpha: 0, y: -40, duration: 60, stagger: 4, ease: "power2.in" }, 170);
    }
  });

  return (
    <div ref={ref} className={styles.phil}>
      <h2 data-title className={styles.title}>How I think</h2>
      <svg className={styles.links} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <path key={i} data-link pathLength={1} strokeDasharray={1} d={`M ${12.5 + i * 25} 38 L ${37.5 + i * 25} 38`} />
        ))}
      </svg>
      <ol className={styles.cols} data-active={active}>
        {principles.map((p, i) => (
          <li
            key={p.title}
            className={styles.col}
            data-on={active === i}
            style={{ left: `${12.5 + 25 * i - 10.5}%` }}
            tabIndex={0}
            onMouseEnter={() => set(i)}
            onMouseLeave={() => set(-1)}
            onFocus={() => set(i)}
            onBlur={() => set(-1)}
            onClick={() => set(active === i ? -1 : i)}
            data-hit
          >
            <span data-node className={styles.node} />
            <div data-ptext>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
