import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryProductRepository } from '../src/infrastructure/repositories/in-memory-product.repository';
import { ReserveStockUseCase } from '../src/domain/use-cases/reserve-stock.use-case';
import { InsufficientStockError } from '../src/domain/errors/insufficient-stock.error';
import { ProductNotFoundError } from '../src/domain/errors/product-not-found.error';

describe('ReserveStockUseCase', () => {
  let repository: InMemoryProductRepository;
  let useCase: ReserveStockUseCase;

  beforeEach(() => {
    repository = new InMemoryProductRepository([
      {
        sku: 'TEST-001',
        name: 'Item de Prueba',
        category: 'Test',
        price: 50.0,
        stock: 10,
        storeId: 'STORE-001'
      }
    ]);
    useCase = new ReserveStockUseCase(repository);
  });

  it('debe reservar stock exitosamente cuando hay existencias suficientes', async () => {
    const result = await useCase.execute({ sku: 'TEST-001', quantity: 4 });

    expect(result.sku).toBe('TEST-001');
    expect(result.reservedQuantity).toBe(4);
    expect(result.remainingStock).toBe(6);

    const product = await repository.findBySku('TEST-001');
    expect(product?.stock).toBe(6);
  });

  it('debe lanzar InsufficientStockError cuando la cantidad solicitada excede el stock disponible', async () => {
    await expect(useCase.execute({ sku: 'TEST-001', quantity: 15 })).rejects.toThrow(InsufficientStockError);

    const product = await repository.findBySku('TEST-001');
    expect(product?.stock).toBe(10);
  });

  it('debe lanzar ProductNotFoundError cuando el SKU solicitado no existe', async () => {
    await expect(useCase.execute({ sku: 'NON-EXISTENT', quantity: 1 })).rejects.toThrow(ProductNotFoundError);
  });
});
