# Implementation Plan: Microservicio de Inventario de Retail (GCP 2026)

**Branch**: `001-inventory-service` | **Date**: 2026-10-08 | **Spec**: [`spec.md`](./spec.md)  
**Input**: Especificación de requerimientos técnicos y contratos de API de `specs/001-inventory-service/spec.md`

---

## Summary

Construcción de un microservicio de inventario de Retail Cloud Native implementando Clean Architecture con Node.js 20 y TypeScript. El servicio expone endpoints REST para consulta de catálogo (`GET /api/v1/products`), reserva atómica de existencias (`POST /api/v1/products/:sku/reserve`) con control de excepciones tipadas (`InsufficientStockError`, `ProductNotFoundError`), endpoint de inyección de fallas (`POST /api/v1/chaos/crash`) para validación de resiliencia en GKE, y observabilidad estructurada nativa para Google Cloud Logging (`StructuredLogger`).

---

## Technical Context

- **Language/Version**: Node.js 20 LTS, TypeScript 5.4+ (modo estricto)
- **Primary Dependencies**: Express 4.19+ (transporte HTTP liviano, sin ORMs pesados)
- **Storage**: Catálogo atómico en memoria estructurado tras la interfaz `ProductRepository`
- **Testing**: Vitest 1.6+ con 100% de cobertura en casos de uso y suite ejecutable vía `rtk npm test`
- **Target Platform**: Google Kubernetes Engine (GKE) contenedor Linux non-root (puerto 8080)
- **Project Type**: Microservicio Web REST Cloud Native
- **Performance Goals**: Respuestas de consulta y reserva en < 50ms p95; terminación forzada en < 200ms
- **Constraints**: 
  - Cumplimiento estricto de Clean Architecture (dominio desacoplado de Express).
  - Trazabilidad y correlación estructurada con Google Cloud Trace (`logging.googleapis.com/trace`).
  - Severidad `EMERGENCY` exclusiva para terminación crítica.
  - Sondas de Kubernetes (`/health`, `/ready`) respondiendo HTTP 200.

---

## Constitution Check

*GATE: Verificación obligatoria contra [`specs/constitution.md`](../constitution.md)*

| Principio Constitucional | Estado | Evidencia de Cumplimiento |
|---|---|---|
| **I. Specifications First** | **PASS** | `spec.md`, `data-model.md` y `contracts/` definidos antes de codificar. |
| **II. GitOps Determinista Puro** | **PASS** | No hay llamadas locales a `gcloud`; se empaqueta para Cloud Build y GKE. |
| **III. Minimal Complexity (Ponytail)**| **PASS** | Cero dependencias superfluas. `StructuredLogger` nativo con `JSON.stringify`. |
| **IV. Clean Architecture** | **PASS** | Dominio puro en `src/domain/` sin imports de Express ni transporte. |
| **V. Native Observability** | **PASS** | Esquema estándar de Google Cloud Logging con severidades y trace correlation. |
| **VI. Test-Driven Verification** | **PASS** | Suite completa con Vitest para éxito, stock insuficiente, SKU no encontrado y caos. |

---

## Project Structure

### Feature Documentation (`specs/001-inventory-service/`)
```text
specs/001-inventory-service/
├── spec.md                  # Especificación contractual de requerimientos y casos de uso
├── research.md              # Decisiones técnicas y justificación arquitectónica
├── data-model.md            # Entidades, invariantes y contratos de repositorio
├── quickstart.md            # Guía de validación y escenarios de prueba
├── contracts/
│   └── products-api.md      # Contratos de interfaces REST y esquemas JSON
├── checklists/
│   └── requirements.md      # Checklist de completitud y calidad
└── plan.md                  # Este documento (Blueprint técnico)
```

### Source Code Layout (`backend/`)
```text
backend/
├── src/
│   ├── domain/                              # Lógica pura de negocio (agnóstica de frameworks)
│   │   ├── entities/                        # Entidades del núcleo
│   │   │   └── product.entity.ts            # Entidad Product (sku, name, category, price, stock, storeId)
│   │   ├── errors/                          # Excepciones de dominio
│   │   │   ├── insufficient-stock.error.ts  # InsufficientStockError
│   │   │   └── product-not-found.error.ts   # ProductNotFoundError
│   │   ├── repositories/                    # Interfaces de persistencia
│   │   │   └── product.repository.ts        # Contrato ProductRepository
│   │   └── use-cases/                       # Casos de uso
│   │       ├── get-products.use-case.ts     # Consulta y filtrado de catálogo
│   │       ├── reserve-stock.use-case.ts    # Reserva atómica con validación de existencias
│   │       └── chaos.use-case.ts            # Registro de emergencia y terminación de proceso
│   ├── infrastructure/                      # Adaptadores y drivers externos
│   │   ├── http/                            # Servidor Express, controladores y rutas
│   │   │   ├── controllers/
│   │   │   │   ├── product.controller.ts    # Handlers para GET /products y POST /products/:sku/reserve
│   │   │   │   └── chaos.controller.ts      # Handler para POST /chaos/crash
│   │   │   ├── middlewares/
│   │   │   │   └── trace.middleware.ts      # Extracción de x-cloud-trace-context con fallback a UUID
│   │   │   └── server.ts                    # Configuración de Express, sondas /health y /ready
│   │   ├── logger/
│   │   │   └── structured-logger.ts         # Logger estructurado de Google Cloud
│   │   └── repositories/
│   │       └── in-memory-product.repository.ts # Implementación de ProductRepository con seed inicial
│   └── index.ts                             # Bootstrap de la aplicación (puerto 8080)
├── tests/                                   # Pruebas unitarias con Vitest
│   ├── reserve-stock.test.ts                # Tests de reserva atómica y errores
│   └── chaos.test.ts                        # Tests del disparo de caos y log EMERGENCY
├── tsconfig.json                            # Configuración TypeScript estricta
└── package.json                             # Dependencias mínimas y scripts (rtk npm test)
```

---

## Complexity Tracking

| Decisión / Patrón | ¿Por qué es necesario? | Alternativa más simple descartada porque: |
|---|---|---|
| Repositorio desacoplado mediante interfaz | Permite probar el caso de uso en milisegundos con Vitest sin levantar bases de datos | Hardcodear arrays dentro del caso de uso violaría Clean Architecture y Open/Closed. |
| Inyección de retardo de 100ms en caos | Asegura que el buffer de salida de `stdout` con el log `EMERGENCY` sea recibido por Cloud Logging | Una terminación sincrónica con `process.exit(1)` inmediata arriesga perder la traza forense. |
