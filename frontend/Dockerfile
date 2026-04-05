# Build from monorepo root: docker compose build frontend
FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/shared ./packages/shared/
COPY frontend ./frontend/

RUN npm ci

RUN npm run build -w @zhimiry/shared

WORKDIR /app/frontend
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ARG NEXT_PUBLIC_API_URL=http://localhost:4001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
