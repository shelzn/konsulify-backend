FROM oven/bun:1.3.14-alpine AS base

WORKDIR /app

ENV NODE_ENV=production

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY tsconfig.json drizzle.config.ts index.ts ./
COPY src ./src
COPY drizzle ./drizzle
COPY docs ./docs

RUN mkdir -p uploads/categories uploads/consultants uploads/services uploads/avatars

EXPOSE 3000

CMD ["bun", "run", "start"]
