# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps-dev
COPY package*.json ./
RUN npm ci

FROM base AS build
COPY --from=deps-dev /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS deps-prod
COPY package*.json ./
RUN npm ci --omit=dev

FROM base AS runtime
ENV NODE_ENV=production
USER node

COPY --chown=node:node package*.json ./ 
COPY --chown=node:node --from=deps-prod /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/server.js ./server.js
EXPOSE 3000
CMD ["npm", "start"]
