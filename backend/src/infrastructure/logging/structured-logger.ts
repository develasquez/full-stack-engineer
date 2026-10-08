// src/infrastructure/logging/structured-logger.ts
export interface LogContext {
  traceId?: string;
  spanId?: string;
  storeId?: string;
  method?: string;
  [key: string]: any;
}

export class StructuredLogger {
  private static projectId = process.env.GOOGLE_CLOUD_PROJECT || 'd1-ecommerce-prod';

  public static formatTrace(traceHeader?: string): string | undefined {
    if (!traceHeader) return undefined;
    const [traceId] = traceHeader.split('/');
    return `projects/${this.projectId}/traces/${traceId}`;
  }

  public static log(severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL' | 'EMERGENCY', message: string, context: LogContext = {}) {
    const { traceId, spanId, method, ...rest } = context;

    const payload: Record<string, any> = {
      severity,
      message,
      timestamp: new Date().toISOString(),
      serviceContext: {
        service: 'd1-inventory-backend',
        version: process.env.SERVICE_VERSION || '1.0.0',
      },
      ...rest,
    };

    if (traceId) {
      payload['logging.googleapis.com/trace'] = traceId.startsWith('projects/')
        ? traceId
        : `projects/${this.projectId}/traces/${traceId}`;
    }

    if (spanId) {
      payload['logging.googleapis.com/spanId'] = spanId;
    }

    if (method) {
      payload['sourceLocation'] = { function: method };
    }

    const logLine = JSON.stringify(payload);
    if (severity === 'ERROR' || severity === 'CRITICAL' || severity === 'EMERGENCY') {
      console.error(logLine);
    } else {
      console.log(logLine);
    }
  }

  public static info(message: string, context?: LogContext) {
    this.log('INFO', message, context);
  }

  public static warn(message: string, context?: LogContext) {
    this.log('WARNING', message, context);
  }

  public static error(message: string, error?: any, context?: LogContext) {
    this.log('ERROR', message, {
      ...context,
      error: error?.message,
      stack: error?.stack,
    });
  }

  public static critical(message: string, error?: any, context?: LogContext) {
    this.log('CRITICAL', message, {
      ...context,
      error: error?.message,
      stack: error?.stack,
    });
  }

  public static emergency(message: string, error?: any, context?: LogContext) {
    this.log('EMERGENCY', message, {
      ...context,
      error: error?.message,
      stack: error?.stack,
    });
  }
}
