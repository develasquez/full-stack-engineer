# Guía Práctica de Sesión 4: Kubernetes en Producción en Google Kubernetes Engine (GKE)

**Duración:** 60 Minutos (12:00 - 13:00)  
**Audiencia:** Tech Leads, Ingenieros DevOps/SRE, Desarrolladores Backend, Arquitectos Cloud de Retail Enterprise  
**Instructor:** Felipe Andrés Velásquez Castro (AI Architecture Lead, Axmos)  
**Insumos Base:**
- Repositorio Workload Identity: [github.com/develasquez/workload-identity-gke](https://github.com/develasquez/workload-identity-gke)
- Repositorio Nivelación K8s: [github.com/develasquez/nivelacion-kubernetes](https://github.com/develasquez/nivelacion-kubernetes)
- Presentación Sé el Rey de los Piratas: [Google Slides Kubernetes](https://docs.google.com/presentation/d/1z1AW6JPWl381OLqKR2f9Sr8_lVQiufjjzWbEsK5pZMM/edit)
- Repositorio Clúster Privado GKE: [github.com/develasquez/gke-private-cluster](https://github.com/develasquez/gke-private-cluster)
- Repositorio Multi-Cluster Ingress: [github.com/develasquez/multi-cluster-ingress](https://github.com/develasquez/multi-cluster-ingress)
- Artículo LinkedIn: [Introducción a Kubernetes por Felipe Velásquez](https://www.linkedin.com/pulse/introducci%C3%B3n-kubernetes-felipe-andres-velasquez-castro/)

---

## 1. Objetivos de Aprendizaje

Al finalizar la última hora del workshop, el equipo técnico de Retail Enterprise será capaz de:
1. **Comprender la evolución arquitectónica desde servidores físicos y VMs hasta la orquestación distribuida con Kubernetes en GKE.**
2. **Diseñar manifiestos declarativos de producción con resiliencia de grado industrial:** `Deployment` con sondas *liveness* y *readiness*, límites y reservas estrictas de CPU/Memoria (`requests` y `limits`), y estrategias de *RollingUpdate* con cero tiempo fuera de servicio (*Zero-Downtime*).
3. **Erradicar de raíz las llaves de cuentas de servicio en formato JSON mediante GKE Workload Identity**, vinculando de forma criptográfica un *Kubernetes Service Account* (KSA) con un *Google Cloud Service Account* (GSA).
4. **Exponer servicios de forma segura y global mediante GKE Ingress**, configurando certificados SSL administrados automáticamente por Google (`ManagedCertificate`) y políticas de seguridad perimetral.
5. **Implementar autoscaling dinámico y predecible mediante Horizontal Pod Autoscaler (HPA)**, definiendo ventanas de estabilización para absorber los picos de ventas de Retail Enterprise sin saturar la infraestructura ni incurrir en sobrecostos.

---

## 2. Diagrama de Arquitectura de Producción en GKE

```mermaid
flowchart TD
    Internet["Clientes POS Retail Enterprise\n& App Móvil"] -->|HTTPS :443| LB["Google Cloud External HTTP(S) Load Balancer\n(IP Anycast Global)"]
    
    subgraph GKECluster ["Google Kubernetes Engine (GKE Private Cluster)"]
        Ingress["GKE Ingress Controller\n(ManagedCertificate SSL)"] -->|ClusterIP| Svc["Kubernetes Service\n(retail-inventory-svc:8080)"]
        
        subgraph PodGroup ["ReplicaSet: Pods de Microservicio"]
            Pod1["Pod 1: Inventory Container\n(KSA: ksa-retail-inventory)"]
            Pod2["Pod 2: Inventory Container\n(KSA: ksa-retail-inventory)"]
            Pod3["Pod N: Inventory Container\n(Autoescalado por HPA)"]
        end
        
        Svc --> Pod1
        Svc --> Pod2
        Svc --> Pod3
        
        HPA["Horizontal Pod Autoscaler (HPA)\n(Min: 2, Max: 10, Target CPU: 70%)"] -.->|Escala Replicas| PodGroup
    end
    
    LB --> Ingress

    subgraph GCPCloud ["Servicios Nativos GCP (Zero-Trust)"]
        GSA["Google Service Account (GSA)\ngsa-retail-inventory@project.iam..."]
        SecretMgr["Cloud Secret Manager"]
        CloudSQL["Cloud SQL (PostgreSQL)\n(Private IP VPC)"]
        GCS["Cloud Storage\n(Backups / Documentos)"]
    end

    Pod1 -.->|Workload Identity Federation\niam.gke.io/gcp-service-account| GSA
    GSA -->|roles/secretmanager.secretAccessor| SecretMgr
    GSA -->|roles/cloudsql.client| CloudSQL
    GSA -->|roles/storage.objectViewer| GCS
```

---

## 3. Patrón Maestro 1: Seguridad Absoluta con Workload Identity

En arquitecturas tradicionales obsoletas, los desarrolladores descargaban llaves privadas JSON (`credentials.json`) y las montaban como secretos en Kubernetes. Esto representaba el riesgo #1 de exfiltración de datos.

Con **Workload Identity** (demostrado en el repositorio de Felipe Velásquez `workload-identity-gke`):
1. El contenedor del Pod consulta la API de metadatos local de GKE (`http://metadata.google.internal`).
2. GKE intercepta la petición y federada el token OpenID Connect (OIDC) del Pod con Google Cloud IAM.
3. Google IAM genera dinámicamente un token de acceso OAuth2 temporal de corta duración (1 hora) con los roles asignados a la GSA.

### Vinculación de Cuentas de Servicio (Comandos Reales):
```bash
# 1. Crear el Service Account en Google Cloud (GSA)
gcloud iam service-accounts create gsa-retail-inventory \
    --display-name="GSA para microservicio de inventario Retail"

# 2. Asignar roles mínimos necesarios a la GSA
gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
    --member="serviceAccount:gsa-retail-inventory@$(gcloud config get-value project).iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

# 3. Vincular la Kubernetes Service Account (KSA) con la GSA (Workload Identity User)
gcloud iam service-accounts add-iam-policy-binding \
    gsa-retail-inventory@$(gcloud config get-value project).iam.gserviceaccount.com \
    --role="roles/iam.workloadIdentityUser" \
    --member="serviceAccount:$(gcloud config get-value project).svc.id.goog[default/ksa-retail-inventory]"
```

---

## 4. Manifiestos Declarativos de Producción

### A. Cuenta de Servicio de Kubernetes con Anotación (`serviceaccount.yaml`)
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: ksa-retail-inventory
  namespace: default
  annotations:
    iam.gke.io/gcp-service-account: gsa-retail-inventory@PROJECT_ID.iam.gserviceaccount.com
```

---

### B. Deployment con Sondas de Salud y Límites (`deployment.yaml`)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: retail-inventory-deployment
  namespace: default
  labels:
    app: retail-inventory
    tier: backend
spec:
  replicas: 2
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: retail-inventory
  template:
    metadata:
      labels:
        app: retail-inventory
    spec:
      serviceAccountName: ksa-retail-inventory
      containers:
        - name: inventory-api
          image: us-east1-docker.pkg.dev/PROJECT_ID/retail-apps/inventory-service:latest
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 8080
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
          # Sonda para determinar si el contenedor está vivo o requiere reinicio
          livenessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 15
            periodSeconds: 10
            timeoutSeconds: 3
            failureThreshold: 3
          # Sonda para determinar si el contenedor puede recibir tráfico del balanceador
          readinessProbe:
            httpGet:
              path: /ready
              port: 8080
            initialDelaySeconds: 10
            periodSeconds: 5
            timeoutSeconds: 2
            failureThreshold: 2
```

---

### C. Exposición con Service e Ingress SSL (`ingress.yaml`)
```yaml
apiVersion: networking.gke.io/v1
kind: ManagedCertificate
metadata:
  name: retail-inventory-cert
  namespace: default
spec:
  domains:
    - api-inventario.tiendasd1.com
---
apiVersion: v1
kind: Service
metadata:
  name: retail-inventory-svc
  namespace: default
spec:
  type: ClusterIP
  selector:
    app: retail-inventory
  ports:
    - port: 8080
      targetPort: 8080
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: retail-inventory-ingress
  namespace: default
  annotations:
    kubernetes.io/ingress.class: "gce"
    networking.gke.io/managed-certificates: "retail-inventory-cert"
spec:
  rules:
    - host: api-inventario.tiendasd1.com
      http:
        paths:
          - path: /*
            pathType: ImplementationSpecific
            backend:
              service:
                name: retail-inventory-svc
                port:
                  number: 8080
```

---

### D. Autoescalado Dinámico (`hpa.yaml`)
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: retail-inventory-hpa
  namespace: default
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: retail-inventory-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300 # Evita fluctuaciones abruptas post-pico
      policies:
        - type: Percent
          value: 10
          periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0 # Reacción inmediata ante picos
      policies:
        - type: Percent
          value: 100
          periodSeconds: 15
```

---

## 5. Laboratorio Hands-on Paso a Paso (40 minutos)

### Paso 1: Conectar a GKE y Desplegar Manifiestos
```bash
# Obtener credenciales del clúster privado
gcloud container clusters get-credentials d1-cluster-prod --region us-east1

# Aplicar los manifiestos en orden
kubectl apply -f serviceaccount.yaml
kubectl apply -f deployment.yaml
kubectl apply -f ingress.yaml
kubectl apply -f hpa.yaml
```

### Paso 2: Verificar la Federación de Workload Identity
Entramos a una shell interactiva en el Pod en ejecución para comprobar que accede a Google Cloud Storage o Secret Manager sin llaves montadas:
```bash
# Ejecutar comando en el Pod
kubectl exec -it $(kubectl get pods -l app=retail-inventory -o jsonpath='{.items[0].metadata.name}') -- \
    node -e "
      const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
      const client = new SecretManagerServiceClient();
      async function test() {
        console.log('✅ Conectando a Secret Manager mediante Workload Identity...');
        const [version] = await client.accessSecretVersion({ name: 'projects/PROJECT_ID/secrets/retail-db-credentials/versions/latest' });
        console.log('🔒 Acceso exitoso sin llaves JSON!');
      }
      test().catch(console.error);
    "
```

### Paso 3: Simular Carga y Monitorear el Autoescalado (HPA)
Utilizamos un generador de tráfico ligero para estresar el servicio:
```bash
# Ejecutar un generador de peticiones masivas
kubectl run -i --tty load-generator --rm --image=busybox:1.36 --restart=Never -- /bin/sh -c "
  while true; do 
    wget -q -O- http://retail-inventory-svc:8080/health; 
  done
"

# Monitorear la reacción del HPA en otra terminal
kubectl get hpa retail-inventory-hpa --watch
```
*Salida observada:* El HPA detecta el incremento de CPU (> 70%) y escala automáticamente las réplicas de 2 a 4, luego a 8 Pods en menos de 90 segundos.

---

## 6. Checklist de Verificación para el Tech Lead (Fin de Sesión)

- [ ] ¿Se eliminaron al 100% las llaves JSON de cuentas de servicio del clúster?
- [ ] ¿El Deployment tiene definidos con exactitud `requests` y `limits` tanto de CPU como de memoria RAM?
- [ ] ¿Las sondas `/health` (liveness) y `/ready` (readiness) discriminan correctamente entre proceso vivo y base de datos disponible?
- [ ] ¿El certificado SSL está en estado `ACTIVE` en Cloud Load Balancing gestionado por Google?
- [ ] ¿El HPA cuenta con ventanas de estabilización para evitar el efecto "yo-yo" (flapping) en el consumo de recursos?
