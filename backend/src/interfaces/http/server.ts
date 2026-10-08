// src/interfaces/http/server.ts
import express, { Express } from 'express';
import cors from 'cors';
import { createHealthRoutes } from './routes/health.routes.js';
import { createInventoryRoutes } from './routes/inventory.routes.js';
import { createChaosRoutes } from './routes/chaos.routes.js';

export function createServer(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Middleware de logging de peticiones
  app.use((req, _res, next) => {
    const traceHeader = req.header('X-Cloud-Trace-Context');
    // Continuar el pipeline
    next();
  });

  // Rutas
  app.use('/', createHealthRoutes());
  app.use('/api/v1/inventory', createInventoryRoutes());
  app.use('/api/v1/chaos', createChaosRoutes());

  // Ruta raíz de bienvenida
  app.get('/', (_req, res) => {
    res.json({
      service: 'd1-backend-demo',
      status: 'ONLINE',
      version: process.env.SERVICE_VERSION || '1.0.0',
      pod: process.env.HOSTNAME || 'local-pod',
      endpoints: {
        health: '/health',
        ready: '/ready',
        inventoryItem: '/api/v1/inventory/items/EAN-7701234001',
        inventoryReservation: 'POST /api/v1/inventory/reservations',
        chaosCrash: '/api/v1/chaos/crash',
      },
    });
  });

  return app;
}
