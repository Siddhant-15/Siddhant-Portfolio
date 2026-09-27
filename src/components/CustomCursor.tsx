import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { bus } from "../lib/bus";
import { useApp } from "../context";
import styles from "./CustomCursor.module.css";

const INTERACTIVE = "[data-cursor],a,button,[role='button'],[data-magnetic]";

/**
 * Dot + lagging ring. States: default · link · label (VIEW PROJECT ↗, COPY EMAIL, …)
 * Magnetic elements (data-magnetic) pull toward the pointer; the ring rotates and
 * stretches with velocity. Not rendered on touch devices.
 */
export default function CustomCursor() {
  const { env } = useApp();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const scaler = useRef<HTMLDivElement>(null);
  const shape = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (env.coarse) return;
    const d = dot.current, r = ring.current, sc = scaler.current, sh = shape.current, lb = label.current;
    if (!d || !r || !sc || !sh || !lb) return;

    const lag = env.reduced ? 0 : 0.45;
    const dx = gsap.quickTo(d, "x", { duration: 0.06, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.06, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: lag, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: lag, ease: "power3" });
    gsap.set([d, r], { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    let magnet: HTMLElement | null = null;
    let scale = 1;
    let shown = false;
    let px = 0, py = 0;
    let stretch = 0, angle = 0;

    const setMode = (el: HTMLElement | null) => {
      const text = el?.dataset.cursor ?? "";
      const mode = text ? "label" : el ? "link" : "default";
      r.dataset.mode = mode;
      lb.textContent = text;
      scale = mode === "label" ? 3.1 : mode === "link" ? 1.7 : 1;
      gsap.to(sc, { scale, duration: 0.45, ease: "expo.out" });
      gsap.to(lb, { autoAlpha: text ? 1 : 0, duration: 0.2 });
      gsap.to(d, { scale: mode === "default" ? 1 : 0, duration: 0.25 });
    };

    const releaseMagnet = () => {
      if (magnet) gsap.to(magnet, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.4)" });
      magnet = null;
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      px = e.clientX; py = e.clientY;
      if (!shown) {
        shown = true;
        gsap.set([d, r], { x: px, y: py });
        gsap.to([d, r], { autoAlpha: 1, duration: 0.3 });
      }
      dx(px); dy(py);
      let tx = px, ty = py;
      if (magnet) {
        const b = magnet.getBoundingClientRect();
        const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
        tx = px + (cx - px) * 0.3;
        ty = py + (cy - py) * 0.3;
        gsap.to(magnet, { x: (px - cx) * 0.22, y: (py - cy) * 0.28, duration: 0.5, ease: "power3.out" });
      }
      rx(tx); ry(ty);
    };

    const over = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(INTERACTIVE) ?? null;
      const m = el && el.hasAttribute("data-magnetic") ? el : null;
      if (m !== magnet) releaseMagnet();
      magnet = m;
      setMode(el);
      if (el) bus.pulse = Math.max(bus.pulse, 0.12);
    };
    const down = () => gsap.to(sc, { scale: scale * 0.8, duration: 0.12, ease: "power2.out" });
    const up = () => gsap.to(sc, { scale, duration: 0.5, ease: "elastic.out(1,0.5)" });
    const leave = () => { shown = false; gsap.to([d, r], { autoAlpha: 0, duration: 0.2 }); };

    // velocity → rotation + stretch
    let lx = 0, ly = 0;
    const tick = () => {
      if (env.reduced || !shown) return;
      const x = gsap.getProperty(r, "x") as number;
      const y = gsap.getProperty(r, "y") as number;
      const vx = x - lx, vy = y - ly;
      lx = x; ly = y;
      const speed = Math.hypot(vx, vy);
      if (speed > 0.6) angle = (Math.atan2(vy, vx) * 180) / Math.PI;
      stretch += (Math.min(speed * 0.025, 0.45) - stretch) * 0.2;
      gsap.set(sh, { rotation: angle, scaleX: 1 + stretch, scaleY: 1 / (1 + stretch) });
    };
    gsap.ticker.add(tick);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
      releaseMagnet();
    };
  }, [env.coarse, env.reduced]);

  if (env.coarse) return null;
  return (
    <div className={styles.layer} aria-hidden="true">
      <div ref={dot} className={styles.dot} />
      <div ref={ring} className={styles.ring} data-mode="default">
        <div ref={scaler} className={styles.scaler}>
          <div ref={shape} className={styles.shape} />
        </div>
        <span ref={label} className={styles.label} />
      </div>
    </div>
  );
}
