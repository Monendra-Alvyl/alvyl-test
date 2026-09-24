# AI FRONTEND DEVELOPMENT SKILL

## React + Tailwind CSS + Sanity CMS
### Design-First, Component-Driven, No-Assumption Development Workflow

---

# 1. PURPOSE

This skill defines how the AI coding agent must analyze, plan, build, test, and maintain production-quality websites from:

- Figma designs
- Figma links
- Screenshots
- Reference images
- Design files
- Written specifications
- Existing websites
- User-provided assets
- Responsive design references

The primary goal is:

> Reproduce the provided design accurately while maintaining a clean, scalable, reusable, and maintainable React codebase.

The agent must separate:

1. Design understanding
2. Architecture planning
3. Component planning
4. Implementation
5. CMS/data integration
6. Testing
7. Visual QA
8. Final architecture QA

The agent must NOT jump directly from a design to code.

---

# 2. CORE PRINCIPLES

## 2.1 Design First

The design and explicit user requirements must be understood before implementation begins.

Never start coding simply because a screenshot or Figma file has been provided.

First inspect and understand the complete design.

## 2.2 Do Not Assume

The agent must not invent:

- Layouts
- Content
- Copy
- Colors
- Typography
- Spacing
- Breakpoints
- Animations
- Interactions
- Icons
- Images
- Component behavior
- Responsive behavior
- CMS fields
- Business logic

when these are not specified or reasonably derivable from the provided source.

If an important requirement is ambiguous:

> STOP AND ASK.

Do not silently choose an arbitrary solution.

## 2.3 Design vs Technical Decisions

The agent may make technical implementation decisions when they do not alter the intended design.

Allowed:

- Component architecture
- File organization
- React patterns
- Tailwind implementation
- TypeScript types
- Data fetching architecture
- API abstraction
- Testing strategy
- Performance optimization that preserves the design

Not allowed without instruction:

- Changing the visual design
- Adding UI elements
- Removing UI elements
- Changing content
- Changing interactions
- Changing responsive behavior
- Adding decorative effects
- Reinterpreting the design

---

# 3. TECHNOLOGY STACK

Default stack:

- React
- TypeScript
- Tailwind CSS
- Sanity CMS
- Git
- ESLint
- Prettier
- Playwright for browser testing
- Visual screenshot comparison when available

For production marketing websites, Next.js may be used instead of plain React/Vite when the project requires:

- SSR
- SSG
- ISR
- stronger SEO architecture
- server-side data fetching
- advanced routing
- image optimization
- server-side functionality

The agent must inspect the existing project before changing the framework.

Never migrate React/Vite to Next.js unless explicitly requested or approved.

---

# 3A. DEFAULT FIGMA REFERENCE

The following Figma file is the default design reference for this project:

```text
https://www.figma.com/design/ToZoELMITbcMeaB0kfUhjU/Untitled?node-id=16-858&t=pknKfqvd5e6xFrOg-1
```

## Figma file details

```text
File key:
ToZoELMITbcMeaB0kfUhjU

Reference node:
16:858
```

When working on this project, the agent MUST use this Figma reference whenever the relevant page, section, component, or state is represented there.

## Access rule

The agent must only inspect the Figma file when it has access to it.

If the Figma file cannot be accessed because of permissions:

- Do not guess missing design details.
- Do not reconstruct unseen details from assumptions.
- Ask the user to provide access or an exported reference.

The provided Figma link does not authorize bypassing Figma access controls.

## Figma inspection requirements

When access is available, inspect:

```text
[ ] Relevant pages
[ ] Relevant frames
[ ] Components
[ ] Component variants
[ ] Auto-layout
[ ] Typography
[ ] Colors
[ ] Spacing
[ ] Assets
[ ] Responsive layouts
[ ] Interaction states
[ ] Variables/styles when available
```

Do not implement from the URL alone.

The agent must inspect the actual relevant Figma nodes before coding.

## Figma as visual reference

Use Figma to determine page-specific:

- Layout
- Dimensions
- Alignment
- Spacing
- Typography
- Colors
- Images
- Icons
- Component composition
- Component states
- Responsive behavior
- Interactions

The embedded project design system remains the baseline for reusable visual tokens and shared components.

## Figma node handling

The supplied reference node is:

```text
16:858
```

When the task concerns this node, inspect it directly first.

If the requested work concerns another page or node in the same file:

1. Inspect the file/page structure.
2. Identify the relevant node.
3. Inspect that node before implementation.
4. Do not assume node 16:858 represents the entire file.

## Figma-first development gate

For a Figma-driven task:

```text
Figma link
   ↓
Confirm access
   ↓
Inspect target node/page
   ↓
Inspect related components
   ↓
Inspect reusable patterns
   ↓
Compare with project design system
   ↓
Identify ambiguities
   ↓
Ask if important information is missing
   ↓
Create component inventory
   ↓
Inspect codebase
   ↓
Implement
```

Never skip the Figma inspection stage.

---

# 3B. EMBEDDED PROJECT DESIGN SYSTEM

The following design-system rules are part of the project specification and MUST be applied during implementation.

Do not depend on the original reference documents being present at runtime. Their relevant design-system details are embedded in this skill and must be treated as project rules.

The design system covers:

- Color
- Spacing
- Typography
- Components
- Responsive behavior
- Component states

The agent must use these rules together with the actual Figma/reference design.

---

# 3B. COLOR SYSTEM

## Backgrounds

Use these approved background values where applicable:

```text
Alchemy Gradient
#CE521D → #CE1D1E → #CE521D

Pitch Black
#000000

Dark Grey
#101010

Light Grey
#171717
```

## Strokes

```text
Dark Black
#000000

Dark Stroke
#4E4E4E

Light Stroke
#1E1E1E

Very Light Stroke
#161616
```

## Primary Button

```text
Button Primary
#FFFFFF

Disabled Primary
#FFFFFF

Text on Primary
#333333
```

## Secondary Button

```text
Button Secondary
#000000 at 20%

Stroke on Button
#FFFFFF

Text on Secondary
#FFFFFF
```

## Alchemy Button

```text
Alchemy Button
#CE521D → #CE1D1E → #CE521D

Text on Alchemy
#FFFFFF
```

## Text

```text
Text White
#FFFFFF

Dark
#E8E8E8

Light Text
#D6D6D6

Ultra Light Text
#B5B5B5
```

## Status Colors

```text
Positive
#85C786

Negative
#E44D4D

Amber
#E4C247
```

## Icons

```text
Alchemy Icons
#CE521D → #CE1D1E → #CE521D

White Icons
#FFFFFF

Black Icons
#333333
```

## Color Rules

- Do not invent new colors when an approved token fits the requirement.
- Do not replace an approved token with a visually similar shade.
- Reuse the same semantic token consistently.
- A Figma-specific value may be used when the design explicitly defines a deliberate exception.
- Do not change the color system merely because another value looks better.

---

# 3C. SPACING SYSTEM

The project uses an 8pt spacing system.

Approved spacing tokens:

```text
2
4
8
12
16
20
24
32
40
48
56
64
80
96
120
160
```

Use these tokens consistently.

## Spacing Rules

- Prefer approved spacing tokens.
- Do not create random spacing values.
- If the design provides an exact value, use the exact design value.
- Do not round values for convenience.
- Do not replace an explicit 18px value with 20px.
- Do not replace an explicit 24px value with 20px or 32px.
- Do not replace an explicit 48px value with 40px or 56px.

The spacing system is a design foundation, not a suggestion.

---

# 3D. PAGE-LEVEL SPACING

Use these reference ranges where the specific design does not override them.

## Desktop

```text
Section Padding
64–120px

Hero Section Padding
96–120px

Side Padding
32px
```

## Tablet

```text
Section Padding
48–80px

Hero Section Padding
72–120px

Side Padding
24px
```

## Mobile

```text
Section Padding
32–48px

Hero Section Padding
48–80px

Side Padding
16px
```

These are ranges. The actual Figma/reference design determines the specific value when available.

---

# 3E. COMPONENT SPACING

## Cards

```text
Desktop
48px

Tablet
32px

Mobile
24px
```

## Hero Section

```text
Desktop
120px

Tablet
80px

Mobile
48px
```

## Component Side Padding

```text
Desktop
48px

Tablet
32px

Mobile
24px
```

Do not apply these values blindly when the supplied design specifies another exact measurement.

---

# 3F. TYPOGRAPHY SYSTEM

The project uses two primary typefaces:

```text
Display / Editorial
IvyMode

UI / Body
Forma DJR Micro
```

Use the correct typeface according to the design.

Do not replace the project typography with a generic system font unless explicitly approved.

## Character Support

The supplied type system includes:

```text
ABCDEFGHIJKLMNOPQRSTUVWXYZ
abcdefghijklmnopqrstuvwxyz
1234567890
$
₹
```

Ensure the chosen font assets support the required content.

---

# 3G. TYPOGRAPHY SCALE

These are the project reference ranges.

Use the exact Figma value when the design specifies one.

## Desktop

```text
H1              48–56px
H2              36–40px
H3              28–32px
H4              22–24px
H5              18–20px
H6              16–18px

Body Large      18px
Body Regular    16px
Body Small      14px
Caption/Label   12–13px
```

## Tablet

```text
H1              36–44px
H2              30–32px
H3              24–26px
H4              20–22px
H5              16–18px
H6              15–16px

Body Large      17px
Body Regular    16px
Body Small      14px
Caption/Label   12–13px
```

## Mobile

```text
H1              28–32px
H2              24–28px
H3              20–22px
H4              18–20px
H5              15–16px
H6              14–15px

Body Large      16px
Body Regular    14–15px
Body Small      13–14px
Caption/Label   10–12px
```

---

# 3H. TYPOGRAPHY LINE HEIGHT

Reference line heights:

## Desktop

```text
H1              120%
H2              120%
H3              120–125%
H4              125%
H5              130%
H6              130%

Body Large      150%
Body Regular    150–160%
Body Small      150–160%
Caption/Label   12–13
```

## Tablet

```text
H1              120%
H2              120%
H3              120–125%
H4              125%
H5              130%
H6              130%

Body Large      150%
Body Regular    150–160%
Body Small      150–160%
Caption/Label   12–13
```

## Mobile

Use the tighter responsive typography behavior represented by the project design system:

```text
H1              115–200%
H2              115–200%
H3              120%
H4              120–125%
H5              125–130%
H6              125–130%

Body Large      150–160%
Body Regular    150–160%
Body Small      150–160%
Caption/Label   12–13
```

When the Figma design provides an exact line-height, follow the Figma value.

---

# 3I. COMPONENT SYSTEM

The project has established reusable component patterns.

The agent MUST inspect the existing implementation and reuse these patterns whenever applicable.

The component system includes:

## Buttons

Button patterns include multiple visual and state variants.

The agent must account for:

- Primary
- Secondary
- Alchemy
- Disabled
- Hover
- Focus
- Active
- Loading, when specified
- Icon + label
- Icon-only, when specified

Do not create an independently styled button when the existing button component can represent the required state.

## Fields and CTA

The project includes field/input and CTA patterns with states such as:

- Default text
- Entering text
- CTA/send action
- Disabled CTA

Inputs and form controls must preserve the approved styling, spacing, typography, borders, and state behavior.

## Chips

The component system includes:

- Selected
- Unselected

Selected and unselected chips must use the established visual patterns.

Do not invent an unrelated chip style.

---

# 3J. COMPONENT STATE RULES

Component states are part of the design system.

When a state is shown or specified, reproduce it accurately.

Examples:

```text
Default
Hover
Focus
Active
Selected
Unselected
Disabled
Entering text
Loading
Error
Success
```

Do not invent state styling when the state is not specified.

If an important state is required for functionality but not visually defined:

Ask the user when the decision materially affects the design.

---

# 3K. DESIGN-SYSTEM IMPLEMENTATION RULES

Every page and component must respect:

```text
Color system
↓
Spacing system
↓
Typography system
↓
Component system
↓
Responsive system
↓
State system
```

Before creating a new visual token:

1. Search the existing design system.
2. Check whether an existing token already represents the requirement.
3. Reuse the existing token where possible.
4. Create a new token only when clearly necessary and approved.

---

# 3L. DESIGN-SYSTEM VS FIGMA

The embedded design system defines the project's baseline.

Figma defines the exact page-level implementation when it provides a specific value or variation.

---

# 4. REQUIRED WORKFLOW

The agent must follow this sequence for every feature, page, or design task:

## 4.1 Inspect the Source

Before writing code, examine:

- Figma file or exported frame
- Screenshot or reference image
- Written requirements
- Existing codebase and design system
- CMS structure and schemas
- Relevant page or component patterns already in the project

## 4.2 Identify Ambiguities

List all unclear elements before implementation.

Examples:

- missing copy
- missing asset
- unknown interaction states
- undefined breakpoints
- unclear CMS fields

If anything materially affects the final result, ask the user before proceeding.

## 4.3 Build a Component Inventory

Map all UI elements into reusable sections such as:

- Hero
- Navigation
- Buttons
- Cards
- Forms
- Testimonials
- CTA blocks
- Footer
- Modal or overlay states

This inventory must align to the Figma composition and the existing codebase.

## 4.4 Plan Architecture

Before coding, determine:

- component boundaries
- props and data contracts
- shared styling tokens
- responsive behavior
- CMS data flow
- fallback states
- loading/error states

The implementation must be stable and scalable without overengineering.

## 4.5 Implement in Small, Verifiable Steps

The agent must implement in small increments and validate each stage.

Do not deliver a large untested block of code.

Use a pattern like:

```text
Layout shell
→ Sections
→ Shared components
→ Data integration
→ Interaction states
→ Responsive tuning
→ Visual QA
```

---

# 5. RESPONSIVE DESIGN RULES

The design must be built responsively, not just desktop-first.

## Required checks

- Mobile layout must be clean and intentional.
- Tablet layout must preserve hierarchy and spacing.
- Desktop layout must respect the design system and spacing rules.
- Breakpoints must match the actual design or the project default patterns.
- Content should not overflow or wrap unexpectedly.
- Text should remain readable and aligned with the design.

## Rule

Do not apply a desktop layout to smaller screens by default. The implementation must preserve the design intent across each breakpoint.

---

# 6. CMS INTEGRATION RULES

When using Sanity CMS:

- Use the existing schema patterns when present.
- Reuse or extend established document types only when needed.
- Do not invent fields without requirement or design justification.
- Ensure content structure is clean and editor-friendly.
- Keep front-end rendering consistent with the design system.

If the CMS structure is not specified:

- ask the user before creating a new schema structure that affects content ownership or editorial flow.

---

# 7. IMPLEMENTATION RULES

The agent must:

- keep the code readable and maintainable
- use Tailwind utilities consistently
- favor reusable components over duplicated markup
- respect the project's color, spacing, and typography tokens
- maintain semantic HTML and accessibility basics
- avoid unnecessary custom CSS when Tailwind can express the design
- avoid feature creep beyond the requested scope

The agent must not:

- add decorative UI not present in the source design
- invent new interactions not requested or implied
- reinterpret the design for aesthetic preference
- replace approved design tokens with arbitrary values

---

# 8. TESTING AND VERIFICATION

The agent must validate implementation before claiming completion.

## Required checks

- static check: code compiles or builds without errors
- linting: project rules are respected
- visual review: layout matches the source design closely
- responsiveness: major breakpoints are checked
- interaction review: hover, focus, and active states function as intended
- content integrity: no placeholder or broken content remains

## Browser testing

Use Playwright where available to review:

- desktop render
- tablet render
- mobile render
- main states and interactions
- layout correctness
- broken styling or overflow

If visual differences exist, adjust until the page matches the approved reference more closely.

---

# 9. VISUAL QA GATE

A design task is not complete until the agent checks the output against the source design.

Visual QA must include:

- alignment and spacing
- color accuracy
- typography consistency
- component states
- responsive behavior
- imagery and icon placement
- CTA behavior and hierarchy

If a mismatch is detected, fix the root cause rather than masking it.

---

# 10. FINAL ARCHITECTURE QA

Before completion, the agent must perform a final review of the code and structure:

- does the implementation match the design?
- is the component structure clean and reusable?
- are tokens reused correctly?
- are there unnecessary abstractions?
- is the CMS/data architecture maintainable?
- is the codebase consistent with existing patterns?
- are there unused files, dead styles, or duplication?
- are there unresolved assumptions or unasked questions?

If the final architecture does not support maintainability or accuracy, it is not ready.

---

# 11. ACCEPTANCE CRITERIA

The work is only complete when all of the following are true:

- design was reviewed before coding
- required Figma/reference sources were inspected when available
- no unsupported assumptions were used to fill missing details
- the existing design system and tokens were respected
- responsive behavior was validated
- component states were implemented accurately
- CMS/data integration was wired correctly
- the site renders cleanly without obvious errors
- visual QA was performed
- final architecture QA was performed

---

# 12. FINAL RULE

The agent must treat the design as the source of truth and the codebase as the implementation layer.

The code should never diverge from the design without explicit justification.

When the requirements are unclear, ask.
When the design is available, inspect it.
When the implementation is done, verify it.
When the work is complete, review it again before delivering.

This is the final working standard for AI frontend development in this project.
