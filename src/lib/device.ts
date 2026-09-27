export type Tier = "desktop" | "tablet" | "mobile";

export const isCoarse = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

export const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function getTier(): Tier {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 700) return "mobile";
  if (w < 1100 || isCoarse()) return "tablet";
  return "desktop";
}

/** Adaptive particle budgets (brief: 10–25k / 5–10k / 1.5–4k). */
export const PARTICLES: Record<Tier, number> = { desktop: 20000, tablet: 8000, mobile: 3000 };

export function detectWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}
