# 🎨 Catálogo Completo y Sistema de Roles de Color Material Design 3 (M3)

Guía completa de integración de **Material Web (M3 / `@material/web`)** y el **Sistema Oficial de Roles de Color de Google ([m3.material.io/styles/color/roles](https://m3.material.io/styles/color/roles))** con la arquitectura **Vanilla-Core**.

---

## 🌈 El Sistema de Roles de Color Oficial de Material 3 (M3)

En Material 3, los colores se organizan en **Roles Funcionales** agrupados en 3 capas fundamentales. Cada rol de fondo tiene una contraparte `on-*` obligatoria para garantizar el contraste de accesibilidad (WCAG AAA):

```
┌────────────────────────────────────────────────────────────────────────┐
│                        1. COLORES DE ACENTO                            │
├───────────────────┬────────────────────────────────────────────────────┤
│ Primary           │ Acción principal (Filled Buttons, FAB, Active Tabs)│
│ On Primary        │ Texto/iconos sobre fondo Primary                   │
│ Primary Container │ Contenedor tonal de énfasis medio-alto             │
│ On Primary Cont.  │ Texto sobre Primary Container                      │
├───────────────────┼────────────────────────────────────────────────────┤
│ Secondary         │ Acciones secundarias y chips de navegación         │
│ Secondary Cont.   │ Estados activos en navegación y filtros            │
├───────────────────┼────────────────────────────────────────────────────┤
│ Tertiary          │ Contrastes expresivos y estados especiales         │
│ Tertiary Cont.    │ Fills destacados para tags o badges de alerta media│
├───────────────────┼────────────────────────────────────────────────────┤
│ Error             │ Acciones destructivas y errores de validación      │
│ Error Container   │ Badges y fondos de alerta crítica                  │
└───────────────────┴────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│               2. JERARQUÍA TONAL DE SUPERFICIES (SURFACES)             │
├──────────────────────────┬─────────────────────────────────────────────┤
│ Surface                  │ Lienzo base de la interfaz                  │
│ Surface Container Lowest │ Tarjetas blancas puras (#FFFFFF) en Light   │
│ Surface Container Low    │ Tarjetas con elevación suave                │
│ Surface Container        │ Contenedor por defecto de modales y paneles │
│ Surface Container High   │ Diálogos y barras de búsqueda elevadas      │
│ Surface Container Highest│ Hojas inferiores (Bottom Sheets) y Pickers  │
└──────────────────────────┴─────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                  3. TEXTO, ICONOS Y CONTORNOS ("ON" ROLES)             │
├───────────────────────┬────────────────────────────────────────────────┤
│ On Surface            │ Títulos y texto principal (Máximo contraste)   │
│ On Surface Variant    │ Texto de soporte, subtítulos y cabeceras       │
│ Outline               │ Bordes de inputs activos y botones outlined    │
│ Outline Variant       │ Líneas divisorias, bordes de cards y tablas    │
└───────────────────────┴────────────────────────────────────────────────┘
```

---

## 📚 Catálogo de Componentes M3

1. [Botones (Buttons)](#1-botones-buttons)
2. [Icon Buttons](#2-icon-buttons)
3. [Campos de Texto (Text Fields)](#3-campos-de-texto-text-fields)
4. [Selectores (Select)](#4-selectores-select)
5. [Checkbox](#5-checkbox)
6. [Switch](#6-switch)
7. [Sliders (Controles Deslizantes)](#7-sliders-controles-deslizantes)
8. [Diálogos Modales (Dialogs)](#8-diálogos-modales-dialogs)
9. [Pestañas (Tabs)](#9-pestañas-tabs)

---

## 1. Botones (Buttons)

- `<md-filled-button>`: `Primary` fill + `On Primary` text.
- `<md-tonal-button>`: `Secondary Container` fill + `On Secondary Container` text.
- `<md-outlined-button>`: `Outline` border + `Primary` text.
- `<md-text-button>`: `Primary` text sin fondo.

```html
<md-filled-button id="btn-save">
  <md-icon slot="icon">save</md-icon>
  Guardar Tarea
</md-filled-button>
```

---

## 2. Icon Buttons

```html
<md-icon-button id="btn-delete" aria-label="Eliminar">
  <md-icon>delete</md-icon>
</md-icon-button>
```

---

## 3. Campos de Texto (Text Fields)

```html
<md-outlined-text-field
  id="input-title"
  label="Título"
  supporting-text="Texto de ayuda"
  required>
  <md-icon slot="leading-icon">edit_note</md-icon>
</md-outlined-text-field>
```

---

## 4. Selectores (Select)

```html
<md-outlined-select id="select-category" label="Categoría">
  <md-select-option value="Frontend" selected>
    <div slot="headline">Frontend</div>
  </md-select-option>
</md-outlined-select>
```

---

## 5. Checkbox

```html
<md-checkbox id="chk-task" touch-target="wrapper"></md-checkbox>
```

---

## 6. Switch

```html
<md-switch id="switch-theme" selected icons show-only-selected-icon></md-switch>
```

---

## 7. Sliders

```html
<md-slider id="slider-priority" min="1" max="3" value="2" step="1" labeled ticks></md-slider>
```

---

## 8. Diálogos (Dialogs)

```html
<md-dialog id="confirm-dialog">
  <div slot="headline">Confirmar</div>
  <form id="dialog-form" slot="content" method="dialog">
    ¿Eliminar este elemento?
  </form>
  <div slot="actions">
    <md-text-button form="dialog-form" value="cancel">Cancelar</md-text-button>
    <md-filled-button form="dialog-form" value="confirm">Aceptar</md-filled-button>
  </div>
</md-dialog>
```

---

## 9. Pestañas (Tabs)

> [!IMPORTANT]
> Usa siempre el atributo `inline-icon` en `<md-primary-tab>` para evitar que los iconos y etiquetas se apilen verticalmente.

```html
<md-tabs id="filter-tabs" active-tab-index="0">
  <md-primary-tab data-filter="all" inline-icon>
    <md-icon slot="icon">list_alt</md-icon>
    Todas
  </md-primary-tab>
</md-tabs>
```
