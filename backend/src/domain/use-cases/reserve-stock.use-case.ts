import { ProductRepository, ReservationResult } from '../repositories/product.repository';

export interface ReserveStockInput {
  sku: string;
  quantity: number;
}

export class ReserveStockUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: ReserveStockInput): Promise<ReservationResult> {
    if (!input.sku || typeof input.sku !== 'string') {
      throw new Error('El parámetro sku es requerido');
    }

    if (!input.quantity || typeof input.quantity !== 'number' || input.quantity <= 0 || !Number.isInteger(input.quantity)) {
      throw new Error('La cantidad debe ser un número entero mayor que cero');
    }

    return this.productRepository.reserveStock(input.sku, input.quantity);
  }
}
