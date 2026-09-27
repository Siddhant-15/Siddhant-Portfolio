import type { IconType } from "react-icons";

import {
  SiPython,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiFastapi,
  SiNodedotjs,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiDocker,
  SiTailwindcss,
  SiGit,
} from "react-icons/si";

import { FaAws } from "react-icons/fa6";
import { TbPlugConnected } from "react-icons/tb";

export interface TechIcon {
  name: string;
  Icon: IconType;
  color: string;
}

export const techIcons: TechIcon[] = [
  { name: "Python", Icon: SiPython, color: "#3776AB" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { name: "React", Icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", Icon: SiNextdotjs, color: "#FFFFFF" },
  { name: "FastAPI", Icon: SiFastapi, color: "#009688" },
  { name: "Node.js", Icon: SiNodedotjs, color: "#3C873A" },
  { name: "PostgreSQL", Icon: SiPostgresql, color: "#4169E1" },
  { name: "MongoDB", Icon: SiMongodb, color: "#47A248" },
  { name: "Redis", Icon: SiRedis, color: "#DC382D" },
  { name: "Docker", Icon: SiDocker, color: "#2496ED" },
  { name: "AWS S3", Icon: FaAws, color: "#FF9900" },
  { name: "WebSockets", Icon: TbPlugConnected, color: "#FF9F1C" },
  { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06B6D4" },
  { name: "Git", Icon: SiGit, color: "#F05032" },
];