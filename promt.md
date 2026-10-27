# TASK: Create Multiple Professional Website Redesign Concepts

## 1. Role and Responsibilities

Act as a Senior Frontend Developer, UI/UX Designer, Design Systems Engineer, and QA Engineer.

Your task is to analyze the existing website and implement several high-quality redesign concepts based on its current visual identity, content, assets, and business goals.

This is an evolutionary redesign, not a complete rebranding.

The new versions should feel like professionally refined alternatives to the original website: modern, polished, visually engaging, interactive, animated, responsive, and production-minded.

Do not start coding immediately. First inspect the project, understand its architecture and design language, create a documented implementation plan, and then execute the redesign systematically.

Work autonomously whenever reasonable. Make informed decisions based on the actual project rather than asking questions that can be answered by inspecting the repository.

---

## 2. Primary Objectives

1. Analyze the original website and understand its purpose, audience, structure, and visual identity.
2. Identify opportunities for a small but meaningful redesign.
3. Reuse the existing website's content, images, icons, logos, typography, and other available resources.
4. Develop multiple visually distinct redesign concepts that remain recognizable as part of the same brand.
5. Make every concept feel alive through carefully designed animations, transitions, hover states, and interactive behaviors.
6. Implement responsive layouts for desktop, tablet, and mobile.
7. Keep all new work isolated from the original project.
8. Verify that every implemented page and interaction works correctly.
9. Document the available concepts and explain their differences.

The final result must consist of working website implementations, not just mockups, screenshots, or design descriptions.

---

## 3. Mandatory Repository Inspection

Before changing any files, inspect the entire relevant project structure.

Identify:

- The existing application entry point.
- The framework, libraries, build tools, and package manager.
- Existing routes and page structure.
- Reusable components and layout patterns.
- Global CSS, stylesheets, design tokens, and typography.
- All available image, icon, logo, video, and font assets.
- Existing animations and interactive elements.
- Existing forms, navigation, menus, dialogs, carousels, and other UI behaviors.
- Current responsive breakpoints and mobile-specific behavior.
- Existing dependencies and available animation libraries.
- Existing build, lint, type-check, and test commands.
- Any project instructions, including AGENTS.md and relevant nested instruction files.

Inspect actual files and rendered pages where possible. Do not rely exclusively on filenames or assumptions.

Do not replace the current architecture with a new stack without a compelling technical reason.

Do not install additional dependencies unless they provide a clear benefit and compatibility has been checked.

### Required deliverable

Create:

`redesigns/REDESIGN_PLAN.md`

This document must describe:

- The original site's structure and purpose.
- The existing visual identity.
- The assets and content available for reuse.
- Current strengths and weaknesses.
- Proposed redesign directions.
- Shared design requirements.
- Technical constraints.
- Implementation phases.
- Validation and QA strategy.

Do not modify the original website during this analysis phase.

---

## 4. Preserve the Original Website

The original implementation must remain unchanged.

Create all redesign-related files inside a new folder in the project root:

`redesigns/`

Use this folder for all new implementations, styles, scripts, components, documentation, and concept-specific assets.

Do not overwrite, rename, move, or delete existing source files.

Do not modify the original package configuration, build configuration, routing, or deployment settings unless absolutely necessary and explicitly justified in the plan.

Prefer isolated implementations that reuse existing assets without duplicating large binary files.

If the existing framework supports nested applications, use a structure compatible with the current project.

If the original project is a static HTML/CSS/JavaScript website, build the concepts as independent static implementations where practical.

If a separate development server or build command is required, document it in the redesign README.

Never introduce a change that breaks the original site's existing build or deployment process.

---

## 5. Analyze and Preserve the Design Identity

The redesigns must be based on the original website, not on an unrelated template.

Study the following characteristics:

- Brand colors and their roles.
- Typography, font weights, and hierarchy.
- Logo usage and brand presentation.
- Image style, cropping, aspect ratios, and composition.
- Content density and information hierarchy.
- Layout, spacing, alignment, and grid structure.
- Button styles, borders, shadows, and surface treatments.
- Existing visual motifs and decorative elements.
- Tone of voice and content style.
- Navigation patterns and user journeys.

Reuse the original content wherever possible.

Do not invent new business claims, customer testimonials, statistics, certifications, or portfolio projects.

Do not replace existing images with unrelated stock images when suitable original assets already exist.

Do not remove important sections merely to make the redesign visually simpler.

Improve clarity, hierarchy, consistency, readability, and usability while preserving the site's identity.

Avoid unnecessary gradients, excessive glassmorphism, random decorative shapes, oversized typography, and generic AI-generated landing-page aesthetics unless they genuinely fit the existing brand.

---

## 6. Create Four Redesign Concepts

Implement four independent design concepts.

All concepts must use the original site's actual content and assets, but each must have a clear visual rationale.

### Concept A — Refined Original

Objective: Improve the existing design without significantly changing its character.

Focus on:

- Better spacing and alignment.
- More consistent typography.
- Improved visual hierarchy.
- Cleaner buttons, cards, and section layouts.
- More polished navigation.
- Subtle animations and hover feedback.
- Improved mobile presentation.

This should be the safest redesign option.

### Concept B — Modern Premium

Objective: Create a more sophisticated, contemporary version of the original site.

Explore:

- More deliberate typography.
- Stronger composition and whitespace.
- Refined surface treatments.
- More expressive image layouts.
- Carefully controlled motion.
- Sophisticated interactions.
- More intentional section transitions.

Keep the original brand recognizable. Do not turn the site into a different company's website.

### Concept C — Dynamic Interactive

Objective: Make the site more engaging without sacrificing usability or professionalism.

Explore:

- More expressive but restrained motion.
- Interactive content blocks.
- Animated section entrances.
- Rich hover and focus states.
- Scroll-linked effects where appropriate.
- Interactive galleries, sliders, tabs, or accordions when relevant to the actual content.
- More engaging calls to action.

Interactions must support the content and user journey rather than exist purely for decoration.

### Concept D — Creative Brand Evolution

Objective: Explore a more distinctive visual interpretation of the original identity.

Explore:

- A more expressive layout.
- Creative use of existing brand colors and visual assets.
- Alternative compositions for hero sections and content blocks.
- More distinctive typography combinations using available fonts.
- Unique transitions and micro-interactions.
- A more memorable presentation of the original content.

This concept can be more experimental, but it must remain coherent, accessible, and commercially credible.

### Important distinction

These must be four genuinely different design directions, not four copies with different colors.

Differentiate the concepts through layout, composition, typography, component treatment, visual rhythm, and interaction design.

However, maintain shared brand foundations across all four.

If a proposed technique is unsuitable for the website's content or audience, use a better alternative and document the decision.

---

## 7. Recommended Folder Structure

Adapt this structure to the actual technology stack without modifying the original application.

`redesigns/`

- `REDESIGN_PLAN.md`
- `README.md`
- `shared/`
  - `assets-reference.md`
  - Shared design tokens or utilities, if appropriate.
- `concept-a-refined/`
  - `index.html` or the framework entry point.
  - Styles and components.
- `concept-b-premium/`
  - `index.html` or the framework entry point.
  - Styles and components.
- `concept-c-interactive/`
  - `index.html` or the framework entry point.
  - Styles and components.
- `concept-d-creative/`
  - `index.html` or the framework entry point.
  - Styles and components.
- `qa/`
  - `QA_CHECKLIST.md`
  - `TEST_RESULTS.md`

This is a suggested structure, not a requirement to introduce unnecessary complexity.

Keep each concept independently identifiable and easy to run.

Avoid duplicating shared assets unnecessarily. Reference the original assets using correct relative paths when possible.

If asset paths or build boundaries make direct references unreliable, use a documented, minimal solution that keeps the original project untouched.

---

## 8. Implement the Actual Website, Not Just the Hero

Each concept must include all major sections of the original website.

Preserve the original information architecture unless there is a clear usability reason to improve it.

Depending on the source website, implement the appropriate sections:

- Header and navigation.
- Hero section.
- Main content sections.
- Product or service presentations.
- Image galleries.
- Feature or benefit sections.
- Portfolio or case studies.
- Contact sections and forms.
- Calls to action.
- Footer.
- Existing secondary pages and relevant routes.

Do not automatically force sections that do not exist in the original site.

If the original site has multiple pages, inspect and redesign all relevant pages, not just the homepage.

Shared elements such as navigation and footer should be consistent within each concept.

The result must feel complete from the first viewport through the final section.

Avoid unfinished placeholder blocks, empty sections, broken images, lorem ipsum, and buttons that have no meaningful behavior.

---

## 9. Animation and Interaction Requirements

Every concept must include purposeful motion and interactive feedback.

### Entrance animations

Use appropriate techniques for:

- Hero content.
- Images and visual elements.
- Cards and content groups.
- Section entrances.
- Supporting decorative elements.

Use staggered animations selectively. Avoid making users wait for essential content.

### Hover and pointer interactions

Implement appropriate interactions for:

- Navigation links.
- Buttons.
- Cards.
- Images and galleries.
- Interactive content blocks.
- Other elements that imply clickability.

Use subtle changes in color, position, scale, shadow, underline, or other properties consistent with the design.

Do not apply the same generic hover effect to every component.

### Scroll interactions

Where appropriate, introduce:

- Reveal-on-scroll effects.
- Progressive content presentation.
- Subtle image movement.
- Section transitions.
- Scroll progress or other useful feedback.

Avoid excessive parallax, scroll hijacking, forced scrolling, and effects that interfere with reading.

### Functional interactive elements

Implement and test relevant interactions such as:

- Mobile navigation.
- Dropdown menus.
- Accordions.
- Tabs.
- Carousels.
- Dialogs and lightboxes.
- Form validation and feedback.
- Interactive filters or selectors, if present in the original site.

Only introduce controls that make sense for the actual content.

Every visible control must have a meaningful, working action.

Do not simulate successful form submission if no real submission endpoint exists. Clearly distinguish client-side validation from actual delivery or persistence.

### Animation quality

- Prefer transform and opacity for animation when practical.
- Avoid expensive layout recalculations and excessive continuous animations.
- Prevent content from remaining invisible if JavaScript fails.
- Support `prefers-reduced-motion`.
- Ensure animations do not interfere with keyboard navigation or screen readers.
- Avoid excessive movement, flashing, and competing animations.
- Make mobile interactions touch-friendly.

Use an existing animation library if it is already installed and suitable. Otherwise, prefer CSS animations and the Web Animations API where appropriate.

---

## 10. Responsive Design

All concepts must work on:

- Large desktop screens.
- Standard laptops.
- Tablets.
- Mobile phones.

Test at representative viewport sizes, including:

- 1920 × 1080.
- 1440 × 900.
- 1024 × 768.
- 768 × 1024.
- 390 × 844.
- 360 × 800.

Treat these as test viewports, not as the only supported dimensions.

Requirements:

- No unintended horizontal scrolling.
- No clipped text or overlapping components.
- Correct image scaling and cropping.
- Readable typography at every breakpoint.
- Proper navigation on touch devices.
- Adequate spacing around interactive elements.
- Correct stacking and reflow of grids.
- No hover-only functionality on mobile.
- Appropriate behavior in both portrait and landscape orientations.

Do not simply shrink the desktop layout. Design mobile layouts deliberately.

---

## 11. Accessibility and Usability

Apply practical accessibility standards.

Ensure:

- Semantic HTML.
- Correct heading hierarchy.
- Keyboard-accessible navigation.
- Visible focus indicators.
- Appropriate labels for inputs.
- Accessible dialog and menu behavior.
- Sufficient text contrast.
- Descriptive alternative text for meaningful images.
- Correct button and link semantics.
- Reduced-motion support.
- Touch-friendly interaction targets.

Do not use clickable `div` elements where semantic buttons or links are appropriate.

Do not communicate important information through color alone.

Preserve useful browser behaviors such as opening links in new tabs when appropriate and allowing standard keyboard navigation.

---

## 12. Performance and Technical Quality

Treat the work as a professional frontend implementation.

Requirements:

- Reuse existing dependencies where possible.
- Avoid unnecessary libraries.
- Avoid duplicate event listeners.
- Clean up observers and event listeners when required.
- Avoid memory leaks.
- Optimize image loading.
- Use lazy loading for appropriate below-the-fold images.
- Preserve image dimensions or aspect ratios to minimize layout shifts.
- Avoid loading all animation resources unnecessarily.
- Keep JavaScript modular and maintainable.
- Avoid brittle selectors and excessive CSS overrides.
- Use consistent naming conventions.
- Keep responsive styles organized.
- Avoid unnecessary network requests.
- Do not introduce console errors or unhandled exceptions.

Use the existing project's conventions and code quality tools.

Do not compromise maintainability for a visual effect.

---

## 13. Asset Reuse

Audit the original asset library before implementing the concepts.

Create `redesigns/shared/assets-reference.md` documenting relevant assets, including:

- File path.
- Asset type.
- Intended or current use.
- Potential use in the redesigns.
- Important dimensions or aspect ratios, when relevant.

Reuse the original logos, photographs, illustrations, icons, fonts, and other relevant materials.

Preserve original asset files.

Do not overwrite images to create a new visual treatment. Use CSS, separate derivative files, or existing image-processing tools if needed.

Do not embed large images as base64 unless there is a compelling reason.

If an original asset is missing, use the closest relevant available alternative and document the limitation rather than inventing a replacement that changes the brand identity.

---

## 14. Preview and Development Workflow

Make all four concepts easy to preview.

The `redesigns/README.md` must explain:

- What each concept represents.
- How to launch each concept.
- Which URLs or routes to open.
- Whether a build step is required.
- Any environment requirements.
- How to run the relevant quality checks.

Where practical, provide a lightweight concept-selection page inside `redesigns/` that links to all four implementations.

This selector must not replace or modify the original website's entry point.

Do not add unnecessary infrastructure just to create a preview page.

If the project uses a framework or development server that makes separate previews more appropriate, document the correct commands instead.

Verify the actual preview URLs and commands before documenting them.

---

## 15. Visual and Functional QA

Do not consider the task complete simply because the code compiles.

Use available browser automation tools, preferably Playwright if already configured, to inspect the actual rendered pages.

For each concept:

1. Launch the implementation.
2. Open every major page or route.
3. Check the desktop layout.
4. Check tablet and mobile layouts.
5. Inspect console errors.
6. Inspect failed network requests.
7. Verify image and font loading.
8. Test navigation and links.
9. Test every interactive control.
10. Test forms and validation.
11. Verify hover, focus, and touch interactions.
12. Verify reduced-motion behavior.
13. Check for horizontal overflow.
14. Check for layout shifts and content clipping.
15. Verify that the original website remains unaffected.

Capture screenshots at representative viewport sizes when the available tooling supports it.

Compare the rendered result against the original site to confirm that the brand identity and content are preserved.

Fix issues found during testing and rerun the relevant checks.

Never report a test as passed if it was not actually executed.

If browser automation or a particular environment is unavailable, state the limitation explicitly and complete all other feasible checks.

---

## 16. Quality Gate for Each Concept

Before considering a concept complete, verify:

- [ ] It has a distinct and coherent visual identity.
- [ ] It uses the original brand assets and actual content.
- [ ] All major original sections are represented.
- [ ] Typography, spacing, and alignment are consistent.
- [ ] Animations are polished and purposeful.
- [ ] Interactive elements work correctly.
- [ ] Mobile navigation works.
- [ ] Responsive behavior is verified.
- [ ] Accessibility basics are implemented.
- [ ] Images and fonts load correctly.
- [ ] There are no known critical console errors.
- [ ] No major layout problems remain.
- [ ] The implementation is maintainable.
- [ ] The original website remains unchanged.
- [ ] The preview instructions work.

---

## 17. Execution Phases

Execute the work in the following order.

### Phase 1 — Discovery

Inspect the repository, identify constraints, inventory assets, and analyze the current website.

Deliver: `REDESIGN_PLAN.md` and `assets-reference.md`.

### Phase 2 — Design Direction

Define four concept-specific design systems.

For each concept, document:

- Visual direction.
- Typography.
- Color usage.
- Layout principles.
- Component styling.
- Animation principles.
- Interaction patterns.
- Mobile design approach.

Avoid introducing arbitrary new brand colors without justification.

### Phase 3 — Shared Foundations

Implement only the shared foundations that genuinely benefit all concepts.

Keep concept-specific styling and behavior isolated.

### Phase 4 — Implementation

Build all four concepts using the actual content and available assets.

Ensure that every concept is functional, not merely decorative.

### Phase 5 — Responsive Refinement

Review every concept at the target viewports and refine the layouts.

### Phase 6 — Interaction and Animation

Implement, test, and polish all relevant interactions, transitions, and animation states.

### Phase 7 — QA

Run available build, lint, type-check, and automated browser checks.

Inspect screenshots and correct visible defects.

### Phase 8 — Documentation and Handover

Update the README and QA reports.

Provide a concise comparison of the four concepts and explain how to preview each one.

---

## 18. Work Continuity and Recovery

The implementation must be resumable if the computer shuts down, the agent session ends, or the connection is interrupted.

Maintain these files:

- `redesigns/REDESIGN_PLAN.md` — architecture, constraints, and full plan.
- `redesigns/PROGRESS.md` — completed work, current phase, next steps, blockers, and decisions.
- `redesigns/README.md` — setup and preview instructions.
- `redesigns/qa/TEST_RESULTS.md` — actual test results and outstanding issues.

Update `PROGRESS.md` after completing each major phase and before stopping work.

Include:

- Current phase.
- Completed tasks.
- Files created or modified.
- Decisions made.
- Tests executed and their actual results.
- Known issues.
- Exact next steps.

At the start of a resumed session, read these files and inspect the actual repository state before continuing.

Do not assume that the previous session completed its last operation.

Do not repeat completed work unnecessarily.

Do not delete working implementations simply to restart with a different approach.

If interrupted, leave the project in a consistent state and record what remains.

---

## 19. Final Deliverables

The final output must include:

1. Four working redesign concepts.
2. All new files isolated under `redesigns/`.
3. A documented analysis of the original site.
4. An inventory of reusable assets.
5. A comparison of all four concepts.
6. Preview and launch instructions.
7. A QA checklist.
8. A report of tests actually performed.
9. A list of unresolved issues or limitations.
10. A final progress report.

At the end, provide a concise summary containing:

- Which concepts were implemented.
- The main differences between them.
- Which original materials were reused.
- Which animations and interactions were added.
- Which viewport sizes were tested.
- Which tests passed or failed.
- How to launch each concept.
- Whether the original project was left unchanged.

If something could not be completed, state it clearly. Do not disguise unfinished work as a successful implementation.

---

## 20. Final Acceptance Criteria

The task is complete only when the following conditions are met:

- Four meaningful redesign alternatives exist.
- Each concept runs independently or through a documented preview mechanism.
- The designs remain recognizably related to the original website.
- The actual content and original materials are reused appropriately.
- The interfaces are responsive, interactive, and visually polished.
- Animations enhance the experience instead of distracting from it.
- All important controls have working behavior.
- No known critical defects remain unreported.
- The original website's source files and normal workflow have not been unintentionally modified.
- The project can be resumed using the progress documentation.

Start with repository inspection and the redesign plan. Then implement the concepts in order, validating each stage before proceeding.

Prioritize quality, consistency, maintainability, and real browser behavior over speed or superficial visual effects.