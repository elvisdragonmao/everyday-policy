FROM node:24.15.0-bookworm-slim AS build

WORKDIR /workspace
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/contracts/package.json packages/contracts/
COPY packages/crawler/package.json packages/crawler/
RUN pnpm install --frozen-lockfile

COPY tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages
RUN pnpm build && pnpm --filter @everyday-policy/api deploy --prod /out

FROM node:24.15.0-bookworm-slim AS runtime

ENV NODE_ENV=production \
    WEB_ROOT=/app/public

WORKDIR /app
COPY --chown=node:node --from=build /out/ ./
COPY --chown=node:node --from=build /workspace/apps/web/dist/ ./public/

USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
