# Siddhant Janbandhu — Portfolio

A frontend-only, interactive 3D portfolio. Scrolling drives a single procedural
particle system through nine formations — one per section — so the whole site
reads as one continuous, living system rather than a stack of separate pages.

## Stack

- React 18 + TypeScript + Vite
- GSAP + ScrollTrigger (scroll-scrubbed timelines, one "runway" per section)
- Lenis (smooth scroll)
- Three.js + React Three Fiber + drei (the particle field)
- Framer-style micro-interactions via GSAP (no Framer Motion dependency needed)
- CSS Modules — no Tailwind
- Web Audio (hand-built, synthesised UI sound — no audio files)

No backend, no CMS. All content lives in `src/data/*.ts`.

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # type-check + production build → dist/
npm run preview   # preview the production build locally
```

## Editing content

Everything you're likely to want to change lives in `src/data/`:

| File | What it controls |
| --- | --- |
| `portfolio.ts` | Name, role, statement, email, GitHub/LinkedIn/LeetCode links, resume path |
| `experience.ts` | Work history shown in the Experience timeline |
| `principles.ts` | The four "How I think" principles, the About paragraph, and the four Intelligence words |
| `skills.ts` | Skill categories (orbital universe) and the tech-orbit belt items |
| `projects.ts` | Case studies shown in Selected Work — description, architecture stages, art style |

Social links and the email button hide themselves automatically when left
blank in `portfolio.ts` — nothing fake is ever shown.

### Adding your resume

Drop a real PDF at `public/resume.pdf`. The in-site resume modal checks the
file's content type before showing the viewer, so until a real PDF is there
it shows a friendly "add your resume" message instead of a broken embed.

### Adding your real project links / screenshots

`projects.ts` has empty `github` / `live` fields by default — fill them in
and the links appear in both the project panel and the case-study modal.
Project visuals are procedural SVG (see `art: "graph" | "market" | "flow"`
in each project and `src/components/ProjectArt.tsx`) — no images required,
but you're free to swap in real screenshots if you'd rather.

## How the transitions work

- `src/three/morph.glsl.ts` defines nine named particle formations (hero,
  about, philosophy, experience, skills, tech, projects, intelligence,
  contact). A single float, `uStage`, blends continuously between whichever
  two are adjacent.
- `src/lib/scroll.ts` measures every section's "runway" (`src/components/Runway.tsx`,
  a pinned sticky stage) and converts scroll position into that `uStage` float —
  consecutive runways overlap by one viewport, and that overlap is where the
  outgoing and incoming particle formations cross-fade.
- Each section's `useRunway` hook (`src/hooks/useRunway.ts`) builds its own
  scroll-scrubbed GSAP timeline for its own DOM content in that same window,
  so the on-screen elements and the particle field transform together.
- `src/three/IntelligenceField.tsx` is a second, independent particle system
  used only for the "Building Intelligence" section, where particles sample
  actual letterforms (via `src/three/sampleText.ts`) to spell DATA → MODELS →
  SYSTEMS → INTELLIGENCE, then disperse and converge into the point that
  becomes the Contact section's opening mark.

## Accessibility & performance

- Respects `prefers-reduced-motion`: pinned/scrubbed animations are replaced
  with simple, static, normally-flowing layouts (see the `:global(.reduced)`
  rules at the bottom of most section CSS files).
- Falls back to a static SVG constellation (`src/three/StaticField.tsx`) if
  WebGL is unavailable or a context is lost mid-session.
- Particle count adapts to device tier: ~20k (desktop) / ~8k (tablet) / ~3k
  (mobile) — see `src/lib/device.ts`.
- Custom cursor and drag interactions are disabled on coarse (touch) pointers.
- All interactive elements are real `button`/`a` elements with visible focus
  states, keyboard support, and `aria-*` attributes; modals trap focus and
  restore it on close.

## Sound

Off by default, never autoplays, persisted in `localStorage`. All tones are
synthesised with the Web Audio API in `src/lib/sound.ts` — there are no audio
asset files to manage.
