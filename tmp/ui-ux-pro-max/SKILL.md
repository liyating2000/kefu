---
name: ui-ux-pro-max
description: Apply advanced UI and UX reasoning to produce production-ready interfaces with stronger information hierarchy, composition, interaction clarity, accessibility, and implementation discipline.
metadata:
  short-description: Senior-level UI and UX design guidance for interface work
---

# UI / UX Pro Max

Use this skill when the user asks for:
- UI or UX improvements for an existing product
- A new screen, flow, dashboard, landing page, or design system
- Better information hierarchy, usability, accessibility, or visual polish
- Design critique, design review, or interaction cleanup
- Frontend implementation that needs stronger product and interface judgment

Do not use this skill when:
- The task is backend-only and has no user-facing behavior
- The user wants a literal clone of an existing product without adaptation
- The repository already has strict design-system rules that must be followed exactly

## Operating Standard

Think like a senior product designer and a senior frontend engineer at the same time.

Your output should:
- Solve the user problem, not just decorate the interface
- Make the primary action obvious
- Reduce ambiguity, visual noise, and dead-end states
- Keep layouts intentional across mobile and desktop
- Respect accessibility, keyboard navigation, and readable contrast
- Translate design choices into implementable code with clear constraints

## Workflow

For substantial UI work, follow this order:
1. Define the goal, primary user, and main success path.
2. Identify the current friction: clutter, weak hierarchy, unclear actions, poor affordance, missing states, or accessibility gaps.
3. Restructure the information hierarchy before changing colors or decoration.
4. Choose a visual direction that fits the product instead of using a default template.
5. Specify interaction states: idle, hover, focus, active, disabled, loading, empty, error, and success.
6. Implement with responsive behavior and accessible semantics.
7. Verify spacing rhythm, copy clarity, and task completion speed.

## Design Rules

### Hierarchy

- One dominant focal point per screen or major section
- Strong separation between primary, secondary, and tertiary actions
- Group related information tightly and unrelated information loosely
- Prefer shorter, scannable blocks over dense walls of text

### Layout

- Start from the task flow, then derive the layout
- Use consistent spacing scale and alignment lines
- Avoid equally weighted cards or controls when the content is not equally important
- On mobile, preserve the same priorities instead of simply stacking everything

### Visual Language

- Pick a deliberate tone and keep it consistent
- Use typography, spacing, contrast, and shape before adding ornament
- Avoid generic gradients, glass, or shadows unless they support the product tone
- Use motion sparingly and only when it clarifies causality or orientation

### Components

- Buttons should communicate priority clearly
- Inputs need labels, examples when necessary, and obvious error handling
- Tables and dense lists need sort, filter, empty, and overflow behavior considered up front
- Navigation should reflect user goals, not internal implementation structure

### Copy

- Prefer short, concrete labels
- State what happens next
- Replace vague CTA text like `Submit` or `Continue` when a more specific verb is possible
- Error copy should explain the problem and the next corrective action

### Accessibility

- Use semantic HTML first
- Ensure keyboard access for all interactive controls
- Provide visible focus states
- Preserve readable contrast and avoid relying on color alone
- Ensure hit targets are appropriate on touch devices

## Implementation Guidance

When editing code:
- Preserve the existing design system if one is already established
- If the current UI is weak or inconsistent, introduce a coherent local system instead of one-off fixes
- Define reusable tokens when the page has repeated values for spacing, color, radius, or type scale
- Prefer simple, robust CSS and component structure over effect-heavy code
- Keep loading, empty, and error states in the first implementation pass

For React work:
- Follow the project’s patterns and compiler guidance
- Avoid premature memoization
- Keep state close to where it is used
- Separate presentation issues from domain logic when possible

## Review Checklist

Before finishing, confirm:
- The main task is obvious within a few seconds
- The interface has a clear primary action
- The visual hierarchy matches product priority
- The result works on small and large screens
- The design remains usable with keyboard-only navigation
- Error, empty, and loading states exist where relevant
- The code is maintainable and not just cosmetically different

## Critique Mode

If the user asks for a review, prioritize findings in this order:
1. Broken or confusing task flow
2. Missing or misleading affordances
3. Weak hierarchy and unreadable density
4. Accessibility failures
5. Inconsistent visual system
6. Cosmetic issues

When proposing changes:
- State the user problem first
- Explain why the current design fails
- Describe the smallest defensible fix
- Implement the change when the user expects code, rather than stopping at advice

## Notes

- This local fallback install is self-contained so it still works when external helper scripts or repo assets are unavailable.
- If the upstream repository becomes reachable later, it is reasonable to replace this file with the original repository contents and any companion assets.
