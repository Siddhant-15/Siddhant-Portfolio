import { useCallback, useEffect, useRef, useState } from "react";
import { AppContext, type AppApi } from "./context";
import { useEnv } from "./hooks/useEnv";
import { useLiveSystem } from "./hooks/useLiveSystem";
import { initScroll, goTo as scrollGoTo } from "./lib/scroll";
import { ready } from "./lib/ready";
import { portfolio } from "./data/portfolio";
import { sound } from "./lib/sound";
import type { Project } from "./types";

import Scene from "./three/Scene";
import StaticField from "./three/StaticField";
import PageLoader from "./components/PageLoader";
import CustomCursor from "./components/CustomCursor";
import Navigation from "./components/Navigation";
import Runway from "./components/Runway";
import Footer from "./components/Footer";
import ResumeModal from "./components/ResumeModal";
import ProjectModal from "./components/ProjectModal";
import CommandPalette from "./components/CommandPalette";

import Hero from "./sections/Hero";
import About from "./sections/About";
import Philosophy from "./sections/Philosophy";
import Experience from "./sections/Experience";
import Skills from "./sections/Skills";
import TechOrbit from "./sections/TechOrbit";
import Projects from "./sections/Projects";
// import Intelligence from "./sections/Intelligence";
import Contact from "./sections/Contact";

import { LEN } from "./lib/layout";

export default function App() {
  const { env, failWebgl } = useEnv();
  useLiveSystem({ coarse: env.coarse, reduced: env.reduced });

  const [entered, setEntered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [origin, setOrigin] = useState<DOMRect | null>(null);

  // real readiness sources for the loader
  useEffect(() => {
    ready.add("fonts");
    ready.add("scene");
    ready.add("words");
    document.fonts.ready.then(() => ready.done("fonts")).catch(() => ready.done("fonts"));
    if (!env.webgl) { ready.done("scene"); ready.done("words"); }
  }, [env.webgl]);

  useEffect(() => {
    const stop = initScroll(!env.reduced);
    return stop;
  }, [env.reduced]);

  const goTo = useCallback((id: string) => scrollGoTo(id), []);

  const openResume = useCallback(() => setResumeOpen(true), []);
  const openProject = useCallback((p: Project, rect: DOMRect | null) => { setOrigin(rect); setProject(p); }, []);
  const closeProject = useCallback(() => setProject(null), []);
  const switchProject = useCallback((p: Project) => { setOrigin(null); setProject(p); }, []);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  const copyEmail = useCallback(async () => {
    if (!portfolio.email) return false;
    try {
      await navigator.clipboard.writeText(portfolio.email);
      sound.play("copy");
      return true;
    } catch {
      return false;
    }
  }, []);

  // "/" opens the command palette; any modal's own Escape is handled by useModal
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") { e.preventDefault(); setPaletteOpen(true); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  const api: AppApi = { env, entered, openResume, openProject, copyEmail, goTo, openPalette };

  return (
    <AppContext.Provider value={api}>
      {loading && (
        <PageLoader
          reduced={env.reduced}
          onReveal={() => setEntered(true)}
          onDone={() => setLoading(false)}
        />
      )}

      {env.webgl ? <Scene tier={env.tier} onFailed={failWebgl} /> : <StaticFieldLayer />}
      {!env.coarse && <CustomCursor />}
      <Navigation />

      <main id="main">
        <Runway id="hero" index={0} length={LEN.hero} label="Introduction"><Hero /></Runway>
        <Runway id="about" index={1} length={LEN.about} label="About"><About /></Runway>
        <Runway id="philosophy" index={2} length={LEN.philosophy} label="How I think"><Philosophy /></Runway>
        <Runway id="experience" index={3} length={LEN.experience} label="Experience"><Experience /></Runway>
        <Runway id="skills" index={4} length={LEN.skills} label="Skills"><Skills /></Runway>
        <Runway
  id="tech"
  index={5}
  length={LEN.tech}
  label="Technologies"
  interactive
>
  <TechOrbit />
</Runway>
        <Runway id="projects" index={6} length={LEN.projects} label="Selected work"><Projects /></Runway>
        {/* <Runway id="intelligence" index={7} length={LEN.intelligence} label="How it comes together"><Intelligence /></Runway> */}
        <Runway id="contact" index={8} length={LEN.contact} label="Contact"><Contact /></Runway>
      </main>
      <Footer />

      <ResumeModal open={resumeOpen} reduced={env.reduced} onClose={() => setResumeOpen(false)} />
      <ProjectModal project={project} origin={origin} reduced={env.reduced} onClose={closeProject} onSwitch={switchProject} />
      <CommandPalette open={paletteOpen} onClose={closePalette} />
    </AppContext.Provider>
  );
}

/** WebGL-unavailable / reduced-motion fallback: a calm static constellation. */
function StaticFieldLayer() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <StaticField />
    </div>
  );
}
