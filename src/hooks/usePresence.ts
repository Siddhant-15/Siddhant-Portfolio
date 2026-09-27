import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import type { gsap } from "../lib/gsap";

type Anim = gsap.core.Timeline | gsap.core.Tween;

/** Keeps a layer mounted until its exit animation has finished. */
export function usePresence(open: boolean, ref: RefObject<HTMLElement | null>, run: (el: HTMLElement, dir: "in" | "out") => Anim) {
  const [mounted, setMounted] = useState(open);
  useEffect(() => { if (open) setMounted(true); }, [open]);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!mounted || !el) return;
    if (open) run(el, "in");
    else run(el, "out").eventCallback("onComplete", () => setMounted(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mounted]);
  return mounted;
}
