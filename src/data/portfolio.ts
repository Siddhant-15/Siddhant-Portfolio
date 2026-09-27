/**
 * Single source of truth for identity + links.
 * Empty strings are hidden in the UI — nothing here is faked.
 * Put your resume at /public/resume.pdf.
 */
export const portfolio = {
  name: "Siddhant Janbandhu",
  role: "Full Stack Developer",
  statement: "I build and ship full-stack products end to end — React front ends, FastAPI backends — with forward-deployed engineering and applied GenAI as an added edge.",
  email: "siddhantjanbandhu18@gmail.com",
  phone: "+91 93078 15720",
  github: "",
  linkedin: "https://linkedin.com/in/siddhant37",
  leetcode: "",
  resume: "/resume.pdf",
  location: "Gurugram, India",
  availability: true,
  siteUrl: ""
};

export const sections = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "philosophy", label: "How I think" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "tech", label: "Tech" },
  { id: "projects", label: "Work" },
  { id: "intelligence", label: "Process" },
  { id: "contact", label: "Contact" }
] as const;

export type SectionId = (typeof sections)[number]["id"];
