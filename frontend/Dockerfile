# ==========================================
# Etapa 1: Preparación de dependencias mínimas
# ==========================================
FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ==========================================
# Etapa 2: Runtime de producción
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=80

# Usuario no privilegiado para cumplimiento de seguridad en GKE
USER node

# Copia de dependencias y código estático/servidor
COPY --chown=node:node --from=dependencies /app/node_modules ./node_modules
COPY --chown=node:node package*.json ./
COPY --chown=node:node server.js index.html style.css load.js main.js store.js dom-elements.js ./
COPY --chown=node:node components/ ./components/
COPY --chown=node:node ui/ ./ui/
COPY --chown=node:node utils/ ./utils/

EXPOSE 80

CMD ["node", "server.js"]
