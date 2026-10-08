# Guía Maestra de Prompts y Gobernanza de Agentes con Google Antigravity

**Entregable Oficial del Workshop:** Tiendas D1  
**Autor:** Felipe Andrés Velásquez Castro (AI Architecture Lead, Axmos)  
**Versión:** 2026.1 - Producción  

---

## 1. Filosofía de Ingeniería: De la "Charla con la IA" al "Contrato con el Agente"

En Tiendas D1, la inteligencia artificial no se utiliza como un autocompletador de texto ("vibe coding"). Se utiliza como un **par de arquitectura y desarrollo autónomo supervisado (Pair Programmer & Tech Lead)**.

Para lograr determinismo, reproducibilidad y calidad empresarial, la interacción con Google Antigravity se estructura en tres capas:
1. **Reglas Globales de Repositorio (`AGENTS.md`):** Leyes inmutables de código, arquitectura y seguridad que el agente no puede quebrantar.
2. **Habilidades Especializadas (`SKILL.md` / `sdd-skill`):** Metodología de pasos estructurados para especificación, diseño e implementación.
3. **Prompts Canónicos Parametrizados:** Comandos con contexto cerrado, restricciones explícitas y criterios de éxito no negociables.

---

## 2. Plantilla Maestra: `AGENTS.md` para Repositorios de Tiendas D1

Copiar este archivo en la raíz de cualquier repositorio nuevo o existente de Tiendas D1:

```markdown
# AGENTS.md - Reglas de Arquitectura e Ingeniería para Tiendas D1

## 1. Rol y Comportamiento del Agente
- Actúa como un Tech Lead Senior y Arquitecto de Software para Tiendas D1.
- No realices cambios especulativos. Aplica estrictamente los principios de minimalismo (YAGNI): el mejor código es el que no se escribe.
- Si un requerimiento es ambiguo o incompleto, formula preguntas clarificadoras antes de generar código.
- Nunca rompas contratos de API existentes ni elimines pruebas previas sin autorización expresa.

## 2. Estándares de Código y Stack Técnico
- Lenguaje: TypeScript 5.x estricto (`"strict": true`, `"noImplicitAny": true`).
- Runtime: Node.js 20 LTS en contenedor Alpine.
- Arquitectura: Clean Architecture (Domain -> UseCases -> Infrastructure -> Interfaces).
- Validación de Entradas: Zod o esquemas OpenAPI 3.0 en la frontera del controlador. Prohibido confiar en payloads sin validar.
- Manejo de Errores: Errores tipados de dominio (e.g. `NotFoundError`, `ConflictError`, `ValidationError`). Nunca silenciar excepciones con `catch (e) {}` vacíos.

## 3. Seguridad y Cloud (Google Cloud Platform)
- Prohibición absoluta de credenciales, tokens o URLs sensibles en el código. Utilizar Google Secret Manager o variables inyectadas por el entorno.
- En Kubernetes (GKE), toda autenticación con servicios GCP debe realizarse vía Workload Identity (`iam.gke.io/gcp-service-account`). Prohibido generar o montar llaves JSON.
- Todo endpoint HTTP debe contar con sondas `/health` y `/ready`, rate limiting y autenticación JWT con Google Identity Platform.

## 4. Observabilidad y Logs
- Prohibido usar `console.log()` en texto plano para depuración en producción.
- Usar el estándar JSON estructurado de Google Cloud:
  - Severidad canónica: `INFO`, `WARNING`, `ERROR`, `CRITICAL`.
  - Inclusión obligatoria de `logging.googleapis.com/trace` para correlación distribuida en Cloud Trace.
```

---

## 3. Catálogo de Prompts Canónicos para el Ciclo de Vida D1

### Fase 1: Especificación Formal de Requerimiento (SDD)
> **Objetivo:** Convertir una historia de usuario de Jira en una especificación ejecutable antes de tirar código.

```text
/sdd-specify Crear la especificación formal del microservicio de "Descuentos y Promociones Dinámicas" para tiendas D1.
Contexto:
- Cada tienda física puede tener promociones regionales según su StoreID.
- Se debe validar el carrito completo de compras (array de SKUs y cantidades).
- Criterios de rendimiento: Respuesta p95 en menos de 35ms para no retrasar la cola de caja.
- Restricciones: Sin dependencias a servicios externos síncronos; la matriz de descuentos reside en memoria con refresco vía Pub/Sub.

Genera el archivo spec.md con:
1. Modelo de datos canónico de entrada y salida.
2. Criterios de Aceptación en formato Gherkin (Given-When-Then).
3. Matriz de códigos de error HTTP y respuestas JSON correspondientes.
```

---

### Fase 2: Clarificación y Cierre de Ambigüedades
> **Objetivo:** Obligar al agente a desafiar los casos de borde (Edge Cases).

```text
/sdd-clarify Revisa la especificación actual de Descuentos Dinámicos y hazme 3 preguntas críticas sobre:
1. Manejo de concurrencia y consistencia eventual cuando se publica un cambio de precios en pleno horario comercial.
2. Comportamiento del POS si la caché de promociones no responde o expira.
3. Estrategia de redondeo de centavos de pesos colombianos (COP).
No generes código hasta que hayamos consensuado las respuestas.
```

---

### Fase 3: Generación de Pruebas TDD (Test-Driven Development)
> **Objetivo:** Crear la suite de pruebas unitarias que define el éxito antes de implementar la solución.

```text
/sdd-tasks A partir de spec.md, genera la lista de tareas atómicas y escribe primero la suite completa de pruebas unitarias en Vitest/Jest para el caso de uso "CalculateCartDiscountsUseCase".
Cobertura requerida:
- Caso 1: Carrito sin productos en promoción (devuelve total sin descuento).
- Caso 2: Promoción 2x1 en productos lácteos (aplica descuento sobre el producto de menor valor).
- Caso 3: Carrito con SKU inexistente en el catálogo (lanza ProductNotFoundDomainException).
- Caso 4: Descuento que excede el tope máximo por transacción.

Asegúrate de que los tests fallen de forma controlada (estado RED).
```

---

### Fase 4: Auditoría de Simplicidad y Rendimiento (Ponytail Review)
> **Objetivo:** Eliminar sobreingeniería, código muerto y librerías redundantes.

```text
Realiza una auditoría exhaustiva de este microservicio bajo los principios de minimalismo eficiente:
1. Identifica librerías en package.json que puedan ser reemplazadas por la API nativa de Node.js 20 (e.g. usar crypto nativo en vez de uuid/crypto-js, usar fetch nativo en vez de axios).
2. Detecta abstracciones innecesarias (fábricas de fábricas, wrappers que no agregan valor sobre la stdlib).
3. Señala consultas a la base de datos N+1 o que no aprovechen índices compuestos en PostgreSQL.
Presenta los hallazgos en una tabla con: Archivo, Líneas, Qué eliminar, Qué usar en su lugar y Tokens/Memoria ahorrados.
```

---

### Fase 5: Generación de Manifiesto GKE y Dockerfile Seguro
> **Objetivo:** Crear la infraestructura como código lista para producción en GKE.

```text
Genera el paquete completo de despliegue para el microservicio "d1-discounts-service":
1. Dockerfile Multi-Stage basado en node:20-alpine ejecutando bajo usuario sin privilegios 'USER node'.
2. Manifiesto deployment.yaml con:
   - RollingUpdate seguro (maxSurge: 1, maxUnavailable: 0).
   - Requests: 100m CPU / 128Mi RAM; Limits: 500m CPU / 512Mi RAM.
   - Liveness Probe en /health y Readiness Probe en /ready.
   - Vinculación a ServiceAccount de Kubernetes ksa-d1-discounts con anotación de Workload Identity para la GSA de producción.
3. Manifiesto hpa.yaml con escalado de 2 a 12 réplicas al superar el 70% de CPU con ventana de estabilización para scaleDown de 300 segundos.
```

---

## 4. Configuración Recomendada de Subagentes Antigravity en D1

Para proyectos de gran escala, se recomienda configurar subagentes especializados dentro de `.gemini/` en el proyecto:

| Nombre Subagente | Rol Principal | Herramientas Asignadas |
| :--- | :--- | :--- |
| `d1-spec-architect` | Conducción del ciclo SDD (`spec.md`, `plan.md`) | Read-only, `sdd-skill` |
| `d1-db-specialist` | Migraciones Cloud SQL, índices y queries | MCP PostgreSQL (solo lectura en staging) |
| `d1-qa-automator` | Generación de pruebas E2E y unitarias con alta cobertura | Ejecución de tests locales (`npm test`) |
| `d1-sec-auditor` | Auditoría de dependencias (CVEs) y políticas IAM/GKE | Read-only de manifiestos y `package-lock.json` |

---

## 5. Regla de Oro para el Ingeniero de Tiendas D1

> *"Si no puedes escribir una especificación clara en Markdown de lo que esperas que haga tu microservicio, ningún modelo de lenguaje del mundo construirá el sistema que tu negocio necesita."*  
> — **Felipe Andrés Velásquez Castro**
