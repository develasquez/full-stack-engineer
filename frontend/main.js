import { subscribe } from './store.js';
import { initElements } from './dom-elements.js';
import { renderHeader, renderCatalog, renderChaosPanel } from './ui/renderer.js';
import { init as initHeader } from './components/header/header.js';
import { init as initCatalog } from './components/catalog/catalog.js';
import { init as initChaos } from './components/chaos-panel/chaos-panel.js';

export async function initializeApp() {
  initElements();
  initHeader();
  initCatalog();
  initChaos();

  // Suscripción al bus de eventos de la fuente única de verdad (SSoT)
  subscribe(renderHeader);
  subscribe(renderCatalog);
  subscribe(renderChaosPanel);

  // Render inicial quirúrgico
  renderHeader();
  renderCatalog();
  renderChaosPanel();

  console.log("✅ Tiendas D1 Frontend (Vanilla-Core) inicializado correctamente.");
}
