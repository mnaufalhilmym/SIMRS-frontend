FROM node:18 AS base

# FROM base AS deps
# WORKDIR /app
# COPY package.json .
# RUN npm i

# FROM base AS builder
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .
# COPY .env.prod ./.env
# RUN npm run build

FROM base AS deps-prod
WORKDIR /app
# COPY --from=deps /app/package.json .
COPY package.json .
RUN npm i vite@^4.3.9

FROM base AS runner
WORKDIR /app
COPY --from=deps-prod /app/package.json .
COPY --from=deps-prod /app/node_modules ./node_modules
COPY dist ./dist
CMD npm run serve-prod