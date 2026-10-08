// src/domain/use-cases/chaos.use-case.ts
import { StructuredLogger } from '../../infrastructure/logging/structured-logger.js';

export interface ChaosTriggerOptions {
  reason?: string;
  delayMs?: number;
  traceId?: string;
}

export class ChaosUseCase {
  /**
   * Genera deliberadamente una falla fatal en el proceso del backend.
   * Emite un log de severidad CRITICAL con contexto de Cloud Trace para
   * permitir el troubleshooting en GCP y comprobar la auto-recuperación de GKE.
   */
  public triggerFatalCrash(options: ChaosTriggerOptions): void {
    const { reason = 'Chaos Engineering Test: Muerte deliberada del Pod para prueba de auto-recuperación GKE', delayMs = 50, traceId } = options;

    StructuredLogger.emergency(`[CHAOS SIMULATION] Pod terminando de forma forzada: ${reason}`, new Error('FATAL_POD_CRASH_SIMULATION'), {
      traceId,
      method: 'ChaosUseCase.triggerFatalCrash',
      chaosDetails: {
        reason,
        nodeVersion: process.version,
        pid: process.pid,
        uptimeSeconds: process.uptime(),
        memoryUsage: process.memoryUsage(),
      },
    });

    // Pequeño timeout no bloqueante de 50ms para permitir que stdout/stderr vacíe el buffer hacia Cloud Logging
    setTimeout(() => {
      console.error(`💥 [CHAOS CRASH] Saliendo del proceso con código 1. GKE reiniciará este Pod.`);
      process.exit(1);
    }, delayMs);
  }
}
