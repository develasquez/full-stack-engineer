import { Request, Response } from 'express';
import { GetProductsUseCase } from '../../../domain/use-cases/get-products.use-case';
import { ReserveStockUseCase } from '../../../domain/use-cases/reserve-stock.use-case';
import { InsufficientStockError } from '../../../domain/errors/insufficient-stock.error';
import { ProductNotFoundError } from '../../../domain/errors/product-not-found.error';
import { StructuredLogger } from '../../logger/structured-logger';

export class ProductController {
  constructor(
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly reserveStockUseCase: ReserveStockUseCase,
    private readonly logger: StructuredLogger
  ) {}

  public getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const storeId = req.query.storeId as string | undefined;
      const products = await this.getProductsUseCase.execute(storeId);
      res.status(200).json(products);
    } catch (error: any) {
      this.logger.error('Error al consultar productos', {
        traceId: req.traceId,
        error: error.message
      });
      res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
  };

  public reserveStock = async (req: Request, res: Response): Promise<void> => {
    const { sku } = req.params;
    const { quantity } = req.body;

    try {
      const result = await this.reserveStockUseCase.execute({ sku, quantity: Number(quantity) });
      this.logger.info(`Stock reservado para SKU ${sku}`, {
        traceId: req.traceId,
        sku,
        reservedQuantity: result.reservedQuantity,
        remainingStock: result.remainingStock
      });
      res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof InsufficientStockError) {
        this.logger.warning(`Intento de reserva con stock insuficiente: ${sku}`, {
          traceId: req.traceId,
          sku: error.sku,
          requested: error.requested,
          available: error.available
        });
        res.status(400).json({
          error: error.name,
          message: error.message,
          sku: error.sku,
          requested: error.requested,
          available: error.available
        });
        return;
      }

      if (error instanceof ProductNotFoundError) {
        this.logger.warning(`Intento de reserva de SKU inexistente: ${sku}`, {
          traceId: req.traceId,
          sku: error.sku
        });
        res.status(404).json({
          error: error.name,
          message: error.message,
          sku: error.sku
        });
        return;
      }

      this.logger.error(`Error inesperado al reservar stock para SKU ${sku}`, {
        traceId: req.traceId,
        error: error.message
      });
      res.status(400).json({
        error: 'ValidationError',
        message: error.message
      });
    }
  };
}
