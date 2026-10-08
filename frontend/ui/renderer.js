import state from '../store.js';
import { elements } from '../dom-elements.js';

export function renderHeader() {
  if (!elements.headerContainer) return;
  const titleDisplay = elements.headerContainer.querySelector('#app-title-display');
  const storeBadge = elements.headerContainer.querySelector('#store-id-badge');

  if (titleDisplay && titleDisplay.textContent !== state.appName) {
    titleDisplay.textContent = state.appName;
  }
  if (storeBadge && storeBadge.textContent !== state.storeId) {
    storeBadge.textContent = state.storeId;
  }
}

export function renderCatalog() {
  if (!elements.catalogContainer) return;

  const tableBody = elements.catalogContainer.querySelector('#inventory-table-body');
  const alertBox = elements.catalogContainer.querySelector('#catalog-alert');

  // Actualizar alertas quirúrgicamente
  if (alertBox) {
    if (state.reservationSuccess) {
      alertBox.className = "mb-4 p-3 rounded-lg text-sm bg-green-50 text-green-800 border border-green-200 block";
      alertBox.textContent = state.reservationSuccess;
    } else if (state.inventoryError) {
      alertBox.className = "mb-4 p-3 rounded-lg text-sm bg-amber-50 text-amber-800 border border-amber-200 block";
      alertBox.textContent = state.inventoryError;
    } else {
      alertBox.className = "hidden";
    }
  }

  if (!tableBody) return;

  // Renderizar filas de la tabla
  tableBody.innerHTML = state.inventory.map(item => {
    const isLowStock = item.quantity < 100;
    const stockBadgeClass = isLowStock 
      ? 'bg-amber-100 text-amber-800' 
      : 'bg-green-100 text-green-800';

    return `
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="py-3 px-4 font-mono font-medium text-xs text-gray-900">${item.sku}</td>
        <td class="py-3 px-4 font-medium text-gray-800">${item.name}</td>
        <td class="py-3 px-4 text-gray-500 text-xs">${item.category || 'General'}</td>
        <td class="py-3 px-4 font-mono text-gray-700">$${item.unitPrice.toLocaleString('es-CO')}</td>
        <td class="py-3 px-4 text-center">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${stockBadgeClass}">
            ${item.quantity} uds
          </span>
        </td>
        <td class="py-3 px-4 text-right">
          <button 
            data-sku="${item.sku}"
            ${item.quantity <= 0 ? 'disabled' : ''}
            class="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white rounded text-xs font-semibold transition active:scale-95 shadow-sm">
            ${item.quantity <= 0 ? 'Agotado' : '⚡ Reservar 1 ud'}
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

export function renderChaosPanel() {
  if (!elements.chaosContainer) return;

  const indicator = elements.chaosContainer.querySelector('#chaos-status-indicator');
  const details = elements.chaosContainer.querySelector('#chaos-status-details');
  const crashBtn = elements.chaosContainer.querySelector('#btn-trigger-crash');

  if (!indicator || !details) return;

  if (state.chaosState.status === "TRIGGERING_CRASH") {
    indicator.className = "flex items-center gap-2 text-sm font-mono text-amber-400";
    indicator.innerHTML = '<span class="w-3 h-3 rounded-full bg-amber-400 animate-spin"></span> Enviando señal fatal a backend...';
    if (crashBtn) crashBtn.disabled = true;
  } else if (state.chaosState.status === "POD_CRASHED" || state.chaosState.status === "POD_TERMINATED") {
    indicator.className = "flex items-center gap-2 text-sm font-mono text-red-400";
    indicator.innerHTML = '<span class="w-3 h-3 rounded-full bg-red-500 animate-bounce"></span> Pod Terminado (Crash detectado por Kubelet)';
    details.textContent = state.chaosState.message || "Esperando que GKE reinicie el Pod saludable...";
    if (crashBtn) {
      crashBtn.disabled = false;
      crashBtn.textContent = "💥 Provocar Fatal Crash Nuevamente";
    }
  } else {
    indicator.className = "flex items-center gap-2 text-sm font-mono text-green-400";
    indicator.innerHTML = '<span class="w-3 h-3 rounded-full bg-green-500"></span> Backend Pod: HEALTHY & LISTENING';
    if (crashBtn) crashBtn.disabled = false;
  }
}
