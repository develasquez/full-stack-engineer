# 📜 Material Design 3 (M3) Boilerplate Kit

Usa este kit cuando construyas o inicialices una aplicación con Material Web M3 y el sistema de diseño Material You.

---

## 1. `package.json`

```json
{
  "name": "vanilla-core-m3-app",
  "version": "1.0.0",
  "description": "Vanilla-Core architecture with Material 3 Web Components",
  "main": "server.js",
  "scripts": {
    "dev": "node server.js"
  }
}
```

---

## 2. `server.js` (Zero-Dependency Node HTTP Server con Auto-Port Fallback)

```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');
const net = require('net');

let basePort = parseInt(process.env.PORT, 10) || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function checkPortAvailable(port) {
  return new Promise((resolve) => {
    const tester = net.createServer()
      .once('error', () => resolve(false))
      .once('listening', () => {
        tester.once('close', () => resolve(true)).close();
      })
      .listen(port);
  });
}

async function findAvailablePort(startPort) {
  let port = startPort;
  while (!(await checkPortAvailable(port))) {
    port++;
  }
  return port;
}

async function start() {
  const port = await findAvailablePort(basePort);

  const server = http.createServer((req, res) => {
    if (req.url === '/favicon.ico') {
      res.writeHead(200, { 'Content-Type': 'image/x-icon' });
      res.end();
      return;
    }

    const cleanUrl = req.url.split('?')[0];
    let filePath = path.join(__dirname, cleanUrl === '/' ? 'index.html' : cleanUrl);
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (extname === '.css') {
          res.writeHead(200, { 'Content-Type': 'text/css' });
          res.end('/* optional css */', 'utf-8');
        } else if (error.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('<h1>404 Not Found</h1>', 'utf-8');
        } else {
          res.writeHead(500);
          res.end(`Server Error: ${error.code}`);
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });

  server.listen(port, () => {
    console.log(`🚀 Vanilla-Core server running at: http://localhost:${port}`);
  });
}

start();
```

---

## 3. `index.html` (Material 3 App Shell)

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Material 3 Vanilla-Core App</title>
  
  <!-- Roboto Font & Material Symbols Outlined -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap">
  <link rel="stylesheet" href="/vendor/material-web/material-symbols.css">
  
  <!-- Tailwind Utilities & Global M3 Tokens -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="/style.css">
  
  <!-- Material 3 Web Components Bundle (Local Vendored) -->
  <script type="module" src="/vendor/material-web/material-web.bundle.js"></script>
</head>
<body class="min-h-screen flex flex-col font-sans antialiased bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)]" data-theme="forest-sage">
  
  <!-- Top Header / Bar -->
  <header id="header-container"></header>
  
  <!-- Responsive Layout Shell (Desktop 3-Pane / Mobile Drill-down) -->
  <div class="flex-1 flex flex-col lg:flex-row w-full overflow-hidden">
    <aside id="drawer-container" class="hidden lg:flex flex-col w-64 bg-[var(--md-sys-color-surface-container-low)] p-4 flex-shrink-0"></aside>
    <main id="main-content-container" class="flex-1 flex flex-col overflow-y-auto p-4 lg:p-6 space-y-6 pb-24 lg:pb-6"></main>
    <aside id="activity-container" class="hidden xl:flex flex-col w-80 bg-[var(--md-sys-color-surface-container-low)] p-5 flex-shrink-0 border-l border-[var(--md-sys-color-outline-variant)]"></aside>
  </div>

  <!-- Mobile Bottom Navigation -->
  <nav id="bottom-nav-container" class="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-20"></nav>

  <script type="module" src="/load.js"></script>
</body>
</html>
```

---

## 4. `style.css` (Tokens Semánticos de los 10 Esquemas M3 + WCAG AAA Badges)

```css
:root {
  --md-shape-corner-extra-small: 4px;
  --md-shape-corner-small: 8px;
  --md-shape-corner-medium: 12px;
  --md-shape-corner-large: 16px;
  --md-shape-corner-extra-large: 24px;
  --md-shape-corner-app-frame: 28px;
  --md-shape-corner-full: 9999px;

  /* Badges WCAG AAA (Contraste >= 7:1) */
  --md-badge-success-bg: #D7E8CD;
  --md-badge-success-text: #0A3E10;
  --md-badge-error-bg: #FFDAD6;
  --md-badge-error-text: #410002;
  --md-badge-warning-bg: #FFECB3;
  --md-badge-warning-text: #502D00;
}

/* 🌿 FAMILIA 1: VERDES Y OLIVA */
[data-theme="forest-sage"], :root {
  --md-sys-color-primary: #426B29;
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: #D7E8CD;
  --md-sys-color-on-primary-container: #0C2002;
  --md-sys-color-secondary-container: #E2E5DC;
  --md-sys-color-on-secondary-container: #1C1D1B;
  --md-sys-color-surface: #F3F6E8;
  --md-sys-color-surface-container-low: #F8FAF0;
  --md-sys-color-surface-container: #EAEFE0;
  --md-sys-color-surface-container-high: #FAFDF1;
  --md-sys-color-surface-container-lowest: #FFFFFF;
  --md-sys-color-on-surface: #1A1E17;
  --md-sys-color-on-surface-variant: #595C56;
  --md-sys-color-outline: #73796E;
  --md-sys-color-outline-variant: #E0E5D7;
}

[data-theme="olive-slate"] {
  --md-sys-color-primary: #5A641F;
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: #DDE895;
  --md-sys-color-on-primary-container: #1A1E00;
  --md-sys-color-secondary-container: #E5E6D6;
  --md-sys-color-on-secondary-container: #1E1B16;
  --md-sys-color-surface: #FBF8F1;
  --md-sys-color-surface-container-low: #FAF5EA;
  --md-sys-color-surface-container: #F5EEE2;
  --md-sys-color-surface-container-high: #FFFDF9;
  --md-sys-color-surface-container-lowest: #FFFFFF;
  --md-sys-color-on-surface: #1E1B16;
  --md-sys-color-on-surface-variant: #5F5E52;
  --md-sys-color-outline: #79796C;
  --md-sys-color-outline-variant: #E4E3D4;
}

/* 🔴 FAMILIA 2: ROJOS Y TERRACOTA */
[data-theme="crimson-quartz"] {
  --md-sys-color-primary: #BB1834;
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: #FFDADF;
  --md-sys-color-on-primary-container: #410009;
  --md-sys-color-secondary-container: #FCD8DC;
  --md-sys-color-on-secondary-container: #241A1A;
  --md-sys-color-surface: #FFF8F7;
  --md-sys-color-surface-container-low: #FFF3F2;
  --md-sys-color-surface-container: #FFF0EF;
  --md-sys-color-surface-container-high: #FFF9F8;
  --md-sys-color-surface-container-lowest: #FFFFFF;
  --md-sys-color-on-surface: #241A1A;
  --md-sys-color-on-surface-variant: #695555;
  --md-sys-color-outline: #857373;
  --md-sys-color-outline-variant: #F4DFDF;
}

[data-theme="terracotta-dusk"] {
  --md-sys-color-primary: #A24244;
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: #FBBBBF;
  --md-sys-color-on-primary-container: #421316;
  --md-sys-color-secondary-container: #FDE0DF;
  --md-sys-color-on-secondary-container: #241A1A;
  --md-sys-color-surface: #FDF8F7;
  --md-sys-color-surface-container-low: #FAF2F1;
  --md-sys-color-surface-container: #FFF0EF;
  --md-sys-color-surface-container-high: #FFF8F7;
  --md-sys-color-surface-container-lowest: #FFFFFF;
  --md-sys-color-on-surface: #241A1A;
  --md-sys-color-on-surface-variant: #635756;
  --md-sys-color-outline: #837373;
  --md-sys-color-outline-variant: #EAE0E0;
}

/* 💜 FAMILIA 3: PÚRPURAS Y VIOLETAS */
[data-theme="lavender-breeze"] {
  --md-sys-color-primary: #6750A4;
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: #C8B6FF;
  --md-sys-color-on-primary-container: #28164D;
  --md-sys-color-secondary-container: #E2DFFF;
  --md-sys-color-on-secondary-container: #1D192B;
  --md-sys-color-surface: #E5E2F3;
  --md-sys-color-surface-container-low: #F8F5FD;
  --md-sys-color-surface-container: #F1EEF8;
  --md-sys-color-surface-container-high: #FAF8FE;
  --md-sys-color-surface-container-lowest: #FFFFFF;
  --md-sys-color-on-surface: #1D192B;
  --md-sys-color-on-surface-variant: #49454F;
  --md-sys-color-outline: #79747E;
  --md-sys-color-outline-variant: #E7E0EC;
}

[data-theme="orchid-velvet"] {
  --md-sys-color-primary: #8E4A8D;
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: #FFD7F7;
  --md-sys-color-on-primary-container: #360538;
  --md-sys-color-secondary-container: #FBD7F5;
  --md-sys-color-on-secondary-container: #201A1E;
  --md-sys-color-surface: #FEF6FA;
  --md-sys-color-surface-container-low: #FAF0F6;
  --md-sys-color-surface-container: #FFF1F8;
  --md-sys-color-surface-container-high: #FFF9FC;
  --md-sys-color-surface-container-lowest: #FFFFFF;
  --md-sys-color-on-surface: #201A1E;
  --md-sys-color-on-surface-variant: #61545D;
  --md-sys-color-outline: #82737D;
  --md-sys-color-outline-variant: #EBDCE6;
}

/* 🌊 FAMILIA 4: AZULES Y TURQUESAS */
[data-theme="oceanic-slate"] {
  --md-sys-color-primary: #2B638B;
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: #CDE5F7;
  --md-sys-color-on-primary-container: #001E30;
  --md-sys-color-secondary-container: #D5E4EF;
  --md-sys-color-on-secondary-container: #181C20;
  --md-sys-color-surface: #F4F7FA;
  --md-sys-color-surface-container-low: #EBF1F7;
  --md-sys-color-surface-container: #E9EEF4;
  --md-sys-color-surface-container-high: #F8FAFC;
  --md-sys-color-surface-container-lowest: #FFFFFF;
  --md-sys-color-on-surface: #181C20;
  --md-sys-color-on-surface-variant: #535A61;
  --md-sys-color-outline: #71787E;
  --md-sys-color-outline-variant: #DEE4EB;
}

[data-theme="aqua-frost"] {
  --md-sys-color-primary: #006874;
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: #97F0FF;
  --md-sys-color-on-primary-container: #001F24;
  --md-sys-color-secondary-container: #CEE9EC;
  --md-sys-color-on-secondary-container: #191C1D;
  --md-sys-color-surface: #F3F6F8;
  --md-sys-color-surface-container-low: #E7EEF0;
  --md-sys-color-surface-container: #EAEFE2;
  --md-sys-color-surface-container-high: #F9FCFC;
  --md-sys-color-surface-container-lowest: #FFFFFF;
  --md-sys-color-on-surface: #191C1D;
  --md-sys-color-on-surface-variant: #525B5C;
  --md-sys-color-outline: #70797B;
  --md-sys-color-outline-variant: #DCE5E7;
}

/* 🍯 FAMILIA 5: ORGÁNICOS Y ÁMBAR */
[data-theme="golden-amber"] {
  --md-sys-color-primary: #7A5900;
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: #FFDF9E;
  --md-sys-color-on-primary-container: #261A00;
  --md-sys-color-secondary-container: #F3E5C7;
  --md-sys-color-on-secondary-container: #1E1B16;
  --md-sys-color-surface: #FBF8F1;
  --md-sys-color-surface-container-low: #F6F1E6;
  --md-sys-color-surface-container: #F5EEE2;
  --md-sys-color-surface-container-high: #FFFDF9;
  --md-sys-color-surface-container-lowest: #FFFFFF;
  --md-sys-color-on-surface: #1E1B16;
  --md-sys-color-on-surface-variant: #61584B;
  --md-sys-color-outline: #807567;
  --md-sys-color-outline-variant: #EAE2D5;
}

[data-theme="desert-bloom"] {
  --md-sys-color-primary: #85511A;
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: #FFDCC3;
  --md-sys-color-on-primary-container: #2C1500;
  --md-sys-color-secondary-container: #F8DFC8;
  --md-sys-color-on-secondary-container: #201A16;
  --md-sys-color-surface: #FFF9F6;
  --md-sys-color-surface-container-low: #F8EFEA;
  --md-sys-color-surface-container: #FFF1EA;
  --md-sys-color-surface-container-high: #FFF9F7;
  --md-sys-color-surface-container-lowest: #FFFFFF;
  --md-sys-color-on-surface: #201A16;
  --md-sys-color-on-surface-variant: #66584E;
  --md-sys-color-outline: #837367;
  --md-sys-color-outline-variant: #EFE0D6;
}

/* 🌙 DARK MODE OVERRIDES */
body.dark-theme {
  --md-sys-color-surface: #121316;
  --md-sys-color-surface-container-low: #1A1C1E;
  --md-sys-color-surface-container: #1E2023;
  --md-sys-color-surface-container-high: #282A2D;
  --md-sys-color-surface-container-lowest: #0D0E11;
  --md-sys-color-on-surface: #E2E2E6;
  --md-sys-color-on-surface-variant: #C4C6D0;
  --md-sys-color-outline: #8E9099;
  --md-sys-color-outline-variant: #44474E;
  --md-badge-success-bg: rgba(129, 199, 132, 0.22);
  --md-badge-success-text: #B9F6CA;
  --md-badge-error-bg: rgba(239, 83, 80, 0.25);
  --md-badge-error-text: #FFCDD2;
  --md-badge-warning-bg: rgba(255, 179, 0, 0.22);
  --md-badge-warning-text: #FFE082;
}

/* M3 Flat Cards & Badges */
.m3-card {
  background-color: var(--md-sys-color-surface-container-lowest);
  border-radius: var(--md-shape-corner-extra-large);
  border: 1px solid var(--md-sys-color-outline-variant);
  transition: background-color 0.25s ease, border-color 0.25s ease;
}

body.dark-theme .m3-card {
  background-color: var(--md-sys-color-surface-container);
}

.m3-badge-success {
  background-color: var(--md-badge-success-bg);
  color: var(--md-badge-success-text);
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: var(--md-shape-corner-full);
}

.m3-badge-error {
  background-color: var(--md-badge-error-bg);
  color: var(--md-badge-error-text);
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: var(--md-shape-corner-full);
}

.m3-badge-warning {
  background-color: var(--md-badge-warning-bg);
  color: var(--md-badge-warning-text);
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: var(--md-shape-corner-full);
}

.m3-badge-neutral {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: var(--md-shape-corner-full);
}
```

```
