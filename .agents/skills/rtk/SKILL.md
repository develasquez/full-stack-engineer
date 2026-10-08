---
name: rtk
description: >-
  Rust Token Killer (RTK) - CLI proxy and token optimization engine that filters
  and condenses terminal outputs (git, ls, find, test, npm, docker, kubectl, vitest)
  saving 60% to 90% of LLM context window tokens while preserving exit codes and errors.
---

# ⚡ RTK (Rust Token Killer) Skill

Este skill habilita y documenta el uso del proxy de alta velocidad **RTK (Rust Token Killer)** en sesiones de desarrollo y ejecución de terminal para Google Antigravity y desarrolladores de Retail Enterprise.

---

## 🎯 ¿Qué es RTK?

RTK es un binario ultraligero escrito en Rust diseñado para intermediar la ejecución de comandos de sistema en terminales interactivas y agentes autónomos.
- **Ahorro de Tokens:** Filtra ruido, barras de progreso y texto redundante, reduciendo el consumo entre 60% y 90%.
- **Fidelidad y Transparencia:** Preserva intactos los códigos de salida (`exit code`), errores críticos (`stderr`) y salidas de fallos.
- **Passthrough Seguro:** Si un comando no tiene filtro especializado o si el binario no está instalado, se ejecuta el comando nativo sin alterar el comportamiento.

---

## 💻 Instalación Rápida para Usuarios (Clone del Repositorio)

Para asegurar que los comandos `rtk ...` funcionen en cualquier máquina tras clonar el repositorio:

### Opción A: macOS con Homebrew (Recomendada)
```bash
brew install rtk
```

### Opción B: Linux / macOS mediante Script Oficial
```bash
curl -fsSL https://www.rtk-ai.app/install.sh | sh
```

### Opción C: Fallback Transparente (Sin Instalación)
Si el usuario no tiene permisos de instalación o prefiere no instalar el binario, puede configurar un alias temporal en su shell (`~/.zshrc` o `~/.bashrc`):
```bash
alias rtk=''
```
Esto permite ejecutar exactamente los mismos comandos (`rtk git status`, `rtk npm test`) ejecutando directamente la herramienta nativa subyacente.

---

## 📋 Comandos Compatibles y Mapeo Frecuente

| Comando RTK | Comando Nativo Proxificado | Optimización Realizada |
| :--- | :--- | :--- |
| `rtk git status` | `git status --short` | Formato ultra compacto de estado Git |
| `rtk git diff` | `git diff` | Muestra solo líneas modificadas y contexto mínimo |
| `rtk git log -n 5` | `git log` | Resumen de una línea por commit |
| `rtk ls -la` | `ls -la` | Tabla compacta con recuento de directorios/archivos |
| `rtk find <dir>` | `find <dir>` | Árbol estructurado sin rutas redundantes |
| `rtk npm test` | `npm test` | Suprime encabezados de npm y muestra solo fallos/resumen |
| `rtk vitest` | `vitest run` | Filtra logs y muestra resultados esenciales |
| `rtk docker ps` | `docker ps` | Tabla condensada sin columnas truncadas |
| `rtk kubectl get ...` | `kubectl get ...` | Salida limpia optimizada para contexto de LLM |

---

## 📊 Métricas de Ahorro y Modo Proxy

```bash
# Ver el ahorro acumulado de tokens
rtk gain

# Ejecutar un comando sin filtro pero auditando el ahorro
rtk proxy <comando>

# Deshabilitar temporalmente RTK
RTK_DISABLED=1 <comando>
```

---

## 🤖 Directiva para el Agente Antigravity
Todo comando de terminal propuesto por Antigravity DEBE incluir el prefijo `rtk` siempre que esté disponible en la máquina del usuario. Si el usuario reporta que no tiene `rtk` instalado, guiarlo con `brew install rtk` o el script shim local provisto en el repositorio.
