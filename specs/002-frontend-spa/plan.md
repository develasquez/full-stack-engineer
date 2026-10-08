# Blueprint Arquitectónico: Frontend SPA (Vanilla-Core UI + Material Design 3)

## 1. Arquitectura de Directorios
```text
frontend/
├── components/
│   ├── header/
│   │   ├── header.html
│   │   ├── header.css
│   │   └── header.js
│   ├── catalog/
│   │   ├── catalog.html
│   │   ├── catalog.css
│   │   └── catalog.js
│   └── chaos-panel/
│       ├── chaos-panel.html
│       ├── chaos-panel.css
│       └── chaos-panel.js
├── public/
│   └── vendor/
│       ├── material/
│       └── material-web/
├── ui/
│   └── renderer.js
├── store.js
├── dom-elements.js
├── index.html
├── load.js
├── main.js
├── server.js
├── style.css
├── package.json
└── Dockerfile
```

## 2. Modelo de Estado en `store.js`
```javascript
const state = {
  appName: "Retail Cloud Platform 2026",
  theme: "oceanic-slate",
  selectedStoreId: "TIENDA-CENTRAL-01",
  backendStatus: "online", // "online" | "connecting" | "chaos_crashed" | "offline"
  products: [],
  isLoadingProducts: false,
  notification: null, // { type: 'success' | 'error' | 'info', message: string }
  chaosInfo: {
    isTriggering: false,
    crashTimestamp: null,
    recoveryAttempt: 0
  }
};
```

## 3. Estrategia de Renderizado Quirúrgico (Anti-Thrashing)
- Las tarjetas de producto se identifican con un atributo `data-sku="<SKU>"`.
- Al realizar una reserva o actualizar stock, `renderer.js` localiza el elemento `.product-card[data-sku="<SKU>"]` y actualiza únicamente:
  - El badge de disponibilidad (`.badge-stock`).
  - El texto numérico de stock (`.stock-count`).
  - La propiedad `disabled` y el atributo `max` del input de cantidad.
- Si la lista completa de productos cambia (por ejemplo al cambiar de tienda), se renderiza la lista solo si difiere en longitud o SKUs.
- Se preserva el foco activo (`document.activeElement`) en todo momento.

## 4. Diseño y Tokens (Material Design 3 - Oceanic Slate)
- Primario: `#2B638B`
- Contenedor Primario: `#CDE5F7`
- On Primary Container: `#001E30`
- Contenedor Secundario: `#D5E4EF`
- Superficie: `#F4F7FA`
- Superficie Contenedor: `#E9EEF4`
- Superficie Contenedor Baja: `#EBF1F7`
- Error Contenedor: `#FFDAD6` (On Error: `#410002`)
- Badges WCAG AAA (>= 7:1):
  - Éxito: Fondo `#D7E8CD`, Texto `#0A3E10`
  - Advertencia: Fondo `#FFECB3`, Texto `#502D00`
  - Error: Fondo `#FFDAD6`, Texto `#410002`
