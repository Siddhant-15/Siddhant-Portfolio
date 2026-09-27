import type { Principle } from "../types";

export const principles: Principle[] = [
  { title: "Understand the whole stack", text: "Front end, backend, infra — a change in one ripples through the others. I design with all three in view." },
  { title: "Design the contract", text: "APIs and schemas are promises. Define them early, keep them clean, version them honestly." },
  { title: "Make it observable", text: "A system you cannot see failing is a system you cannot fix. Logging and clear errors are features." },
  { title: "Ship the interface", text: "A solid backend only counts once a person can feel it. Interaction is part of the system, not a skin on it." }
];

export const aboutLines = [
  "I'm a full-stack developer",
  "who ships products end to end —",
  "React front ends, FastAPI backends,",
  "forward-deployed and AI-savvy."
];

export const aboutNote = "Full-stack engineer specializing in React, FastAPI and PostgreSQL, with hands-on forward-deployed engineering and applied GenAI experience on the side.";

export const intelligenceWords = [
  { word: "DESIGN", caption: "Interfaces people actually want to use." },
  { word: "BUILD", caption: "APIs, services and schemas that hold up." },
  { word: "DEPLOY", caption: "Containers, cloud storage, pipelines that just work." },
  { word: "SHIP", caption: "Where the whole stack meets a person." }
];
