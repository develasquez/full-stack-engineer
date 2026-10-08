import { describe, it, expect, vi } from 'vitest';
import { ChaosUseCase } from '../src/domain/use-cases/chaos.use-case';
import { StructuredLogger } from '../src/infrastructure/logger/structured-logger';

describe('ChaosUseCase', () => {
  it('debe registrar un evento de severidad EMERGENCY y programar el cierre del proceso', async () => {
    const logger = new StructuredLogger();
    const mockExit = vi.fn();
    const chaosUseCase = new ChaosUseCase(logger, mockExit, 10);

    const result = chaosUseCase.execute('projects/retail-test/traces/trace-123', 'Prueba Unitaria de Caos');

    expect(result.status).toBe('crashing');
    expect(result.traceId).toContain('trace-123');

    // Esperar a que el delay de 10ms se complete
    await new Promise((resolve) => setTimeout(resolve, 25));

    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
