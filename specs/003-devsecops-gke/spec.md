# Especificación de Requerimientos: DevSecOps CI/CD & Manifiestos GKE

## 1. Identificación y Metadatos
- **ID de Característica:** `003-devsecops-gke`
- **Dominio:** Infraestructura Cloud Native, DevSecOps & Orquestación Kubernetes
- **Plataforma:** Google Cloud Platform (GCP 2026), Google Kubernetes Engine (GKE), Google Cloud Build, Google Artifact Registry
- **Estado:** `APROBADO_PARA_IMPLEMENTACION`

---

## 2. Descripción General y Objetivos
Definir la canalización de integración y entrega continua (CI/CD) declarativa y automatizada con Google Cloud Build y la especificación de infraestructura como código en manifiestos de Kubernetes para GKE.
Se implementa un pipeline GitOps determinista estricto con análisis de vulnerabilidades Trivy y despliegue a GKE con soporte de Container-Native Load Balancing (NEG), sondas de salud (readiness y liveness), escalado automático horizontal (HPA) y gobernanza FinOps de recursos.

---

## 3. Principios de DevSecOps & GitOps (GCP 2026)
1. **GitOps Determinista Puro:** Todo artefacto se versiona en Git. Google Cloud Build es la única entidad autorizada para construir y desplegar tras eventos de `git push`.
2. **Escaneo de Seguridad Shift-Left:** Toda imagen de contenedor construida es analizada contra CVEs de severidad `HIGH,CRITICAL` usando `aquasec/trivy:latest` antes de ser promocionada o desplegada.
3. **Container-Native Load Balancing (NEG):** Los servicios de Kubernetes integran la anotación `cloud.google.com/neg: '{"ingress": true}'` para enrutamiento directo L7 desde Google Cloud Load Balancer hacia las IPs de los Pods.
4. **Auto-Recuperación y Observabilidad:** Sondas `livenessProbe` (`/health`) y `readinessProbe` (`/ready` en backend, `/health` en frontend) permiten al Kubelet detectar estados anómalos o inducidos por pruebas de caos y reemplazar pods sin intervención humana.
5. **Gobernanza FinOps:** Asignación explícita de `requests` y `limits` de CPU y memoria en todos los Pods para evitar saturación de nodos o ruidos de vecindad.

---

## 4. Requerimientos de Manifiestos GKE (`k8s/`)
1. `k8s/namespace.yaml`: Namespace aislado `retail-store`.
2. `k8s/configmap.yaml`: Parámetros de entorno no sensibles (`NODE_ENV`, `PORT`, `GCP_PROJECT_ID`, `SERVICE_NAME`).
3. `k8s/secret.yaml`: Secretos codificados en base64 simulados (`DATABASE_CREDENTIALS`, `API_KEY`).
4. `k8s/backend-deployment.yaml`: Deployment del microservicio backend con 2 réplicas mínimas, `runAsNonRoot`, sondas y recursos.
5. `k8s/backend-service.yaml`: Service `ClusterIP` con anotación NEG en puerto `8080`.
6. `k8s/frontend-deployment.yaml`: Deployment del frontend SPA con réplicas, probes y recursos.
7. `k8s/frontend-service.yaml`: Service `ClusterIP` con anotación NEG en puerto `80`.
8. `k8s/ingress.yaml`: Ingress L7 que mapea `/api/*` hacia `backend-service:8080` y `/*` hacia `frontend-service:80`.
9. `k8s/hpa.yaml`: Horizontal Pod Autoscaler `v2` para `backend-deployment` con umbral del 70% de CPU y límites de 2 a 10 réplicas.

---

## 5. Requerimientos de Pipeline CI/CD (`cloudbuild.yaml`)
- Estructurado como un Grafo Acíclico Dirigido (DAG) mediante directivas `waitFor`:
  - `test-backend`: Corre tests con Vitest inmediatamente (`waitFor: ['-']`).
  - `build-backend`: Construye imagen Docker de backend tras pasar los tests (`waitFor: ['test-backend']`).
  - `build-frontend`: Construye imagen Docker de frontend en paralelo desde el inicio (`waitFor: ['-']`).
  - `scan-backend`: Escaneo con `aquasec/trivy:latest` (`waitFor: ['build-backend']`).
  - `scan-frontend`: Escaneo con `aquasec/trivy:latest` (`waitFor: ['build-frontend']`).
  - `push-images`: Empuja imágenes a Artifact Registry (`waitFor: ['scan-backend', 'scan-frontend']`).
  - `deploy-k8s`: Sustituye `$SHORT_SHA` y aplica manifiestos a GKE (`waitFor: ['push-images']`).
