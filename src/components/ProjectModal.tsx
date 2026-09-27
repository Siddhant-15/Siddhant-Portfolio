import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { gsap } from "../lib/gsap";
import { sound } from "../lib/sound";
import { projects } from "../data/projects";
import { useModal } from "../hooks/useModal";
import { usePresence } from "../hooks/usePresence";
import type { Project } from "../types";
import Architecture from "./Architecture";
import ProjectArt from "./ProjectArt";
import styles from "./ProjectModal.module.css";

type Props = {
  project: Project | null;
  origin: DOMRect | null;
  reduced: boolean;
  onClose: () => void;
  onSwitch: (p: Project) => void;
};

const insetFrom = (r: DOMRect | null) =>
  r
    ? `inset(${r.top}px ${window.innerWidth - r.right}px ${window.innerHeight - r.bottom}px ${r.left}px round 20px)`
    : "inset(50% 50% 50% 50% round 20px)";

/** Case study that expands out of the panel you clicked (clip-path FLIP) and stays on-site. */
export default function ProjectModal({ project, origin, reduced, onClose, onSwitch }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState<Project | null>(project);
  const open = project !== null;

  useEffect(() => { if (project) setCurrent(project); }, [project]);

  const mounted = usePresence(open, root, (el, dir) => {
    const d = reduced ? 0.01 : 1;
    const reveal = el.querySelectorAll("[data-reveal]");
    if (dir === "in") {
      sound.play("expand");
      return gsap.timeline()
        .set(el, { autoAlpha: 1 })
        .fromTo(el, { clipPath: insetFrom(origin) }, { clipPath: "inset(0px 0px 0px 0px round 0px)", duration: 1.05 * d, ease: "expo.inOut" })
        .fromTo(reveal, { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 * d, stagger: 0.07 * d, ease: "expo.out" }, 0.55 * d);
    }
    sound.play("close");
    return gsap.timeline()
      .to(reveal, { autoAlpha: 0, y: -20, duration: 0.3 * d, stagger: 0.02 * d })
      .to(el, { clipPath: insetFrom(origin), duration: 0.8 * d, ease: "expo.inOut" }, 0.1 * d)
      .set(el, { autoAlpha: 0 });
  });

  useModal(open && mounted, root, onClose);

  // switching between case studies without closing
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const el = root.current;
    if (!el || !current) return;
    gsap.fromTo(el.querySelectorAll("[data-reveal]"), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.05, ease: "expo.out" });
    el.querySelector<HTMLElement>("[data-scroller]")?.scrollTo({ top: 0 });
  }, [current?.slug]);

  if (!mounted || !current) return null;
  const idx = projects.findIndex((p) => p.slug === current.slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <div ref={root} className={styles.root} role="dialog" aria-modal="true" aria-labelledby="case-title" style={{ visibility: "hidden" }}>
      <div className={styles.bar} data-reveal>
        <span>Case study {idx + 1} of {projects.length}</span>
        <button type="button" className={styles.close} onClick={onClose} data-magnetic data-cursor="CLOSE">
          Close <X size={16} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.scroller} data-scroller data-lenis-prevent>
        <div className={styles.inner}>
          <header className={styles.header}>
            <p data-reveal className={styles.cat}>{current.category}</p>
            <h2 id="case-title" data-reveal>{current.title}</h2>
            <p data-reveal className={styles.lead}>{current.description}</p>
          </header>

          <div className={styles.art} data-reveal><ProjectArt kind={current.art} seed={idx + 3} /></div>

          <section className={styles.facts}>
            <div data-reveal><h3>Problem</h3><p>{current.problem}</p></div>
            <div data-reveal><h3>Approach</h3><p>{current.approach}</p></div>
            <div data-reveal><h3>My role</h3><p>{current.role}</p></div>
          </section>

          <section className={styles.arch} data-reveal>
            <h3>Architecture</h3>
            <Architecture nodes={current.architecture} />
          </section>

          <section className={styles.tech} data-reveal aria-label="Technologies">
            {current.technologies.map((t) => <span key={t}>{t}</span>)}
          </section>

          {(current.github || current.live) && (
            <div className={styles.links} data-reveal>
              {current.github && <a href={current.github} target="_blank" rel="noreferrer" data-cursor="VIEW GITHUB ↗" data-magnetic>GitHub <ArrowUpRight size={16} aria-hidden="true" /></a>}
              {current.live && <a href={current.live} target="_blank" rel="noreferrer" data-cursor="VIEW LIVE ↗" data-magnetic>Live <ArrowUpRight size={16} aria-hidden="true" /></a>}
            </div>
          )}

          <button type="button" className={styles.next} data-reveal data-magnetic onClick={() => { sound.play("click"); onSwitch(next); }}>
            <span>Next case study</span>
            <strong>{next.title}</strong>
          </button>
        </div>
      </div>
    </div>
  );
}
