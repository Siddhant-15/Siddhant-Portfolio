import type { Experience } from "../types";

/** Chronological (earliest → now), taken directly from the resume. */
export const experiences: Experience[] = [
  {
    role: "Graduate Trainee Engineer",
    company: "Cubastion Consulting",
    period: "Oct 2023 – Jan 2024",
    summary: "Built and shipped responsive single-page apps in React, with reusable UI components and accessibility-minded, cross-browser front-end work in an agile team.",
    stack: ["React", "JavaScript", "HTML", "CSS", "Git"]
  },
  {
    role: "Full Stack Developer",
    company: "Miimansa AI Systems",
    period: "Mar 2025 – Present",
    summary: "Building and scaling a full-stack auto-annotation platform: async FastAPI + SQLAlchemy + WebSocket services on the backend, React + Zustand + React Query on the front end, containerized with Docker and backed by AWS S3.",
    stack: ["React", "FastAPI", "PostgreSQL", "WebSockets", "Docker", "AWS S3", "Zustand"]
  }
];
