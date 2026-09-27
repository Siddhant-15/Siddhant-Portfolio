/**
 * Mutable interaction bus. Read inside useFrame / GSAP tickers.
 * Never store these in React state — they change every frame.
 */
export const bus = {
  mouse: { nx: 0, ny: 0, vx: 0, vy: 0, active: false },
  scroll: { y: 0, velocity: 0, direction: 1 as 1 | -1 },
  /** Continuous 0..8 — which particle formation the field is in. */
  stage: 0,
  pulse: 0,
  menu: 0,
  hoverNode: -1,
  belt: 0,
  contact: 0,
  intel: { form: 0, word: 0, disp: 0, conv: 0 },
  anchors: { start: [] as number[], end: [] as number[] }
};

export type Bus = typeof bus;
