import state from '../store.js';
import { elements } from '../dom-elements.js';

let lastRenderedSkus = '';

export function renderHeader() {
  if (!elements.headerContainer) return;

  const storeSelector = elements.headerContainer.querySelector('#store-selector');
  if (storeSelector && storeSelector.value !== state.selectedStoreId) {
    storeSelector.value = state.selectedStoreId;
  }

  const statusContainer = elements.headerContainer.querySelector('#backend-status-container');
  if (statusContainer) {
    if (state.backendStatus === 'online') {
      statusContainer.innerHTML = `
        <span id="backend-status-badge" class="m3-badge-success">
          <span class="inline-block w-2 h-2 rounded-full bg-[#0A3E10]"></span>
          Backend Online
        </span>`;
    } else if (state.backendStatus === 'chaos_crashed') {
      statusContainer.innerHTML = `
        <span id="backend-status-badge" class="m3-badge-error chaos-pulsing">
          <span class="inline-block w-2 h-2 rounded-full bg-[#BA1A1A]"></span>
          Pod Caído (GKE Kubelet Reiniciando)
        </span>`;
    } else {
      statusContainer.innerHTML = `
        <span id="backend-status-badge" class="m3-badge-warning">
          <span class="inline-block w-2 h-2 rounded-full bg-[#502D00]"></span>
          Desconectado
        </span>`;
    }
  }
}

export function renderChaosPanel() {
  if (!elements.chaosPanelContainer) return;

  const btn = elements.chaosPanelContainer.querySelector('#btn-trigger-chaos');
  const btnText = elements.chaosPanelContainer.querySelector('#chaos-btn-text');
  const banner = elements.chaosPanelContainer.querySelector('#chaos-telemetry-banner');
  const counter = elements.chaosPanelContainer.querySelector('#chaos-telemetry-counter');
  const message = elements.chaosPanelContainer.querySelector('#chaos-telemetry-message');

  const isCrashing = state.chaosState.isCrashing;

  if (btn) {
    btn.disabled = isCrashing;
  }

  if (btnText) {
    btnText.textContent = isCrashing ? 'Recreando Pod en GKE...' : 'Simular Caída de Pod (Crash)';
  }

  if (banner) {
    if (isCrashing) {
      banner.classList.remove('hidden');
      if (counter) counter.textContent = `Sondeos Kubelet: ${state.chaosState.pollCount}`;
      if (message) message.textContent = 'Fallo crítico inducido. Esperando recreación de Pod por Kubelet...';
    } else {
      banner.classList.add('hidden');
    }
  }
}

export function renderNotifications() {
  if (!elements.notificationContainer) return;

  if (!state.notification) {
    elements.notificationContainer.innerHTML = '';
    return;
  }

  const { type, message } = state.notification;
  let bgClass = 'bg-[#CDE5F7] text-[#001E30] border-[#2B638B]';

  if (type === 'success') bgClass = 'bg-[#D7E8CD] text-[#0A3E10] border-[#0A3E10]';
  if (type === 'warning') bgClass = 'bg-[#FFECB3] text-[#502D00] border-[#502D00]';
  if (type === 'error') bgClass = 'bg-[#FFDAD6] text-[#410002] border-[#BA1A1A]';

  elements.notificationContainer.innerHTML = `
    <div class="p-3.5 rounded-lg border ${bgClass} text-xs sm:text-sm flex items-center justify-between shadow-sm">
      <div class="flex items-center gap-2">
        <span class="font-bold">${type.toUpperCase()}:</span>
        <span>${message}</span>
      </div>
      <button type="button" onclick="this.parentElement.remove()" class="text-xs font-bold px-2 py-0.5 rounded hover:opacity-75">✕</button>
    </div>
  `;
}

export function renderCatalog() {
  if (!elements.catalogContainer) return;

  const loadingEl = elements.catalogContainer.querySelector('#catalog-loading');
  const emptyEl = elements.catalogContainer.querySelector('#catalog-empty');
  const gridEl = elements.catalogContainer.querySelector('#products-grid');

  if (loadingEl) {
    loadingEl.classList.toggle('hidden', !state.isLoading);
  }

  if (!gridEl) return;

  const currentSkus = state.products.map(p => p.sku).sort().join(',');

  // Focus guard: if user is interacting with an input inside grid, perform surgical update only
  const hasActiveFocusInsideGrid = gridEl.contains(document.activeElement);

  if (currentSkus !== lastRenderedSkus && !hasActiveFocusInsideGrid) {
    lastRenderedSkus = currentSkus;

    if (state.products.length === 0 && !state.isLoading) {
      if (emptyEl) emptyEl.classList.remove('hidden');
      gridEl.innerHTML = '';
      return;
    }

    if (emptyEl) emptyEl.classList.add('hidden');

    // Build full grid DOM
    gridEl.innerHTML = state.products.map(product => buildProductCardHtml(product)).join('');
  } else {
    // Surgical update per product card without re-rendering container
    state.products.forEach(product => {
      const card = gridEl.querySelector(`.product-card[data-sku="${product.sku}"]`);
      if (card) {
        updateCardSurgically(card, product);
      }
    });
  }
}

function buildProductCardHtml(product) {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  let badgeHtml = '';
  if (isOutOfStock) {
    badgeHtml = '<span class="m3-badge-error">Agotado (0)</span>';
  } else if (isLowStock) {
    badgeHtml = `<span class="m3-badge-warning">Stock Crítico (${product.stock})</span>`;
  } else {
    badgeHtml = `<span class="m3-badge-success">Disponible (${product.stock})</span>`;
  }

  const formattedPrice = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(product.price);

  return `
    <div class="m3-card p-5 product-card" data-sku="${product.sku}">
      <div>
        <div class="flex items-start justify-between gap-2 mb-2">
          <span class="text-[10px] font-mono uppercase tracking-wider text-[#535A61] bg-[#E9EEF4] px-2 py-0.5 rounded">
            SKU: ${product.sku}
          </span>
          <div class="stock-badge-container">${badgeHtml}</div>
        </div>

        <h3 class="text-base font-bold text-[#181C20] line-clamp-1">${product.name}</h3>
        <p class="text-xs text-[#535A61] mb-3">${product.category} • <span class="text-[10px] font-semibold">${product.storeId}</span></p>

        <div class="text-lg font-extrabold text-[#2B638B] mb-4">
          ${formattedPrice}
        </div>
      </div>

      <div class="pt-3 border-t border-[#DEE4EB] flex items-center gap-2">
        <label class="sr-only" for="qty-${product.sku}">Cantidad</label>
        <input
          id="qty-${product.sku}"
          type="number"
          min="1"
          max="${Math.max(1, product.stock)}"
          value="1"
          ${isOutOfStock ? 'disabled' : ''}
          class="input-qty w-16 bg-[#F4F7FA] border border-[#DEE4EB] rounded-lg px-2 py-1.5 text-center text-xs font-semibold text-[#181C20] focus:outline-none focus:ring-2 focus:ring-[#2B638B]"
        />
        <button
          type="button"
          data-sku="${product.sku}"
          ${isOutOfStock ? 'disabled' : ''}
          class="btn-reserve flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            isOutOfStock
              ? 'bg-[#E9EEF4] text-[#71787E] cursor-not-allowed'
              : 'bg-[#2B638B] text-white hover:bg-[#1E4D6E] active:scale-95 shadow-sm'
          }">
          ${isOutOfStock ? 'Sin Existencias' : 'Reservar'}
        </button>
      </div>
    </div>
  `;
}

function updateCardSurgically(card, product) {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const badgeContainer = card.querySelector('.stock-badge-container');
  if (badgeContainer) {
    if (isOutOfStock) {
      badgeContainer.innerHTML = '<span class="m3-badge-error">Agotado (0)</span>';
    } else if (isLowStock) {
      badgeHtml = `<span class="m3-badge-warning">Stock Crítico (${product.stock})</span>`;
      badgeContainer.innerHTML = `<span class="m3-badge-warning">Stock Crítico (${product.stock})</span>`;
    } else {
      badgeContainer.innerHTML = `<span class="m3-badge-success">Disponible (${product.stock})</span>`;
    }
  }

  const qtyInput = card.querySelector('.input-qty');
  if (qtyInput) {
    qtyInput.max = Math.max(1, product.stock).toString();
    qtyInput.disabled = isOutOfStock;
  }

  const reserveBtn = card.querySelector('.btn-reserve');
  if (reserveBtn) {
    reserveBtn.disabled = isOutOfStock;
    if (isOutOfStock) {
      reserveBtn.className = 'btn-reserve flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-[#E9EEF4] text-[#71787E] cursor-not-allowed';
      reserveBtn.textContent = 'Sin Existencias';
    } else {
      reserveBtn.className = 'btn-reserve flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-[#2B638B] text-white hover:bg-[#1E4D6E] active:scale-95 shadow-sm';
      reserveBtn.textContent = 'Reservar';
    }
  }
}
