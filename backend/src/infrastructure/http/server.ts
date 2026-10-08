import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { traceMiddleware } from './middlewares/trace.middleware';
import { ProductController } from './controllers/product.controller';
import { ChaosController } from './controllers/chaos.controller';
import { GetProductsUseCase } from '../../domain/use-cases/get-products.use-case';
import { ReserveStockUseCase } from '../../domain/use-cases/reserve-stock.use-case';
import { ChaosUseCase } from '../../domain/use-cases/chaos.use-case';
import { InMemoryProductRepository } from '../repositories/in-memory-product.repository';
import { StructuredLogger } from '../logger/structured-logger';

export interface ServerOptions {
  repository?: InMemoryProductRepository;
  logger?: StructuredLogger;
  exitHandler?: (code: number) => void;
}

export function createServer(options: ServerOptions = {}): Application {
  const app: Application = express();
  const logger = options.logger || new StructuredLogger();
  const repository = options.repository || new InMemoryProductRepository();

  const getProductsUseCase = new GetProductsUseCase(repository);
  const reserveStockUseCase = new ReserveStockUseCase(repository);
  const chaosUseCase = new ChaosUseCase(logger, options.exitHandler);

  const productController = new ProductController(getProductsUseCase, reserveStockUseCase, logger);
  const chaosController = new ChaosController(chaosUseCase);

  // Global Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(traceMiddleware);

  // Kubernetes Probes
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
  });

  app.get('/ready', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
  });

  // REST API v1 Endpoints
  const apiRouter = express.Router();
  apiRouter.get('/products', productController.getProducts);
  apiRouter.post('/products/:sku/reserve', productController.reserveStock);
  apiRouter.post('/chaos/crash', chaosController.crash);

  app.use('/api/v1', apiRouter);

  return app;
}
