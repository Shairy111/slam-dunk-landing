# Master Execution Guide: High-End 3D Landing Page

## Project Overview
This project is a premium, high-end 3D landing page featuring a hyper-realistic 3D basketball as its hero object. The experience focuses on cinematic UI composition, scroll-driven storytelling, motion design, and a luxury dark-theme atmosphere.

## Technical Stack
- Next.js
- TypeScript
- React
- Three.js (@react-three/fiber, @react-three/drei)
- GSAP

## Working Methodology
- **Progressive Iteration:** Build based only on provided reference screenshots.
- **Controlled Steps:** Break implementation into clear TODO-based phases.
- **Component Architecture:** Modular sections, keeping 3D logic organized and maintainable.
- **Quality Standards:** Maintain performance, responsiveness, clean Git workflow, and a stable codebase at each step.

## Master Prompt & Rules
*(This section evolves based on project feedback)*

### What Worked Well
- *To be updated as the project progresses*

### Issues Encountered
- *To be updated as the project progresses*

### Implementation Lessons
- *To be updated as the project progresses*

---

## Phase History
- **Phase 0 (Completed):** Project initialization, environment setup, and dependency installation (Next.js, Three.js, GSAP, TailwindCSS).
- **Phase 1 (Completed):** Built the hero section layout, UI overlay, Header, and responsive framing.
- **Phase 2 (Completed):** Integrated the 3D Scene with a procedurally textured basketball (bump maps and seam lines generated via Canvas) and cinematic lighting.
- **Phase 3 (Completed):** Added GSAP animations for the cinematic reveal of the "SPACING" text, the UI elements, and the 3D basketball.
- **Phase 4 (Completed):** Upgraded 3D scene to use external PBR textures (leather normal/roughness) blended with procedural colors. Performed deep performance optimization pass.
- **Phase 5 (Completed):** Converted the Hero section into a dynamic Carousel. Wired up arrow controls and added GSAP transitions to smoothly animate background colors, UI elements, and the 3D basketball rotation/re-texturing for the "VEROTEX" slide.
- **Phase 6 (Completed):** Added the third carousel slide ("NEBOULA") featuring a deep blue theme. Implemented dynamic canvas mask logic to support a new latitude/longitude grid pattern specifically for this slide while maintaining the classic pattern for the others.
- **Phase 7 (Completed):** Engineered a custom, synthesized Web Audio API sound effect (`useTransitionSound.ts`) that plays a smooth, dampened "swoosh/glide" whenever the user changes slides, adding an elegant auditory layer to the visual transitions.
- **Phase 8 (Completed):** Upgraded the physics-based double-click bounce animation with GSAP squash-and-stretch principles. Engineered a custom Web Audio API hook (`useBounceSound.ts`) that synthesizes a heavy, realistic basketball thud (combining a low sine wave with filtered white noise for the rubber slap) perfectly synced to the impact frames of the animation.
- **Phase 9 (Completed):** Architected the vertical scrolling layout in `page.tsx`, decoupling the 3D Canvas into a fixed global background layer. Built the "Performance Metrics" UI section and integrated GSAP ScrollTrigger to smoothly animate the basketball's scale, position, and rotation as it transitions from the hero center to the right edge of the screen. Wired the Web Audio API "swoosh" effect to the ScrollTrigger bounds. Refined typography using fluid `clamp()` values and responsive breakpoints to prevent layout overlap on different screen sizes.
- **Phase 10 (Pending):** Awaiting next reference screenshot for scroll-based transitions or additional sections.