import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";
import { bus } from "./bus";
import { clamp } from "./dom";
import { sections } from "../data/portfolio";

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

/** Measure every runway so the field can map scroll → formation stage. */
export function measureAnchors() {
  const runways = Array.from(document.querySelectorAll<HTMLElement>("[data-runway]"));
  const y = window.scrollY;
  bus.anchors.start = runways.map((r) => r.getBoundingClientRect().top + y);
  bus.anchors.end = runways.map((r) => {
    const stage = r.querySelector<HTMLElement>("[data-stage]");
    const top = r.getBoundingClientRect().top + y;
    return top + r.offsetHeight - (stage?.offsetHeight ?? window.innerHeight);
  });
}

/**
 * Stage k→k+1 transition window = the overlap [start(k+1), end(k)],
 * which is exactly where both sections are on screen. Sum of progress = stage.
 */
export function computeStage(y: number) {
  const { start, end } = bus.anchors;
  let s = 0;
  for (let k = 0; k < start.length - 1; k++) {
    const a = start[k + 1];
    const b = end[k];
    if (b <= a) continue;
    s += clamp((y - a) / (b - a));
  }
  bus.stage = s;
}

function onScroll(y: number, velocity: number, direction: number) {
  bus.scroll.y = y;
  bus.scroll.velocity = velocity;
  if (direction) bus.scroll.direction = direction > 0 ? 1 : -1;
  computeStage(y);
}

export function initScroll(smooth: boolean) {
  measureAnchors();
  const onRefresh = () => measureAnchors();
  ScrollTrigger.addEventListener("refresh", onRefresh);
  window.addEventListener("resize", onRefresh);

  let tick: ((t: number) => void) | null = null;
  let native: (() => void) | null = null;

  if (smooth) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true, syncTouch: false });
    lenis.on("scroll", (e: Lenis) => {
      ScrollTrigger.update();
      onScroll(e.scroll, e.velocity, e.direction);
    });
    tick = (t: number) => lenis?.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
  } else {
    let last = window.scrollY;
    native = () => {
      const y = window.scrollY;
      onScroll(y, y - last, y - last);
      last = y;
    };
    window.addEventListener("scroll", native, { passive: true });
    native();
  }
  onScroll(window.scrollY, 0, 1);

  return () => {
    ScrollTrigger.removeEventListener("refresh", onRefresh);
    window.removeEventListener("resize", onRefresh);
    if (tick) gsap.ticker.remove(tick);
    if (native) window.removeEventListener("scroll", native);
    lenis?.destroy();
    lenis = null;
  };
}

export function stopScroll() {
  lenis?.stop();
  document.documentElement.classList.add("scroll-locked");
}
export function startScroll() {
  lenis?.start();
  document.documentElement.classList.remove("scroll-locked");
}

/** Scroll position at which section `id` is fully assembled. */
export function goTo(id: string) {
  const i = sections.findIndex((s) => s.id === id);
  const reduced = document.documentElement.classList.contains("reduced");
  const el = document.getElementById(id);
  if (!el) return;
  let y: number;
  if (reduced || i < 0 || !bus.anchors.start.length) {
    y = el.getBoundingClientRect().top + window.scrollY;
  } else if (i === 0) {
    y = 0;
  } else {
    const mult = id === "contact" ? 2 : id === "intelligence" ? 1.05 : 1.08;
    y = bus.anchors.start[i] + window.innerHeight * mult;
  }
  if (lenis) lenis.scrollTo(y, { duration: 1.8, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
  else window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
}
