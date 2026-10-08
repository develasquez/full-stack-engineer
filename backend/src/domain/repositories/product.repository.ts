import { Product } from '../entities/product.entity';

export interface ReservationResult {
  sku: string;
  reservedQuantity: number;
  remainingStock: number;
  message: string;
}

export interface ProductRepository {
  findAll(storeId?: string): Promise<Product[]>;
  findBySku(sku: string): Promise<Product | null>;
  reserveStock(sku: string, quantity: number): Promise<ReservationResult>;
}
