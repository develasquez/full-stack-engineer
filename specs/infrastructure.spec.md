# Especificación Canónica: Infraestructura Cloud Native & DevSecOps (GKE + Cloud Build)

## 1. Identificación y Metadatos
- **ID de Característica:** `003-devsecops-gke`
- **Dominio:** Infraestructura Cloud Native, DevSecOps & Orquestación Kubernetes
- **Plataforma:** Google Cloud Platform (GCP 2026), Google Kubernetes Engine (GKE), Google Cloud Build, Google Artifact Registry
- **Estado:** `APROBADO_PARA_IMPLEMENTACION`

---

## 2. Principios de DevSecOps & GitOps
1. **GitOps Determinista Puro:** Todo artefacto se versiona en Git; Google Cloud Build orquesta despliegues automáticamente.
2. **Escaneo de Seguridad Shift-Left:** Escaneo obligatorio de imágenes con Trivy (`aquasec/trivy:latest`) en severidades `HIGH,CRITICAL`.
3. **Container-Native Load Balancing (NEG):** Servicios con anotación `cloud.google.com/neg: '{"ingress": true}'` para enrutamiento directo L7.
4. **Auto-Recuperación y Observabilidad:** Sondas `livenessProbe` (`/health`) y `readinessProbe` (`/ready`).
5. **Gobernanza FinOps & Escalado:** Asignación explícita de `requests` y `limits` y HPA v2 (70% CPU, 2 a 10 réplicas).
