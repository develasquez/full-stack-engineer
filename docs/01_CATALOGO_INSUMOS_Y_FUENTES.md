# Catálogo Exhaustivo de Materiales, Repositorios e Insumos Técnicos
## Autoría y Creación: Felipe Andrés Velásquez Castro (AI Architecture Lead)

Este documento cataloga y analiza cada una de las 13 fuentes técnicas provistas como insumos fundacionales para el **Workshop Técnico: De la Especificación a Producción en GCP**. Todos estos activos son de autoría de Felipe Velásquez, diseñados para ilustrar los paradigmas de ingeniería de software vigentes en el 2026.

---

## 📊 Matriz de Alineación de Insumos con las Sesiones

| # | Recurso / Insumo | Tipo | URL de Origen | Sesión Principal | Sesión Secundaria |
|---|---|---|---|---|---|
| **1** | **Presentación Antigravity & Gravi** | Google Slides | [Ver Presentación](https://docs.google.com/presentation/d/17ZVpe-sGWTjUsyu3_DcUV15sXWfiJfAxdp6w8KNHay0/edit) | **S1** (IA & SDD) | - |
| **2** | **sdd-skill** | GitHub Repo | [`develasquez/sdd-skill`](https://github.com/develasquez/sdd-skill/) | **S1** (IA & SDD) | **S2** (Contratos) |
| **3** | **vanilla-core-ui** | npm Package | [`vanilla-core-ui` (npm)](https://www.npmjs.com/package/vanilla-core-ui) | **S1** (IA & SDD) | **S3** (Front Deploy) |
| **4** | **gcp-front-end-example** | GitHub Repo | [`develasquez/gcp-front-end-example`](https://github.com/develasquez/gcp-front-end-example) | **S1** / **S3** | **S2** (Consumo API) |
| **5** | **gcp-back-end-example** | GitHub Repo | [`develasquez/gcp-back-end-example`](https://github.com/develasquez/gcp-back-end-example) | **S2** (APIs & Sec) | **S3** (Cloud Build) |
| **6** | **google-cloud-structured-logs** | GitHub Repo | [`develasquez/google-cloud-structured-logs`](https://github.com/develasquez/google-cloud-structured-logs) | **S2** (APIs & Sec) | **S4** (Observabilidad) |
| **7** | **gcp-setup-example** | GitHub Repo | [`develasquez/gcp-setup-example`](https://github.com/develasquez/gcp-setup-example) | **S2** (Secretos/VPC) | **S3** (Artifact Reg) |
| **8** | **nivelacion-kubernetes** | GitHub Repo | [`develasquez/nivelacion-kubernetes`](https://github.com/develasquez/nivelacion-kubernetes) | **S4** (K8s Prod) | **S3** (Docker) |
| **9** | **Presentación Nivelación K8s** | Google Slides | [Ver Presentación K8s](https://docs.google.com/presentation/d/1z1AW6JPWl381OLqKR2f9Sr8_lVQiufjjzWbEsK5pZMM/edit) | **S4** (K8s Prod) | - |
| **10** | **Artículo Pulse K8s** | LinkedIn Pulse | [Leer en LinkedIn Pulse](https://www.linkedin.com/pulse/introducci%C3%B3n-kubernetes-felipe-andres-velasquez-castro/) | **S4** (K8s Prod) | - |
| **11** | **workload-identity-gke** | GitHub Repo | [`develasquez/workload-identity-gke`](https://github.com/develasquez/workload-identity-gke) | **S4** (K8s Prod) | **S2** (Seguridad IAM) |
| **12** | **gke-private-cluster** | GitHub Repo | [`develasquez/gke-private-cluster`](https://github.com/develasquez/gke-private-cluster) | **S4** (K8s Prod) | **S3** (Redes VPC) |
| **13** | **multi-cluster-ingress** | GitHub Repo | [`develasquez/multi-cluster-ingress`](https://github.com/develasquez/multi-cluster-ingress) | **S4** (K8s Prod) | **S2** (Ingress Global) |

---

## 🔍 Análisis Detallado de Cada Insumo

### 1. Presentación: "¡Bienvenido, Gravi! El Nuevo Integrante AXMOS // ANTIGRAVITY"
* **Fuente:** Google Slides — [`17ZVpe-sGWTjUsyu3_DcUV15sXWfiJfAxdp6w8KNHay0`](https://docs.google.com/presentation/d/17ZVpe-sGWTjUsyu3_DcUV15sXWfiJfAxdp6w8KNHay0/edit?slide=id.p5#slide=id.p5)
* **Temática Central:** Cómo evolucionar y liderar un copiloto y célula de agentes de IA en el desarrollo empresarial.
* **Metáfora Pedagógica ("La Historia de Gravi"):** Gravi ingresa como un pasante brillante pero sin contexto (`Digital Engineering Intern`). A través de 4 fases madura hasta convertirse en Líder Técnico (`Tech Lead Orchestrator`).
* **Conceptos Clave para el Workshop:**
  1. **Workspaces Desktop vs. CLI:** La oficina de arquitectura (Desktop, visual diffs, hilos complejos, diseño conceptual) frente a la vía rápida (CLI, terminal nativa, flujo continuo en tmux/vim).
  2. **Fase 1: Reglamento Interno (`AGENTS.md`):** Arquitectura oficial, Clean Architecture, separación de capas, límites innegociables (cero secretos hardcodeados, no ignorar linters) y estándar de calidad con testing obligatorio.
  3. **Fase 2: Capacitaciones Modulares (`SKILL.md`):** Procedimientos operativos estándar (SOPs) cargados bajo demanda para evitar la saturación de la ventana de contexto.
  4. **Fase 3: Acceso Seguro con MCP (Model Context Protocol):** Acceso solo lectura a PostgreSQL, Jira/Confluence y repositorios de GitHub sin requerir copiado y pegado manual.
  5. **Fase 4: Gravi como Tech Lead (Subagentes en Paralelo):** Descomposición de épicas y coordinación simultánea de subagentes (backend, frontend, testing y documentación).
  6. **Atajos Clave:** Comandos `/plan`, `/goal` y punteros directos `@archivo`. Autenticación con Google Cloud Project mediante Gemini Enterprise.
* **Alineación con la Agenda:** Columna vertebral teórica y pedagógica de la **Sesión 1 (Desarrollo con IA & SDD)**.

---

### 2. Repositorio: `develasquez/sdd-skill`
* **Fuente:** GitHub — [`https://github.com/develasquez/sdd-skill/`](https://github.com/develasquez/sdd-skill/)
* **Tecnología:** Skill universal para agentes de IA (Antigravity IDE/CLI, Claude Code, Cursor, Codex).
* **Filosofía Fundamental:** **Power Inversion (Inversión de Poder)**. El código deja de ser la fuente primaria de verdad y pasa a ser una expresión generada y descartable de la especificación técnica ejecutable.
* **Comandos y Ciclo de Vida Implementados:**
  - `/sdd-baseline`: Ingeniería inversa de bases de código legadas hacia artefactos de especificación (`specs/000-baseline/`).
  - `/sdd-constitution`: Reglas y principios de gobernanza inviolables del proyecto.
  - `/sdd-specify`: Creación de especificaciones funcionales a partir de requerimientos en lenguaje natural con historias de usuario (`Given/When/Then`), requerimientos funcionales (`FR-001`), criterios de éxito (`SC-001`) y marcadores de ambigüedad (`[NEEDS CLARIFICATION]`).
  - `/sdd-clarify`: Protocolo interactivo de desambiguación guiado por una taxonomía de 9 categorías (una pregunta a la vez).
  - `/sdd-plan`: Diseño de arquitectura técnica, mapa de componentes, decisiones tecnológicas y contratos de API.
  - `/sdd-tasks`: Descomposición en tareas atómicas priorizadas según historias de usuario (MVP P1 first).
  - `/sdd-checklist`: Listas de control de calidad para inglés y requisitos funcionales ("Unit Tests for English").
  - `/sdd-implement` & `/sdd-converge`: Ejecución secuencial y reconciliación continua entre especificación y código.
* **Alineación con la Agenda:** Es el motor práctico de la **Sesión 1**, enseñando a D1 a no generar código "a ciegas" sino a gobernar a la IA mediante contratos formales.

---

### 3. Paquete npm: `vanilla-core-ui`
* **Fuente:** npm — [`https://www.npmjs.com/package/vanilla-core-ui`](https://www.npmjs.com/package/vanilla-core-ui)
* **Versión Actual:** 1.3.9
* **Propósito:** Skill y CLI para arquitecturas web ligeras con JavaScript Vanilla, sin dependencias de frameworks pesados, con gestión de estado centralizada (SSoT), Pub/Sub y renderizado quirúrgico.
* **Nota de Evolución 2026 (Indicación del Autor):** Actualmente en proceso de desacople en **dos skills independientes**:
  1. `vanilla-core`: Núcleo de arquitectura estricta (SSoT `store.js`, pub/sub, `dom-elements.js`, `load.js`, anti-thrashing focus guards).
  2. `material-design`: Tokens visuales, paletas HCT de Material Design 3 / Material You, contraste WCAG AAA y Web Components (@material/web).
* **Los 7 Principios No Negociables:**
  1. Single Source of Truth (SSoT) en `store.js`.
  2. Estado de solo lectura para componentes (mutación exclusiva vía `setState()`).
  3. Flujo unidireccional de datos (Pub/Sub).
  4. Separación estricta de responsabilidades (`components/`, `ui/`, `services/`, `utils/`).
  5. CSS Utility-First (Tailwind) y animaciones de `width/flex-basis` con `overflow: hidden` para estabilidad visual.
  6. Renderizado quirúrgico con **Focus Guard** para evitar parpadeos y pérdida de foco mientras el usuario escribe.
  7. Consistencia geométrica compartida entre renderizado y detección de clicks en Canvas/SVG (`utils/geometry.js`).
* **Alineación con la Agenda:** Complemento de Frontend para la **Sesión 1** y despliegue rápido en la **Sesión 3**.

---

### 4. Repositorio: `develasquez/gcp-front-end-example`
* **Fuente:** GitHub — [`https://github.com/develasquez/gcp-front-end-example`](https://github.com/develasquez/gcp-front-end-example)
* **Tecnología:** React + Material Tailwind Dashboard + Vite + Node.js.
* **Arquitectura:** Dashboard moderno de front-end listo para desplegar en Google Cloud, con integración a Identity Platform y consumo del backend de APIs.
* **Archivos Clave:** `cloudbuild.yaml`, `genezio.yaml`, `dev.env_deploy`, configuración de Tailwind y PostCSS.
* **Alineación con la Agenda:** Sirve como caso de estudio de Frontend en la **Sesión 1** (diseño y consumo de contratos) y en la **Sesión 3** (automatización de CI/CD para estáticos o contenedores).

---

### 5. Repositorio: `develasquez/gcp-back-end-example`
* **Fuente:** GitHub — [`https://github.com/develasquez/gcp-back-end-example`](https://github.com/develasquez/gcp-back-end-example)
* **Tecnología:** Node.js 20, TypeScript, Express, PostgreSQL, BigQuery, Google Cloud Identity Platform, Swagger UI OpenAPI 3.0.
* **Patrón de Diseño:** Clean Architecture / Capas desacopladas:
  - `controllers/`: `Login.ts`, `Register.ts`.
  - `services/`: `IdentityPlatformService.ts` (manejo de autenticación y tokens con Google Cloud).
  - `repositories/`: `PostgresRepository.ts`, `BigQueryRepository.ts`.
  - `tools/`: `Cors.ts`, `Validation.ts`, integraciones con logs estructurados.
* **Componentes de Producción:**
  - `Dockerfile` multi-stage: `BUILD_IMAGE` (compilación TypeScript) -> runtime final ultra ligero sobre `node:20-alpine` ejecutando solo dependencias de producción.
  - `cloudbuild.yaml`: Pipeline que construye, genera tag con timestamp (`$VERSION`), publica en Artifact Registry y dispara `deploy.sh`.
  - Exposición de especificación OpenAPI interactiva en `/api-docs`.
* **Alineación con la Agenda:** Es el pilar práctico de la **Sesión 2 (Gestión y Seguridad de APIs)** y la **Sesión 3 (DevOps en GCP)**, sirviendo como el backend desacoplado que se publica a través de **Google Cloud Apigee** (con políticas `SpikeArrest`, `VerifyJWT` y `Quota`) contrastándolo con gateways simples como Kong.

---

### 6. Repositorio: `develasquez/google-cloud-structured-logs`
* **Fuente:** GitHub — [`https://github.com/develasquez/google-cloud-structured-logs`](https://github.com/develasquez/google-cloud-structured-logs)
* **Tecnología:** Módulo Node.js basado en Bunyan / Winston especializado en **Google Cloud Logging**.
* **Capacidades Técnicas:**
  - Estructuración JSON nativa reconocida automáticamente por Google Cloud Operations Suite (Stackdriver).
  - Mapeo de severidades oficiales de GCP: `DEFAULT`, `DEBUG`, `INFO`, `NOTICE`, `WARNING`, `ERROR`, `CRITICAL`, `ALERT`, `EMERGENCY`.
  - Inyección de contexto operacional (`task`, `parameters`, `result`, `error`).
  - Medición automática de latencia de peticiones HTTP (`httpRequest.latency` en segundos).
  - Trazabilidad distribuida con correlación de `traceId` y `spanId` (`_genRanHex(16)`) para Cloud Trace entre microservicios.
* **Alineación con la Agenda:** Pilar de observabilidad para la **Sesión 2** y diagnóstico de Pods en la **Sesión 4**.

---

### 7. Repositorio: `develasquez/gcp-setup-example`
* **Fuente:** GitHub — [`https://github.com/develasquez/gcp-setup-example`](https://github.com/develasquez/gcp-setup-example)
* **Tecnología:** Bash scripts y automatización con `gcloud CLI`.
* **Contenido Modular:**
  - `00-main_setup.sh`: Orquestador principal de variables (Proyecto, Región `southamerica-west1`, VPCs, Subredes).
  - `01-enable_apis.sh`: Activación programática de APIs (`compute.googleapis.com`, `sqladmin.googleapis.com`, `artifactregistry.googleapis.com`, `secretmanager.googleapis.com`, etc.).
  - `02-vpc.sh`: Creación de red VPC en modo custom, subredes regionales y reglas de firewall seguras mediante Identity-Aware Proxy (IAP).
  - `04-artifact_registry.sh`: Aprovisionamiento de repositorio Docker privado regional.
  - `05-cloud_sql.sh`: Creación de instancia PostgreSQL con conectividad privada (Private IP) sin IP pública expuesta.
  - `06-secrets.sh`: Gestión segura de secretos en Secret Manager (`DB_NAME`, `DB_PASS`, `DB_HOST`, `DB_USER`).
  - `07-bigquery.sh`: Creación de dataset y tablas analíticas para auditoría de logins y logs de aplicación.
* **Alineación con la Agenda:** Soporte de infraestructura base para **Sesión 2** (Secret Manager), **Sesión 3** (Artifact Registry) y **Sesión 4** (VPC y Networking).

---

### 8. Repositorio: `develasquez/nivelacion-kubernetes`
* **Fuente:** GitHub — [`https://github.com/develasquez/nivelacion-kubernetes`](https://github.com/develasquez/nivelacion-kubernetes)
* **Tecnología:** Node.js, Express, Docker, Kubernetes Manifests (`deployment.yaml`, `service-load-balancer.yaml`).
* **Propósito Pedagógico:** Enseñar la evolución desde la máquina física y las VMs hacia contenedores y microservicios en Kubernetes. Diseñado para que los estudiantes exploren la historia a través de los commits.
* **Alineación con la Agenda:** Fundamento introductorio de la **Sesión 4 (Kubernetes en Producción)**.

---

### 9. Presentación: "Se el Rey de los piratas con Kubernetes - NIVELACIÓN"
* **Fuente:** Google Slides — [`1z1AW6JPWl381OLqKR2f9Sr8_lVQiufjjzWbEsK5pZMM`](https://docs.google.com/presentation/d/1z1AW6JPWl381OLqKR2f9Sr8_lVQiufjjzWbEsK5pZMM/edit?slide=id.g3a1f43bda7_8_43#slide=id.g3a1f43bda7_8_43)
* **Temario:**
  - De la infraestructura física (servidor dedicado, single point of failure, sobredimensionamiento, soporte obsoleto) a Máquinas Virtuales (hypervisor, emulación pesada).
  - El salto a Contenedores (reutilización del Kernel del host, aislamiento liviano, arranque en milisegundos).
  - Desafíos del Monolito vs. Microservicios.
  - Stateful vs. Stateless.
  - Escalamiento vertical vs. Escalamiento horizontal.
  - Balanceo de carga y Service Discovery.
  - Kubernetes en la Nube y transición al código en vivo.
* **Alineación con la Agenda:** Material visual para los primeros 15 minutos de la **Sesión 4**.

---

### 10. Artículo: "Introducción a Kubernetes" (LinkedIn Pulse)
* **Fuente:** LinkedIn Pulse — [`felipe-andres-velasquez-castro`](https://www.linkedin.com/pulse/introducci%C3%B3n-kubernetes-felipe-andres-velasquez-castro/)
* **Contenido:** Basado en la charla técnica impartida para el GDG Santiago en las oficinas de Globant. Expone la nivelación teórica de computación distribuida, desacoplamiento y orquestación de contenedores para equipos de desarrollo.
* **Alineación con la Agenda:** Material de lectura complementaria previa para la convocatoria de **D1**.

---

### 11. Repositorio: `develasquez/workload-identity-gke`
* **Fuente:** GitHub — [`https://github.com/develasquez/workload-identity-gke`](https://github.com/develasquez/workload-identity-gke)
* **Tecnología:** GKE, Workload Identity, Cloud IAM, Google Cloud Storage SDK, Node.js (`server.js`), `deployment.yaml`.
* **Concepto de Producción:** Eliminar por completo el antipatrón de exportar archivos de credenciales (`service-account-key.json`) e inyectarlos en contenedores.
* **Flujo Técnico:**
  1. Creación de Google Service Account (GSA) en Cloud IAM con permisos mínimos (ej. lectura de Cloud Storage).
  2. Creación de Kubernetes Service Account (KSA) en el namespace de la aplicación.
  3. Vinculación bidireccional mediante el rol `roles/iam.workloadIdentityUser` en el pool `PROJECT_ID.svc.id.goog[NAMESPACE/KSA]`.
  4. Anotación en la KSA: `iam.gke.io/gcp-service-account: GSA@PROJECT_ID.iam.gserviceaccount.com`.
  5. El pod asume la identidad automáticamente a través del GKE Metadata Server.
* **Endpoints de Salud:** Implementa `/ready` (Readiness Probe) y `/health` (Liveness Probe) en `server.js`.
* **Alineación con la Agenda:** Elemento estrella de seguridad en la **Sesión 4 (Kubernetes en Producción)**.

---

### 12. Repositorio: `develasquez/gke-private-cluster`
* **Fuente:** GitHub — [`https://github.com/develasquez/gke-private-cluster`](https://github.com/develasquez/gke-private-cluster)
* **Tecnología:** GKE Private Nodes, Custom VPC, Anthos Service Mesh (ASM) / Cloud Service Mesh, Istio Canary Releases (`frontend-v1`, `frontend-v2`, `frontend-v1-v2.yaml`), Online Boutique microservices.
* **Automatización:**
  - `01_create_cluster.sh`: Creación de cluster GKE con nodos privados (`--enable-private-nodes`), master CIDR privado (`172.16.0.0/28`) y red custom.
  - `02_install_asm.sh`: Instalación de Service Mesh gestionado.
  - `03_install_online_boutique.sh`: Despliegue de suite de microservicios de referencia para pruebas de tráfico y canarios.
* **Alineación con la Agenda:** Arquitectura avanzada de redes y seguridad para la **Sesión 4**.

---

### 13. Repositorio: `develasquez/multi-cluster-ingress`
* **Fuente:** GitHub — [`https://github.com/develasquez/multi-cluster-ingress`](https://github.com/develasquez/multi-cluster-ingress)
* **Tecnología:** Multi-Cluster Ingress (MCI) en GKE, Anthos Hub / GKE Hub Fleet, Global HTTP(S) Load Balancer.
* **Topología:** Despliegue multi-región (`us-central1` y `europe-west1`) con un único punto de entrada global Anycast IP que enruta tráfico de usuarios según proximidad geográfica y tolerancia a fallos.
* **Alineación con la Agenda:** Demostración de alta disponibilidad e Ingress de escala planetaria para la **Sesión 4**.
