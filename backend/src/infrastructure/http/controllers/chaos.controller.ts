import { Request, Response } from 'express';
import { ChaosUseCase } from '../../../domain/use-cases/chaos.use-case';

export class ChaosController {
  constructor(private readonly chaosUseCase: ChaosUseCase) {}

  public crash = (req: Request, res: Response): void => {
    const reason = req.body?.reason || 'Fallo crítico fatal forzado desde endpoint de caos';
    const result = this.chaosUseCase.execute(req.traceId, reason);
    res.status(200).json(result);
  };
}
