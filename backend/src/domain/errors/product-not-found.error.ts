export class ProductNotFoundError extends Error {
  public readonly sku: string;

  constructor(sku: string) {
    super(`Producto con SKU ${sku} no encontrado`);
    this.name = 'ProductNotFoundError';
    this.sku = sku;
    Object.setPrototypeOf(this, ProductNotFoundError.prototype);
  }
}
