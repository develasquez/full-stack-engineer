import state, { setState } from '../../store.js';

export function init() {
  const btnRefresh = document.getElementById('btn-refresh-catalog');
  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => fetchProducts());
  }

  const productsGrid = document.getElementById('products-grid');
  if (productsGrid) {
    productsGrid.addEventListener('click', handleGridClick);
  }

  // Initial load
  fetchProducts();
}

export async function fetchProducts() {
  setState({ isLoading: true });

  try {
    const url = state.selectedStoreId
      ? `/api/v1/products?storeId=${encodeURIComponent(state.selectedStoreId)}`
      : '/api/v1/products';
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    const data = await response.json();
    const products = data.products || data || [];

    setState({
      products,
      isLoading: false,
      backendStatus: 'online'
    });
  } catch (err) {
    console.error('[CATALOG] Error fetching products:', err);
    setState({
      isLoading: false,
      backendStatus: state.chaosState.isCrashing ? 'chaos_crashed' : 'offline',
      notification: {
        type: 'error',
        message: 'No se pudo comunicar con el backend de inventario. Verifique el estado del pod.'
      }
    });
  }
}

async function handleGridClick(e) {
  const reserveBtn = e.target.closest('.btn-reserve');
  if (!reserveBtn) return;

  const sku = reserveBtn.dataset.sku;
  if (!sku) return;

  const card = reserveBtn.closest('.product-card');
  const qtyInput = card ? card.querySelector('.input-qty') : null;
  const quantity = qtyInput ? parseInt(qtyInput.value, 10) : 1;

  if (isNaN(quantity) || quantity <= 0) {
    setState({
      notification: {
        type: 'warning',
        message: 'Por favor indique una cantidad válida mayor a cero.'
      }
    });
    return;
  }

  await executeReservation(sku, quantity);
}

async function executeReservation(sku, quantity) {
  try {
    const response = await fetch(`/api/v1/products/${encodeURIComponent(sku)}/reserve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quantity,
        storeId: state.selectedStoreId
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // Backend returned 400 (InsufficientStockError) or 404 (ProductNotFoundError)
      const errorMsg = data.error || data.message || 'Error en la reserva de inventario';
      setState({
        notification: {
          type: 'error',
          message: `⚠️ Fallo en reserva (${sku}): ${errorMsg}`
        }
      });
      return;
    }

    // Reservation successful
    const updatedProduct = data.product;
    const updatedProducts = state.products.map(p =>
      p.sku === sku ? updatedProduct : p
    );

    setState({
      products: updatedProducts,
      notification: {
        type: 'success',
        message: `✅ Reserva exitosa: ${quantity} unidad(es) de ${updatedProduct.name}. Stock restante: ${updatedProduct.stock}`
      }
    });
  } catch (err) {
    console.error('[CATALOG] Reservation network error:', err);
    setState({
      notification: {
        type: 'error',
        message: `Fallo de conexión al procesar reserva para SKU: ${sku}`
      }
    });
  }
}
