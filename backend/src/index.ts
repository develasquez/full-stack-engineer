import { createServer } from './infrastructure/http/server';
import { StructuredLogger } from './infrastructure/logger/structured-logger';

const PORT = Number(process.env.PORT) || 8080;
const logger = new StructuredLogger();
const app = createServer({ logger });

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Retail Inventory Service escuchando en el puerto ${PORT}`, {
    component: 'bootstrap',
    port: PORT
  });
});
