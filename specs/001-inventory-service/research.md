# Technical Research & Architectural Decisions: Microservicio de Inventario

**Feature**: `001-inventory-service`  
**Date**: 2026-10-08  
**Status**: Completed (Phase 0 SDD)

---

## 1. Decision: Runtime y Lenguaje (Node.js 20 LTS + TypeScript 5.x)
- **Decision**: Adoptar Node.js 20 LTS con TypeScript en modo estricto (`strict: true`, target `ES2022`).
- **Rationale**: Node.js 20 proporciona soporte nativo de APIs modernas (`crypto.randomUUID()`, `fetch`), excelente rendimiento en contenedores ligeros y tipado estático robusto en tiempo de compilación.
- **Alternatives considered**:
  - *JavaScript puro*: Menor disciplina de tipos y mayor riesgo de errores en tiempo de ejecución en contratos de dominio.
  - *Go*: Excelente rendimiento pero incrementa la curva de aprendizaje y diverge del stack full-stack unificado (TypeScript en backend y frontend).

---

## 2. Decision: Patrón Arquitectónico (Clean Architecture Aislada)
- **Decision**: Separar estrictamente la aplicación en capas concéntricas:
  - `src/domain/entities/`: Entidades puras y tipos primitivos de negocio.
  - `src/domain/errors/`: Excepciones de negocio (`InsufficientStockError`, `ProductNotFoundError`).
  - `src/domain/use-cases/`: Lógica de aplicación pura sin dependencias de Express ni HTTP.
  - `src/infrastructure/http/`: Controladores Express, serialización, middlewares y rutas.
  - `src/infrastructure/logger/`: Logger estructurado para Google Cloud Logging.
- **Rationale**: Cumple directamente con las reglas de [`AGENTS.md`](../../AGENTS.md) y la Constitución del proyecto. Facilita pruebas unitarias al 100% sin necesidad de mocks de red o servidores HTTP levantados.
- **Alternatives considered**:
  - *Arquitectura monolítica MVC*: Mezcla lógica de negocio con controladores HTTP, dificultando las pruebas y la portabilidad a Cloud Run o Functions.

---

## 3. Decision: Framework HTTP y Rutas (Express 4.x)
- **Decision**: Emplear Express 4.x como servidor de transporte HTTP liviano.
- **Rationale**: Estándar consolidado en el ecosistema Node.js, bajo consumo de memoria, compatibilidad inmediata con middlewares de trazas y sondas de Kubernetes (`/health`, `/ready`).
- **Alternatives considered**:
  - *Fastify*: Alta velocidad, pero Express es la directiva estándar del workshop y no añade sobrecarga innecesaria para el volumen objetivo.

---

## 4. Decision: Observabilidad y Logger Estructurado (Google Cloud Logging)
- **Decision**: Implementar `StructuredLogger` en `src/infrastructure/logger/structured-logger.ts` escribiendo JSON a `stdout` con:
  - Severidades estándar de GCP: `INFO`, `WARNING`, `ERROR`, `EMERGENCY`.
  - Campo de traza distribuida: `logging.googleapis.com/trace: projects/${GCP_PROJECT_ID}/traces/${TRACE_ID}`.
  - Extracción de cabecera HTTP `x-cloud-trace-context` (`TRACE_ID/SPAN_ID`) con fallback automático a UUID v4.
- **Rationale**: Google Cloud Logging ingesta nativamente `stdout` en contenedores GKE sin necesidad de agentes pesados en el Pod. La severidad `EMERGENCY` es visible inmediatamente en la consola de GCP y genera alertas automatizadas de SRE.
- **Alternatives considered**:
  - *Winston o Pino*: Bibliotecas potentes pero añaden dependencias y sobrecarga innecesaria (Ponytail dogma). La serialización directa con `JSON.stringify` sobre `process.stdout.write` es nativa, instantánea y 100% determinista.

---

## 5. Decision: Concurrencia y Persistencia Atómica en Memoria
- **Decision**: Implementar la interfaz `ProductRepository` con un adaptador en memoria (`InMemoryProductRepository`) respaldado por un catálogo inicial pre-cargado y operaciones síncronas/atómicas protegidas contra condiciones de carrera.
- **Rationale**: Cumple el criterio de agilidad del workshop (Lab 02 Sprint A en 10 min), aísla el dominio mediante inversión de dependencias y permite verificar las pruebas con Vitest en menos de 1 segundo sin requerir un clúster de base de datos local.
- **Alternatives considered**:
  - *PostgreSQL / TypeORM / Prisma*: Añadiría dependencias de infraestructura, migraciones y contenedores docker adicionales no requeridos para validar los contratos en esta fase.

---

## 6. Decision: Motor de Pruebas Unitarias (Vitest)
- **Decision**: Emplear **Vitest** como framework de pruebas unitarias.
- **Rationale**: Soporte nativo de TypeScript sin transpilación previa pesada (`ts-jest`), ejecución concurrente ultrarrápida, y compatibilidad total con la directiva `rtk npm test`.
- **Alternatives considered**:
  - *Jest*: Requiere configuración compleja de `ts-jest` o Babel y mayor tiempo de ejecución.

---

## 7. Decision: Endpoint de Caos y Simulación de Fallo
- **Decision**: En `POST /api/v1/chaos/crash`, registrar el log `EMERGENCY` forense con stack trace y programar `process.exit(1)` tras 100 ms usando `setTimeout`.
- **Rationale**: Los 100 ms garantizan que el buffer de salida de Node.js (`stdout`) se vacíe completamente y que la respuesta HTTP pueda responderse antes de la terminación del proceso, permitiendo al Kubelet de GKE detectar el crash inmediatamente.
- **Alternatives considered**:
  - `process.abort()` inmediato: Puede truncar el log forense en stdout antes de que Cloud Logging lo recolecte.
