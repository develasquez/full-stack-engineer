# Feature Specification: Microservicio de Inventario de Retail (GCP 2026)

**Feature Branch**: `001-inventory-service`  
**Created**: 2026-10-08  
**Status**: Clarified / Ready for Technical Plan  
**Input**: Diseña el microservicio de inventario de Retail los contratos de API:
- Modelo de dominio Product (SKU, nombre, categoría, precio, stock disponible, storeId).
- Endpoints REST: GET /api/v1/products para consultar el inventario, POST /api/v1/products/:sku/reserve para descontar stock de forma atómica; si el pedido supera las existencias lanza InsufficientStockError (HTTP 400); si el SKU no existe lanza ProductNotFoundError (HTTP 404).
- Endpoint de Caos POST /api/v1/chaos/crash: registra log estructurado con severidad EMERGENCY y stack trace en formato Google Cloud Logging, y ejecuta process.exit(1) para forzar la muerte del contenedor.

---

## Clarifications

### Session 2026-10-08
- **Q**: ¿Cómo debe gestionar el microservicio la extracción y propagación de trazas distribuidas (`logging.googleapis.com/trace`) en los logs estructurados?  
  → **A**: Extraer `x-cloud-trace-context` (formato `TRACE_ID/SPAN_ID;o=OPTIONS`) de la cabecera HTTP mapeándolo a `projects/${GCP_PROJECT_ID}/traces/${TRACE_ID}`, y utilizar fallback a UUID v4 local si el encabezado no está presente en la solicitud.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consulta de Catálogo e Inventario por Tienda (Priority: P1 - MVP)

Como cliente o cajero de la tienda retail, necesito consultar el inventario disponible de productos filtrado por tienda o catálogo general para saber qué artículos están listos para la venta en tiempo real.

**Why this priority**: Es la funcionalidad nuclear básica (MVP). Sin la visibilidad del catálogo y el stock en estantería/almacén, ninguna operación posterior de compra, reserva o checkout puede ejecutarse.

**Independent Test**: Puede probarse de forma aislada realizando una petición HTTP GET y verificando que retorne la lista de productos con SKU, nombre, categoría, precio, stock y storeId correspondiente.

**Acceptance Scenarios**:

1. **Given** existen productos registrados en el inventario para la tienda `STORE-001`,  
   **When** el cliente o sistema consulta el endpoint `GET /api/v1/products`,  
   **Then** el sistema responde con código HTTP 200 y una lista JSON de todos los productos con sus atributos completos (`sku`, `name`, `category`, `price`, `stock`, `storeId`).

2. **Given** existen productos para múltiples tiendas (`STORE-001`, `STORE-002`),  
   **When** el cliente envía `GET /api/v1/products?storeId=STORE-001`,  
   **Then** el sistema retorna únicamente los productos pertenecientes a `STORE-001` con código HTTP 200.

3. **Given** no existen productos que coincidan con el filtro solicitado,  
   **When** el cliente ejecuta `GET /api/v1/products?storeId=STORE-999`,  
   **Then** el sistema retorna una lista vacía `[]` con código HTTP 200.

---

### User Story 2 - Reserva Atómica de Stock con Control de Concurrencia (Priority: P2)

Como motor de checkout y ventas de Retail, necesito reservar unidades de un producto por SKU de forma atómica para garantizar que no exista sobreventa (overselling) ante compras simultáneas y descontar el inventario de manera consistente.

**Why this priority**: La integridad transaccional del stock es crítica para el negocio de retail. Evita ventas de artículos agotados y asegura consistencia ante alta demanda.

**Independent Test**: Puede probarse ejecutando peticiones POST concurrentes hacia `POST /api/v1/products/:sku/reserve` y comprobando que el stock disminuya exactamente por la cantidad solicitada o falle adecuadamente si no hay suficiente existencias.

**Acceptance Scenarios**:

1. **Given** el producto con SKU `PROD-001` tiene `10` unidades de stock disponible,  
   **When** se solicita reservar `2` unidades mediante `POST /api/v1/products/PROD-001/reserve` con body `{ "quantity": 2 }`,  
   **Then** el sistema descuenta atómicamente el stock, responde HTTP 200 con `{ "sku": "PROD-001", "reservedQuantity": 2, "remainingStock": 8 }`, y el stock resultante en el sistema es `8`.

2. **Given** el producto con SKU `PROD-002` tiene `3` unidades de stock disponible,  
   **When** se solicita reservar `5` unidades mediante `POST /api/v1/products/PROD-002/reserve` con body `{ "quantity": 5 }`,  
   **Then** el sistema rechaza la operación lanzando una excepción de dominio `InsufficientStockError`, retornando código HTTP 400 y un payload estructurado `{ "error": "InsufficientStockError", "message": "Stock insuficiente para el producto PROD-002. Solicitado: 5, Disponible: 3", "sku": "PROD-002", "requested": 5, "available": 3 }`, manteniendo el stock intacto en `3`.

3. **Given** el SKU `PROD-NON-EXISTENT` no se encuentra en la base de datos de inventario,  
   **When** se solicita reservar `1` unidad mediante `POST /api/v1/products/PROD-NON-EXISTENT/reserve` con body `{ "quantity": 1 }`,  
   **Then** el sistema lanza la excepción de dominio `ProductNotFoundError`, retornando código HTTP 404 y un payload estructurado `{ "error": "ProductNotFoundError", "message": "Producto con SKU PROD-NON-EXISTENT no encontrado", "sku": "PROD-NON-EXISTENT" }`.

4. **Given** una petición de reserva con cantidad inválida (ej. `0`, negativa o no entera),  
   **When** se invoca `POST /api/v1/products/PROD-001/reserve` con body `{ "quantity": -2 }`,  
   **Then** el sistema retorna código HTTP 400 con un mensaje de validación descriptivo sin alterar el stock.

---

### User Story 3 - Inyección de Fallas Forenses (Chaos Testing) y Auto-Sanación Cloud Native (Priority: P3)

Como Ingeniero SRE / DevOps, necesito un mecanismo controlado para inducir la muerte forzada del microservicio mediante un endpoint de caos que registre telemetría forense estructurada en Google Cloud Logging con severidad EMERGENCY y stack trace, para validar las políticas de resiliencia, health probes y auto-recuperación de Pods en Google Kubernetes Engine (GKE).

**Why this priority**: Habilita la validación activa de observabilidad en GCP, las alertas automáticas y los contratos de operación bajo fallos catastróficos en clústeres Kubernetes de alta disponibilidad.

**Independent Test**: Puede probarse enviando `POST /api/v1/chaos/crash`, capturando la salida en stdout en formato JSON estructurado compatible con Google Cloud Logging con `severity: "EMERGENCY"`, y verificando que el proceso Node.js finalice con código de salida `1` (`process.exit(1)`).

**Acceptance Scenarios**:

1. **Given** el microservicio de inventario se encuentra operativo y recibiendo tráfico,  
   **When** se envía una solicitud `POST /api/v1/chaos/crash`,  
   **Then** el sistema emite inmediatamente a `stdout` un evento JSON estructurado con severidad `EMERGENCY`, stack trace forense, mensaje descriptivo y contexto de traza distribuida (`logging.googleapis.com/trace`).

2. **Given** la emisión del log de emergencia forense,  
   **When** transcurren 100 milisegundos tras registrar el log,  
   **Then** el microservicio ejecuta `process.exit(1)`, forzando la terminación del contenedor para que la sonda de vida (`livenessProbe`) y el Kubelet de GKE detecten la detención y aprovisionen un Pod sustituto.

---

### Edge Cases

- **Concurrencia Extrema de Stock Cero**: Si dos peticiones simultáneas intentan reservar la última unidad disponible (`stock = 1`), exactamente una debe tener éxito (HTTP 200, restante `0`) y la otra debe fallar de forma atómica con `InsufficientStockError` (HTTP 400).
- **Entrada Malformada o Ausente en Body**: Peticiones a `POST /api/v1/products/:sku/reserve` con body vacío o sin campo `quantity` deben ser interceptadas y responder HTTP 400 indicando requerimiento del campo numérico.
- **Formato de Trace y Propagación**: El middleware de logging extraerá la cabecera HTTP `x-cloud-trace-context` (formato `TRACE_ID/SPAN_ID;o=OPTIONS`) formateándolo como `projects/${GCP_PROJECT_ID}/traces/${TRACE_ID}`. Cuando la cabecera no esté presente o en pruebas locales/unitarias, el sistema generará automáticamente un UUID v4 local para asegurar que la propiedad `logging.googleapis.com/trace` siempre exista en los logs estructurados sin degradar la respuesta HTTP.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE exponer el endpoint `GET /api/v1/products` para consultar el listado completo de productos de inventario.
- **FR-002**: El sistema DEBE permitir filtrar la consulta de productos por el parámetro de consulta `storeId` (ej. `GET /api/v1/products?storeId=STORE-001`).
- **FR-003**: El sistema DEBE implementar la entidad de dominio `Product` conteniendo los campos: `sku` (string único), `name` (string), `category` (string), `price` (número positivo), `stock` (entero mayor o igual a 0) y `storeId` (string).
- **FR-004**: El sistema DEBE exponer el endpoint `POST /api/v1/products/:sku/reserve` que acepte en el body la cantidad a reservar (`quantity: integer > 0`) y ejecute la deducción de forma atómica.
- **FR-005**: Si la cantidad solicitada excede el stock actual disponible, el caso de uso DEBE lanzar la excepción de dominio `InsufficientStockError`, la cual se traducirá en el adaptador HTTP en una respuesta HTTP 400 con los detalles de cantidad solicitada y existente.
- **FR-006**: Si el SKU solicitado no existe en el catálogo, el caso de uso DEBE lanzar la excepción de dominio `ProductNotFoundError`, traduciéndose en una respuesta HTTP 404.
- **FR-007**: El sistema DEBE exponer el endpoint de pruebas de caos `POST /api/v1/chaos/crash`, el cual emite un log forense estructurado con severidad `EMERGENCY` a `stdout` y fuerza la terminación del contenedor con `process.exit(1)` con un delay de 100 ms.
- **FR-008**: El sistema DEBE integrar un logger estructurado compatible con Google Cloud Logging (`severity`, `message`, `timestamp`, `component`, `logging.googleapis.com/trace`). Debe extraer `TRACE_ID` desde la cabecera `x-cloud-trace-context` (`TRACE_ID/SPAN_ID`) y formatearlo como `projects/${GCP_PROJECT_ID}/traces/${TRACE_ID}`, con fallback a UUID v4 si dicha cabecera está ausente.
- **FR-009**: El sistema DEBE exponer los endpoints de sondas de salud `GET /health` y `GET /ready` respondiendo HTTP 200 para la integración con Kubernetes / GKE.

### Key Entities

- **Product**:
  - `sku`: Identificador alfanumérico único del producto (ej. `PROD-001`).
  - `name`: Nombre descriptivo del artículo comercial (ej. `Smart TV 55 UHD`).
  - `category`: Categoría departamental de Retail (ej. `Electro`, `Moda`, `Hogar`).
  - `price`: Precio unitario en moneda local (número flotante/entero positivo).
  - `stock`: Cantidad física disponible para reserva/venta (entero `>= 0`).
  - `storeId`: Identificador de la tienda física o centro de distribución (ej. `STORE-001`).

- **ReservationRequest**:
  - `sku`: SKU del producto recibido por parámetro de ruta.
  - `quantity`: Cantidad solicitada a reservar (entero positivo `>= 1`).

- **ReservationResult**:
  - `sku`: SKU del producto reservado.
  - `reservedQuantity`: Cantidad efectivamente descontada.
  - `remainingStock`: Stock remanente en el inventario tras la reserva.

- **StructuredLogEntry (Google Cloud Logging format)**:
  - `severity`: Nivel de severidad (`INFO`, `WARNING`, `ERROR`, `EMERGENCY`).
  - `message`: Mensaje descriptivo de la traza u operación.
  - `timestamp`: Marca de tiempo en formato ISO 8601.
  - `logging.googleapis.com/trace`: URI de correlación de traza `projects/${PROJECT_ID}/traces/${TRACE_ID}`.
  - `stack_trace`: Opcional, traza de error en eventos críticos o emergencias.

---

## Contratos de API (REST Contracts)

### 1. `GET /api/v1/products`
- **Método**: `GET`
- **Query Params**: `storeId` (opcional, string)
- **Respuestas**:
  - `200 OK`:
    ```json
    [
      {
        "sku": "PROD-001",
        "name": "Smart TV 55 4K",
        "category": "Electrónica",
        "price": 499.99,
        "stock": 15,
        "storeId": "STORE-001"
      },
      {
        "sku": "PROD-002",
        "name": "Zapatillas Running Pro",
        "category": "Calzado",
        "price": 89.90,
        "stock": 3,
        "storeId": "STORE-001"
      }
    ]
    ```

### 2. `POST /api/v1/products/:sku/reserve`
- **Método**: `POST`
- **Path Params**: `sku` (string, obligatorio)
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "quantity": 2
  }
  ```
- **Respuestas**:
  - `200 OK`:
    ```json
    {
      "sku": "PROD-001",
      "reservedQuantity": 2,
      "remainingStock": 13,
      "message": "Stock reservado exitosamente"
    }
    ```
  - `400 Bad Request` (Stock Insuficiente):
    ```json
    {
      "error": "InsufficientStockError",
      "message": "Stock insuficiente para el producto PROD-002. Solicitado: 5, Disponible: 3",
      "sku": "PROD-002",
      "requested": 5,
      "available": 3
    }
    ```
  - `404 Not Found` (Producto no encontrado):
    ```json
    {
      "error": "ProductNotFoundError",
      "message": "Producto con SKU PROD-999 no encontrado",
      "sku": "PROD-999"
    }
    ```

### 3. `POST /api/v1/chaos/crash`
- **Método**: `POST`
- **Headers**: `Content-Type: application/json`
- **Comportamiento**:
  - Emite log JSON a `stdout`:
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
  - Responde HTTP 200 con `{ "status": "crashing", "message": "Container termination initiated" }`.
  - Ejecuta `process.exit(1)` tras 100 ms.

### 4. `GET /health` & `GET /ready`
- **Método**: `GET`
- **Respuestas**:
  - `200 OK`: `{ "status": "UP", "timestamp": "2026-10-08T07:44:00.000Z" }`

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de las consultas de inventario devuelven el estado del stock en menos de 50 milisegundos bajo pruebas locales estándar.
- **SC-002**: El sistema mantiene consistencia atómica absoluta del 100% en condiciones de concurrencia, evitando cualquier saldo negativo de inventario.
- **SC-003**: En el 100% de las reservas no viables por falta de unidades, se devuelven códigos HTTP 400 con la estructura de error tipada `InsufficientStockError`.
- **SC-004**: Ante la invocación de caos, el contenedor finaliza de manera determinista (exit code 1) en menos de 200 milisegundos, emitiendo el log forense en formato JSON con severidad `EMERGENCY`.
- **SC-005**: 100% de cobertura de pruebas unitarias sobre los casos de uso (`reserve-stock` y `chaos`).

---

## Assumptions

- **A-001**: El inventario inicial se pre-cargará mediante un catálogo representativo en memoria para permitir pruebas inmediatas sin dependencias externas pesadas de base de datos en los labs iniciales, respetando Clean Architecture mediante una interfaz de repositorio (`ProductRepository`).
- **A-002**: Las trazas distribuidas utilizarán la cabecera estándar `x-cloud-trace-context` cuando sea provista por el Ingress / Load Balancer de GCP, o un ID autogenerado en caso de pruebas locales.
- **A-003**: El framework HTTP subyacente será Express sobre Node.js 20 con TypeScript, estructurado según las directivas de Clean Architecture y sin dependencias de transporte en la capa de dominio.
