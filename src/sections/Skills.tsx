import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import { bus } from "../lib/bus";
import { sound } from "../lib/sound";
import { clamp } from "../lib/dom";
import { useApp } from "../context";
import { useRunway } from "../hooks/useRunway";
import { LEN } from "../lib/layout";
import { skillGroups } from "../data/skills";
import styles from "./Skills.module.css";

const SPEEDS = [0.075, -0.055, 0.04]; // rad/s per orbit — slow, calm idle drift
const RADII = [0.24, 0.36, 0.47];   // fraction of universe width
const TILT = 0.8;                    // ellipse squash for depth

/**
 * Skills → Tech Orbit: an assembling orbital universe. Categories ride three
 * counter-rotating orbits; drag to spin them, select one to expand its
 * capabilities (and send a pulse through the particle field).
 */
export default function Skills() {
  const { env } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  const uni = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const st = useRef({ rot: [0, 0, 0], inertia: 0, dragging: false, lastX: 0, moved: 0, hover: 0 });

  const select = (i: number) => {
    if (i !== active) sound.play("hover");
    setActive(i);
    bus.pulse = 1;
  };

  // orbit motion (plain DOM writes on GSAP's ticker — no React state per frame)
  useEffect(() => {
    const u = uni.current;
    if (!u) return;
    let size = u.clientWidth;
    const ro = new ResizeObserver(() => { size = u.clientWidth; place(); });
    ro.observe(u);
    function place() {
      skillGroups.forEach((_, i) => {
        const el = nodes.current[i];
        if (!el) return;
        const r = i % 3;
        const a = st.current.rot[r] + Math.floor(i / 3) * Math.PI + r * 1.1;
        el.style.transform = `translate3d(${Math.cos(a) * RADII[r] * size}px, ${Math.sin(a) * RADII[r] * size * TILT}px, 0)`;
      });
    }
    const tick = () => {
      if (env.reduced) return;
      const s = st.current;
      const dt = gsap.ticker.deltaRatio() / 60;
      s.inertia *= 0.94;
      const speedMul = 1 - s.hover * 0.94; // ease almost to a stop while a pointer is over the universe
      for (let r = 0; r < 3; r++) s.rot[r] += (SPEEDS[r] * speedMul + s.inertia) * dt;
      place();
    };
    place();
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); ro.disconnect(); };
  }, [env.reduced]);

  // drag to spin (window listeners so button clicks still work)
  const onDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return; // pressing a label selects it, it doesn't start a drag
    const s = st.current;
    s.dragging = true; s.lastX = e.clientX; s.moved = 0;
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - s.lastX;
      s.lastX = ev.clientX;
      s.moved += Math.abs(dx);
      for (let r = 0; r < 3; r++) s.rot[r] += dx * 0.006;
      s.inertia = clamp(dx * 0.25, -4, 4);
    };
    const up = () => {
      s.dragging = false;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const onUniEnter = () => gsap.to(st.current, { hover: 1, duration: 0.4, overwrite: true });
  const onUniLeave = () => gsap.to(st.current, { hover: 0, duration: 0.7, overwrite: true });

  useRunway(ref, LEN.skills, env.reduced, (tl) => {
    const el = ref.current!;
    const rings = gsap.utils.toArray<HTMLElement>("[data-ring]", el);
    const btns = gsap.utils.toArray<HTMLElement>("[data-nodebtn]", el);
    tl.fromTo(uni.current, { scale: 0.15, rotation: -60, autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 1, duration: 100, ease: "power3.out" }, 0)
      .fromTo(rings, { scale: 0.3, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 80, stagger: 10 }, 10)
      .fromTo(btns, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 40, stagger: 6, ease: "back.out(2)" }, 50)
      .fromTo(el.querySelector("[data-copy]"), { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 50 }, 50)
      .to(el.querySelector("[data-copy]"), { autoAlpha: 0, x: -40, duration: 50 }, 150)
      .to(uni.current, { scale: 0.3, rotation: 90, autoAlpha: 0, duration: 100, ease: "power3.in" }, 160);
  });

  const group = skillGroups[active];
  return (
    <div ref={ref} className={styles.skills}>
      <div data-copy className={styles.copy}>
        <h2>A working system, not a badge wall.</h2>
        <div className={styles.detail} aria-live="polite">
          <h3 key={group.label}>{group.label}</h3>
          <ul key={group.label + "-l"}>
            {group.items.map((x, i) => <li key={x} style={{ animationDelay: `${i * 45}ms` }}>{x}</li>)}
          </ul>
        </div>
        <p className={styles.hint}>{env.coarse ? "Tap a category." : "Select a category, or drag the universe."}</p>
      </div>

      <div className={styles.uniPos}>
        <div ref={uni} className={styles.uni} data-cursor="DRAG" data-hit onPointerDown={onDown} onPointerEnter={onUniEnter} onPointerLeave={onUniLeave}>
          {RADII.map((r, i) => (
            <span key={i} data-ring className={styles.ring} style={{ left: `${50 - r * 100}%`, top: `${50 - r * TILT * 100}%`, width: `${r * 200}%`, height: `${r * TILT * 200}%` }} />
          ))}
          <span className={styles.core}><b>Stack</b></span>
          {skillGroups.map((g, i) => (
            <div key={g.label} ref={(n) => { nodes.current[i] = n; }} className={styles.pos}>
              <div className={styles.center}>
                <button
                  type="button"
                  data-nodebtn
                  className={styles.node}
                  aria-pressed={active === i}
                  onMouseEnter={() => !env.coarse && select(i)}
                  onFocus={() => select(i)}
                  onClick={() => { if (st.current.moved < 6) select(i); }}
                >
                  {g.label}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
