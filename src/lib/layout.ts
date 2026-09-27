import { projects } from "../data/projects";
import { experiences } from "../data/experience";

export const ACCENT = "#ff9f1c";

/** Rail geometry shared by Philosophy (nodes collapse onto it) and Experience (dots sit on it). */
export const RAIL_X = 0.14;
export const railY = (i: number, n: number) => 0.24 + (Math.min(i, n - 1) * 0.51) / Math.max(1, n - 1);

/** Pinned scroll length of each stage, in vh. Each includes a 100vh in-zone and 100vh out-zone. */
export const ROLE_STEP = 85;
export const LEN = {
  hero: 150,
  about: 240,
  philosophy: 260,
  experience: 140 + ROLE_STEP * experiences.length,
  skills: 260,
  tech: 220,
  projects: 260,
  intelligence: 460,
  contact: 220
} as const;
