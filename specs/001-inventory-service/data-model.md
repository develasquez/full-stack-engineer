# Data Model & Domain Entities: Microservicio de Inventario Retail

**Feature**: `001-inventory-service`  
**Date**: 2026-10-08  
**Phase**: Phase 1 SDD Design

---

## 1. Entidad de Dominio: `Product`

Representa un artículo comercial en el catálogo de inventario con stock físico controlado.

### Atributos
| Campo | Tipo | Restricción / Invariante | Descripción |
|---|---|---|---|
| `sku` | `string` | Obligatorio, no vacío, único por tienda | Código de referencia de almacén (ej: `PROD-001`) |
| `name` | `string` | Obligatorio, 1 a 120 caracteres | Nombre comercial del producto |
| `category` | `string` | Obligatorio | Categoría retail (ej: `Electrónica`, `Calzado`, `Hogar`) |
| `price` | `number` | Flotante positivo `> 0` | Precio unitario de venta |
| `stock` | `number` | Entero `>= 0` | Existencias disponibles para reserva inmediata |
| `storeId` | `string` | Obligatorio | Identificador de tienda o almacén (ej: `STORE-001`) |

### Invariantes de Dominio
1. El valor de `stock` jamás puede ser inferior a `0` (garantía anti-sobreventa).
2. La deducción de stock es estrictamente atómica: `nuevo_stock = stock_actual - cantidad_reservada`.
3. El `price` no puede ser negativo ni cero.

---

## 2. Excepciones de Dominio

### `InsufficientStockError`
- **Herencia**: `Error`
- **Atributos**:
  - `name`: `"InsufficientStockError"`
  - `sku`: `string`
  - `requested`: `number`
  - `available`: `number`
  - `message`: `"Stock insuficiente para el producto [sku]. Solicitado: [requested], Disponible: [available]"`
- **Mapeo HTTP**: `400 Bad Request`

### `ProductNotFoundError`
- **Herencia**: `Error`
- **Atributos**:
  - `name`: `"ProductNotFoundError"`
  - `sku`: `string`
  - `message`: `"Producto con SKU [sku] no encontrado"`
- **Mapeo HTTP**: `404 Not Found`

---

## 3. Contratos de Transferencia de Datos (DTOs)

### `ReserveStockDto`
```typescript
interface ReserveStockDto {
  sku: string;
  quantity: number; // Entero positivo >= 1
}
```

### `ReservationResultDto`
```typescript
interface ReservationResultDto {
  sku: string;
  reservedQuantity: number;
  remainingStock: number;
  message: string;
}
```

### `ChaosResultDto`
```typescript
interface ChaosResultDto {
  status: 'crashing';
  message: string;
  traceId: string;
}
```

---

## 4. Contrato de Repositorio (Inversión de Dependencias)

```typescript
export interface ProductRepository {
  findAll(storeId?: string): Promise<Product[]>;
  findBySku(sku: string): Promise<Product | null>;
  reserveStock(sku: string, quantity: number): Promise<ReservationResultDto>;
}
```

### Semántica de `reserveStock`:
1. Busca el producto por `sku`. Si no existe → lanza `ProductNotFoundError`.
2. Si `producto.stock < quantity` → lanza `InsufficientStockError`.
3. Descuenta `producto.stock -= quantity` de forma atómica.
4. Retorna el resultado con `remainingStock`.
