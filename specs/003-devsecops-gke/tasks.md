# Plan de Tareas: DevSecOps CI/CD & Manifiestos GKE

## Tareas de Implementación

- [x] **TASK-OPS-01:** Crear `k8s/namespace.yaml` para el namespace `retail-store`.
- [x] **TASK-OPS-02:** Crear `k8s/configmap.yaml` y `k8s/secret.yaml`.
- [x] **TASK-OPS-03:** Crear `k8s/backend-deployment.yaml` con health probes y gobernanza FinOps.
- [x] **TASK-OPS-04:** Crear `k8s/backend-service.yaml` con anotación Container-Native NEG.
- [x] **TASK-OPS-05:** Crear `k8s/frontend-deployment.yaml` y `k8s/frontend-service.yaml`.
- [x] **TASK-OPS-06:** Crear `k8s/ingress.yaml` L7 para enrutamiento unificado frontend/backend.
- [x] **TASK-OPS-07:** Crear `k8s/hpa.yaml` con autoscaling v2 para backend.
- [x] **TASK-OPS-08:** Crear `cloudbuild.yaml` con DAG (`waitFor`), escaneo Trivy y despliegue a GKE.
- [x] **TASK-OPS-09:** Validar sintaxis y coherencia de manifiestos y pipeline.
