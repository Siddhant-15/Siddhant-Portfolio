import { useLayoutEffect, type RefObject } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { sound } from "../lib/sound";

export type RunwayCtx = { el: HTMLElement; stage: HTMLElement; desktop: boolean; L: number };

/**
 * Builds a scrubbed timeline whose time unit is 1 vh of scroll (0…L).
 * Zones: [0, 100] = incoming transition, [L-100, L] = outgoing transition.
 */
export function useRunway(
  ref: RefObject<HTMLElement | null>,
  length: number,
  reduced: boolean,
  build: (tl: gsap.core.Timeline, c: RunwayCtx) => void
) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const runway = el.closest<HTMLElement>("[data-runway]");
    const stage = el.closest<HTMLElement>("[data-stage]");
    if (!runway || !stage) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 900px)", mobile: "(max-width: 899px)" }, (c) => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: runway, start: "top top", end: "bottom bottom", scrub: true, invalidateOnRefresh: true }
        });
        build(tl, { el, stage, desktop: !!c.conditions?.desktop, L: length });
        tl.set({}, {}, length + 100); // pad to the runway's real scrolled height (length + overlap) so 1 time unit == 1vh
        tl.progress(0); // fromTo() tweens nested in a timeline don't immediateRender — force the time-0 (hidden) state now, before paint
      });
      ScrollTrigger.create({ trigger: runway, start: "top top+=2", onEnter: () => sound.play("enter"), onEnterBack: () => sound.play("enter") });
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);
}
