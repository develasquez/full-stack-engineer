import { describe, it, expect } from 'vitest';
import { ReserveStockUseCase, InsufficientStockError, ProductNotFoundError } from '../src/domain/use-cases/reserve-stock.use-case.js';

describe('ReserveStockUseCase (Tiendas D1)', () => {
  const useCase = new ReserveStockUseCase();

  it('debe reservar existencias correctamente cuando hay stock suficiente', () => {
    const result = useCase.execute({
      sku: 'EAN-7701234001',
      storeId: 'TIENDA_BOG_102',
      quantity: 5,
    });

    expect(result.status).toBe('CONFIRMED');
    expect(result.reservedQuantity).toBe(5);
    expect(result.remainingStock).toBeGreaterThanOrEqual(0);
    expect(result.reservationId).toMatch(/^RES-/);
  });

  it('debe rechazar con InsufficientStockError cuando la cantidad supera el inventario disponible', () => {
    expect(() => {
      useCase.execute({
        sku: 'EAN-7701234003', // Solo quedan pocas unidades
        storeId: 'TIENDA_BOG_102',
        quantity: 9999,
      });
    }).toThrowError(InsufficientStockError);
  });

  it('debe lanzar ProductNotFoundError cuando el SKU no existe en catálogo', () => {
    expect(() => {
      useCase.execute({
        sku: 'SKU-INEXISTENTE-999',
        storeId: 'TIENDA_BOG_102',
        quantity: 1,
      });
    }).toThrowError(ProductNotFoundError);
  });
});
