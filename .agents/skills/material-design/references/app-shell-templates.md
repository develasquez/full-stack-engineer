# 🏛️ Material Design 3 (M3) App Shell & Layout Templates

Templates de maquetación HTML y layouts responsivos de alta fidelidad según la especificación de **Material Design 3 (Material You)**.

---

## 1. M3 Responsive App Shell (Desktop 3-Pane / Mobile Drill-down)

Estructura canónica que adapta la navegación según el viewport:
- **Desktop (>= 1024px):** Barra superior (Top App Bar), Navigation Drawer colapsable a la izquierda, área central de scroll independiente y panel de actividad/contexto a la derecha (>= 1280px).
- **Mobile (< 1024px):** Bottom Navigation bar fija en la base con safe-areas, drawer modal flotante y barra superior compacta.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Material 3 Application</title>
  
  <!-- Roboto Typography & Material Symbols Outlined (Local Offline) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap">
  <link rel="stylesheet" href="/vendor/material-web/material-symbols.css">
  
  <!-- Tailwind Utilities & Global M3 Design Tokens -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="/style.css">
  
  <!-- Material 3 Web Components Bundle (Zero external dependencies) -->
  <script type="module" src="/vendor/material-web/material-web.bundle.js"></script>
</head>
<body class="min-h-screen flex flex-col font-sans antialiased bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)]" data-theme="forest-sage">
  
  <!-- Top App Bar -->
  <header id="header-container" class="h-16 flex items-center justify-between px-4 lg:px-6 bg-[var(--md-sys-color-surface)] border-b border-[var(--md-sys-color-outline-variant)] flex-shrink-0 z-30">
    <div class="flex items-center gap-3">
      <md-icon-button id="btn-toggle-drawer" aria-label="Toggle navigation">
        <md-icon>menu</md-icon>
      </md-icon-button>
      <div class="flex items-center gap-2 font-medium text-lg tracking-tight">
        <md-icon class="text-[var(--md-sys-color-primary)]">dashboard</md-icon>
        <span id="app-title">Application Name</span>
      </div>
    </div>
    
    <!-- M3 Search Bar Container -->
    <div class="hidden md:flex items-center flex-1 max-w-md mx-6">
      <div class="w-full h-10 px-4 rounded-full bg-[var(--md-sys-color-surface-container)] flex items-center gap-3 border border-transparent focus-within:border-[var(--md-sys-color-outline)] transition-all">
        <md-icon class="text-[var(--md-sys-color-on-surface-variant)] text-sm">search</md-icon>
        <input type="text" placeholder="Search..." class="bg-transparent border-none outline-none w-full text-sm text-[var(--md-sys-color-on-surface)] placeholder-[var(--md-sys-color-on-surface-variant)]">
      </div>
    </div>

    <!-- Actions / Theme Switcher -->
    <div class="flex items-center gap-2">
      <md-icon-button id="btn-toggle-theme" aria-label="Toggle dark mode">
        <md-icon>dark_mode</md-icon>
      </md-icon-button>
      <div id="user-profile-badge" class="w-8 h-8 rounded-full bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] flex items-center justify-center font-bold text-xs">
        US
      </div>
    </div>
  </header>
  
  <!-- Responsive Layout Shell (3-Pane Desktop) -->
  <div class="flex-1 flex flex-col lg:flex-row w-full overflow-hidden">
    <!-- Standard Navigation Drawer -->
    <aside id="drawer-container" class="hidden lg:flex flex-col w-64 bg-[var(--md-sys-color-surface-container-low)] p-4 flex-shrink-0 border-r border-[var(--md-sys-color-outline-variant)]">
      <!-- Navigation items rendered here -->
    </aside>

    <!-- Main Content Canvas -->
    <main id="main-content-container" class="flex-1 flex flex-col overflow-y-auto p-4 lg:p-6 space-y-6 pb-24 lg:pb-6">
      <!-- Dynamic page content / cards rendered here -->
    </main>

    <!-- Activity / Context Rail (Wide screens) -->
    <aside id="activity-container" class="hidden xl:flex flex-col w-80 bg-[var(--md-sys-color-surface-container-low)] p-5 flex-shrink-0 border-l border-[var(--md-sys-color-outline-variant)]">
      <!-- Secondary telemetry / side panels -->
    </aside>
  </div>

  <!-- Mobile Bottom Navigation Bar (< 1024px) -->
  <nav id="bottom-nav-container" class="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[var(--md-sys-color-surface-container)] border-t border-[var(--md-sys-color-outline-variant)] flex items-center justify-around px-2">
    <!-- Bottom nav tabs -->
  </nav>

  <script type="module" src="/load.js"></script>
</body>
</html>
```

---

## 2. Navigation Item Pattern (Active vs Inactive States)

```html
<!-- Active Navigation Item -->
<button class="w-full flex items-center gap-3 px-4 py-3 rounded-full bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] font-medium text-sm transition-colors">
  <md-icon>inbox</md-icon>
  <span>Inbox</span>
  <span class="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)]">12</span>
</button>

<!-- Inactive Navigation Item -->
<button class="w-full flex items-center gap-3 px-4 py-3 rounded-full text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)] font-medium text-sm transition-colors">
  <md-icon>send</md-icon>
  <span>Sent</span>
</button>
```

---

## 3. Surface Card & Metric Tile Pattern

```html
<div class="m3-card p-6 flex flex-col gap-4">
  <div class="flex items-center justify-between">
    <div class="text-xs font-semibold tracking-wider uppercase text-[var(--md-sys-color-on-surface-variant)]">
      Total Compute Instances
    </div>
    <span class="m3-badge-success">Operational</span>
  </div>
  
  <div class="text-3xl font-bold tracking-tight text-[var(--md-sys-color-on-surface)]">
    1,428 vCPU
  </div>
  
  <div class="text-xs text-[var(--md-sys-color-on-surface-variant)] flex items-center gap-1">
    <md-icon class="text-xs text-[var(--md-sys-color-primary)]">trending_up</md-icon>
    <span>+12% vs last month</span>
  </div>
</div>
```
