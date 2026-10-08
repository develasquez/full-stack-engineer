import state, { setState } from '../../store.js';

const elements = {};

export function init() {
  elements.storeSelector = document.getElementById('store-selector');

  if (elements.storeSelector) {
    elements.storeSelector.value = state.selectedStoreId;
    elements.storeSelector.addEventListener('change', handleStoreChange);
  }
}

function handleStoreChange(e) {
  const newStoreId = e.target.value;
  setState({ selectedStoreId: newStoreId });
}
