# Build from monorepo root: docker compose build backend
FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/shared ./packages/shared/
COPY backend ./backend/

# Probably not going to be needed later but for now it's here
COPY frontend ./frontend/

RUN npm ci

RUN npm run build -w @zhimiry/shared

WORKDIR /app/backend
RUN npx prisma generate && npx tsc

EXPOSE 4001
# Might have to change later because runs schema migrations on all container restarts
CMD ["sh", "-c", "npx prisma db push && node dist/index.js"]
