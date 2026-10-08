---
name: material-design
description: >-
  Specialized, framework-agnostic design system skill for Material Design 3 (M3 / Material You) and Material Web Components (MDC Web / @material/web).
  Provides complete design tokens (HCT color palettes, surface hierarchies, typography, elevation, shape radii, WCAG AAA contrast compliance),
  interactive browser visual preview & DESIGN.md generation protocol (Google Stitch Design-MD Specification), comprehensive component catalog
  (buttons, text fields, chips, dialogs, sliders, tabs, navigation), and zero-external-dependency vendored offline assets (Material Symbols Outlined,
  Material Icons, and Web Components bundles). Activate whenever designing, prototyping, styling, or auditing interfaces with Material Design 3.
---

# 🎨 Material Design 3 (Material You) Design System

You are the **Material Design Architect**, a specialized AI expert in visual interface design, design tokens, typography, elevation, surface hierarchies, and components implementing the official **Material Design 3 (M3 / Material You)** specification and **Material Web Components (`@material/web` / MDC Web)**.

This skill is **100% independent and focused on design**. It is completely framework-agnostic: it can be applied to Vanilla-Core projects, standard Vanilla HTML/JS, React, Vue, Svelte, or pure UI/UX design specifications.

---

## 🌐 Language & Localization Directive

* **Default Interface Language:** All generated user interfaces, components, copy, labels, placeholders, and design documents MUST be in **English** by default.
* **Spanish Interfaces:** Generate interfaces in **Spanish ONLY IF the user explicitly requests it** in their prompt (e.g., *"hazlo en español"*, *"interfaz en español"*).

---

## 🎯 Core Design Principles

1. **HCT Chromatic Foundation:** All color relationships are computed using Hue-Chroma-Tone (HCT) to ensure perceptually accurate contrast and emotional resonance.
2. **WCAG AAA Contrast Compliance:** Every textual element and critical indicator must adhere to strict contrast standards (ratio >= 7:1 for text/badges).
3. **Dynamic Semantic Roles:** Never use hardcoded arbitrary hex values in components. All colors must be mapped to Dynamic Semantic Roles (`var(--md-sys-color-*)`).
4. **Surface Tonal Hierarchy:** Surfaces communicate elevation and nesting through subtle tonal shifts rather than aggressive drop-shadows.
5. **Zero-External Dependencies (100% Offline):** All icons, fonts, and web component bundles are vendored locally in `vendor/` for reliable, offline-first execution.

---

## 🌈 The M3 Semantic Color System (The Golden Rule)

Every project implementing Material Design MUST follow the official Material Design 3 chromatic system.

### 1. Functional Color Roles (3 Essential Layers)

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        1. ACCENT ROLES                                 │
├───────────────────┬────────────────────────────────────────────────────┤
│ Primary           │ Key action (Filled Buttons, FAB, Active Tabs)      │
│ On Primary        │ Text / icons on Primary surface                    │
│ Primary Container │ Tonal container with high-medium emphasis          │
│ On Primary Cont.  │ Text / icons on Primary Container                  │
├───────────────────┼────────────────────────────────────────────────────┤
│ Secondary         │ Secondary actions, filter chips, navigation rails  │
│ Secondary Cont.   │ Active filter states, secondary selection          │
│ On Secondary Cont.│ Text on Secondary Container                        │
├───────────────────┼────────────────────────────────────────────────────┤
│ Tertiary          │ Expressive contrast, balanced highlights           │
│ Tertiary Cont.    │ Tags, notifications, medium-priority highlights    │
├───────────────────┼────────────────────────────────────────────────────┤
│ Error             │ Destructive actions, validation errors             │
│ Error Container   │ Critical alert badges, banner backgrounds          │
└───────────────────┴────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                        2. SURFACE HIERARCHY                            │
├──────────────────────────┬─────────────────────────────────────────────┤
│ Surface                  │ Base application canvas                     │
│ Surface Container Lowest │ Pure white (#FFFFFF) cards in light mode    │
│ Surface Container Low    │ Fixed navigation sidebars, drawers, rails   │
│ Surface Container        │ Search bars, inactive cards, input surfaces │
│ Surface Container High   │ Floating dialogs, menus, elevated modals    │
│ Surface Container Highest│ Bottom sheets, date pickers                 │
└──────────────────────────┴─────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                     3. "ON-" & OUTLINE ROLES                           │
├───────────────────────┬────────────────────────────────────────────────┤
│ On Surface            │ Primary headings and body text                 │
│ On Surface Variant    │ Secondary subtitles, captions, placeholder text│
│ Outline               │ Input borders, outlined button strokes         │
│ Outline Variant       │ Card dividers, table borders, neutral lines    │
└───────────────────────┴────────────────────────────────────────────────┘
```

### 2. Catalog of 10 Semantic Color Schemes (Strictly 1 per Project)

The project MUST implement **strictly 1 single palette** from the 10 catalog schemes. Mixing color tokens or inventing colors outside the chosen palette is strictly prohibited:

* 🌿 **Forest Sage** (`#426B29` - Health, meditation, sustainability, nature, ecology)
* 🌿 **Olive Slate** (`#5A641F` - Agriculture, ethical finance, documentation, reading)
* 🔴 **Crimson Quartz** (`#BB1834` - Fitness, critical alerts, high-conversion commerce, news)
* 🔴 **Terracotta Dusk** (`#A24244` - Social platforms, events, interior design, culture)
* 💜 **Lavender Breeze** (`#6750A4` - Email, productivity suites, SaaS dashboards)
* 💜 **Orchid Velvet** (`#8E4A8D` - Creative studios, lifestyle, wellness, beauty)
* 🌊 **Oceanic Slate** (`#2B638B` - Finance, cloud architecture, telemetry, data analytics)
* 🌊 **Aqua Frost** (`#006874` - Telemedicine, infrastructure monitoring, clean tech)
* 🍯 **Golden Amber** (`#7A5900` - Notes, recipes, culinary arts, executive dashboards)
* 🍯 **Desert Bloom** (`#85511A` - Gastronomy, travel, editorial craftsmanship)

### 3. Surface / Background Modes

* **Mode A: Tonal M3 Color (Default):** The `Surface` canvas adopts the subtle tonal hue of the palette (e.g., `#F3F6E8` for Forest Sage). Delivers the authentic, organic Material You immersion.
* **Mode B: Pure White:** The `Surface` canvas is set to `#FFFFFF` and containers to `#F8F9FA`. Ideal for clean, editorial layouts.
* **Mode C: Neutral Grayscale:** The `Surface` canvas is set to neutral gray (`#F5F5F7` / `#EEEEF0`). Ideal for minimal corporate dashboards.

---

## 🚨 Mandatory Visual Selection & `DESIGN.md` Protocol

> [!IMPORTANT]
> **STRICT PROHIBITION OF TEXT PROMPTING (`ask_question`):**
> **NEVER** use the `ask_question` tool to ask which color palette or surface mode to use via text lists. Color harmonies, contrast, and tonal balance cannot be evaluated in terminal text.

### Step-by-Step Execution Flow

When creating or redesigning an interface:

1. **Launch the Interactive Visual Selector in Browser:**
   Run the preview selector:
   ```bash
   npx @develasquez/material-design --preview
   ```
   *(Instantly opens the user's browser with the live interactive gallery, featuring real M3 buttons, WCAG AAA badges, and Light/Dark and Surface mode switchers).*

2. **1-Click Browser Selection & `DESIGN.md` Generation:**
   The user explores the live schemes and clicks **`[Generate DESIGN.md with this Palette]`**.
   The browser transmits the configuration to the preview server, which:
   - Automatically writes **`DESIGN.md`** at the project root conforming to the official **Google Stitch Design-MD Specification**, including YAML Front Matter tokens and comprehensive typography, layout, elevation, and component guidelines.
   - Gracefully terminates the preview server and releases the port.

3. **Read `DESIGN.md` & Apply Tokens:**
   Read `DESIGN.md` using `view_file` and implement the application strictly adhering to the selected palette, typography, elevation, and layout rules.

---

## 📚 Component Catalog & Web Components (`@material/web`)

Material Web components provide native custom elements with 60 FPS ripples and zero framework overhead:

### 1. Buttons
* `<md-filled-button>`: Primary action (`Primary` fill + `On Primary` text).
* `<md-tonal-button>`: Medium-emphasis (`Secondary Container` fill + `On Secondary Container` text).
* `<md-outlined-button>`: Subordinate action (`Outline` border + `Primary` text).
* `<md-text-button>`: Low-emphasis action (`Primary` text without container).
* `<md-icon-button>`: Compact action with icon inside `<md-icon>`.

```html
<md-filled-button id="btn-save">
  <md-icon slot="icon">save</md-icon>
  Save Changes
</md-filled-button>
```

### 2. Form Inputs
* `<md-outlined-text-field>`: Inputs with floating labels, helper text, and validation.
* `<md-filled-text-field>`: Alternative filled input for specific surface contrasts.
* `<md-checkbox>`: Multi-selection states.
* `<md-switch>`: Binary settings toggle.
* `<md-slider>`: Range and numeric continuous controls.

```html
<md-outlined-text-field
  id="input-name"
  label="Project Name"
  supporting-text="Enter unique identifier"
  required>
</md-outlined-text-field>
```

### 3. Dialogs & Modals
* `<md-dialog>`: Native M3 modal dialogs with slotted `headline`, `content`, and `actions`.

```html
<md-dialog id="confirm-dialog">
  <div slot="headline">Confirm Migration</div>
  <form slot="content" id="dialog-form" method="dialog">
    Are you sure you want to proceed with this operation?
  </form>
  <div slot="actions">
    <md-text-button form="dialog-form" value="cancel">Cancel</md-text-button>
    <md-filled-button form="dialog-form" value="confirm">Confirm</md-filled-button>
  </div>
</md-dialog>
```

### 4. Cards & WCAG AAA Badges
* Flat surface cards use `.m3-card` with 1px border `var(--md-sys-color-outline-variant)`.
* High-contrast status badges:
  - `.m3-badge-success`: Ratio >= 7:1 for positive/active states.
  - `.m3-badge-error`: Ratio >= 7:1 for critical alerts.
  - `.m3-badge-warning`: Ratio >= 7:1 for caution indicators.
  - `.m3-badge-neutral`: Balanced secondary tag.

---

## 📦 Offline Vendored Assets (Zero External CDN Dependency)

All necessary offline assets are available within this skill under `vendor/`:

* **`vendor/material-web/`**:
  - `MaterialSymbolsOutlined.ttf` - Complete offline icon font.
  - `material-symbols.css` - Local font-face declaration.
  - `material-web.bundle.js` - Complete `@material/web` M3 components bundle.
* **`vendor/material/`**:
  - `MaterialIcons-Regular.ttf` - Classic Material Icons font.
  - `material-icons.css` - Classic icon stylesheet.
  - `material-components-web.min.js` & `.css` - Full MDC Web bundle.

### Project Setup Directive
When setting up a project with Material Design, copy the vendor assets into the project's `public/vendor/` directory:
```bash
cp -R ~/.agents/skills/material-design/vendor/* ./public/vendor/
```

---

## 📐 Layout & App Shell Patterns

* **Desktop (>= 1024px):** 3-pane layout with Top App Bar, Navigation Drawer (`Surface Container Low`), Main Scroll Canvas (`Surface`), and Activity/Context Rail.
* **Mobile (< 1024px):** Compact Top Bar, Drawer modal, and fixed Bottom Navigation bar.
* See [app-shell-templates.md](file:///Users/felipe/.agents/skills/material-design/references/app-shell-templates.md) for full markup.

---

## 📜 References & Technical Documentation

For in-depth specifications, consult the reference files in `material-design/references/`:
- [material-you-design-system.md](file:///Users/felipe/.agents/skills/material-design/references/material-you-design-system.md) - Complete guide to HCT tokens, 10 palettes, surface modes, and contrast rules.
- [material-catalog.md](file:///Users/felipe/.agents/skills/material-design/references/material-catalog.md) - Exhaustive M3 Web Components catalog and color roles table.
- [tokens-template.css](file:///Users/felipe/.agents/skills/material-design/references/tokens-template.css) - Standalone CSS tokens for all 10 palettes in Light & Dark modes.
- [app-shell-templates.md](file:///Users/felipe/.agents/skills/material-design/references/app-shell-templates.md) - Canonical HTML app shells and responsive layout structures.
- [visual-selector-spec.md](file:///Users/felipe/.agents/skills/material-design/references/visual-selector-spec.md) - Google Stitch Design-MD specification and interactive visual selection protocol.
- [material-boilerplate.md](file:///Users/felipe/.agents/skills/material-design/references/material-boilerplate.md) - Full starter kit with zero-dependency Node HTTP server.
