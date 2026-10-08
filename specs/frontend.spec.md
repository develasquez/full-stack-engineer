# Especificación Canónica: Frontend SPA Retail Platform (Vanilla-Core UI + Material Design 3)

## 1. Identificación y Metadatos
- **ID de Característica:** `002-frontend-spa`
- **Dominio:** Frontend & Experiencia de Usuario (UI/UX)
- **Tecnología:** Vanilla-Core UI (SSoT, Pub/Sub, Surgical Rendering) + Material Design 3 tokens
- **Servidor:** Express estático (Puerto 80, health probe `/health`)
- **Estado:** `APROBADO_PARA_IMPLEMENTACION`

---

## 2. Principios Arquitectónicos Obligatorios (Vanilla-Core UI + M3)
1. **Single Source of Truth (SSoT):** Todo el estado dinámico (catálogo de productos, filtro por tienda, estado de carga, reservas, alertas de notificación y telemetría de caos) reside en `store.js`.
2. **Inmutabilidad Externa:** Ningún componente muta `state` directamente; toda transición se publica mediante `setState({ ... })`.
3. **Flujo Unidireccional Pub/Sub:** Los componentes emiten eventos a `store.js`, y el store notifica a `ui/renderer.js`.
4. **Renderizado Quirúrgico (Anti-Thrashing):** NUNCA destruir el foco ni hacer `innerHTML` sobre inputs activos o contenedores durante la interacción del usuario. Solo actualizar nodos específicos (`textContent`, `className`, atributos).
5. **Tokens Material Design 3:** Implementación estricta de la paleta **Oceanic Slate** (`#2B638B`) con soporte de badges WCAG AAA (contraste >= 7:1) y componentes M3 (`Surface Container`, `Primary Container`, `Error Container`).

---

## 3. Requerimientos Funcionales
- **Header Component (`components/header/`):** Título de la plataforma, selector de tienda activa, badge de salud backend.
- **Catalog Component (`components/catalog/`):** Listado reactivo de productos, stock en tiempo real, reserva de inventario con validaciones.
- **Chaos Panel (`components/chaos-panel/`):** Disparo de terminación de Pods con auto-reintento y visualización de recuperación de Kubernetes.
- **Express Server (`server.js`):** Puerto 80, archivos estáticos, probe `/health`.
- **Dockerfile:** Multi-stage, non-root, puerto 80 expuesto.
