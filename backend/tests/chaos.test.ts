import { describe, it, expect, vi } from 'vitest';
import { ChaosUseCase } from '../src/domain/use-cases/chaos.use-case.js';

describe('ChaosUseCase (Deliberate Pod Crash for GKE Recovery)', () => {
  it('debe registrar el fallo fatal y programar process.exit', () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);
    vi.useFakeTimers();

    const chaos = new ChaosUseCase();
    chaos.triggerFatalCrash({
      reason: 'Prueba de test unitario',
      delayMs: 10,
    });

    vi.advanceTimersByTime(20);
    expect(exitSpy).toHaveBeenCalledWith(1);

    vi.useRealTimers();
    exitSpy.mockRestore();
  });
});
