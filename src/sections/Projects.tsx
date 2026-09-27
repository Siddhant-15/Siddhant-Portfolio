import { useEffect, useRef, useState } from "react";
import { useApp } from "../context";
import { useRunway } from "../hooks/useRunway";
import { LEN } from "../lib/layout";
import { projects } from "../data/projects";
import { ProjectsScene } from "../three/ProjectsScene"
import styles from "./Projects.module.css";

/**
 * Weichie-style Projects, WebGL version:
 * Cards are rendered as curved (cylindrically bent) meshes in a Three.js
 * scene, evenly spaced around a circle, with the whole stage continuously
 * rotating — matching the reference carousel's bowed-card look, which
 * flat CSS 3D transforms can't produce.
 *
 * When there are fewer projects than ProjectsScene's minimum slot count,
 * the ring is padded by cycling back through the project list
 * (1,2,3,4,5,1,2,3,4,5,...) so spacing stays tight regardless of how many
 * real projects exist.
 */
export default function Projects() {
  const { env, openProject } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<ProjectsScene | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  // ── Mount the WebGL scene once ──
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new ProjectsScene({
      canvas: canvasRef.current,
      projects,
      reduced: env.reduced,
      onHoverChange: setHovered,
      onSelect: (index, rect) => {
        openProject(projects[index], rect);
      },
    });
    sceneRef.current = scene;

    return () => {
      scene.dispose();
      sceneRef.current = null;
    };
    // Intentionally mount once; reduced-motion changes are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Keep spin state in sync with reduced-motion preference ──
  useEffect(() => {
    sceneRef.current?.setSpinning(!env.reduced);
  }, [env.reduced]);

  // Scroll only handles entrance + soft exit of the whole canvas + headline
  useRunway(ref, LEN.projects, env.reduced, (tl, { el, L }) => {
    const head = el.querySelector("[data-headline]");
    const canvasWrap = el.querySelector("[data-canvas-wrap]");

    tl.fromTo(
      head,
      { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: 32, ease: "power2.out" },
      0
    ).to(head, { autoAlpha: 0, y: -16, duration: 24, ease: "power2.in" }, 70);

    tl.fromTo(
      canvasWrap,
      { autoAlpha: 0, y: 80, scale: 0.92 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 48, ease: "power3.out" },
      10
    );

    tl.to(
      canvasWrap,
      { autoAlpha: 0, y: -50, scale: 0.95, duration: 50, ease: "power2.in" },
      L - 70
    );
  });

  return (
    <div ref={ref} className={styles.wrap}>
      <p data-headline className={styles.headline}>
        Selected work
      </p>

      <div data-canvas-wrap className={styles.canvasWrap}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          data-cursor={hovered !== null ? "VIEW CASE STUDY" : undefined}
        />
      </div>

      {/*
        The cards are canvas pixels now, so real interactive elements live
        here instead: visually hidden, but present for keyboard nav,
        screen readers, and crawlers/SEO.
      */}
      <ul className={styles.a11yList} aria-label="Selected work">
        {projects.map((p) => (
          <li key={p.slug}>
            <button type="button" onClick={() => openProject(p, null)}>
              {p.title} — {p.category}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}