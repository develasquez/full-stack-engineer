# Retail Cloud Native Architecture Constitution (GCP 2026)

## Core Principles

### I. Executable Specifications First (NON-NEGOTIABLE)
All features MUST start with a clear, unambiguous specification in `specs/`. Code serves specifications; specifications are the single source of truth. Every domain component must pass SDD phases (`specify`, `clarify`, `plan`, `tasks`, `implement`).

### II. GitOps Determinista Puro (Zero Local Cloud SDK Deploy)
Manual local deployments via Cloud SDK (`gcloud run deploy`, `gcloud compute`) are strictly forbidden. All code, container configurations, and Kubernetes manifests are version-controlled in Git. Google Cloud Build is the sole authorized entity to orchestrate builds, vulnerability scans, and GKE deployments.

### III. Minimal Complexity & Native Capabilities (Ponytail Dogma)
Start simple. Prioritize native language standard library and lightweight packages over heavyweight external dependencies. Avoid speculative abstraction and dead layers.

### IV. Clean Architecture & Domain Isolation
Domain logic (`src/domain/`) MUST be pure and agnostic of transport protocols (HTTP/Express), databases, or infrastructure drivers. Use cases receive plain DTOs and return results or throw typed domain exceptions.

### V. Native Structured Observability
All microservices must emit structured JSON events to `stdout` compatible with Google Cloud Logging (`INFO`, `WARNING`, `ERROR`, `EMERGENCY`) and correlated with distributed traces (`logging.googleapis.com/trace`). The severity `EMERGENCY` is reserved exclusively for fatal container crashes.

### VI. Test-Driven Verification (100% Core Use-Case Coverage)
Vitest is the mandatory test framework. 100% of core use cases (successful execution, insufficient stock, not found, chaos trigger) must have automated unit tests runnable with `rtk npm test`.

## Governance

- This Constitution supersedes arbitrary design preferences.
- Any architectural violation in `plan.md` must be explicitly justified in the Complexity Tracking section.
- Amendments require updating this document and re-evaluating active implementation plans.

**Version**: 1.0.0 | **Ratified**: 2026-10-08
