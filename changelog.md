# Changelog — Retail Enterprise Platform (GCP 2026)

## [1.0.0] - 2026-10-08

### Backend Microservice (`backend/`)
- **Clean Architecture Domain**: Entidad `Product`, excepciones de dominio (`InsufficientStockError`, `ProductNotFoundError`).
- **Casos de Uso**: `GetProductsUseCase`, `ReserveStockUseCase` (descuento atómico), `ChaosUseCase` (inyección de fallas críticas).
- **Observabilidad Google Cloud**: `StructuredLogger` con severidades `INFO`, `WARNING`, `ERROR`, `EMERGENCY` y correlación de trazas `logging.googleapis.com/trace`.
- **API REST Express**: `GET /api/v1/products`, `POST /api/v1/products/:sku/reserve`, `POST /api/v1/chaos/crash`, `GET /health`, `GET /ready`.
- **Pruebas Unitarias Vitest**: 100% de cobertura de casos de uso ejecutando con pool forks.
- **Docker**: Multi-stage Dockerfile con usuario `node` non-root.

### Frontend SPA (`frontend/`)
- **Arquitectura Vanilla-Core UI**: Single Source of Truth (`store.js`), Pub/Sub desacoplado, mapeo DOM centralizado (`dom-elements.js`).
- **Material Design 3**: Paleta HCT *Oceanic Slate* (`#2B638B`), componentes de superficie y badges WCAG AAA (contraste >= 7:1).
- **Renderizado Quirúrgico (Anti-Thrashing)**: Actualizaciones localizadas en `ui/renderer.js` preservando foco de usuario.
- **Componentes**: Header con selector de tienda, Catálogo de inventario reactivo con reserva atómica, Panel de Chaos Engineering con monitoreo de auto-sanación de Kubelet.
- **Servidor Express Estático**: Puerto 80 con endpoint `/health` para sondas de GKE.
- **Docker**: Multi-stage Dockerfile non-root.

### DevSecOps & Manifiestos GKE (`k8s/` & `cloudbuild.yaml`)
- **Pipeline Cloud Build DAG**: Grafo de dependencias con `waitFor`: Vitest backend tests, construcción paralela frontend/backend, escaneo Aqua Trivy (`HIGH,CRITICAL`), push a Artifact Registry y despliegue GitOps declarativo con `gke-deploy`.
- **Kubernetes Manifiestos**:
  - `namespace.yaml`: Namespace `retail-store`.
  - `configmap.yaml` & `secret.yaml`: Configuración FinOps y credenciales simuladas.
  - `backend-deployment.yaml` & `backend-service.yaml`: ClusterIP con anotación NEG (`cloud.google.com/neg: '{"ingress": true}'`), probes y límites FinOps.
  - `frontend-deployment.yaml` & `frontend-service.yaml`: Puerto 80 con NEG.
  - `ingress.yaml`: Ingress L7 con rutas `/api/*` y `/*`.
  - `hpa.yaml`: Escalado elástico horizontal al 70% CPU (2 a 10 réplicas).
