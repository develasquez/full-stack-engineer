# Especificación de Requerimientos: Frontend SPA Retail Platform (Vanilla-Core UI + Material Design 3)

## 1. Identificación y Metadatos
- **ID de Característica:** `002-frontend-spa`
- **Dominio:** Frontend & Experiencia de Usuario (UI/UX)
- **Tecnología:** Vanilla-Core UI (SSoT, Pub/Sub, Surgical Rendering) + Material Design 3 tokens
- **Servidor:** Express estático (Puerto 80, health probe `/health`)
- **Estado:** `APROBADO_PARA_IMPLEMENTACION`

---

## 2. Descripción General y Objetivos
Construir una Single Page Application (SPA) para la plataforma de retail enterprise bajo la arquitectura Vanilla-Core UI y Material Design 3. La aplicación debe permitir la visualización en tiempo real del catálogo de inventario por tienda, la reserva atómica de existencias, la retroalimentación visual reactiva sin parpadeo (anti-thrashing), y un panel de ingeniería de caos (Chaos Testing) capaz de inducir la caída forzada del pod backend y monitorear la auto-recuperación de Kubernetes.

---

## 3. Principios Arquitectónicos Obligatorios (Vanilla-Core UI + M3)
1. **Single Source of Truth (SSoT):** Todo el estado dinámico (catálogo de productos, filtro por tienda, estado de carga, reservas, alertas de notificación y telemetría de caos) reside en `store.js`.
2. **Inmutabilidad Externa:** Ningún componente muta `state` directamente; toda transición se publica mediante `setState({ ... })`.
3. **Flujo Unidireccional Pub/Sub:** Los componentes emiten eventos a `store.js`, y el store notifica a `ui/renderer.js`.
4. **Renderizado Quirúrgico (Anti-Thrashing):** NUNCA destruir el foco ni hacer `innerHTML` sobre inputs activos o contenedores durante la interacción del usuario. Solo actualizar nodos específicos (`textContent`, `className`, atributos).
5. **Tokens Material Design 3:** Implementación estricta de la paleta **Oceanic Slate** (`#2B638B`) con soporte de badges WCAG AAA (contraste >= 7:1) y componentes M3 (`Surface Container`, `Primary Container`, `Error Container`).

---

## 4. Requerimientos Funcionales

### RF-01: Encabezado y Navegación (Header)
- Mostrar el título de la plataforma: **Retail Cloud Platform 2026**.
- Selector de tienda activa (`TIENDA-CENTRAL-01`, `TIENDA-NORTE-02`, etc.).
- Badge de estado de salud del backend (Online / Desconectado / Caos Activo).

### RF-02: Catálogo de Productos (Catalog)
- Consultar periódicamente o al inicio el endpoint `GET /api/v1/products`.
- Renderizar tarjetas de producto M3 con:
  - SKU y Nombre de producto.
  - Categoría y Precio formateado en moneda local.
  - Disponibilidad de inventario con badge de contraste accesible (En Existencia: Verde WCAG AAA; Stock Crítico <= 5: Amarillo WCAG AAA; Agotado: Rojo WCAG AAA).
  - Campo numérico de cantidad a reservar (con validación de mínimo 1 y máximo stock disponible).
  - Botón "Reservar" que invoca `POST /api/v1/products/:sku/reserve`.
- Actualización atómica del stock sin recargar la página ni perder la posición de scroll.

### RF-03: Panel de Caos (Chaos Testing Panel)
- Botón prominente de color de contenedor de error: **"Simular Caída de Pod (Chaos Crash)"**.
- Al activarse, envía `POST /api/v1/chaos/crash` al backend.
- Notifica al operador el estado del caos:
  - Muestra alerta de emergencia.
  - Inicia un polling periódico al endpoint `/health` o `/api/v1/products` para detectar cuando GKE Kubelet levanta el nuevo pod sustituto y restaurar el estado "Online".

### RF-04: Servidor Web Estático & Kubernetes Probes
- Servidor `server.js` en Express que sirve archivos estáticos en el puerto `80` (configurable por variable de entorno `PORT`).
- Endpoint `GET /health` que responde HTTP 200 con `{ status: "healthy", service: "retail-frontend" }` para las sondas `livenessProbe` y `readinessProbe` de GKE.

---

## 5. Criterios de Aceptación
1. **[CA-01]** La aplicación carga sin errores en consola y obtiene la lista de productos inicial desde el backend.
2. **[CA-02]** La reserva de productos actualiza el inventario inmediatamente en la tarjeta y bloquea el botón si el stock llega a 0.
3. **[CA-03]** El botón de caos dispara la llamada de terminación y la UI refleja la desconexión temporal y posterior reconexión una vez que el servicio se recupera.
4. **[CA-04]** El contenedor Docker del frontend es multi-stage, corre como usuario no root y expone el puerto 80 con health check funcional.
