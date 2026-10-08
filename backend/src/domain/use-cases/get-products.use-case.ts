import { Product } from '../entities/product.entity';
import { ProductRepository } from '../repositories/product.repository';

export class GetProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(storeId?: string): Promise<Product[]> {
    return this.productRepository.findAll(storeId);
  }
}
