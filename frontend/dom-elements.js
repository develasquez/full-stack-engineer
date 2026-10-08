export const elements = {};

export function initElements() {
  const elementIds = {
    headerContainer: 'header-container',
    notificationContainer: 'notification-container',
    chaosPanelContainer: 'chaos-panel-container',
    catalogContainer: 'catalog-container',
  };

  for (const key in elementIds) {
    const el = document.getElementById(elementIds[key]);
    if (!el) {
      console.warn(`[DOM] Element with ID '${elementIds[key]}' not found.`);
    }
    elements[key] = el;
  }
}
