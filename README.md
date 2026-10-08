# 🚀 Workshop Técnico: Modernización Cloud Native & AI-Assisted Engineering con GCP 2026
## Capacitación Práctica de 4 Horas para Tiendas D1 (Google Cloud Bogotá)

> **Transferencia Técnica Presencial | Oficinas Google Cloud Bogotá**  
> **Líder Técnico & Facilitador:** Felipe Andrés Velásquez Castro (AI Architecture Lead)  
> **Firma Patrocinadora:** AXMOS Technologies  
> **Convocatoria:** Equipo de Ingeniería Tiendas D1 (Líderes Técnicos, Desarrolladores Backend/Frontend, DevOps/SRE y Arquitectos de Software)  
> **Laboratorio Interactivo:** 👉 [**Acceder a la Guía Hands-on Paso a Paso (workshop.md)**](./workshop.md) 👈

---

## 🧭 Visión General de la Capacitación

Este repositorio contiene el material técnico, la arquitectura de referencia y el código fuente completo para el workshop interactivo de 4 horas diseñado para **Tiendas D1** en el año **2026**.

Abarca desde el desarrollo asistido por Inteligencia Artificial con **Google Antigravity CLI (`agy`)**, **Specification-Driven Development (`sdd-skill`)**, y **Vanilla-Core UI & Material Design 3**, hasta la construcción de microservicios contenerizados y el despliegue puramente **GitOps** en **Google Kubernetes Engine (GKE Private Cluster)** mediante **Google Cloud Build** y observabilidad empresarial con **Google Cloud Trace & Logging**.

---

## ⚡ Estructura del Repositorio

La raíz se mantiene limpia y organizada por responsabilidades:

```text
full-stack-engineer/
├── README.md               # Este documento de bienvenida y mapa general
├── workshop.md             # Guía interactiva paso a paso estilo Cloud Skills Boost / Qwiklabs
├── cloudbuild.yaml         # Pipeline CI/CD DevSecOps con ordenamiento DAG (waitFor) y Trivy Scan
├── backend/                # Microservicio Node.js 20 / TypeScript con Clean Architecture y Chaos Endpoint
│   ├── src/                # Dominio, Casos de Uso, Infraestructura y Rutas HTTP
│   ├── tests/              # Pruebas unitarias de reserva y caos con Vitest
│   ├── Dockerfile          # Multi-stage build con usuario no root
│   └── package.json
├── frontend/               # Single Page Application con Vanilla-Core UI & Material Design 3
│   ├── components/         # Header, Catálogo de Inventario y Panel de Inyección de Caos
│   ├── ui/                 # Renderizado quirúrgico anti-thrashing
│   ├── store.js            # Fuente Única de Verdad (SSoT) y Bus Pub/Sub
│   ├── server.js           # Servidor Express estático con health check
│   └── Dockerfile          # Imagen Alpine optimizada para producción
├── k8s/                    # Manifiestos declarativos de infraestructura en GKE
│   ├── namespace.yaml      # Namespace tiendas-d1
│   ├── configmap.yaml      # Configuraciones de entorno no sensibles
│   ├── secret.yaml         # Secretos y credenciales desacopladas
│   ├── backend-deployment.yaml   # Deployment con liveness/readiness probes y limits
│   ├── backend-service.yaml      # Service con anotación NEG Container-Native
│   ├── frontend-deployment.yaml  # Deployment web
│   ├── frontend-service.yaml     # Service frontend
│   ├── ingress.yaml        # GKE Ingress L7 Load Balancer
│   └── hpa.yaml            # HorizontalPodAutoscaler (2 a 10 réplicas al 70% CPU)
└── docs/                   # Documentación teórica, comparativas de arquitectura y encuestas
    ├── 01_CATALOGO_INSUMOS_Y_FUENTES.md
    ├── 02_S1_DESARROLLO_IA_Y_SDD.md
    ├── 03_S2_GESTION_Y_SEGURIDAD_APIS.md
    ├── 04_S3_DEVOPS_EN_GCP.md
    ├── 05_S4_KUBERNETES_EN_PRODUCCION.md
    ├── 06_GAPS_Y_LABS_COMPLEMENTARIOS.md
    ├── 07_GUIA_PROMPTS_AGENTES_D1.md
    └── 08_ENCUESTA_Y_EVALUACION_ADOPCION.md
```

---

## 🧪 Laboratorio Práctico Paso a Paso (`workshop.md`)

Para ejecutar la capacitación siguiendo la metodología **Cloud Skills Boost / Qwiklabs**, abre el archivo:

👉 [**Guía Hands-on Completa (workshop.md)**](./workshop.md)

Cada sección incluye:
- 🎯 **Objetivo específico del laboratorio.**
- 🤖 **Prompt canónico y conciso para Google Antigravity.**
- 💻 **Comando de consola optimizado con RTK (`rtk ...`).**
- 🔍 **Validación y salida esperada.**
- 💥 **Inyección de fallas en vivo (Chaos Engineering) y resolución de incidentes en Google Cloud Trace & Logging.**

---

## 📚 Documentación Técnica Detallada (`docs/`)

| Documento | Enlace | Propósito y Alcance |
| :--- | :--- | :--- |
| **01. Catálogo de Insumos y Fuentes** | [`docs/01_CATALOGO_INSUMOS_Y_FUENTES.md`](./docs/01_CATALOGO_INSUMOS_Y_FUENTES.md) | Análisis detallado de los 13 insumos de autoría propia (repos, slides, artículos, npm). |
| **02. Sesión 1: Desarrollo con IA & SDD** | [`docs/02_S1_DESARROLLO_IA_Y_SDD.md`](./docs/02_S1_DESARROLLO_IA_Y_SDD.md) | Antigravity CLI, sdd-skill, gobernanza con AGENTS.md, Vanilla-Core UI y tests. |
| **03. Sesión 2: Gestión y Seguridad de APIs** | [`docs/03_S2_GESTION_Y_SEGURIDAD_APIS.md`](./docs/03_S2_GESTION_Y_SEGURIDAD_APIS.md) | **Google Cloud Apigee (X/Hybrid) vs. Kong Gateway**, OpenAPI 3.0, Identity Platform, Spike Arrest y logs estructurados. |
| **04. Sesión 3: DevOps en GCP** | [`docs/04_S3_DEVOPS_EN_GCP.md`](./docs/04_S3_DEVOPS_EN_GCP.md) | Dockerfiles multi-stage, Artifact Registry regional y pipelines de `cloudbuild.yaml`. |
| **05. Sesión 4: Kubernetes en Producción** | [`docs/05_S4_KUBERNETES_EN_PRODUCCION.md`](./docs/05_S4_KUBERNETES_EN_PRODUCCION.md) | Arquitectura K8s, GKE Private Cluster, Workload Identity y HPA. |
| **06. Gaps & Labs Complementarios** | [`docs/06_GAPS_Y_LABS_COMPLEMENTARIOS.md`](./docs/06_GAPS_Y_LABS_COMPLEMENTARIOS.md) | Manifiestos de Workload Identity, Cloud NAT y Multi-Cluster Ingress. |
| **07. Guía de Prompts y Agentes D1** | [`docs/07_GUIA_PROMPTS_AGENTES_D1.md`](./docs/07_GUIA_PROMPTS_AGENTES_D1.md) | Recetas operativas de prompts para equipos de desarrollo en Tiendas D1. |
| **08. Encuesta y Plan de Adopción** | [`docs/08_ENCUESTA_Y_EVALUACION_ADOPCION.md`](./docs/08_ENCUESTA_Y_EVALUACION_ADOPCION.md) | Instrumento de medición pre/post workshop y hoja de ruta de adopción a 30 días. |

---

## 🛡️ Principios DevSecOps & GitOps Aplicados
1. **Cero despliegues manuales con Cloud SDK:** Ningún desarrollador despliega desde su terminal local. El único canal de entrega a producción es `git push origin main`.
2. **Seguridad integrada en el pipeline:** Cada imagen es analizada contra bases de datos de vulnerabilidades con **Aqua Trivy** antes de publicarse en Artifact Registry.
3. **Observabilidad estructurada de primer nivel:** Los registros emiten severidades nativas de Google Cloud Logging (`EMERGENCY`, `WARNING`, `INFO`) con correlación automática de trazas distribuidas (`logging.googleapis.com/trace`).
4. **Auto-sanación comprobable:** La plataforma resiste caídas catastróficas de procesos y regenera las réplicas en segundos sin intervención humana.

---
*Diseñado y facilitado por Felipe Andrés Velásquez Castro para Tiendas D1 y Google Cloud Colombia.*
