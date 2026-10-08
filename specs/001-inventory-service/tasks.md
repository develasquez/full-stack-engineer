# Implementation Tasks: Retail Inventory Microservice

**Feature**: `001-inventory-service`  
**Plan**: [`plan.md`](./plan.md) | **Spec**: [`spec.md`](./spec.md)  
**Status**: Ready for Implementation

---

## Phase 1: Setup

- [ ] T001 [INFRASTRUCTURE] Initialize Node.js 20 project with TypeScript configuration in `backend/package.json` and `backend/tsconfig.json`
- [ ] T002 [INFRASTRUCTURE] Configure Vitest runner and scripts in `backend/package.json`

## Phase 2: Foundational

- [ ] T003 [DOMAIN] Create Product domain entity in `backend/src/domain/entities/product.entity.ts`
- [ ] T004 [DOMAIN] Define domain exceptions `InsufficientStockError` and `ProductNotFoundError` in `backend/src/domain/errors/`
- [ ] T005 [DOMAIN] Define `ProductRepository` interface in `backend/src/domain/repositories/product.repository.ts`
- [ ] T006 [INFRASTRUCTURE] Implement Google Cloud structured logger in `backend/src/infrastructure/logger/structured-logger.ts`
- [ ] T007 [INFRASTRUCTURE] Implement trace extraction middleware with UUID fallback in `backend/src/infrastructure/http/middlewares/trace.middleware.ts`
- [ ] T008 [DATABASE] Implement in-memory product repository with seed data in `backend/src/infrastructure/repositories/in-memory-product.repository.ts`

## Phase 3: User Story 1 - Consulta de Catálogo (P1 - MVP)

- [ ] T009 [P1] [US1] [API] Implement `GetProductsUseCase` in `backend/src/domain/use-cases/get-products.use-case.ts`
- [ ] T010 [P1] [US1] [API] Implement `GET /api/v1/products` controller and router in `backend/src/infrastructure/http/controllers/product.controller.ts`
- [ ] T011 [P1] [US1] [API] Configure Express app and health probes (`/health`, `/ready`) in `backend/src/infrastructure/http/server.ts`
- [ ] T012 [P1] [US1] Create application bootstrap entrypoint in `backend/src/index.ts`

## Phase 4: User Story 2 - Reserva Atómica de Stock (P2)

- [ ] T013 [P2] [US2] [API] Implement `ReserveStockUseCase` enforcing atomic deduction and exception handling in `backend/src/domain/use-cases/reserve-stock.use-case.ts`
- [ ] T014 [P2] [US2] [API] Wire `POST /api/v1/products/:sku/reserve` endpoint in `backend/src/infrastructure/http/controllers/product.controller.ts`
- [ ] T015 [P2] [US2] Add unit tests for stock reservation, insufficient stock, and SKU not found in `backend/tests/reserve-stock.test.ts`

## Phase 5: User Story 3 - Inyección de Caos y Resiliencia (P3)

- [ ] T016 [P3] [US3] [API] Implement `ChaosUseCase` logging EMERGENCY and exiting process in `backend/src/domain/use-cases/chaos.use-case.ts`
- [ ] T017 [P3] [US3] [API] Wire `POST /api/v1/chaos/crash` endpoint in `backend/src/infrastructure/http/controllers/chaos.controller.ts`
- [ ] T018 [P3] [US3] Add unit tests for chaos crash simulation and emergency log in `backend/tests/chaos.test.ts`

## Phase 6: Polish & Verification

- [ ] T019 Execute full Vitest test suite with `rtk npm test` in `backend/` and verify 100% pass rate
