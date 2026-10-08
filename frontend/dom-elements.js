export const elements = {};

export function initElements() {
  const elementIds = {
    headerContainer: 'header-container',
    catalogContainer: 'catalog-container',
    chaosContainer: 'chaos-container',
    notificationContainer: 'notification-container'
  };

  for (const key in elementIds) {
    const element = document.getElementById(elementIds[key]);
    if (!element) console.warn(`Global element with ID '${elementIds[key]}' not found.`);
    elements[key] = element;
  }
}
