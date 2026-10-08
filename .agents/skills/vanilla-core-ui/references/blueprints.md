# 🧠 Core Module Blueprints (The Architectural Core)

## `store.js`

```javascript
// The state is a "private" constant within this module.
const state = {
    appName: "New Vanilla-Core Project",
    theme: 'light',
    user: { isLoggedIn: false, name: "Guest" },
    isSidebarVisible: true,
};
const subscribers = [];

export function subscribe(callback) {
    if (typeof callback !== 'function') throw new Error('Subscriber must be a function.');
    subscribers.push(callback);
}

export function setState(newState) {
    Object.assign(state, newState);
    // Notify all subscribers
    console.log("📢 STATE CHANGE PUBLISHED:", newState);
    subscribers.forEach(callback => callback());
}
export default state;
```

## `dom-elements.js`

```javascript
export const elements = {};
export function initElements() {
  const elementIds = {
    headerContainer: 'header-container',
    mainContentContainer: 'main-content-container',
    sidebarContainer: 'sidebar-container',
  };
  for (const key in elementIds) {
    const element = document.getElementById(elementIds[key]);
    if (!element) console.warn(`Global element with ID '${elementIds[key]}' not found.`);
    elements[key] = element;
  }
}
```

## `ui/renderer.js`

```javascript
import state from '../store.js';
import { elements } from '../dom-elements.js';

export function renderHeader() {
    if (!elements.headerContainer) return;
    // Surgical update logic should go here
    const userNameDisplay = elements.headerContainer.querySelector('#user-name-display');
    if (userNameDisplay) userNameDisplay.textContent = state.user.name;
}

export function renderSidebar() {
    if (elements.sidebarContainer) {
        elements.sidebarContainer.classList.toggle('hidden', !state.isSidebarVisible);
    }
}

export function renderTheme() {
    document.body.classList.toggle('dark-theme', state.theme === 'dark');
}
```

## `load.js`

```javascript
import { initializeApp } from "./main.js";
async function loadComponent(url, elementId) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load ${url}`);
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) element.innerHTML = html;

        // Check if optional component CSS exists before injecting link tag to avoid 404 console errors
        const cssUrl = url.replace(".html", ".css");
        try {
            const cssCheck = await fetch(cssUrl, { method: 'HEAD' });
            if (cssCheck.ok) {
                loadCSS(cssUrl);
            }
        } catch (_) {
            // Optional component CSS
        }
    } catch (error) {
        console.error(`Component load error: ${error}`);
    }
}
function loadCSS(url) {
    if (document.querySelector(`link[href="${url}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
}
async function main() {
    await Promise.all([
        loadComponent("/components/header/header.html", "header-container"),
        loadComponent("/components/sidebar/sidebar.html", "sidebar-container"),
    ]);
    setTimeout(initializeApp, 0);
}
main();
```

## `main.js`

```javascript
import { subscribe } from './store.js';
import { initElements } from './dom-elements.js';
import { renderHeader, renderSidebar, renderTheme } from './ui/renderer.js';
import { init as initHeader } from './components/header/header.js';
import { init as initSidebar } from './components/sidebar/sidebar.js';

export async function initializeApp() {
    initElements();
    initHeader();
    initSidebar();
    subscribe(renderHeader);
    subscribe(renderSidebar);
    subscribe(renderTheme);
    renderHeader();
    renderSidebar();
    renderTheme();
    console.log("✅ Vanilla-Core application initialized.");
}
```
