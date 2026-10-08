// Store Central SSoT - Tiendas D1 Frontend
// Siguiendo el dogma de Vanilla-Core UI

const state = {
  appName: "Portal Logístico Tiendas D1 - GCP Cloud Native 2026",
  storeId: "STORE-BOG-001",
  inventory: [
    { sku: "D1-LECHE-001", name: "Leche Entera Latti 1L", quantity: 450, unitPrice: 3800, category: "Lácteos" },
    { sku: "D1-HUEVO-002", name: "Huevos AA Cubeta x30", quantity: 180, unitPrice: 17500, category: "Huevos" },
    { sku: "D1-CAFE-003", name: "Café Molido Aromatel 500g", quantity: 95, unitPrice: 9200, category: "Despensa" },
    { sku: "D1-PANEL-004", name: "Panela Pastilla 1kg", quantity: 320, unitPrice: 4200, category: "Despensa" },
    { sku: "D1-ARROZ-005", name: "Arroz Blanco Diana 1kg", quantity: 600, unitPrice: 4100, category: "Granos" }
  ],
  inventoryLoading: false,
  inventoryError: null,
  reservationSuccess: null,
  chaosState: {
    status: "READY",
    lastIncident: null,
    inFlight: false,
    podReplicasDetected: 1
  }
};

const subscribers = [];

export function subscribe(callback) {
  if (typeof callback !== 'function') throw new Error('Subscriber must be a function.');
  subscribers.push(callback);
}

export function setState(newState) {
  Object.assign(state, newState);
  console.log("📢 STATE CHANGE PUBLISHED:", newState);
  subscribers.forEach(callback => callback());
}

export default state;
