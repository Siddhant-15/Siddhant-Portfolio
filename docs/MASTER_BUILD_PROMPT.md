# MASTER BUILD PROMPT — PREMIUM INTERACTIVE SIDDHANT JANBANDHU PORTFOLIO

## ROLE

Act as a world-class creative developer, interaction designer, motion designer, frontend architect and UX engineer.

Build a **complete frontend-only, production-quality, highly interactive portfolio website** for:

**Siddhant Janbandhu**
**Full-Stack AI/ML Engineer**

This is not a mockup and not a static landing page. Deliver a runnable project with all source files, dependencies, configuration, responsive behavior and real interactions.

The uploaded original specification is the base requirement. Preserve its core intent, but apply all improvements below. fileciteturn0file0L5-L29

---

# 1. NON-NEGOTIABLE OUTPUT

Create a complete **frontend-only** project.

Preferred stack:

- React
- TypeScript
- Vite
- GSAP
- ScrollTrigger
- Lenis
- Three.js
- React Three Fiber
- @react-three/drei
- Lucide React
- CSS Modules or well-organized CSS
- Web Audio API for micro-sounds
- no backend
- no database
- no authentication

The project must run with:

```bash
npm install
npm run dev
```

and build with:

```bash
npm run build
```

Do not stop at a visual concept.

---

# 2. FULL CUSTOMIZABILITY

The site must be extremely easy to customize.

Create a central configuration/data layer such as:

```text
src/
  data/
    portfolio.ts
    projects.ts
    experience.ts
    skills.ts
    links.ts
```

At minimum, the central portfolio configuration must control:

```ts
name
role
email
github
linkedin
leetcode
resume
location
accent
availability
```

Projects, experience, skills and technology lists must also be data-driven.

Do not hard-code personal URLs throughout components.

A user should be able to replace their portfolio information without touching animation or UI logic.

---

# 3. REFERENCE WEBSITES

Use the supplied references strictly as **interaction, pacing and quality inspiration**:

- https://weichie.com/
- https://crency.agency/
- https://www.noth.in/
- https://www.cutthecode.com/

Do NOT copy:

- layouts
- text
- branding
- images
- exact animations
- visual identity
- source code

Extract principles instead.

Reference qualities to study:

### Weichie
- project-led storytelling
- restrained premium layout
- continuous navigation
- strong typography
- work presentation

### Crency
- smooth scrolling
- large type
- interactive sections
- cursor behavior
- animated storytelling
- polished transitions

### Nothin'
- memorable entrance
- experimental typography
- visual surprise
- sound-aware experience
- unusual transitions
- use of empty space

### Cut the Code
- polished navigation
- strong project presentation
- service/skill storytelling
- responsive quality
- high production polish

The resulting site must have its own visual identity.

---

# 4. CORE EXPERIENCE — ONE CONTINUOUS WORLD

This is the most important requirement.

The site must **not feel like separate sections stacked vertically**.

When the user scrolls, each section should feel like it is transforming into the next.

Think:

```text
USER SCROLLS
      ↓
CURRENT VISUAL REACTS
      ↓
TYPOGRAPHY CHANGES
      ↓
CURRENT ELEMENTS MORPH
      ↓
NEW ELEMENTS ENTER
      ↓
OLD ELEMENTS EXIT
      ↓
BACKGROUND / PARTICLE FIELD EVOLVES
      ↓
NEXT SECTION FEELS LIKE A CONTINUATION
```

The site should feel like one visual narrative.

Do not simply use:

```text
fade-in
fade-in
fade-in
fade-in
```

for every section.

---

# 5. DIFFERENT TRANSITION LANGUAGE PER SECTION

This is a strict requirement.

**Do not reuse the same transition pattern for every section.**

Each major section should have its own visual transition language.

Examples:

### Loader → Hero
Clip-path / panel reveal.

### Hero → About
Particles expand and typography compresses.

### About → Philosophy
Large text pins while supporting copy emerges through masks.

### Philosophy → Experience
Text fragments reorganize into a technical pipeline.

### Experience → Skills
Pipeline nodes spread into the skill universe.

### Skills → Tech Orbit
Skill nodes collapse into a rotating technology system.

### Tech Orbit → Projects
Technology belt decelerates and resolves into the first project.

### Project → Project
Previous project scales backward while the next project grows from depth.

### Projects → Intelligence
Project visual dissolves into particles.

### Intelligence → Contact
Particles converge into a point and typography emerges from that point.

### Contact → Footer
Typography stretches and resolves into the footer identity.

Use different techniques such as:

- clip-path
- scale
- depth
- pinning
- masks
- line reveals
- text splitting
- morphing
- parallax
- particle dispersion
- particle convergence
- SVG path animation
- horizontal movement
- controlled blur
- color/contrast transformation
- velocity-driven movement

Never turn every transition into a giant effect.

---

# 6. SCROLL SHOULD MAKE EVERYTHING COME TOGETHER

Scrolling is not just navigation.

Scrolling is the main interaction.

Use:

- Lenis
- GSAP
- ScrollTrigger

Synchronize them correctly.

Scroll velocity should affect selected visuals.

For example:

```text
slow scroll
→ slow visual response

fast scroll
→ stronger movement

reverse scroll
→ visual direction reverses
```

Use scroll velocity selectively.

Do not attach expensive work to React state every frame.

---

# 7. VISUAL IDENTITY

Create an original premium visual identity.

Base:

```text
#050505
#080808
#0B0B0B
```

Text:

- warm off-white
- muted gray

Accent:

Use ONE accent only.

Preferred direction:

```text
electric acid green / warm chartreuse
```

Use it sparingly.

Do not create:

- generic neon cyberpunk
- excessive gradients
- glassmorphism everywhere
- glowing badges everywhere
- generic SaaS UI

Typography should carry a large part of the visual identity.

Suggested:

- Manrope
- Geist
- Inter
- Space Grotesk
- DM Mono for technical metadata

---

# 8. LOADER

Create a short cinematic loader.

Example:

```text
SJ

037%
```

then:

```text
100%
```

Loader must represent actual application readiness as much as practical.

Do NOT artificially force a 5-second loader.

Target:

```text
~0.8–2 seconds
```

At completion:

- loader typography moves
- clip-path reveals the hero
- hero content enters
- particles are already preparing behind it

---

# 9. HERO

Hero should immediately communicate:

```text
SIDDHANT
JANBANDHU

FULL-STACK AI ENGINEER
```

Supporting message:

```text
I build intelligent systems that connect AI, data, and software.
```

Hero should contain a procedural visual intelligence field.

Do not use downloaded 3D models.

---

# 10. PROCEDURAL 3D — BUT DO NOT RELY ONLY ON PARTICLES

This is a critical upgrade.

The original specification asks for particles, but the implementation must **not become "just particles.js / just a particle background."**

Use multiple interactive visual systems:

### A. Procedural particle field
Three.js / R3F.

### B. Flow-field behavior
Particles react to noise and pointer movement.

### C. Neural connections
Procedural lines connect selected nearby nodes.

### D. SVG/data pipeline
DOM/SVG nodes connect:

```text
DATA → PIPELINE → AI → API → UI
```

### E. Project architecture visualization
Interactive architecture diagrams.

### F. Technology orbit
Scroll/velocity-controlled technology system.

### G. Cursor physics
Desktop-only cursor with inertia.

### H. Typography motion
Text itself participates in transitions.

### I. Magnetic controls
Buttons and selected interactive elements subtly attract toward the cursor.

### J. Distortion
Use limited image/visual displacement where useful.

### K. Depth
Use scale, blur, perspective and z-order to create cinematic depth.

The experience must feel like an **interactive system**, not a particle demo.

---

# 11. PROCEDURAL INTELLIGENCE FIELD

Use React Three Fiber.

Desktop:

```text
~6,000–15,000 particles
```

Tablet:

```text
~3,000–7,000
```

Mobile:

```text
~1,000–2,500
```

Adapt to device capability.

Use:

- BufferGeometry
- Points
- shaders where justified
- uniforms
- refs
- useFrame

Do not call React setState every animation frame.

Mouse should influence:

- field rotation
- local attraction/repulsion
- density perception
- wake
- subtle deformation

Scroll should influence:

- rotation
- dispersion
- convergence
- section-specific transformations

---

# 12. CUSTOM CURSOR

Desktop only.

Normal:

```text
dot + ring
```

Hover states:

```text
VIEW PROJECT
EMAIL
GITHUB
RESUME
DRAG
GO
```

Cursor should have:

- inertia
- lag
- scale
- magnetic attraction
- subtle rotation

Do not make it annoying.

Disable it on touch devices.

---

# 13. AUDIO SYSTEM

Add relevant interaction sounds.

Sounds should include:

- click
- hover
- navigation
- project open
- optional scroll feedback for major transitions

But:

**Never autoplay audio.**

Browser audio policy must be respected.

Use either:

- Web Audio API
- tiny local audio assets

Prefer Web Audio API for tiny UI sounds so the project has no heavy audio dependency.

Add:

```text
SOUND ON
SOUND OFF
```

Store the preference in:

```text
localStorage
```

Sounds must be extremely subtle.

Do not make the site sound like a game.

---

# 14. NAVIGATION

Create a floating premium navigation.

Top:

```text
SJ
SIDDHANT JANBANDHU
```

Navigation:

```text
ABOUT
EXPERIENCE
SKILLS
PROJECTS
INTELLIGENCE
CONTACT
```

Resume:

```text
RESUME
```

Sound:

```text
SOUND ON/OFF
```

Behavior:

- transparent at top
- compact on scroll
- subtle blur
- hide/reveal based on scroll direction
- mobile becomes full-screen menu

Do not create generic SaaS glassmorphism.

---

# 15. RESUME BUTTON — IMPORTANT

There must be a prominent resume button.

Examples:

```text
RESUME ↗
```

and:

```text
VIEW RESUME
```

But clicking it must **NOT immediately leave the website**.

Instead:

### Open an in-site modal.

Modal should contain:

- resume PDF preview
- close button
- open in new tab
- download button

Example:

```text
┌───────────────────────────────────────┐
│ RESUME                         X       │
│                                       │
│          PDF PREVIEW                  │
│                                       │
│                                       │
│                         OPEN ↗        │
│                    DOWNLOAD ↓         │
└───────────────────────────────────────┘
```

Use:

```html
<object>
```

or iframe/object fallback.

The resume path must be configurable.

Default:

```text
/public/resume.pdf
```

Do not fabricate a resume.

If no PDF exists, show a polished empty state explaining where to place it.

---

# 16. ABOUT

Do not create a generic bio card.

Use an editorial statement:

```text
I build intelligent software where
AI, data, backend systems and
interfaces meet.
```

Reveal it through line/mask animation.

Supporting copy should enter differently from the headline.

---

# 17. HOW I THINK

Create:

```text
HOW I THINK
```

with:

```text
01 SYSTEMS
02 INTELLIGENCE
03 PRODUCT
04 DETAIL
```

Hovering one changes:

- typography
- supporting description
- background
- visual system

Do not use four boring cards.

---

# 18. EXPERIENCE

Do not use a standard vertical timeline.

Use a pinned interactive experience system.

As the user scrolls:

```text
ROLE
COMPANY
PERIOD
STACK
DESCRIPTION
```

changes/evolves.

Visual pipeline:

```text
DATA
 ↓
PIPELINE
 ↓
AI
 ↓
API
 ↓
PRODUCT
```

Nodes should activate based on scroll position.

---

# 19. SKILLS

No grid of skill badges.

Create an interactive skills universe.

Categories:

```text
AI / ML
GENAI
BACKEND
FRONTEND
DATA
CLOUD
```

Center object:

```text
INTELLIGENCE
```

Hovering a category should:

- expand it
- update details
- alter visual field
- change active nodes
- trigger subtle audio if enabled

---

# 20. TECHNOLOGY BELT

Create a rotating/scroll-responsive technology belt:

```text
PYTHON
REACT
FASTAPI
POSTGRESQL
PYTORCH
LLM
RAG
THREE.JS
DOCKER
AWS
```

Do not rotate aggressively.

Velocity controls movement.

---

# 21. PROJECTS

Projects must be the strongest section.

No conventional 3-column card grid.

Use large immersive project panels.

Each project contains:

```text
NUMBER
TITLE
CATEGORY
DESCRIPTION
ROLE
TECHNOLOGIES
IMPACT
```

Project visuals should be procedural or abstract when appropriate.

---

# 22. PROJECT DATA MUST BE CONFIGURABLE

Use:

```ts
const projects = [
  {
    number: "01",
    title: "...",
    category: "...",
    description: "...",
    role: "...",
    technologies: [],
    impact: "...",
    problem: "...",
    approach: "...",
    architecture: [],
    github: "",
    live: ""
  }
]
```

Never fabricate links.

Empty links should remain empty.

---

# 23. PROJECT OPEN EXPERIENCE

Clicking a project must not instantly navigate away.

Instead:

```text
PROJECT PANEL
      ↓
EXPANDS
      ↓
FILLS VIEWPORT
      ↓
CASE STUDY
```

Include:

```text
PROBLEM
APPROACH
ARCHITECTURE
TECHNOLOGY
CHALLENGES
RESULT
GITHUB
LIVE DEMO
```

Use a unique transition for project opening.

---

# 24. ARCHITECTURE VISUALIZATION

For technical projects create an interactive diagram:

```text
USER
 ↓
FRONTEND
 ↓
API
 ↓
SERVICE
 ↓
AI / ML
 ↓
DATABASE
```

Use SVG or Canvas.

Nodes:

- respond to hover
- change active state
- lines pulse
- architecture feels alive

Do not use a static screenshot.

---

# 25. BUILDING INTELLIGENCE SECTION

Major immersive section.

Dark full-screen visual.

As the user scrolls:

```text
AI
↓
DATA
↓
SYSTEMS
↓
DISPERSE
```

Use procedural visuals.

Particles are one layer, not the entire experience.

Combine:

- particle field
- typography
- SVG lines
- noise
- depth
- scroll progress

---

# 26. SYSTEM ONLINE

Add a subtle interactive moment:

```text
SYSTEM STATUS

● ONLINE

AI
DATA
API
SYSTEMS

ALL SYSTEMS OPERATIONAL
```

Pointer movement should make nodes respond.

Keep it professional.

---

# 27. CONTACT

Make contact a visual climax.

```text
LET'S
BUILD
SOMETHING
INTELLIGENT.
```

Actions:

```text
COPY EMAIL
VIEW RESUME
```

Social links:

```text
GITHUB
LINKEDIN
LEETCODE
```

Email click:

```text
COPY EMAIL
```

then:

```text
COPIED
```

Never fake email or social URLs.

Keep them configurable.

---

# 28. FOOTER

Strong typography.

```text
SIDDHANT
JANBANDHU
```

Then:

```text
FULL-STACK AI ENGINEER
```

Links:

```text
EMAIL
GITHUB
LINKEDIN
LEETCODE
RESUME
```

Footer should have subtle visual movement.

---

# 29. MICRO-INTERACTIONS

Use a hierarchy.

Useful interactions:

- magnetic buttons
- link underline motion
- cursor response
- hover depth
- parallax
- scroll velocity
- text masks
- project scale
- SVG path movement
- architecture node pulses
- particle response
- click feedback
- sound feedback

Do not animate everything.

---

# 30. PERFORMANCE

Target:

```text
60fps where practical
fast first paint
lazy-loaded 3D
limited mobile particles
GPU-friendly transforms
no unnecessary React re-renders
no animation state in React
```

Use:

- refs
- transforms
- opacity
- requestAnimationFrame where appropriate
- IntersectionObserver/ScrollTrigger
- dynamic imports where useful

Pause expensive effects when the tab is hidden.

Respect reduced motion.

---

# 31. WEBGL FAILURE FALLBACK

The portfolio must remain usable without WebGL.

If WebGL fails:

```text
beautiful procedural CSS/SVG visual
```

must replace it.

The content must remain accessible.

---

# 32. RESPONSIVE DESIGN

Desktop:
full interactive experience.

Tablet:
reduced 3D.

Mobile:
intentionally redesigned.

Mobile must:

- remove custom cursor
- remove cursor audio
- reduce 3D
- simplify expensive effects
- retain visual storytelling
- retain resume modal
- retain navigation
- retain project interaction

Do not simply shrink desktop.

---

# 33. ACCESSIBILITY

Support:

- semantic HTML
- keyboard navigation
- visible focus states
- buttons for actions
- aria labels
- sufficient contrast
- reduced motion
- modal focus/escape behavior

With:

```css
prefers-reduced-motion: reduce
```

disable/reduce:

- parallax
- particle movement
- cursor effects
- large transitions
- unnecessary audio

---

# 34. EASTER EGG

Use:

```text
/
```

to open a command-style quick navigation.

Commands:

```text
about
experience
skills
projects
intelligence
contact
```

Keep it subtle.

---

# 35. CODE ARCHITECTURE

Use:

```text
src/
  components/
    Navigation/
    CustomCursor/
    PageLoader/
    ParticleScene/
    Hero/
    About/
    Philosophy/
    Experience/
    Skills/
    TechOrbit/
    Projects/
    ProjectCaseStudy/
    Architecture/
    IntelligenceScene/
    Contact/
    Footer/
    AudioController/

  animations/
    loader
    navigation
    hero
    sections
    projects
    transitions

  hooks/
    useMousePosition
    useScrollVelocity
    useReducedMotion
    useMediaQuery
    useAudio

  data/
    portfolio
    projects
    experience
    skills
    links

  styles/
    globals
    variables
    typography
```

Keep components modular.

Do not create a giant App component.

---

# 36. ENGINEERING RULES

Avoid:

- monolithic components
- duplicated animation code
- magic numbers
- setState every frame
- unnecessary useEffect chains
- expensive DOM queries
- leaked listeners
- copied project data
- fake statistics
- fake testimonials
- fake achievements
- invented experience
- invented links

Use cleanup correctly.

Use GSAP context.

---

# 37. SEO

Include:

- title
- description
- OpenGraph
- semantic headings
- canonical placeholder
- favicon

Title:

```text
Siddhant Janbandhu — Full-Stack AI/ML Engineer
```

---

# 38. SOUND DESIGN RULE

Sound should feel like **interface feedback**, not background music.

Good:

```text
tiny click
soft hover tick
subtle navigation blip
short project-open tone
```

Bad:

```text
loud synth
constant background music
sound on page load
repetitive annoying effects
```

---

# 39. FINAL QUALITY BAR

Before finishing, verify:

### First impression
Does the first five seconds feel memorable?

### Continuity
Does scrolling feel like one continuous world?

### Transitions
Does each major section have a different transition language?

### Interactivity
Does the website respond to mouse, scroll, velocity, hover and click?

### 3D
Does 3D support the story rather than exist only as decoration?

### Beyond particles
Are there multiple visual systems besides particles?

### Resume
Does the resume open inside an in-site modal?

### Sound
Are interaction sounds subtle, optional and user-controlled?

### Customization
Can all personal content be changed from data/config files?

### Performance
Does the site remain responsive?

### Mobile
Does mobile feel intentionally designed?

### Accessibility
Does the site remain usable with keyboard/reduced motion/WebGL disabled?

### Authenticity
Are there zero fake statistics, links or claims?

---

# 40. FINAL DELIVERABLE

Deliver a complete ZIP containing:

1. source code
2. package.json
3. Vite config
4. TypeScript config
5. responsive styles
6. reusable components
7. data/config files
8. smooth scrolling
9. GSAP animations
10. procedural 3D
11. cursor
12. sound controller
13. sound toggle
14. page loader
15. scroll-driven transitions
16. project case-study modal
17. architecture visualization
18. resume modal
19. mobile navigation
20. reduced-motion mode
21. WebGL fallback
22. SEO metadata
23. README
24. customization instructions

Also include:

```text
public/resume.pdf
```

as the expected location for the user's real resume. Do not generate fake resume content.

The final experience should feel like:

> **an intelligent digital system created by an engineer who understands software, AI, architecture, product and interaction design.**

Priority:

```text
1. UX
2. VISUAL QUALITY
3. MOTION QUALITY
4. PERFORMANCE
5. ACCESSIBILITY
6. CUSTOMIZABILITY
7. CODE QUALITY
8. 3D COMPLEXITY
```

Never sacrifice UX or performance just to make the 3D more complex.
