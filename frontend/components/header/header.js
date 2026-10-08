import state from '../../store.js';

export function init() {
  const titleDisplay = document.getElementById('app-title-display');
  const storeBadge = document.getElementById('store-id-badge');

  if (titleDisplay && state.appName) {
    titleDisplay.textContent = state.appName;
  }
  if (storeBadge && state.storeId) {
    storeBadge.textContent = state.storeId;
  }
}
