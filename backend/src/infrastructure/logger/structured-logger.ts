export type LogSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'EMERGENCY';

export interface LogContext {
  traceId?: string;
  component?: string;
  stackTrace?: string;
  [key: string]: unknown;
}

export class StructuredLogger {
  private readonly projectId: string;

  constructor(projectId?: string) {
    this.projectId = projectId || process.env.GCP_PROJECT_ID || 'retail-enterprise-2026';
  }

  public formatTrace(traceId?: string): string {
    if (!traceId) return `projects/${this.projectId}/traces/default-trace-id`;
    if (traceId.startsWith('projects/')) return traceId;
    return `projects/${this.projectId}/traces/${traceId}`;
  }

  private write(severity: LogSeverity, message: string, context?: LogContext): void {
    const entry: Record<string, unknown> = {
      severity,
      message,
      timestamp: new Date().toISOString(),
      component: context?.component || 'inventory-service',
      'logging.googleapis.com/trace': this.formatTrace(context?.traceId)
    };

    if (context?.stackTrace) {
      entry['stack_trace'] = context.stackTrace;
    }

    if (context) {
      for (const [key, val] of Object.entries(context)) {
        if (!['traceId', 'component', 'stackTrace'].includes(key)) {
          entry[key] = val;
        }
      }
    }

    process.stdout.write(JSON.stringify(entry) + '\n');
  }

  public info(message: string, context?: LogContext): void {
    this.write('INFO', message, context);
  }

  public warning(message: string, context?: LogContext): void {
    this.write('WARNING', message, context);
  }

  public error(message: string, context?: LogContext): void {
    this.write('ERROR', message, context);
  }

  public emergency(message: string, context?: LogContext): void {
    this.write('EMERGENCY', message, context);
  }
}
