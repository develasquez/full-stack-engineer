// src/interfaces/http/routes/chaos.routes.ts
import { Router, Request, Response } from 'express';
import { ChaosUseCase } from '../../../domain/use-cases/chaos.use-case.js';
import { StructuredLogger } from '../../../infrastructure/logging/structured-logger.js';

export function createChaosRoutes(): Router {
  const router = Router();
  const chaosUseCase = new ChaosUseCase();

  const handleCrash = (req: Request, res: Response) => {
    const traceHeader = req.header('X-Cloud-Trace-Context');
    const traceId = StructuredLogger.formatTrace(traceHeader);
    const reason = (req.body?.reason || req.query?.reason || 'Prueba de Chaos Engineering: Muerte forzada del Pod') as string;

    const podName = process.env.HOSTNAME || 'local-pod';
    const responsePayload = {
      status: 'CRASH_TRIGGERED',
      message: `El Pod '${podName}' iniciará su terminación forzada en 50ms para probar la auto-recuperación de Kubernetes GKE.`,
      traceId,
      troubleshooting: {
        cloudLoggingFilter: `resource.type="k8s_container" AND severity="EMERGENCY" AND jsonPayload.sourceLocation.function="ChaosUseCase.triggerFatalCrash"`,
        cloudTraceUrl: traceId ? `https://console.cloud.google.com/traces/traces?project=${process.env.GOOGLE_CLOUD_PROJECT || 'd1-ecommerce-prod'}` : undefined,
      },
      timestamp: new Date().toISOString(),
    };

    // Responder al cliente antes de que el proceso muera
    res.status(200).json(responsePayload);

    // Disparar la muerte deliberada del Pod
    chaosUseCase.triggerFatalCrash({
      reason,
      delayMs: 80,
      traceId,
    });
  };

  // Permitir GET y POST para máxima facilidad en terminal o navegador
  router.get('/crash', handleCrash);
  router.post('/crash', handleCrash);

  return router;
}
