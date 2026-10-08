// src/interfaces/http/routes/inventory.routes.ts
import { Router, Request, Response } from 'express';
import { ReserveStockUseCase, InsufficientStockError, ProductNotFoundError } from '../../../domain/use-cases/reserve-stock.use-case.js';
import { StructuredLogger } from '../../../infrastructure/logging/structured-logger.js';

export function createInventoryRoutes(): Router {
  const router = Router();
  const reserveStockUseCase = new ReserveStockUseCase();

  // GET /api/v1/inventory/items/:sku
  router.get('/items/:sku', (req: Request, res: Response) => {
    const { sku } = req.params;
    const traceHeader = req.header('X-Cloud-Trace-Context');
    const traceId = StructuredLogger.formatTrace(traceHeader);

    StructuredLogger.info(`Consultando stock para SKU: ${sku}`, {
      traceId,
      sku,
      method: 'InventoryRoutes.getItem',
    });

    const stock = reserveStockUseCase.getAvailableStock(sku);
    if (stock === undefined) {
      res.status(404).json({
        error: 'PRODUCT_NOT_FOUND',
        message: `El producto ${sku} no existe en catálogo D1`,
      });
      return;
    }

    res.status(200).json({
      sku,
      stock,
      currency: 'COP',
      storeId: (req.header('X-Store-Id') as string) || 'TIENDA_BOG_001',
      lastUpdated: new Date().toISOString(),
    });
  });

  // POST /api/v1/inventory/reservations
  router.post('/reservations', (req: Request, res: Response) => {
    const traceHeader = req.header('X-Cloud-Trace-Context');
    const traceId = StructuredLogger.formatTrace(traceHeader);
    const { sku, storeId, quantity } = req.body;

    if (!sku || !quantity || quantity <= 0) {
      res.status(400).json({
        error: 'INVALID_REQUEST',
        message: 'Campos requeridos: sku (string) y quantity (número positivo)',
      });
      return;
    }

    try {
      const result = reserveStockUseCase.execute({
        sku,
        storeId: storeId || 'TIENDA_BOG_001',
        quantity: Number(quantity),
      }, traceId);

      res.status(201).json(result);
    } catch (error) {
      if (error instanceof InsufficientStockError) {
        res.status(409).json({
          error: 'INSUFFICIENT_STOCK',
          message: error.message,
          requested: error.requested,
          available: error.available,
        });
      } else if (error instanceof ProductNotFoundError) {
        res.status(404).json({
          error: 'PRODUCT_NOT_FOUND',
          message: error.message,
        });
      } else {
        StructuredLogger.error('Error no controlado al reservar stock', error, {
          traceId,
          method: 'InventoryRoutes.postReservation',
        });
        res.status(500).json({
          error: 'INTERNAL_SERVER_ERROR',
          message: 'Error procesando la transacción de reserva',
        });
      }
    }
  });

  return router;
}
