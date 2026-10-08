// src/domain/use-cases/reserve-stock.use-case.ts
import { ReservationRequest, ReservationResult } from '../entities/inventory-item.js';
import { StructuredLogger } from '../../infrastructure/logging/structured-logger.js';

export class InsufficientStockError extends Error {
  constructor(public sku: string, public requested: number, public available: number) {
    super(`Stock insuficiente para SKU ${sku}: solicitado ${requested}, disponible ${available}`);
    this.name = 'InsufficientStockError';
  }
}

export class ProductNotFoundError extends Error {
  constructor(public sku: string) {
    super(`Producto con SKU ${sku} no existe en catálogo`);
    this.name = 'ProductNotFoundError';
  }
}

export class ReserveStockUseCase {
  // Mock de inventario en memoria para la demostración
  private static stockDatabase = new Map<string, number>([
    ['EAN-7701234001', 50],  // Leche D1 Entera
    ['EAN-7701234002', 15],  // Pan Tajado D1
    ['EAN-7701234003', 5],   // Huevos AA x30 (crítico)
  ]);

  public execute(req: ReservationRequest, traceId?: string): ReservationResult {
    const currentStock = ReserveStockUseCase.stockDatabase.get(req.sku);

    if (currentStock === undefined) {
      StructuredLogger.warn(`Producto no encontrado en reserva: ${req.sku}`, {
        traceId,
        storeId: req.storeId,
        method: 'ReserveStockUseCase.execute',
      });
      throw new ProductNotFoundError(req.sku);
    }

    if (currentStock < req.quantity) {
      StructuredLogger.warn(`Intento de sobreventa bloqueado para SKU: ${req.sku}`, {
        traceId,
        storeId: req.storeId,
        method: 'ReserveStockUseCase.execute',
        requested: req.quantity,
        available: currentStock,
      });
      throw new InsufficientStockError(req.sku, req.quantity, currentStock);
    }

    const newStock = currentStock - req.quantity;
    ReserveStockUseCase.stockDatabase.set(req.sku, newStock);

    StructuredLogger.info(`Reserva confirmada con éxito para SKU ${req.sku}`, {
      traceId,
      storeId: req.storeId,
      method: 'ReserveStockUseCase.execute',
      reservedQuantity: req.quantity,
      remainingStock: newStock,
    });

    return {
      reservationId: `RES-${Date.now().toString(36).toUpperCase()}`,
      sku: req.sku,
      storeId: req.storeId,
      reservedQuantity: req.quantity,
      remainingStock: newStock,
      status: 'CONFIRMED',
    };
  }

  public getAvailableStock(sku: string): number | undefined {
    return ReserveStockUseCase.stockDatabase.get(sku);
  }
}
