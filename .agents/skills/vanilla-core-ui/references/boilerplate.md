# 📜 Project Boilerplate Kit (The Unalterable Start)

When creating a new project, you MUST use the exact content below for these core files.

## `package.json`

```json
{
  "name": "vanilla-core-project",
  "version": "1.0.0",
  "description": "A project built with the Vanilla-Core architecture.",
  "main": "server.js",
  "scripts": {
    "dev": "node server.js"
  }
}
```

## `server.js` (Zero-Dependency Node HTTP Server)

```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  if (req.url === '/favicon.ico') {
    res.writeHead(200, { 'Content-Type': 'image/x-icon' });
    res.end();
    return;
  }

  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (extname === '.css') {
        // Fallback for missing component CSS to prevent browser console 404s
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

server.listen(PORT, () => {
  console.log(`🚀 Vanilla-Core server running at http://localhost:${PORT}`);
});
```

## `index.html` (App Shell)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vanilla-Core Project</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="/style.css">
</head>
<body class="bg-gray-100">
    <div id="app-container" class="max-w-7xl mx-auto p-4">
        <header id="header-container"></header>
        <div id="sidebar-container"></div>
        <main id="main-content-container" class="mt-4"></main>
    </div>
    <script type="module" src="/load.js"></script>
</body>
</html>
```

## `style.css`

```css
/* This file is for global styles or complex CSS that Tailwind cannot handle. */
body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
body.dark-theme {
    background-color: #1a202c;
    color: #edf2f7;
}
```
