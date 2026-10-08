# Security Checklist: Retail Inventory Microservice

**Purpose**: Validate security and compliance requirements for the inventory microservice  
**Created**: 2026-10-08  
**Feature**: [spec.md](../spec.md)

## Completeness & Input Validation
- [x] CHK001: All external inputs (`sku`, `quantity`, `storeId`) are strictly sanitized and validated before use
- [x] CHK002: Negative, zero, or non-integer quantities are rejected with HTTP 400
- [x] CHK003: String inputs are bounded in length to prevent memory exhaustion

## Authentication & Authorization Boundaries
- [x] CHK004: Endpoints are prepared for perimeter authentication handled by GKE Ingress
- [x] CHK005: Chaos endpoint is designated as internal testing only and gated in production pipelines

## Secrets & Data Protection
- [x] CHK006: No hardcoded secrets, passwords, or GCP credentials exist in source code or configuration
- [x] CHK007: Distributed trace IDs and headers do not leak sensitive PII in log entries

## Runtime Security
- [x] CHK008: Process runs inside container under non-root UID/GID
- [x] CHK009: Dependencies audited for vulnerabilities via Trivy in CI/CD pipeline
