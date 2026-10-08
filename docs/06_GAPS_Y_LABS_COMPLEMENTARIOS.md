# Gaps Técnicos y Laboratorios Complementarios: Retail Enterprise

Este documento recopila el código fuente complementario, manifiestos y políticas de infraestructura requeridos para cubrir al 100% los requerimientos de la agenda que no estaban empaquetados en los repositorios base.

---

## 1. Brecha de Sesión 2: Rate Limiting & Cloud Armor Security Policy

### A. Middleware de Rate Limiting con Redis en Express
Para entornos multi-pod en GKE, el rate-limiting en memoria local es insuficiente porque cada Pod mantiene su propio contador. Este middleware utiliza un almacén distribuido con Redis / Memorystore:

```typescript
// src/interfaces/http/middlewares/distributed-rate-limit.middleware.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

// Cliente Redis apuntando a Cloud Memorystore en la VPC privada
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://10.128.0.8:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.connect().catch(console.error);

export const retailApiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // Ventana de 1 minuto
  max: 150, // 150 peticiones por minuto por tienda / IP
  standardHeaders: true,
  legacyHeaders: false,
  // Almacén distribuido respaldado en Redis
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    prefix: 'rl:retail:',
  }),
  message: {
    status: 429,
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Se ha superado el umbral permitido de peticiones por minuto para su sucursal.',
    retryAfterSeconds: 60,
  },
});
```

---

### B. Política de Seguridad Cloud Armor para GKE Ingress
Política WAF y de mitigación DDoS a nivel de borde de Google Cloud:

```bash
# Crear política de seguridad Cloud Armor
gcloud compute security-policies create retail-edge-armor-policy \
    --description="Politica Cloud Armor para APIs de Retail Enterprise"

# Regla 1: Rate limiting perimetral (Máximo 500 req/min por IP origen)
gcloud compute security-policies rules create 1000 \
    --security-policy=retail-edge-armor-policy \
    --expression="true" \
    --action="rate-based-ban" \
    --rate-limit-threshold-count=500 \
    --rate-limit-threshold-interval-sec=60 \
    --ban-duration-sec=300 \
    --conform-action="allow" \
    --exceed-action="deny(429)" \
    --enforce-on-key="IP"

# Regla 2: Mitigación de inyecciones SQL (SQLi) preconfigurada por Google
gcloud compute security-policies rules create 2000 \
    --security-policy=retail-edge-armor-policy \
    --expression="evaluatePreconfiguredExpr('sqli-v33-stable')" \
    --action="deny(403)" \
    --description="Bloqueo automatico de SQL Injection"
```

---

## 2. Brecha de Sesión 4: Configuración Avanzada de GKE Ingress

Para que GKE Ingress redirija automáticamente el tráfico HTTP a HTTPS y vincule la política de Cloud Armor, se requieren dos recursos nativos de GKE: `FrontendConfig` y `BackendConfig`.

### A. `frontend-config.yaml` (Redirección HTTP $\to$ HTTPS)
```yaml
apiVersion: networking.gke.io/v1beta1
kind: FrontendConfig
metadata:
  name: retail-frontend-config
  namespace: default
spec:
  redirectToHttps:
    enabled: true
    responseCodeName: MOVED_PERMANENTLY_DEFAULT # HTTP 301
```

---

### B. `backend-config.yaml` (Cloud Armor & Health Checks Personalizados)
```yaml
apiVersion: networking.gke.io/v1beta1
kind: BackendConfig
metadata:
  name: retail-backend-config
  namespace: default
spec:
  securityPolicy:
    name: "retail-edge-armor-policy" # Vinculación con Cloud Armor
  timeoutSec: 30
  connectionDraining:
    drainingTimeoutSec: 60
  healthCheck:
    checkIntervalSec: 10
    timeoutSec: 5
    healthyThreshold: 2
    unhealthyThreshold: 3
    type: HTTP
    requestPath: /health
    port: 8080
```

---

### C. Manifiesto Integrado de Ingress y Service con Anotaciones
```yaml
apiVersion: v1
kind: Service
metadata:
  name: retail-inventory-svc
  namespace: default
  annotations:
    beta.cloud.google.com/backend-config: '{"default": "retail-backend-config"}'
spec:
  type: ClusterIP
  selector:
    app: retail-inventory
  ports:
    - port: 8080
      targetPort: 8080
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: retail-inventory-ingress
  namespace: default
  annotations:
    kubernetes.io/ingress.class: "gce"
    networking.gke.io/managed-certificates: "retail-inventory-cert"
    networking.gke.io/v1beta1.FrontendConfig: "retail-frontend-config"
spec:
  rules:
    - host: api-inventario.retailstore.com
      http:
        paths:
          - path: /*
            pathType: ImplementationSpecific
            backend:
              service:
                name: retail-inventory-svc
                port:
                  number: 8080
```

---

## 3. Implementación de Sondas de Salud `/health` y `/ready` con Ping a Base de Datos

En Express, las sondas deben responder con precisión según el estado de las dependencias:

```typescript
// src/interfaces/http/routes/health.routes.ts
import { Router, Request, Response } from 'express';
import { Pool } from 'pg';

export function createHealthRoutes(dbPool: Pool): Router {
  const router = Router();

  // Liveness Probe: Solo verifica que el proceso Node.js no esté muerto o en bucle infinito
  router.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  // Readiness Probe: Verifica que la base de datos PostgreSQL responda antes de enviar tráfico
  router.get('/ready', async (_req: Request, res: Response) => {
    try {
      const client = await dbPool.connect();
      await client.query('SELECT 1');
      client.release();

      res.status(200).json({
        status: 'READY',
        database: 'CONNECTED',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(503).json({
        status: 'NOT_READY',
        database: 'DISCONNECTED',
        error: error.message,
      });
    }
  });

  return router;
}
```
