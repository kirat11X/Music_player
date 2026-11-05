# The Design System: Surgical Precision & Tonal Depth

## 1. Overview & Creative North Star
**The Creative North Star: "The Digital Surgeon"**

This design system is not a collection of components; it is an environment of extreme intentionality. Inspired by high-end toolsets and aerospace interfaces, the aesthetic moves away from the "web-standard" look by embracing a **Surgical Minimalism**. 

We achieve a premium feel through "Luminance Stacking"—a technique where hierarchy is defined by light values rather than physical dropshadows. The layout should feel like a high-precision instrument: high-contrast typography scales, razor-thin visual separators, and expansive negative space. We challenge the rigid grid by using intentional asymmetry—offsetting metadata and using variable-width columns to break the "template" feel.

---

## 2. Colors & Surface Logic

The palette is rooted in a pure, light-absorbent black, layered with increasing levels of luminance to denote proximity to the user.

### The Foundation
- **Background (`surface`):** `#08090a` — The absolute void. All UI begins here.
- **Surface Low (`surface_container_low`):** `#0f1011` — For primary sidebar or secondary background regions.
- **Surface High (`surface_container_high`):** `#191a1b` — For active panels, cards, and floating modals.

### The Accents
- **Primary:** `#bdc2ff` (Soft highlight) / **Primary Container:** `#5e6ad2` (The Core Accent).
- **Secondary:** `#c5c6d1` (Muted metadata).
- **Tertiary/Error:** `#ffb3af` / `#ce4244` (Used sparingly for surgical precision).

### The Core Rules
*   **The "No-Line" Rule:** Prohibit the use of 1px solid borders for sectioning. Separation must be achieved through background shifts (e.g., a `#0f1011` sidebar against a `#08090a` workspace).
*   **The "Glass & Gradient" Rule:** For floating navigation or context menus, use `surface_container_highest` with a `20px` backdrop blur and `60%` opacity. 
*   **Signature Textures:** Main CTAs should not be flat. Use a subtle linear gradient from `#5e6ad2` to `#7170ff` at a 135-degree angle to provide a "machined" finish.

---

## 3. Typography: The Editorial Voice

We utilize **Inter Variable** as our primary typeface, leveraging its technical precision.

### Typographic Character
- **Weights:** Use `400` for long-form, `510` for standard UI labels (the "sweet spot" for dark mode legibility), and `590` for semantic emphasis.
- **OpenType Features:** You **must** enable `cv01` (alternate 'a') and `ss03` (lower-case 'r' variants) to remove the "default" look of Inter and provide a custom-tailored feel.
- **Secondary Typeface:** Use **Berkeley Mono** for metadata, code snippets, and timestamps at `label-sm` scale.

### Scale & Hierarchy
- **Display (L/M/S):** `3.5rem` down to `2.25rem`. Use these for hero moments only. Extreme tracking (`-0.02em`).
- **Title (L/M/S):** `1.375rem` down to `1rem`. Weight `590`. This is the "Surgical Title" for panel headers.
- **Body (L/M/S):** `1rem` down to `0.75rem`. Weight `400`. High line-height (`1.6`) for maximum breathability.

---

## 4. Elevation & Depth: Tonal Layering

Traditional shadows are forbidden in the primary workspace. We use the **Layering Principle**.

*   **Luminance Stacking:** To lift an element, move it up one tier in the surface scale. A card sitting on `surface_container_low` (`#0f1011`) must use `surface_container_high` (`#191a1b`).
*   **Ambient Shadows:** For floating elements (modals), use a "Tinted Glow" rather than a shadow.
    *   `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);`
*   **The Ghost Border:** If containment is required for accessibility, use a `1px` stroke of `rgba(255,255,255,0.08)`. This is the only acceptable border.

---

## 5. Components: Machined Precision

### Buttons
- **Primary CTA:** Circular (High Border Radius). Background: `#5e6ad2`. Text: `#fdfaff`. No border.
- **Secondary (Ghost):** Background: `rgba(255,255,255,0.02)`. Border: `rgba(255,255,255,0.05)`. Hover state: Increase background opacity to `0.06`.
- **Tertiary:** Text-only, Weight `510`, Primary color.

### Input Fields
- **Container-less:** Inputs should not be boxes. Use a simple `bottom-border` only (`rgba(255,255,255,0.1)`) or a subtle surface shift. 
- **Focus State:** Transition the bottom border to the Primary accent (`#5e6ad2`) and add a `2px` blur glow.

### Cards & Lists
- **Forbid Dividers:** Use vertical white space (8px / 16px / 24px) to separate items.
- **Interactions:** On hover, a list item should shift from `transparent` to `surface_container_low`. 

### The "Command" Bar
- A central component for this system. Use `surface_container_highest` with a `blur(12px)`. It should appear to float precisely in the center of the viewport, using the `Primary` color for the cursor/active line.

---

## 6. Do’s and Don'ts

### Do
- **Do** use `Berkeley Mono` for numerical data to emphasize the "tool-like" nature of the UI.
- **Do** allow content to bleed to the edges of containers if it creates an interesting asymmetric crop.
- **Do** use "Optical Centering"—sometimes an icon needs to be 1px higher than the math suggests to look correct.

### Don't
- **Don't** use 100% white (`#FFFFFF`) for text. Use `on_surface` (`#e3e2e3`) to prevent "halation" (glowing) on deep black backgrounds.
- **Don't** use standard `border-radius: 4px`. Use our `sm` (`2px`) for a sharper, more technical edge, or `full` for interactive CTAs.
- **Don't** use motion that is "bouncy." All transitions should be `cubic-bezier(0.16, 1, 0.3, 1)` (Expo Out)—snappy, fast, and surgical.