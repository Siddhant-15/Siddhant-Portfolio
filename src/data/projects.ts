import type { Project } from "../types";

/** Edit this file to change the Selected Work section. github/live are hidden when empty. */
export const projects: Project[] = [
  {
    slug: "docusync",
    title: "DocuSync",
    category: "Real-time collaboration · Document editor",
    description:
      "A real-time collaborative document editor with conflict-free concurrent editing, live presence and AI-assisted writing.",
    role: "Full-stack engineering",
    technologies: ["React", "Node.js", "Yjs", "Socket.IO", "Redis", "Docker"],
    problem:
      "Multiple people editing the same document need instant, conflict-free synchronization and visible presence.",
    approach:
      "CRDT-based editing with Yjs, an event-driven real-time layer over Socket.IO and Redis Pub/Sub, local LLMs (LLAMA3, Mistral via Ollama) for writing assistance, and Docker Compose for deployment.",
    architecture: [
      "EDITOR",
      "YJS CRDT",
      "SOCKET.IO",
      "REDIS PUB/SUB",
      "LOCAL LLM",
      "EXPORT",
    ],
    art: "flow",
    github: "",
    live: "",
  },
  {
    slug: "algoscope",
    title: "AlgoScope",
    category: "Visualization · Algorithms",
    description:
      "An interactive sorting-algorithm visualizer covering seven-plus algorithms with real-time execution insight.",
    role: "Frontend engineering",
    technologies: ["React", "TypeScript", "Custom hooks"],
    problem:
      "Sorting algorithms are hard to reason about from code and static diagrams alone.",
    approach:
      "A modular React + TypeScript architecture with custom hooks separating algorithm logic from UI, rendering smooth 60fps animation for large datasets via requestAnimationFrame and batched state updates.",
    architecture: [
      "INPUT DATA",
      "ALGORITHM HOOK",
      "STATE BATCH",
      "ANIMATION LOOP",
      "CANVAS / UI",
    ],
    art: "graph",
    github: "",
    live: "",
  },
  {
    slug: "tout-bien",
    title: "Tout Bien",
    category: "Brand · E-commerce",
    description:
      "Premium Belgian beer brand experience with immersive product storytelling and e-commerce.",
    role: "Frontend + 3D",
    technologies: ["React", "Three.js", "GSAP", "Shopify"],
    problem: "Make a traditional product feel premium and interactive online.",
    approach:
      "3D product viewers, scroll-driven storytelling and high-fidelity product cards.",
    architecture: ["PRODUCT VIEWER", "SCROLL STORY", "SHOPIFY", "3D ASSETS"],
    art: "flow",
    github: "",
    live: "",
  },
  {
    slug: "adaptive-green",
    title: "Adaptive Green",
    category: "Web platform · Sustainability",
    description:
      "Leaders in green infrastructure and carbon-negative design solutions.",
    role: "Full-stack",
    technologies: ["Next.js", "TypeScript", "Mapbox", "CMS"],
    problem:
      "Complex environmental data needs clear, interactive presentation.",
    approach:
      "Interactive maps, project dashboards and content-driven architecture.",
    architecture: ["MAP LAYER", "CMS", "DASHBOARD", "DATA PIPELINE"],
    art: "graph",
    github: "",
    live: "",
  },
  // {
  //   slug: "aidan",
  //   title: "AIDAN",
  //   category: "AI · Interactive",
  //   description:
  //     "Friendly AI companion experience with real-time interaction and personality.",
  //   role: "Frontend + AI integration",
  //   technologies: ["React", "WebGL", "LLM API"],
  //   problem: "Make AI feel approachable and alive.",
  //   approach:
  //     "3D character, conversational UI and real-time response handling.",
  //   architecture: ["CHARACTER", "CHAT LAYER", "LLM", "STATE"],
  //   art: "flow",
  //   github: "",
  //   live: "",
  // },
  // {
  //   slug: "aidan",
  //   title: "AIDAN",
  //   category: "AI · Interactive",
  //   description:
  //     "Friendly AI companion experience with real-time interaction and personality.",
  //   role: "Frontend + AI integration",
  //   technologies: ["React", "WebGL", "LLM API"],
  //   problem: "Make AI feel approachable and alive.",
  //   approach:
  //     "3D character, conversational UI and real-time response handling.",
  //   architecture: ["CHARACTER", "CHAT LAYER", "LLM", "STATE"],
  //   art: "flow",
  //   github: "",
  //   live: "",
  // },
  // {
  //   slug: "aidan",
  //   title: "AIDAN",
  //   category: "AI · Interactive",
  //   description:
  //     "Friendly AI companion experience with real-time interaction and personality.",
  //   role: "Frontend + AI integration",
  //   technologies: ["React", "WebGL", "LLM API"],
  //   problem: "Make AI feel approachable and alive.",
  //   approach:
  //     "3D character, conversational UI and real-time response handling.",
  //   architecture: ["CHARACTER", "CHAT LAYER", "LLM", "STATE"],
  //   art: "flow",
  //   github: "",
  //   live: "",
  // },
  // {
  //   slug: "aidan",
  //   title: "AIDAN",
  //   category: "AI · Interactive",
  //   description:
  //     "Friendly AI companion experience with real-time interaction and personality.",
  //   role: "Frontend + AI integration",
  //   technologies: ["React", "WebGL", "LLM API"],
  //   problem: "Make AI feel approachable and alive.",
  //   approach:
  //     "3D character, conversational UI and real-time response handling.",
  //   architecture: ["CHARACTER", "CHAT LAYER", "LLM", "STATE"],
  //   art: "flow",
  //   github: "",
  //   live: "",
  // },
  // {
  //   slug: "aidan",
  //   title: "AIDAN",
  //   category: "AI · Interactive",
  //   description:
  //     "Friendly AI companion experience with real-time interaction and personality.",
  //   role: "Frontend + AI integration",
  //   technologies: ["React", "WebGL", "LLM API"],
  //   problem: "Make AI feel approachable and alive.",
  //   approach:
  //     "3D character, conversational UI and real-time response handling.",
  //   architecture: ["CHARACTER", "CHAT LAYER", "LLM", "STATE"],
  //   art: "flow",
  //   github: "",
  //   live: "",
  // },
  // {
  //   slug: "aidan",
  //   title: "AIDAN",
  //   category: "AI · Interactive",
  //   description:
  //     "Friendly AI companion experience with real-time interaction and personality.",
  //   role: "Frontend + AI integration",
  //   technologies: ["React", "WebGL", "LLM API"],
  //   problem: "Make AI feel approachable and alive.",
  //   approach:
  //     "3D character, conversational UI and real-time response handling.",
  //   architecture: ["CHARACTER", "CHAT LAYER", "LLM", "STATE"],
  //   art: "flow",
  //   github: "",
  //   live: "",
  // },
  // {
  //   slug: "aidan",
  //   title: "AIDAN",
  //   category: "AI · Interactive",
  //   description:
  //     "Friendly AI companion experience with real-time interaction and personality.",
  //   role: "Frontend + AI integration",
  //   technologies: ["React", "WebGL", "LLM API"],
  //   problem: "Make AI feel approachable and alive.",
  //   approach:
  //     "3D character, conversational UI and real-time response handling.",
  //   architecture: ["CHARACTER", "CHAT LAYER", "LLM", "STATE"],
  //   art: "flow",
  //   github: "",
  //   live: "",
  // },
  
];