import { StructuredLogger } from '../../infrastructure/logger/structured-logger';

export interface ChaosResult {
  status: 'crashing';
  message: string;
  traceId: string;
}

export class ChaosUseCase {
  constructor(
    private readonly logger: StructuredLogger,
    private readonly exitHandler: (code: number) => void = (code) => process.exit(code),
    private readonly delayMs: number = 100
  ) {}

  execute(traceId?: string, reason: string = 'Simulación de fallo crítico inducido por endpoint de caos'): ChaosResult {
    const error = new Error(`Simulated Pod Crash: ${reason}`);
    const resolvedTraceId = traceId || `projects/${process.env.GCP_PROJECT_ID || 'retail-enterprise-2026'}/traces/chaos-test-trace-id`;

    this.logger.emergency(
      `[CHAOS SIMULATION] Pod terminando de forma forzada: ${reason}`,
      {
        traceId: resolvedTraceId,
        stackTrace: error.stack,
        component: 'chaos-controller'
      }
    );

    const timer = setTimeout(() => {
      this.exitHandler(1);
    }, this.delayMs);
    if (typeof timer.unref === 'function') {
      timer.unref();
    }

    return {
      status: 'crashing',
      message: 'Fallo crítico inducido: Pod terminando de forma forzada',
      traceId: resolvedTraceId
    };
  }
}
