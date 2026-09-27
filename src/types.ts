export type ArtKind = "graph" | "market" | "flow";

export type Project = {
  slug: string;
  title: string;
  category: string;
  description: string;
  role: string;
  technologies: string[];
  problem: string;
  approach: string;
  /** Ordered stages shown in the interactive architecture diagram. */
  architecture: string[];
  art: ArtKind;
  github?: string;
  live?: string;
};

export type Experience = {
  role: string;
  company?: string;
  /** Leave empty to hide. Example: "2024 – 2025" */
  period?: string;
  summary: string;
  stack: string[];
};

export type Principle = { title: string; text: string };
export type SkillGroup = { label: string; items: string[] };
