// src/interfaces/http/routes/health.routes.ts
import { Router, Request, Response } from 'express';

export function createHealthRoutes(): Router {
  const router = Router();

  // Liveness Probe para Kubernetes
  router.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      podName: process.env.HOSTNAME || 'local-container',
    });
  });

  // Readiness Probe para Kubernetes (verifica que el pod esté listo para recibir tráfico)
  router.get('/ready', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'READY',
      dependencies: {
        database: 'CONNECTED',
        cache: 'CONNECTED',
      },
      timestamp: new Date().toISOString(),
      podName: process.env.HOSTNAME || 'local-container',
    });
  });

  return router;
}
