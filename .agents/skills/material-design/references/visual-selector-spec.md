# 🎨 Visual Selector Protocol & Google Stitch `DESIGN.md` Specification

Guía y especificación técnica para la selección visual interactiva de paletas Material Design 3 y la generación del archivo de especificación `DESIGN.md` conforme al estándar **Google Stitch Design-MD Specification**.

---

## 🚨 1. Regla de Oro: Prohibición de Prompting en Texto

> [!CAUTION]
> **PROHIBICIÓN ESTRICTA DE `ask_question` PARA ESTÉTICA O COLORES:**
> **JAMÁS** utilices la herramienta `ask_question` para consultar al usuario qué paleta cromática, modo de superficie o variantes de color prefiere mediante listas de texto en terminal.
> El ojo humano no puede juzgar contrastes WCAG AAA, armonías cromáticas HCT ni saturación tonal mediante strings de texto.

---

## 🖥️ 2. Flujo de Selección Visual en Navegador

Cuando el usuario solicite crear o rediseñar una interfaz con Material Design:

1. **Lanzamiento del Selector Interactivo:**
   Ejecuta mediante `run_command`:
   ```bash
   npx @develasquez/material-design --preview
   # O el comando local si está instalado: material-design --preview
   ```
   *Esto abre inmediatamente una pestaña en el navegador con la galería viva interactiva, componentes reales (botones rellenos, tonal, outlined, inputs, badges WCAG AAA) y conmutadores de Light/Dark Mode y Modos de Superficie.*

2. **Selección en 1 Clic y Emisión de `DESIGN.md`:**
   El usuario interactúa y hace clic en **`[Generate DESIGN.md with this Palette]`**. El servidor escribe automáticamente el archivo `DESIGN.md` en la raíz del proyecto y se cierra liberando el puerto.

3. **Lectura y Adherencia Estricta:**
   El agente lee `DESIGN.md` con `view_file` y respeta al 100% cada token semántico y regla allí consignada.

---

## 📄 3. Estructura Canónica de `DESIGN.md` (Google Stitch Specification)

Todo archivo `DESIGN.md` generado DEBE cumplir con la siguiente estructura formal:

```markdown
---
design-system: "Material Design 3 (Material You)"
version: "1.0.0"
theme:
  id: "forest-sage"
  name: "Forest Sage"
  family: "Greens & Olive"
  seed: "#426B29"
  surface-mode: "tonal" # tonal | pure-white | neutral-gray
tokens:
  primary: "#426B29"
  on-primary: "#FFFFFF"
  primary-container: "#D7E8CD"
  on-primary-container: "#0C2002"
  secondary-container: "#E2E5DC"
  on-secondary-container: "#1C1D1B"
  surface: "#F3F6E8"
  surface-container-low: "#F8FAF0"
  surface-container: "#EAEFE0"
  surface-container-high: "#FAFDF1"
  surface-container-lowest: "#FFFFFF"
  on-surface: "#1A1E17"
  on-surface-variant: "#595C56"
  outline: "#73796E"
  outline-variant: "#E0E5D7"
typography:
  font-family: "Roboto, system-ui, sans-serif"
  headline-large: "32px / 40px, font-weight 700"
  headline-medium: "24px / 32px, font-weight 600"
  title-medium: "16px / 24px, font-weight 500"
  body-medium: "14px / 20px, font-weight 400"
  label-small: "11px / 16px, font-weight 700"
shape:
  corner-small: "8px"
  corner-medium: "12px"
  corner-large: "16px"
  corner-extra-large: "24px"
  corner-full: "9999px"
contrast-compliance: "WCAG AAA (>= 7:1)"
---

# 🎨 Project Design Specification (`DESIGN.md`)

## 1. Executive Summary
- **Selected Palette:** Forest Sage (`#426B29`)
- **Atmosphere:** Natural, serene, sustainable, high cognitive clarity.
- **Surface Strategy:** Tonal M3 Color (`#F3F6E8`) for full organic Material You depth.

## 2. Core Color Assignments
- **Primary Actions:** `#426B29` on `#FFFFFF` (Primary buttons, FABs, key toggles).
- **Active Navigation / Selection:** `#D7E8CD` with text `#0C2002` (Selected nav drawer items, active tabs).
- **Cards & Data Tables:** Surface Container Lowest (`#FFFFFF`) with 1px border `#E0E5D7`.
- **Badges:** WCAG AAA strict tokens.

## 3. Interaction & Elevation Directives
- **Ripples:** 60 FPS Material Ripple enabled on all interactive elements.
- **Elevation:** Flat border-based elevation for web performance (`border: 1px solid var(--md-sys-color-outline-variant)`).
```
