import type { SkillGroup } from "../types";

export const skillGroups: SkillGroup[] = [
  { label: "Languages", items: ["Python", "C++", "JavaScript", "TypeScript", "SQL"] },
  { label: "Frontend", items: ["React.js", "Next.js", "Tailwind CSS", "Zustand", "React Query"] },
  { label: "Backend", items: ["FastAPI", "Node.js", "Express.js", "REST APIs", "WebSockets", "Microservices"] },
  { label: "AI & GenAI", items: ["LLM Integration", "Prompt Engineering", "Generative AI"] },
  { label: "Databases & Storage", items: ["PostgreSQL", "MongoDB", "Redis", "AWS S3"] },
  { label: "DevOps & Tools", items: ["Docker", "Git", "GitHub", "Postman"] }
];

export const techs = [
  "PYTHON", "TYPESCRIPT", "REACT", "NEXT.JS", "FASTAPI", "NODE.JS",
  "POSTGRESQL", "MONGODB", "REDIS", "DOCKER", "AWS S3", "WEBSOCKETS", "TAILWIND", "GIT"
];
