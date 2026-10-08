# Especificación de Dominio: Microservicio de Inventario Retail (GCP 2026)
> Archivo canónico de dominio según directiva `AGENTS.md`.  
> Fuente detallada del ciclo SDD: [`specs/001-inventory-service/spec.md`](./001-inventory-service/spec.md)

---

## 1. Modelo de Dominio (`Product`)
- **sku** (`string`): Identificador único del producto (ej: `PROD-001`).
- **name** (`string`): Nombre del artículo.
- **category** (`string`): Categoría del producto (ej: `Electrónica`, `Calzado`).
- **price** (`number`): Precio unitario en moneda local.
- **stock** (`number`, entero `>= 0`): Unidades físicas disponibles para reserva y venta.
- **storeId** (`string`): Identificador de la tienda física (ej: `STORE-001`).

---

## 2. Excepciones de Dominio
- **`InsufficientStockError`**: Lanzada cuando la cantidad solicitada para reserva supera el stock disponible en almacén. Mapea a **HTTP 400 Bad Request**.
- **`ProductNotFoundError`**: Lanzada cuando el SKU solicitado no se encuentra en el inventario. Mapea a **HTTP 404 Not Found**.

---

## 3. Contratos de API REST

### `GET /api/v1/products`
- **Descripción**: Consulta el catálogo de productos y su disponibilidad de stock.
- **Query Params**: `storeId` (opcional).
- **Código HTTP**: `200 OK`.
- **Payload**: Lista de entidades `Product`.

### `POST /api/v1/products/:sku/reserve`
- **Descripción**: Descuenta atómicamente el stock solicitado.
- **Path Params**: `sku` (string).
- **Body**: `{ "quantity": number }`.
- **Respuestas**:
  - `200 OK`: `{ "sku": string, "reservedQuantity": number, "remainingStock": number, "message": string }`
  - `400 Bad Request`: `{ "error": "InsufficientStockError", "message": string, "sku": string, "requested": number, "available": number }`
  - `404 Not Found`: `{ "error": "ProductNotFoundError", "message": string, "sku": string }`

### `POST /api/v1/chaos/crash`
- **Descripción**: Endpoint de prueba de caos y resiliencia en GKE.
- **Acción**:
  1. Emite log estructurado a `stdout` con severidad `EMERGENCY` y stack trace forense compatible con **Google Cloud Logging**.
  2. Incluye vinculación de traza `logging.googleapis.com/trace`.
  3. Ejecuta `process.exit(1)` con un delay de 100 ms para inducir la auto-recuperación por Kubelet en GKE.

### `GET /health` & `GET /ready`
- **Descripción**: Sondas de liveness y readiness para Kubernetes.
- **Código HTTP**: `200 OK` `{ "status": "UP" }`.

---

## 4. Severidades y Formato de Observabilidad (Google Cloud Logging)
- Formato: JSON estructurado a `stdout`.
- Severidades estándar: `INFO`, `WARNING`, `ERROR`, `EMERGENCY`.
- Campo de traza distribuida: `logging.googleapis.com/trace: projects/${GCP_PROJECT_ID}/traces/${TRACE_ID}`.
- Propagación de Traza: Extrae `TRACE_ID` de la cabecera HTTP `x-cloud-trace-context` (`TRACE_ID/SPAN_ID`), con fallback a UUID v4 local si está ausente.

