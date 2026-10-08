# 🚀 Workshop Técnico: Modernización Cloud Native & AI-Assisted Engineering con GCP 2026
## Capacitación Práctica de 4 Horas — Caso de Uso: Arquitectura Retail Enterprise (Google Cloud Bogotá)

> **Transferencia Técnica Presencial | Oficinas Google Cloud Bogotá**  
> **Líder Técnico & Facilitador:** Felipe Andrés Velásquez Castro (AI Architecture Lead)  
> **Firma Patrocinadora:** AXMOS Technologies  
> **Audiencia:** Líderes Técnicos, Desarrolladores Backend/Frontend, DevOps/SRE y Arquitectos de Software de Retail  
> **Laboratorio Interactivo:** 👉 [**Acceder a la Guía Hands-on Paso a Paso (workshop.md)**](./workshop.md) 👈

---

## 🧭 Visión General de la Capacitación

Este repositorio contiene la guía interactiva, el contrato maestro de gobernanza arquitectónica y la base de conocimiento estructurada para el workshop interactivo de 4 horas enfocado en un caso de uso real de **Retail Enterprise** en el año **2026**.

Abarca desde el desarrollo asistido por Inteligencia Artificial con **Google Antigravity CLI (`agy`)**, **Specification-Driven Development (`sdd-skill`)**, y **Vanilla-Core UI & Material Design 3 (`npx vanilla-core-ui`, `npx @develasquez/material-design`)**, hasta la construcción incremental de microservicios contenerizados y el despliegue puramente **GitOps** en **Google Kubernetes Engine (GKE Private Cluster)** mediante **Google Cloud Build** y observabilidad empresarial con **Google Cloud Trace & Logging**.

---

## ⚡ Estructura del Repositorio

El repositorio inicia como un workspace limpio y listo para que cada participante genere dinámicamente los componentes mediante prompts gobernados por **`AGENTS.md`**:

```text
full-stack-engineer/
├── README.md               # Este documento de bienvenida y mapa general
├── AGENTS.md               # Contrato maestro de gobernanza y directivas de arquitectura para Antigravity
├── workshop.md             # Guía interactiva paso a paso estilo Cloud Skills Boost / Qwiklabs
├── docs/                   # Documentación teórica, comparativas de arquitectura y encuestas
│   ├── 01_CATALOGO_INSUMOS_Y_FUENTES.md
│   ├── 02_S1_DESARROLLO_IA_Y_SDD.md
│   ├── 03_S2_GESTION_Y_SEGURIDAD_APIS.md
│   ├── 04_S3_DEVOPS_EN_GCP.md
│   ├── 05_S4_KUBERNETES_EN_PRODUCCION.md
│   ├── 06_GAPS_Y_LABS_COMPLEMENTARIOS.md
│   ├── 07_GUIA_PROMPTS_AGENTES.md
│   └── 08_ENCUESTA_Y_EVALUACION_ADOPCION.md
```

> 💡 **Componentes Generados Dinámicamente Durante el Workshop:**  
> A medida que avances en [`workshop.md`](./workshop.md), Antigravity generará de forma asistida:
> - `specs/`: Especificaciones formales contractuales generadas por `/sdd-skill sdd-specify`.
> - `backend/`: Microservicio Node.js 20 / TypeScript con Clean Architecture, `StructuredLogger` para GCP y endpoint de Caos (`POST /api/v1/chaos/crash`), validado con Vitest.
> - `frontend/`: Single Page Application reactiva creada con Vanilla-Core UI y Material Design 3 (`store.js`, componentes, renderizado quirúrgico y servidor Express en puerto 80).
> - `cloudbuild.yaml`: Pipeline CI/CD DevSecOps con ordenamiento DAG (`waitFor`) y escaneo Aqua Trivy.
> - `k8s/`: Manifiestos declarativos para GKE (Namespace, ConfigMap, Secret, Deployments, Services NEG Container-Native, Ingress y HPA v2).

---

## 🧪 Laboratorio Práctico Paso a Paso (`workshop.md`)

Para ejecutar la capacitación siguiendo la metodología **Cloud Skills Boost / Qwiklabs**, abre el archivo:

👉 [**Guía Hands-on Completa (workshop.md)**](./workshop.md)

Cada ciclo SDD y laboratorio incluye:
- 🎯 **Objetivo específico del laboratorio.**
- 🤖 **Secuencia SDD con Antigravity (`/sdd-skill sdd-specify`, `/sdd-skill sdd-clarify`, `/sdd-skill sdd-plan`, `/sdd-skill sdd-tasks`, `/sdd-skill sdd-implement`).**
- 💻 **Comando de consola optimizado con RTK (`rtk ...`).**
- 🔍 **Validación y salida esperada.**
- 💥 **Inyección de fallas en vivo (Chaos Engineering) y resolución forense en Google Cloud Trace & Logging.**

---

## 📚 Documentación Técnica Detallada (`docs/`)

| Documento | Enlace | Propósito y Alcance |
| :--- | :--- | :--- |
| **01. Catálogo de Insumos y Fuentes** | [`docs/01_CATALOGO_INSUMOS_Y_FUENTES.md`](./docs/01_CATALOGO_INSUMOS_Y_FUENTES.md) | Análisis detallado de los insumos de autoría propia (repos, slides, artículos, npm). |
| **02. Sesión 1: Desarrollo con IA & SDD** | [`docs/02_S1_DESARROLLO_IA_Y_SDD.md`](./docs/02_S1_DESARROLLO_IA_Y_SDD.md) | Antigravity CLI, sdd-skill, gobernanza con AGENTS.md, Vanilla-Core UI y tests. |
| **03. Sesión 2: Gestión y Seguridad de APIs** | [`docs/03_S2_GESTION_Y_SEGURIDAD_APIS.md`](./docs/03_S2_GESTION_Y_SEGURIDAD_APIS.md) | **Google Cloud Apigee (X/Hybrid) vs. Kong Gateway**, OpenAPI 3.0, Identity Platform, Spike Arrest y logs estructurados. |
| **04. Sesión 3: DevOps en GCP** | [`docs/04_S3_DEVOPS_EN_GCP.md`](./docs/04_S3_DEVOPS_EN_GCP.md) | Dockerfiles multi-stage, Artifact Registry regional y pipelines de `cloudbuild.yaml`. |
| **05. Sesión 4: Kubernetes en Producción** | [`docs/05_S4_KUBERNETES_EN_PRODUCCION.md`](./docs/05_S4_KUBERNETES_EN_PRODUCCION.md) | Arquitectura K8s, GKE Private Cluster, Workload Identity y HPA. |
| **06. Gaps & Labs Complementarios** | [`docs/06_GAPS_Y_LABS_COMPLEMENTARIOS.md`](./docs/06_GAPS_Y_LABS_COMPLEMENTARIOS.md) | Manifiestos de Workload Identity, Cloud NAT y Multi-Cluster Ingress. |
| **07. Guía de Prompts y Agentes** | [`docs/07_GUIA_PROMPTS_AGENTES.md`](./docs/07_GUIA_PROMPTS_AGENTES.md) | Recetas operativas de prompts para equipos de desarrollo en Retail Enterprise. |
| **08. Encuesta y Plan de Adopción** | [`docs/08_ENCUESTA_Y_EVALUACION_ADOPCION.md`](./docs/08_ENCUESTA_Y_EVALUACION_ADOPCION.md) | Instrumento de medición pre/post workshop y hoja de ruta de adopción a 30 días. |

---

## 🛡️ Principios DevSecOps & GitOps Aplicados
1. **Cero despliegues manuales con Cloud SDK:** Ningún desarrollador despliega desde su terminal local. El único canal de entrega a producción es `git push origin main`.
2. **Seguridad integrada en el pipeline:** Cada imagen es analizada contra bases de datos de vulnerabilidades con **Aqua Trivy** antes de publicarse en Artifact Registry.
3. **Observabilidad estructurada de primer nivel:** Los registros emiten severidades nativas de Google Cloud Logging (`EMERGENCY`, `WARNING`, `INFO`) con correlación automática de trazas distribuidas (`logging.googleapis.com/trace`).
4. **Auto-sanación comprobable:** La plataforma resiste caídas catastróficas de procesos y regenera las réplicas en segundos sin intervención humana.

---
*Diseñado y facilitado por Felipe Andrés Velásquez Castro para Google Cloud Colombia.*
