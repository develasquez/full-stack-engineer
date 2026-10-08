import { Product } from '../../domain/entities/product.entity';
import { ProductRepository, ReservationResult } from '../../domain/repositories/product.repository';
import { InsufficientStockError } from '../../domain/errors/insufficient-stock.error';
import { ProductNotFoundError } from '../../domain/errors/product-not-found.error';

export class InMemoryProductRepository implements ProductRepository {
  private products: Map<string, Product> = new Map();

  constructor(initialProducts?: Product[]) {
    if (initialProducts) {
      for (const p of initialProducts) {
        this.products.set(p.sku, { ...p });
      }
    } else {
      this.seedDefaultData();
    }
  }

  private seedDefaultData(): void {
    const seed: Product[] = [
      {
        sku: 'PROD-001',
        name: 'Smart TV 55 4K UHD',
        category: 'Electrónica',
        price: 499.99,
        stock: 15,
        storeId: 'STORE-001'
      },
      {
        sku: 'PROD-002',
        name: 'Zapatillas Running Pro Nitro',
        category: 'Calzado',
        price: 89.90,
        stock: 3,
        storeId: 'STORE-001'
      },
      {
        sku: 'PROD-003',
        name: 'Cafetera Espresso Automática',
        category: 'Hogar',
        price: 129.50,
        stock: 8,
        storeId: 'STORE-001'
      },
      {
        sku: 'PROD-004',
        name: 'Laptop Pro 16 M3',
        category: 'Electrónica',
        price: 1899.00,
        stock: 5,
        storeId: 'STORE-002'
      }
    ];

    for (const p of seed) {
      this.products.set(p.sku, { ...p });
    }
  }

  async findAll(storeId?: string): Promise<Product[]> {
    const list = Array.from(this.products.values());
    if (storeId) {
      return list.filter((p) => p.storeId === storeId);
    }
    return list;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const prod = this.products.get(sku);
    return prod ? { ...prod } : null;
  }

  async reserveStock(sku: string, quantity: number): Promise<ReservationResult> {
    const product = this.products.get(sku);

    if (!product) {
      throw new ProductNotFoundError(sku);
    }

    if (product.stock < quantity) {
      throw new InsufficientStockError(sku, quantity, product.stock);
    }

    // Deducción atómica en memoria
    product.stock -= quantity;
    this.products.set(sku, product);

    return {
      sku: product.sku,
      reservedQuantity: quantity,
      remainingStock: product.stock,
      message: 'Stock reservado exitosamente'
    };
  }
}
