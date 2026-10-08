# API Interface Contracts: Retail Inventory Service

**Feature**: `001-inventory-service`  
**Base Path**: `/api/v1`  
**Protocol**: HTTP/1.1 REST + JSON  
**Observability**: Google Cloud Logging format to stdout

---

## 1. `GET /api/v1/products`

Recupera el inventario de productos disponibles, con soporte para filtrado opcional por identificador de tienda.

- **Método**: `GET`
- **Query Parameters**:
  - `storeId` (opcional, string): Identificador de la tienda (ej: `STORE-001`).
- **Headers**:
  - `x-cloud-trace-context` (opcional): Contexto de traza distribuida inyectado por GCP Ingress.

### Respuesta Exitosa (`200 OK`)
```json
[
  {
    "sku": "PROD-001",
    "name": "Smart TV 55 4K UHD",
    "category": "Electrónica",
    "price": 499.99,
    "stock": 15,
    "storeId": "STORE-001"
  },
  {
    "sku": "PROD-002",
    "name": "Zapatillas Running Pro Nitro",
    "category": "Calzado",
    "price": 89.90,
    "stock": 3,
    "storeId": "STORE-001"
  }
]
```

---

## 2. `POST /api/v1/products/:sku/reserve`

Ejecuta la deducción atómica de existencias para un artículo especificado por su SKU.

- **Método**: `POST`
- **Ruta**: `/api/v1/products/:sku/reserve`
- **Path Parameters**:
  - `sku` (obligatorio, string): Identificador del producto a reservar.
- **Headers**:
  - `Content-Type: application/json`
  - `x-cloud-trace-context` (opcional)

### Request Body
```json
{
  "quantity": 2
}
```

### Respuesta Exitosa (`200 OK`)
```json
{
  "sku": "PROD-001",
  "reservedQuantity": 2,
  "remainingStock": 13,
  "message": "Stock reservado exitosamente"
}
```

### Respuestas de Error
- **`400 Bad Request` — Stock Insuficiente (`InsufficientStockError`)**:
  ```json
  {
    "error": "InsufficientStockError",
    "message": "Stock insuficiente para el producto PROD-002. Solicitado: 5, Disponible: 3",
    "sku": "PROD-002",
    "requested": 5,
    "available": 3
  }
  ```

- **`400 Bad Request` — Payload Inválido**:
  ```json
  {
    "error": "ValidationError",
    "message": "La cantidad debe ser un número entero mayor que cero"
  }
  ```

- **`404 Not Found` — Producto No Encontrado (`ProductNotFoundError`)**:
  ```json
  {
    "error": "ProductNotFoundError",
    "message": "Producto con SKU PROD-999 no encontrado",
    "sku": "PROD-999"
  }
  ```

---

## 3. `POST /api/v1/chaos/crash`

Induce deliberadamente un fallo crítico fatal en el proceso del contenedor con fines de prueba de resiliencia y auto-sanación en GKE.

- **Método**: `POST`
- **Headers**: `Content-Type: application/json`

### Respuesta HTTP Inmediata (`200 OK`)
```json
{
  "status": "crashing",
  "message": "Fallo crítico inducido: Pod terminando de forma forzada",
  "traceId": "projects/retail-enterprise-2026/traces/chaos-test-trace-id"
}
```

### Evento Forense a `stdout` (Google Cloud Logging Format)
```json
{
  "severity": "EMERGENCY",
  "message": "[CHAOS SIMULATION] Pod terminando de forma forzada: fallo crítico inducido por endpoint de caos",
  "component": "chaos-controller",
  "timestamp": "2026-10-08T07:44:00.000Z",
  "logging.googleapis.com/trace": "projects/retail-enterprise-2026/traces/chaos-test-trace-id",
  "stack_trace": "Error: Simulated Pod Crash at ChaosUseCase.execute (/app/src/domain/use-cases/chaos.use-case.ts:15:11)"
}
```
*Efecto de proceso*: Ejecuta `process.exit(1)` 100 ms después de emitir el log.

---

## 4. `GET /health` & `GET /ready` (Kubernetes Probes)

Sondas de liveness y readiness para el Kubelet de Google Kubernetes Engine.

- **Método**: `GET`
- **Respuesta (`200 OK`)**:
  ```json
  {
    "status": "UP",
    "timestamp": "2026-10-08T07:44:00.000Z"
  }
  ```
