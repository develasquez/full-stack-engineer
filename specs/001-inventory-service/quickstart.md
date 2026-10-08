# Quickstart Validation Guide: Retail Inventory Service

**Feature**: `001-inventory-service`  
**Date**: 2026-10-08  
**Phase**: Phase 1 SDD Validation Guide

Esta guía describe los escenarios ejecutables para validar el microservicio de inventario de forma local y automatizada.

---

## 1. Prerrequisitos

- Node.js 20+ instalado en el sistema.
- Prefijo `rtk` disponible para optimización de tokens.
- Contratos de referencia: [`contracts/products-api.md`](./contracts/products-api.md).
- Modelo de dominio: [`data-model.md`](./data-model.md).

---

## 2. Instalación y Ejecución de Pruebas Unitarias (TDD)

```bash
cd backend
rtk npm install
rtk npm test
```

### Salida Esperada:
```text
✓ tests/reserve-stock.test.ts (3 tests)
  ✓ Debe listar productos y filtrar por storeId
  ✓ Debe reservar stock atómicamente cuando hay existencias suficientes
  ✓ Debe lanzar InsufficientStockError cuando la cantidad supera el stock
  ✓ Debe lanzar ProductNotFoundError cuando el SKU no existe
{"severity":"EMERGENCY","message":"[CHAOS SIMULATION] Pod terminando de forma forzada: ..."}
✓ tests/chaos.test.ts (1 test)
  ✓ Debe emitir log EMERGENCY y finalizar proceso con exit code 1

Test Files  2 passed (2)
     Tests  5 passed (5)
```

---

## 3. Escenarios de Validación End-to-End con `curl`

### Iniciar el microservicio localmente:
```bash
cd backend
rtk npm run dev
# Servidor escuchando en http://localhost:8080
```

### Escenario A: Consulta de Inventario
```bash
curl -X GET http://localhost:8080/api/v1/products
```
*Resultado esperado*: HTTP 200 con array JSON de productos (`PROD-001`, `PROD-002`).

### Escenario B: Reserva Exitosa
```bash
curl -X POST http://localhost:8080/api/v1/products/PROD-001/reserve \
  -H "Content-Type: application/json" \
  -d '{"quantity": 2}'
```
*Resultado esperado*: HTTP 200 con `remainingStock: 13`.

### Escenario C: Reserva con Stock Insuficiente
```bash
curl -X POST http://localhost:8080/api/v1/products/PROD-002/reserve \
  -H "Content-Type: application/json" \
  -d '{"quantity": 999}'
```
*Resultado esperado*: HTTP 400 con `error: "InsufficientStockError"`.

### Escenario D: Simulación de Caos (Crash)
```bash
curl -X POST http://localhost:8080/api/v1/chaos/crash
```
*Resultado esperado*: HTTP 200 `{ "status": "crashing" }`, log JSON con `severity: "EMERGENCY"` en la terminal, y terminación del proceso (`exit code 1`).
