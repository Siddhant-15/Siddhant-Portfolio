import { useEffect } from "react";
import { gsap } from "../lib/gsap";
import { bus } from "../lib/bus";
import { clamp } from "../lib/dom";
import { sound } from "../lib/sound";

/**
 * Global per-frame plumbing: pointer → bus, belt integration, pulse decay,
 * scroll-velocity sound. Runs on GSAP's ticker — no React state involved.
 */
export function useLiveSystem(opts: { coarse: boolean; reduced: boolean }) {
  useEffect(() => {
    sound.allowed = !opts.coarse;
    sound.motionAllowed = !opts.reduced;
  }, [opts.coarse, opts.reduced]);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      bus.mouse.nx = (e.clientX / window.innerWidth) * 2 - 1;
      bus.mouse.ny = -((e.clientY / window.innerHeight) * 2 - 1);
      bus.mouse.active = true;
    };
    const leave = () => { bus.mouse.active = false; };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);

    const tick = () => {
      const dt = gsap.ticker.deltaRatio() / 60;
      const v = clamp(bus.scroll.velocity / 25, -2, 2);
      bus.belt += (0.16 + v * 1.6) * dt;
      bus.pulse *= Math.exp(-dt * 2.2);
      if (bus.pulse < 0.001) bus.pulse = 0;
      sound.setScrollEnergy(Math.abs(bus.scroll.velocity) / 50);
    };
    gsap.ticker.add(tick);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
      gsap.ticker.remove(tick);
    };
  }, []);
}
