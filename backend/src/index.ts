// src/index.ts
import { createServer } from './interfaces/http/server.js';
import { StructuredLogger } from './infrastructure/logging/structured-logger.js';

const PORT = Number(process.env.PORT) || 8080;
const app = createServer();

const server = app.listen(PORT, () => {
  StructuredLogger.info(`🚀 Microservicio D1 Backend iniciado exitosamente en puerto ${PORT}`, {
    method: 'bootstrap',
    port: PORT,
    nodeEnv: process.env.NODE_ENV || 'development',
    podName: process.env.HOSTNAME || 'local-container',
  });
});

// Manejo elegante de señales UNIX para GKE Rolling Updates
process.on('SIGTERM', () => {
  StructuredLogger.warn('Recibida señal SIGTERM en GKE: Cerrando servidor HTTP de forma limpia...', {
    method: 'SIGTERM_HANDLER',
  });
  server.close(() => {
    StructuredLogger.info('Servidor HTTP cerrado. Saliendo del proceso.', { method: 'SIGTERM_HANDLER' });
    process.exit(0);
  });
});
