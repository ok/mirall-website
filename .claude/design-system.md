# Design System Specification: The Luminous Editorial

## 1. Overview & Creative North Star
**Creative North Star: The Botanical Gallery**

This design system is built to evoke the feeling of a high-end, sun-drenched art gallery—clean, expansive, and meticulously curated. We are moving away from the "standard dashboard" aesthetic of boxes-within-boxes. Instead, we embrace **Luminous Editorial**: a style defined by massive whitespace, intentional asymmetry, and a sophisticated interplay between vibrant emerald organics and deep indigo structure.

We break the "template" look through:
*   **Tonal Layering:** Using color shifts rather than lines to define space.
*   **Typography as Architecture:** Leveraging the Manrope scale to create visual anchors.
*   **Organic Accents:** Using the emerald primary to draw the eye through a narrative path, complemented by the depth of purple tones.

## 2. Colors & Surface Philosophy
The palette is rooted in a "bright-first" mentality. The primary Emerald (`#10B981`) acts as the "life force" of the UI, while the Secondary (`#4648D4`) and Tertiary (`#6D3BD7`) provide the intellectual weight.

### The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using 1px solid borders to section off content. Boundaries must be defined through background color shifts. For example, a `surface-container-low` (`#f2f4f6`) section should sit directly on a `surface` (`#f7f9fb`) background. If you cannot distinguish two sections without a line, your spacing or tonal shift is insufficient.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, physical layers of fine paper.
*   **Base:** `background` (#f7f9fb)
*   **Sectioning:** `surface-container-low` (#f2f4f6) or `surface-container` (#eceef0)
*   **Prominent Elements (Cards):** `surface-container-lowest` (#ffffff) to provide a "pop" of brightness.

### The "Glass & Gradient" Rule
To escape the "flat" trap, floating elements (modals, navigation bars) should utilize **Glassmorphism**.
*   **Tokens:** Use `surface` at 80% opacity with a `24px` backdrop-blur.
*   **Signature Textures:** For Hero sections or primary CTAs, use a subtle linear gradient: `primary` (#006c49) to `primary_container` (#10b981) at a 135-degree angle. This adds "soul" and prevents the emerald from feeling clinical.

## 3. Typography: The Manrope Scale
Manrope is a modern, geometric sans-serif that requires breathing room. Our hierarchy is designed to feel like a premium magazine.

*   **Display (lg/md):** Use for high-impact hero moments. Letter-spacing should be set to `-0.02em` to feel tighter and more "designed."
*   **Headlines:** The authority of the page. Always use `on-surface` (#191c1e).
*   **Titles:** Use `title-lg` for card headers. Ensure there is at least `24px` (spacing-6) of padding between the title and the body.
*   **Body:** `body-lg` is our workhorse. Keep line heights generous (1.5x minimum) to maintain the "bright" feel.
*   **Labels:** Use `label-md` in all-caps with `0.05em` letter-spacing for category tags or overlines.

## 4. Elevation & Depth
We convey hierarchy through **Tonal Layering** and **Ambient Light**, never through heavy shadows or structural lines.

### The Layering Principle
Instead of a shadow, place a `surface-container-lowest` (#ffffff) card on a `surface-container-low` (#f2f4f6) background. This creates a natural, soft "lift" that feels integrated into the environment.

### Ambient Shadows
When an element must float (e.g., a dropdown or a primary action button), use an "Ambient Shadow":
*   **Color:** 8% opacity of `on-secondary-fixed` (#07006c). By using an indigo-tinted shadow instead of grey, the shadow feels like a natural refraction of the brand colors.
*   **Blur:** High diffusion (min 30px blur) with a small Y-offset (4px - 8px).

### The "Ghost Border" Fallback
If a border is required for accessibility (e.g., high-contrast mode or complex form fields), use a **Ghost Border**:
*   Token: `outline-variant` (#bbcabf) at **15% opacity**. It should be felt, not seen.

## 5. Components

### Buttons
*   **Primary:** Emerald gradient (`primary` to `primary_container`). `rounded-lg` (1rem). White text. No shadow except on hover (Ambient Shadow).
*   **Secondary:** Indigo `secondary` (#4648d4) with `on-secondary` text. Used for "Logic" actions.
*   **Tertiary:** Ghost style. No background, `primary` text. Use for low-priority navigation.

### Cards & Lists
*   **Rule:** Forbid divider lines. Use `spacing-8` (2rem) of vertical white space or a subtle shift to `surface-container-high` (#e6e8ea) for hover states.
*   **Radius:** Always `rounded-lg` (1rem).

### Form Inputs
*   **Style:** Minimalist. Background `surface-container-low`, no border. On focus, transition to a 1px `primary` ghost border (20% opacity) and a subtle 2px emerald "glow" (ambient shadow).
*   **Labels:** Always `label-md` positioned above the field, never placeholder-only.

### Signature Component: The "Luminous Chip"
*   For status indicators or tags, use a semi-transparent `secondary_container` (#6063ee) at 10% opacity with solid `on-secondary_container` (#fffbff) text. This creates a "glow" effect that complements the emerald primary.

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical layouts. Push content to the right and leave a wide left margin for a "gallery" feel.
*   **Do** use the Spacing Scale strictly. Gaps should be large (e.g., `spacing-12` or `spacing-16`) between major sections.
*   **Do** use `tertiary` (purple) for interactive secondary elements like toggles or sliders to provide a sophisticated contrast to the green.

### Don’t:
*   **Don’t** use pure black (#000000) for text or shadows. It "kills" the luminosity. Use `on-surface` (#191c1e).
*   **Don’t** use 1px borders to separate list items. Use white space.
*   **Don’t** crowd the corners. The `rounded-lg` (1rem) radius requires significant internal padding (at least `spacing-6`) to look intentional.