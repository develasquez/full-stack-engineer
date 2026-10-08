# Especificación Formal SDD: Plataforma de Inventario Tiendas D1 (GCP 2026)
## Metodología: Specification-Driven Development (`sdd-skill`)

- **Proyecto:** Modernización Cloud Native Tiendas D1
- **Fecha:** Octubre 2026
- **Autor:** Felipe Andrés Velásquez Castro (AI Architecture Lead)
- **Estado:** `APROBADO PARA IMPLEMENTACIÓN`

---

## 1. Alcance y Objetivos de Negocio

La solución provee un sistema distribuido de alta disponibilidad para el control y reserva de existencias en tiendas físicas de D1, minimizando sobreventas y demostrando resiliencia y auto-sanación ante fallos en **Google Kubernetes Engine (GKE)**.

---

## 2. Especificación Técnica de Microservicios

### 2.1 Backend (`backend/`)
- **Runtime:** Node.js 20 LTS (Alpine), TypeScript 5.x estricto.
- **Patrón:** Clean Architecture (Domain -> UseCases -> Infrastructure -> Interfaces HTTP).
- **Contrato de Datos (Entidad `InventoryItem`):**
  - `sku`: Código único de barra/EAN (string).
  - `name`: Nombre comercial del producto (string).
  - `quantity`: Existencias disponibles en góndola/bodega (integer >= 0).
  - `unitPrice`: Precio unitario en COP (number > 0).
  - `category`: Categoría del producto (string).
- **Casos de Uso:**
  1. `ReserveStockUseCase`: Descuenta unidades atómicamente; si `quantity < requested`, rechaza con `InsufficientStockError`.
  2. `ChaosUseCase`: Endpoint deliberado `POST /api/v1/chaos/crash` que emite registro estructurado con severidad `EMERGENCY` y finaliza el proceso con `process.exit(1)`.
- **Observabilidad:**
  - `StructuredLogger` con campos estándar de Google Cloud Logging (`severity`, `serviceContext`, `logging.googleapis.com/trace`, `sourceLocation`).
- **Health Checks:**
  - `GET /health`: Liveness probe para K8s (retorna `{ status: "UP" }`).
  - `GET /ready`: Readiness probe para K8s (retorna `{ status: "READY" }`).

### 2.2 Frontend (`frontend/`)
- **Paradigma:** **Vanilla-Core UI** (cero frameworks pesados, JS moderno nativo).
- **Sistema de Diseño:** **Material Design 3** (`@develasquez/material-design`) + TailwindCSS.
- **Gestión de Estado:**
  - Single Source of Truth (SSoT) en `store.js`.
  - Mutaciones exclusivas vía `setState(newState)`.
  - Notificación reactiva mediante bus Pub/Sub desacoplado (`subscribe()`).
- **Renderizado:**
  - Renderizado quirúrgico en `ui/renderer.js` preservando el cursor y foco (anti-thrashing).
- **Componentes:**
  1. `header`: Logotipo de D1, identificador de tienda (`STORE-BOG-001`) y estado del nodo GKE.
  2. `catalog`: Tabla de inventario en tiempo real con botón de reserva directa.
  3. `chaos-panel`: Panel de control de Chaos Testing con botón para provocar el crash y visualizador de auto-sanación.

---

## 3. Criterios de Aceptación & Pruebas (TDD)

1. **CA-01 (Reserva Válida):** Al reservar 1 unidad de un SKU con stock 10, el saldo resultante debe ser exactamente 9.
2. **CA-02 (Bloqueo de Sobreventa):** Al solicitar una cantidad mayor al stock disponible, debe emitirse un log `WARNING` y retornar error HTTP 400.
3. **CA-03 (Trazabilidad Forense en Caos):** Al detonar el crash, debe generarse un log estructurado con `severity: "EMERGENCY"` antes de la muerte del proceso.
4. **CA-04 (Auto-Recuperación K8s):** El Kubelet debe reiniciar el contenedor o el ReplicaSet debe instanciar un nuevo Pod en menos de 10 segundos.
