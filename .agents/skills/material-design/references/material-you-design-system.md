# 🎨 Style Guide & UI Architecture System (Material Design 3 / Material You)

This comprehensive technical specification establishes the mandatory design rules, dynamic tokens, geometry, typography, elevation, and responsiveness to build user interfaces with **100% precision and zero ambiguity**.

---

## 🌐 Language & Localization Directive
* **Default Interface Language:** All user interfaces, components, copy, labels, placeholders, and design documents MUST be in **English** by default.
* **Spanish Interfaces:** Generate interfaces in Spanish **ONLY IF the user explicitly requests it** in their prompt.

---

## 1. Dynamic Tokens & Color System (Core Palette)

The agent must never use static or arbitrary hardcoded colors. **All colors must be mapped to Dynamic Semantic Roles**.

### A. Master Semantic Orchestration Rules

To apply any color scheme successfully across all layouts (mobile, tablet, desktop), the agent MUST follow these **four mandatory rules**:

1. **Surfaces & Elevation Rule:**
   - `Surface`: Base canvas (the outermost application background / App Shell).
   - `Surface Container Low`: Fixed side navigation panels (*Standard Navigation Drawer / Navigation Rail*).
   - `Surface Container`: Search bars (`Search Bar`), inactive content cards, neutral input backgrounds.
   - `Surface Container High`: Floating modal dialogs, elevated cards, dropdown menus.
   - `Surface Container Lowest`: Data tables, kanban boards, content modules.

2. **"On-" Contrast Rule:**
   - Any text or icon placed on a `Container` surface must strictly use its corresponding `On...Container` tone (*Example:* If a card uses `Primary Container`, its text must be `On Primary Container`).

3. **Selection State Rule:**
   - `Inactive / Neutral State`: Uses `Surface Container` or `Surface Container Lowest`.
   - `Selected / Active State`: Background changes to `Primary Container`. Internal text/icons adapt to `On Primary Container`.

4. **Single-Theme Rule:**
   - Every application must implement **strictly 1 single palette** from the 10 catalog schemes. Never mix tokens from different schemes.

---

### B. The 3 Surface / Background Modes

1. **Mode A: Tonal M3 Color (Default):**
   - The `Surface` canvas adopts the subtle tonal hue of the palette (e.g., `#F3F6E8` in Forest Sage or `#F4F7FA` in Oceanic Slate). Delivers the native, organic Material You immersion.

2. **Mode B: Pure White:**
   - The `Surface` canvas is set to `#FFFFFF` and `Surface Container` to very light neutral gray (`#F8F9FA` / `#F1F3F5`). Ideal for clean editorial layouts.

3. **Mode C: Neutral Grayscale:**
   - The `Surface` canvas is set to neutral gray (`#F5F5F7` / `#EEEEF0`) and `Surface Container` to `#FFFFFF` or `#E5E5EA`. Ideal for minimal corporate dashboards.

---

### C. Catalog of the 10 Semantic Color Schemes (5 Tonal Families)

#### 🌿 Family 1: Greens & Olive (Health / Sustainability / Nature)

##### Scheme 1: "Forest Sage" (Vibrant Sage Green)
- *Seed:* `#426B29` — Fresh, natural, high readability.
- *Usage:* Health, meditation, sustainability, ecology.

| Semantic Token | Hex Value | UI Role |
| :--- | :--- | :--- |
| **`Primary`** | `#426B29` | Primary buttons, FABs, selected icons. |
| **`On Primary`** | `#FFFFFF` | Text/icons on primary buttons. |
| **`Primary Container`** | `#D7E8CD` | Selected card/item background. |
| **`On Primary Container`** | `#0C2002` | Text/icons on selected items. |
| **`Surface`** | `#F3F6E8` | Base app canvas. |
| **`Surface Container`** | `#EAEFE0` | Search bar, inactive cards. |
| **`Surface Container High`** | `#FAFDF1` | Floating dialogs, menus. |
| **`On Surface`** | `#1A1E17` | Primary text. |
| **`Outline`** | `#73796E` | Input borders, chip outlines. |

##### Scheme 2: "Olive Slate" (Desaturated Olive Green)
- *Seed:* `#5A641F` — Dry olive green with warm creamy base.
- *Usage:* Agriculture, ethical finance, calm reading, documentation.

| Semantic Token | Hex Value | UI Role |
| :--- | :--- | :--- |
| **`Primary`** | `#5A641F` | Primary buttons, FABs, selected icons. |
| **`On Primary`** | `#FFFFFF` | Text/icons on primary buttons. |
| **`Primary Container`** | `#DDE895` | Selected card/item background. |
| **`On Primary Container`** | `#1A1E00` | Text/icons on selected items. |
| **`Surface`** | `#FBF8F1` | Base app canvas. |
| **`Surface Container`** | `#F5EEE2` | Search bar, inactive cards. |
| **`Surface Container High`** | `#FFFDF9` | Floating dialogs, menus. |
| **`On Surface`** | `#1E1B16` | Primary text. |
| **`Outline`** | `#79796C` | Input borders, chip outlines. |

---

#### 🔴 Family 2: Reds & Terracotta (Dynamic / High Visibility / Energy)

##### Scheme 3: "Crimson Quartz" (Deep Crimson Red)
- *Seed:* `#BB1834` — Saturated crisp crimson red.
- *Usage:* Critical alerts, fitness, high-conversion commerce, breaking news.

| Semantic Token | Hex Value | UI Role |
| :--- | :--- | :--- |
| **`Primary`** | `#BB1834` | Primary buttons, FABs, selected icons. |
| **`On Primary`** | `#FFFFFF` | Text/icons on primary buttons. |
| **`Primary Container`** | `#FFDADF` | Selected card/item background. |
| **`On Primary Container`** | `#410009` | Text/icons on selected items. |
| **`Surface`** | `#FFF8F7` | Base app canvas. |
| **`Surface Container`** | `#FFF0EF` | Search bar, inactive cards. |
| **`Surface Container High`** | `#FFF9F8` | Floating dialogs, menus. |
| **`On Surface`** | `#241A1A` | Primary text. |
| **`Outline`** | `#857373` | Input borders, chip outlines. |

##### Scheme 4: "Terracotta Dusk" (Warm Clay Red)
- *Seed:* `#A24244` — Earthy terracotta with organic warmth.
- *Usage:* Social feeds, event platforms, culinary, interior design.

| Semantic Token | Hex Value | UI Role |
| :--- | :--- | :--- |
| **`Primary`** | `#A24244` | Primary buttons, FABs, selected icons. |
| **`On Primary`** | `#FFFFFF` | Text/icons on primary buttons. |
| **`Primary Container`** | `#FBBBBF` | Selected card/item background. |
| **`On Primary Container`** | `#421316` | Text/icons on selected items. |
| **`Surface`** | `#FDF8F7` | Base app canvas. |
| **`Surface Container`** | `#FFF0EF` | Search bar, inactive cards. |
| **`Surface Container High`** | `#FFF8F7` | Floating dialogs, menus. |
| **`On Surface`** | `#241A1A` | Primary text. |
| **`Outline`** | `#837373` | Input borders, chip outlines. |

---

#### 💜 Family 3: Purples & Violets (Productivity / SaaS / Lifestyle)

##### Scheme 5: "Lavender Breeze" (Canonical Material Purple)
- *Seed:* `#6750A4` — Canonical Material 3 lavender violet.
- *Usage:* Email, cloud SaaS, productivity suites, task boards.

| Semantic Token | Hex Value | UI Role |
| :--- | :--- | :--- |
| **`Primary`** | `#6750A4` | Primary buttons, FABs, selected icons. |
| **`On Primary`** | `#FFFFFF` | Text/icons on primary buttons. |
| **`Primary Container`** | `#C8B6FF` | Selected card/item background. |
| **`On Primary Container`** | `#28164D` | Text/icons on selected items. |
| **`Surface`** | `#E5E2F3` | Base app canvas. |
| **`Surface Container`** | `#F1EEF8` | Search bar, inactive cards. |
| **`Surface Container High`** | `#FAF8FE` | Floating dialogs, menus. |
| **`On Surface`** | `#1D192B` | Primary text. |
| **`Outline`** | `#79747E` | Input borders, chip outlines. |

##### Scheme 6: "Orchid Velvet" (Floral Orchid Purple)
- *Seed:* `#8E4A8D` — Elegant magenta orchid tone.
- *Usage:* Creative studios, lifestyle, wellness, beauty, creator tools.

| Semantic Token | Hex Value | UI Role |
| :--- | :--- | :--- |
| **`Primary`** | `#8E4A8D` | Primary buttons, FABs, selected icons. |
| **`On Primary`** | `#FFFFFF` | Text/icons on primary buttons. |
| **`Primary Container`** | `#FFD7F7` | Selected card/item background. |
| **`On Primary Container`** | `#360538` | Text/icons on selected items. |
| **`Surface`** | `#FEF6FA` | Base app canvas. |
| **`Surface Container`** | `#FFF1F8` | Search bar, inactive cards. |
| **`Surface Container High`** | `#FFF9FC` | Floating dialogs, menus. |
| **`On Surface`** | `#201A1E` | Primary text. |
| **`Outline`** | `#82737D` | Input borders, chip outlines. |

---

#### 🌊 Family 4: Blues & Teals (Corporate / Analytics / Technical)

##### Scheme 7: "Oceanic Slate" (Crisp Oceanic Slate)
- *Seed:* `#2B638B` — Clean deep oceanic slate blue.
- *Usage:* Data analytics, fintech, cloud consoles, corporate dashboards.

| Semantic Token | Hex Value | UI Role |
| :--- | :--- | :--- |
| **`Primary`** | `#2B638B` | Primary buttons, FABs, selected icons. |
| **`On Primary`** | `#FFFFFF` | Text/icons on primary buttons. |
| **`Primary Container`** | `#CDE5F7` | Selected card/item background. |
| **`On Primary Container`** | `#001E30` | Text/icons on selected items. |
| **`Surface`** | `#F4F7FA` | Base app canvas. |
| **`Surface Container`** | `#E9EEF4` | Search bar, inactive cards. |
| **`Surface Container High`** | `#F8FAFC` | Floating dialogs, menus. |
| **`On Surface`** | `#181C20` | Primary text. |
| **`Outline`** | `#71787E` | Input borders, chip outlines. |

##### Scheme 8: "Aqua Frost" (Clinical Aqua Teal)
- *Seed:* `#006874` — High clarity frosty turquoise.
- *Usage:* Telemedicine, telemetry, infrastructure monitoring, weather.

| Semantic Token | Hex Value | UI Role |
| :--- | :--- | :--- |
| **`Primary`** | `#006874` | Primary buttons, FABs, selected icons. |
| **`On Primary`** | `#FFFFFF` | Text/icons on primary buttons. |
| **`Primary Container`** | `#97F0FF` | Selected card/item background. |
| **`On Primary Container`** | `#001F24` | Text/icons on selected items. |
| **`Surface`** | `#F3F6F8` | Base app canvas. |
| **`Surface Container`** | `#EAEFE2` | Search bar, inactive cards. |
| **`Surface Container High`** | `#F9FCFC` | Floating dialogs, menus. |
| **`On Surface`** | `#191C1D` | Primary text. |
| **`Outline`** | `#70797B` | Input borders, chip outlines. |

---

#### 🍯 Family 5: Organics & Amber (Warmth / Editorial / Craftsmanship)

##### Scheme 9: "Golden Amber" (Luminous Honey Amber)
- *Seed:* `#7A5900` — Warm golden amber with rich contrast.
- *Usage:* Notes, recipes, executive metrics, curated reading.

| Semantic Token | Hex Value | UI Role |
| :--- | :--- | :--- |
| **`Primary`** | `#7A5900` | Primary buttons, FABs, selected icons. |
| **`On Primary`** | `#FFFFFF` | Text/icons on primary buttons. |
| **`Primary Container`** | `#FFDF9E` | Selected card/item background. |
| **`On Primary Container`** | `#261A00` | Text/icons on selected items. |
| **`Surface`** | `#FBF8F1` | Base app canvas. |
| **`Surface Container`** | `#F5EEE2` | Search bar, inactive cards. |
| **`Surface Container High`** | `#FFFDF9` | Floating dialogs, menus. |
| **`On Surface`** | `#1E1B16` | Primary text. |
| **`Outline`** | `#807567` | Input borders, chip outlines. |

##### Scheme 10: "Desert Bloom" (Warm Sienna Earth)
- *Seed:* `#85511A` — Rustic sienna bronze tone.
- *Usage:* Gastronomy, travel logs, editorial showcases, architecture.

| Semantic Token | Hex Value | UI Role |
| :--- | :--- | :--- |
| **`Primary`** | `#85511A` | Primary buttons, FABs, selected icons. |
| **`On Primary`** | `#FFFFFF` | Text/icons on primary buttons. |
| **`Primary Container`** | `#FFDCC3` | Selected card/item background. |
| **`On Primary Container`** | `#2C1500` | Text/icons on selected items. |
| **`Surface`** | `#FFF9F6` | Base app canvas. |
| **`Surface Container`** | `#FFF1EA` | Search bar, inactive cards. |
| **`Surface Container High`** | `#FFF9F7` | Floating dialogs, menus. |
| **`On Surface`** | `#201A16` | Primary text. |
| **`Outline`** | `#837367` | Input borders, chip outlines. |

---

## 2. Geometry, Elevation & Layout Architecture

### A. Border Radius Hierarchy
* **App Shell Frame:** `28px - 32px`
* **Modal Dialogs & Drawers (`md-dialog`):** `28px`
* **Content Cards:** `20px - 24px`
* **Inner Images / Media:** `16px` *(Child radius < Parent container)*
* **Form Inputs (`md-outlined-text-field`):** `8px`
* **Pills, Buttons, Search Bars, Badges:** `9999px`

### B. Adaptive Screen Breakpoints
* **Compact (Mobile):** `< 600px` — Bottom Navigation Bar (`80px`), Single Pane, Circular FAB.
* **Medium (Tablet):** `600px - 839px` — Navigation Rail (`64px - 72px`), Wide Single Pane.
* **Expanded (Desktop):** `≥ 840px` — Navigation Drawer (`240px - 280px`), 3-Pane Layout, Extended FAB.
