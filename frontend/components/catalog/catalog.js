import state, { setState } from '../../store.js';

export function init() {
  const refreshBtn = document.getElementById('btn-refresh-inventory');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', handleRefreshInventory);
  }

  // Delegación de eventos para botones de reserva en la tabla
  const tableBody = document.getElementById('inventory-table-body');
  if (tableBody) {
    tableBody.addEventListener('click', handleTableClick);
  }
}

async function handleRefreshInventory() {
  setState({ inventoryLoading: true, inventoryError: null });
  try {
    const res = await fetch('/api/v1/inventory');
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const data = await res.json();
    if (data && data.items) {
      setState({ inventory: data.items, inventoryLoading: false });
    }
  } catch (err) {
    console.warn("No fue posible conectar con el backend en /api/v1/inventory, conservando datos locales:", err);
    setState({ 
      inventoryLoading: false, 
      inventoryError: "Modo Offline / Standalone: Mostrando réplica local de inventario D1." 
    });
  }
}

async function handleTableClick(e) {
  const target = e.target.closest('button[data-sku]');
  if (!target) return;

  const sku = target.getAttribute('data-sku');
  await executeReserveStock(sku, 1);
}

async function executeReserveStock(sku, quantity) {
  try {
    const res = await fetch('/api/v1/inventory/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku, quantity, storeId: state.storeId })
    });

    if (res.ok) {
      const result = await res.json();
      // Actualizar quirúrgicamente el stock en el store
      const updated = state.inventory.map(item => {
        if (item.sku === sku) {
          return { ...item, quantity: result.reservation.remainingStock };
        }
        return item;
      });
      setState({
        inventory: updated,
        reservationSuccess: `✅ Reserva exitosa: 1 unidad de ${sku} descontada en ${state.storeId}`
      });
    } else {
      // Fallback local si backend offline
      const updated = state.inventory.map(item => {
        if (item.sku === sku && item.quantity >= quantity) {
          return { ...item, quantity: item.quantity - quantity };
        }
        return item;
      });
      setState({
        inventory: updated,
        reservationSuccess: `✅ Descuento simulado local: 1 unidad de ${sku}`
      });
    }
  } catch (err) {
    // Fallback local
    const updated = state.inventory.map(item => {
      if (item.sku === sku && item.quantity >= quantity) {
        return { ...item, quantity: item.quantity - quantity };
      }
      return item;
    });
    setState({
      inventory: updated,
      reservationSuccess: `✅ Descuento simulado local: 1 unidad de ${sku}`
    });
  }
}
