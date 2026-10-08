# ==========================================
# Etapa 1: Builder (Compilación y dependencias)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json tsconfig.json ./
RUN npm ci

COPY src/ ./src
RUN npm run build
RUN npm prune --production

# ==========================================
# Etapa 2: Runtime (Imagen final hiperoptimizada <90MB)
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV PORT=8080

# Usuario no-root para seguridad en GKE
USER node

COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
COPY --chown=node:node package*.json ./

EXPOSE 8080

CMD ["node", "dist/index.js"]
