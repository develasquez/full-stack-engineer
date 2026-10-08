import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

declare global {
  namespace Express {
    interface Request {
      traceId?: string;
    }
  }
}

export function traceMiddleware(req: Request, res: Response, next: NextFunction): void {
  const cloudTraceHeader = req.header('x-cloud-trace-context');

  if (cloudTraceHeader) {
    // Header format: TRACE_ID/SPAN_ID;o=TRACE_TRUE
    const [traceId] = cloudTraceHeader.split('/');
    req.traceId = traceId;
  } else {
    req.traceId = randomUUID();
  }

  res.setHeader('x-trace-id', req.traceId);
  next();
}
