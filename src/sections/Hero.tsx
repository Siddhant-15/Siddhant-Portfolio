import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { useApp } from "../context";
import { useRunway } from "../hooks/useRunway";
import { LEN } from "../lib/layout";
import { portfolio } from "../data/portfolio";
import SplitChars from "../components/SplitChars";
import styles from "./Hero.module.css";

/**
 * Hero → About: the headline scales up and shatters character by character
 * while the particle field expands outward into a halo around the editorial statement.
 */
export default function Hero() {
  const { env, entered, goTo } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  const [first, last] = portfolio.name.split(" ");

  useLayoutEffect(() => {
    if (env.reduced) return;
    const el = ref.current!;
    const chars = el.querySelectorAll("[data-char]");
    const fade = el.querySelectorAll("[data-fade]");
    gsap.set(chars, { yPercent: 110 });
    gsap.set(fade, { autoAlpha: 0, y: 30 });
    return () => { gsap.set([chars, fade], { clearProps: "transform,opacity,visibility" }); };
  }, [env.reduced]);

  useEffect(() => {
    if (!entered || env.reduced) return;
    const el = ref.current!;
    const lines = el.querySelectorAll(`.${styles.line}`);
    const tl = gsap.timeline();
    tl.to(el.querySelectorAll("[data-char]"), { yPercent: 0, duration: 1.5, stagger: 0.04, ease: "expo.out" })
      .to(el.querySelectorAll("[data-fade]"), { autoAlpha: 1, y: 0, duration: 1, stagger: 0.12, ease: "expo.out" }, 0.55)
      .set(lines, { overflow: "visible" }); // let characters scatter freely later
    return () => { tl.kill(); };
  }, [entered, env.reduced]);

  useRunway(ref, LEN.hero, env.reduced, (tl, { el }) => {
    const title = el.querySelector("[data-title]");
    const chars = gsap.utils.toArray<HTMLElement>("[data-char]", el);
    tl.to(el.querySelector("[data-cue]"), { autoAlpha: 0, duration: 20 }, 4)
      .to(el.querySelectorAll("[data-fade]"), { autoAlpha: 0, y: -40, duration: 60, stagger: 6, ease: "power2.in" }, 30)
      .to(title, { scale: 1.55, duration: 95, ease: "power2.in" }, 50)
      .to(chars, {
        yPercent: () => gsap.utils.random(-70, 70),
        xPercent: () => gsap.utils.random(-30, 30),
        rotation: () => gsap.utils.random(-30, 30),
        autoAlpha: 0,
        duration: 70,
        stagger: { each: 0.45, from: "center" },
        ease: "power2.in"
      }, 55);
  });

  return (
    <div ref={ref} className={styles.hero}>
      <div data-title className={styles.titleWrap}>
        <h1 className={styles.title}>
          <span className="sr-only">{portfolio.name}</span>
          <span className={styles.line}><SplitChars text={first.toUpperCase()} /></span>
          <span className={styles.line}><SplitChars text={last.toUpperCase()} /></span>
        </h1>
      </div>
      <div className={styles.foot}>
        <p data-fade className={styles.role}>FULL-STACK<br />AI ENGINEER</p>
        <p data-fade className={styles.support}>{portfolio.statement}</p>
        <button data-fade data-cue type="button" className={styles.cue} data-cursor="SCROLL" onClick={() => goTo("about")}>
          SCROLL TO EXPLORE ↓
        </button>
      </div>
    </div>
  );
}
