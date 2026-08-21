# Existing Wix Prototype

The client has already created a prototype website using Wix.

I will provide the existing Wix website URL:

```text
https://goingcoastalrefresh.com/
```

This existing website should be treated as the **primary visual and content reference for the new static website**.

The purpose of this project is **not to redesign the client's website from scratch**.

Instead, recreate the existing Wix prototype as closely as reasonably possible using simple, maintainable HTML and CSS.

The client is having difficulty maintaining the Wix version, so this new implementation should preserve the design they already chose while making future edits considerably easier.

---

# First: Analyze the Existing Website

Before writing code, inspect the provided Wix website thoroughly.

Review all publicly accessible pages and identify:

- Navigation structure
- Page names
- Page order
- Hero sections
- Headings
- Body copy
- Calls-to-action
- Service descriptions
- Contact information
- Footer content
- Images
- Portfolio/project photos
- Section ordering
- Background colors
- Accent colors
- Button colors
- Text colors
- Font style and general typography
- Border styles
- Spacing
- Card layouts
- Image layouts
- Desktop layout
- Mobile/responsive behavior
- Any other visually important characteristics

Use the existing Wix site as the source of truth whenever possible.

Do not replace the client's existing wording, structure, photography, or branding merely because you think another design would be better.

---

# Preserve the Existing Design

The new site should visually resemble the existing Wix prototype as closely as practical while using much simpler underlying code.

Prioritize preserving:

1. Overall page structure
2. Section order
3. Existing content
4. Existing photographs
5. Color palette
6. Navigation
7. Calls-to-action
8. General typography
9. Spacing and visual hierarchy

Minor adjustments are acceptable when necessary for:

- Responsive behavior
- Accessibility
- Readability
- Maintainability
- Browser compatibility

However, avoid unnecessary creative redesign.

If something on the Wix site can be reproduced cleanly with basic HTML and CSS, reproduce it.

---

# Existing Images and Assets

Where technically possible, identify the images currently being used on the Wix website.

The client owns or has selected these images for their current website, so reuse the existing client-provided imagery rather than replacing it with generic stock photography.

Download or otherwise preserve the appropriate publicly accessible image assets needed to recreate the site.

Store copied client images locally inside the project, using an organized structure such as:

```text
images/
├── branding/
├── portfolio/
├── services/
└── general/
```

Use descriptive lowercase filenames where practical.

For example:

```text
images/portfolio/deck-staining-01.jpg
images/portfolio/exterior-painting-01.jpg
images/general/home-hero.jpg
```

Do not leave production images dependent on Wix-hosted URLs if the assets can reasonably be stored locally.

Update the HTML to reference these local files.

---

# Image Quality

Wix may expose multiple resized or optimized versions of an image.

When multiple versions are available:

- Prefer an appropriately high-resolution source.
- Do not intentionally download tiny thumbnail versions for large page images.
- Avoid unnecessarily enormous files when a more appropriately sized version is available.
- Preserve the original aspect ratio unless the Wix design intentionally crops the image.

Do not distort client photographs.

---

# Existing Color Palette

Analyze the existing Wix site and reproduce its color palette closely.

Create CSS custom properties near the beginning of:

```text
css/styles.css
```

For example:

```css
:root {
  --color-primary: #...;
  --color-secondary: #...;
  --color-accent: #...;
  --color-background: #...;
  --color-surface: #...;
  --color-text: #...;
  --color-text-muted: #...;
}
```

Derive these colors from the existing Wix website rather than selecting a completely new palette.

Add simple comments explaining which site elements each major color controls.

For example:

```css
/* Main brand color used for buttons and important accents. */
--color-primary: #...;
```

This is particularly important because the future client should be able to change the site's colors without searching through hundreds of CSS rules.

---

# Typography

Inspect the typography used by the Wix prototype.

Try to reproduce the same general appearance without adding unnecessary technical complexity.

If the Wix site uses a common web-safe or system font, use it directly.

If it relies on an external font that creates unnecessary maintenance overhead, choose the closest reasonable system-font alternative unless the font is important to the client's branding.

Preserve the general:

- Font weight
- Heading sizes
- Text hierarchy
- Letter spacing
- Alignment

Do not prioritize exact font matching over simplicity and maintainability.

---

# Content Migration

Reuse the existing public-facing content from the Wix prototype whenever possible.

This includes:

- Business name
- Existing page headings
- Service names
- Existing descriptions
- About text
- Existing calls-to-action
- Service areas
- Contact information
- Existing project descriptions

Do not rewrite the client's content simply to make it sound more polished unless something clearly needs adaptation because of the new implementation.

Do not invent:

- Testimonials
- Customer names
- Certifications
- Licenses
- Awards
- Years of experience
- Guarantees
- Statistics
- Business history

If information is missing, use a clearly identified placeholder rather than fabricating it.

---

# Page Structure

Use the existing Wix site's page organization as the basis for the static site's file structure.

For example, if the Wix website currently contains:

```text
Home
Services
About
Gallery
Contact
```

create corresponding pages such as:

```text
index.html
services.html
about.html
gallery.html
contact.html
```

If the Wix site uses a somewhat different structure, follow the actual Wix site instead.

Do not create unnecessary pages simply because they appeared in an earlier specification.

The existing Wix prototype should determine the appropriate page hierarchy.

---

# Section Structure

Within each page, follow the existing Wix section order as closely as practical.

For example, if the existing home page is:

```text
Navigation
Hero
Introduction
Services
Project Gallery
About Preview
Contact CTA
Footer
```

the static implementation should generally use the same sequence.

Avoid reorganizing the site without a functional reason.

---

# Responsive Reconstruction

Inspect both the desktop and mobile versions of the existing Wix website when possible.

The new site does not need to reproduce every Wix-specific breakpoint exactly.

Instead:

- Preserve the same general visual appearance.
- Make navigation easy to use.
- Ensure photographs resize correctly.
- Prevent horizontal scrolling.
- Stack content naturally on smaller screens.
- Maintain good spacing and readability.

Because maintainability is important, prefer a simple CSS responsive implementation over JavaScript-heavy Wix-like interactions.

---

# Simplify Wix-Specific Features

Wix may implement visual elements using large amounts of generated JavaScript, proprietary components, animations, or complex layout code.

Do **not** attempt to reproduce Wix's underlying implementation.

Reproduce the **visual result**, not Wix's technical architecture.

For example:

Wix implementation:

```text
Large JavaScript component
        ↓
Animated card
        ↓
Responsive layout engine
```

Static replacement:

```text
Semantic HTML
        +
Simple CSS Grid/Flexbox
```

If a Wix animation or interactive effect is primarily decorative, it may be simplified or omitted.

Maintainability is more important than perfectly reproducing unnecessary animation.

---

# Important Editing Comments

Because this website is being migrated specifically to make editing easier for the client, comments should identify areas that came from the existing Wix website.

For example:

```html
<!--
HOME PAGE HERO

To change this headline, edit the text inside the <h1> below.

To change the hero image:
1. Add the new photo to images/general/
2. Open css/styles.css
3. Search for "HOME HERO"
-->
```

For an existing portfolio image:

```html
<!--
PORTFOLIO PHOTO

Image file:
images/portfolio/deck-staining-01.jpg

You can replace the image file while keeping the same filename,
or change the filename in the src="" value below.
-->
```

Comments should help a beginner locate what they want to change without needing to understand the entire codebase.

---

# Do Not Depend on Wix After Migration

The completed static website should operate independently of Wix.

Do not require:

- Wix JavaScript
- Wix APIs
- Wix hosting
- Wix page components
- Wix CSS
- Wix authentication
- Wix image URLs when local copies are practical
- Wix-specific runtime dependencies

The final site should contain the HTML, CSS, and image assets required to display the migrated website independently.

---

# Migration Philosophy

Think of this task as:

```text
Existing Wix prototype
        ↓
Extract design, content, colors, and assets
        ↓
Recreate visual appearance
        ↓
Replace Wix complexity with simple HTML/CSS
        ↓
Make future editing significantly easier
```

The existing Wix website represents the client's current design decisions.

Respect those decisions.

Do not turn this into an unsolicited redesign.

The objective is:

**Same website concept and appearance, much simpler implementation.**

---

# Before Coding

Before generating the project files, briefly summarize your observations from the Wix site, including:

- Pages discovered
- Main sections
- Primary colors
- General typography
- Major images/assets
- Navigation structure
- Any Wix functionality that may need to be simplified

Then proceed with the implementation.

Do not stop and ask for approval unless you encounter something that makes implementation impossible.

Make reasonable decisions and continue.

---

# Final Comparison

After creating the project, compare the finished static implementation against the original Wix site.

Verify that:

- The same major content is present.
- Navigation reflects the Wix site.
- Section order is substantially the same.
- Client photographs have been preserved where possible.
- The color palette closely resembles the original.
- Calls-to-action have been preserved.
- Mobile layout remains usable.
- No unnecessary redesign was introduced.
- The website no longer depends on Wix.
- Ordinary content changes can be performed through GitHub's browser editor.
- The project remains simple HTML and CSS without a build process.

If something could not be reproduced from the Wix site, document it clearly in the README rather than silently omitting it.
