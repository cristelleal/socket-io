FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN DATABASE_URL=postgresql://x:x@x:5432/x npx prisma generate
RUN npm run build

FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./src/generated
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts

EXPOSE 3000

# Lance les migrations puis démarre le serveur
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
