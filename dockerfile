# 1. Dependencias
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2. Builder
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Solo declaras las variables PÚBLICAS
ARG NEXT_PUBLIC_SITE_URL
ARG API_PAYPHONE
ARG DIRECTUS_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV API_PAYPHONE=$API_PAYPHONE
ENV DIRECTUS_URL=$DIRECTUS_URL

RUN npm run build

# 3. Runner / Producción
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=PRODUCTION
ENV PORT=3002
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3002

CMD ["node", "server.js"]