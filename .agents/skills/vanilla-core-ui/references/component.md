# 🧩 Component Pattern (The Building Block)

A component is a self-contained unit. All its files MUST reside within a dedicated folder in `components/`.
Every component folder MUST include the trio: `.html`, `.css`, and `.js`.

## Directory Structure:
```text
components/header/
├── header.html
├── header.css
└── header.js
```

## HTML (`components/header/header.html`):

```html
<header class="bg-white shadow p-4 flex justify-between items-center">
    <span id="user-name-display" class="font-bold text-gray-800"></span>
    <button id="header-toggle-sidebar-btn" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Toggle Sidebar
    </button>
</header>
```

## CSS (`components/header/header.css`):

```css
/* Component-specific styles that cannot be done with Tailwind utility classes */
```

## JavaScript (`components/header/header.js`):

```javascript
import { setState } from '../../store.js';
import state from '../../store.js';
const elements = {};

export function init() {
    elements.toggleSidebarBtn = document.getElementById('header-toggle-sidebar-btn');
    if (elements.toggleSidebarBtn) {
        elements.toggleSidebarBtn.addEventListener('click', handleToggleSidebar);
    } else {
        console.warn("Header toggle button not found.");
    }
}

function handleToggleSidebar() {
    setState({ isSidebarVisible: !state.isSidebarVisible });
}
```
