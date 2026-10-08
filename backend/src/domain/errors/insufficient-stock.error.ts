export class InsufficientStockError extends Error {
  public readonly sku: string;
  public readonly requested: number;
  public readonly available: number;

  constructor(sku: string, requested: number, available: number) {
    super(`Stock insuficiente para el producto ${sku}. Solicitado: ${requested}, Disponible: ${available}`);
    this.name = 'InsufficientStockError';
    this.sku = sku;
    this.requested = requested;
    this.available = available;
    Object.setPrototypeOf(this, InsufficientStockError.prototype);
  }
}
