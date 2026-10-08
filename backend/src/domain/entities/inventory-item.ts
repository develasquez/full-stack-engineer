// src/domain/entities/inventory-item.ts
export interface InventoryItem {
  sku: string;
  name: string;
  storeId: string;
  stock: number;
  unitPriceCop: number;
  lastUpdated: string;
}

export interface ReservationRequest {
  sku: string;
  storeId: string;
  quantity: number;
}

export interface ReservationResult {
  reservationId: string;
  sku: string;
  storeId: string;
  reservedQuantity: number;
  remainingStock: number;
  status: 'CONFIRMED' | 'REJECTED';
}
