import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import { bus } from "../lib/bus";
import { sound } from "../lib/sound";
import { useApp } from "../context";
import { useModal } from "../hooks/useModal";
import { portfolio } from "../data/portfolio";
import SoundToggle from "./SoundToggle";
import styles from "./Navigation.module.css";

const LINKS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Work" },
  { id: "contact", label: "Contact" }
];

export default function Navigation() {
  const { env, goTo, openResume, openPalette, entered } = useApp();
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const root = useRef<HTMLElement>(null);
  const overlay = useRef<HTMLDivElement>(null);

  // compact pill on scroll · hide on scroll down, reveal on scroll up
  useEffect(() => {
    let last = 0;
    let c = false, h = false;
    const tick = () => {
      const y = bus.scroll.y;
      const dy = y - last;
      if (Math.abs(dy) > 4) {
        const nextH = dy > 0 && y > 260;
        if (nextH !== h) { h = nextH; setHidden(h); }
        last = y;
      }
      const nextC = y > 60;
      if (nextC !== c) { c = nextC; setCompact(c); }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.round((y / max) * 100) : 0;
      setProgress((prev) => (prev !== p ? p : prev));
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  const close = () => setOpen(false);
  useModal(open, root, close);

  // full-screen mobile overlay with sequential reveal + particle reaction
  useEffect(() => {
    const ov = overlay.current;
    if (!ov) return;
    const items = ov.querySelectorAll("[data-item]");
    gsap.killTweensOf([ov, items, bus]);
    if (open) {
      sound.play("open");
      gsap.to(bus, { menu: 1, duration: 0.9, ease: "power2.out" });
      bus.pulse = 0.8;
      gsap.set(ov, { visibility: "visible" });
      gsap.fromTo(ov, { clipPath: "circle(0% at 92% 4%)" }, { clipPath: "circle(150% at 92% 4%)", duration: env.reduced ? 0.01 : 0.9, ease: "expo.inOut" });
      gsap.fromTo(items, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: env.reduced ? 0.01 : 0.8, ease: "expo.out", stagger: 0.07, delay: 0.25 });
    } else {
      gsap.to(bus, { menu: 0, duration: 0.7 });
      gsap.to(ov, { clipPath: "circle(0% at 92% 4%)", duration: env.reduced ? 0.01 : 0.6, ease: "expo.inOut", onComplete: () => { gsap.set(ov, { visibility: "hidden" }); } });
    }
  }, [open, env.reduced]);

  const nav = (id: string) => {
    sound.play("click");
    const wasOpen = open;
    setOpen(false);
    window.setTimeout(() => goTo(id), wasOpen ? 350 : 0);
  };

  return (
    <header ref={root} className={styles.nav} data-compact={compact} data-hidden={hidden && !open} data-entered={entered}>
      <div className={styles.bar}>
        <button type="button" className={styles.brand} onClick={() => nav("hero")} aria-label={`${portfolio.name}, back to top`} data-magnetic>
          <span className={styles.mark}>SJ</span>
          <span className={styles.name}>{portfolio.name}</span>
        </button>

        <nav className={styles.links} aria-label="Primary">
          {LINKS.map((l) => (
            <button key={l.id} type="button" onClick={() => nav(l.id)} data-magnetic>{l.label}</button>
          ))}
        </nav>

        <div className={styles.actions}>
          {!env.coarse && (
            <button type="button" className={styles.kbd} onClick={openPalette} aria-label="Open quick navigation (press /)" data-magnetic>/</button>
          )}
          {!env.coarse && <SoundToggle />}
          <button type="button" className={styles.resume} data-cursor="RESUME" data-magnetic onClick={() => { sound.play("click"); openResume(); }}>Resume</button>
          <button
            type="button"
            className={styles.menuBtn}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span />
          </button>
        </div>
        <span className={styles.progress} style={{ transform: `scaleX(${progress / 100})` }} aria-hidden="true" />
      </div>

      <div id="mobile-menu" ref={overlay} className={styles.overlay} aria-hidden={!open} role="dialog" aria-label="Menu">
        <ul>
          {LINKS.map((l) => (
            <li key={l.id}>
              <button type="button" data-item onClick={() => nav(l.id)}>{l.label}</button>
            </li>
          ))}
          <li className={styles.overlayResume}>
            <button type="button" data-item onClick={() => { close(); openResume(); }}>Resume</button>
          </li>
        </ul>
        <p className={styles.overlayNote} data-item>{portfolio.role}</p>
      </div>
    </header>
  );
}
