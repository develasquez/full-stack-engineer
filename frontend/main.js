import { subscribe } from './store.js';
import { initElements } from './dom-elements.js';
import { renderHeader, renderChaosPanel, renderCatalog, renderNotifications } from './ui/renderer.js';
import { init as initHeader } from './components/header/header.js';
import { init as initChaosPanel } from './components/chaos-panel/chaos-panel.js';
import { init as initCatalog } from './components/catalog/catalog.js';

export async function initializeApp() {
  console.log("🚀 Initializing Retail Cloud Platform 2026 (Vanilla-Core UI)...");
  initElements();

  initHeader();
  initChaosPanel();
  initCatalog();

  subscribe(renderHeader);
  subscribe(renderChaosPanel);
  subscribe(renderCatalog);
  subscribe(renderNotifications);

  // Initial renders
  renderHeader();
  renderChaosPanel();
  renderCatalog();
  renderNotifications();

  console.log("✅ Retail Frontend initialized with Pub/Sub & Surgical Rendering.");
}
