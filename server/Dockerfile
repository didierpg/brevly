FROM node:20-slim AS build

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY pnpm-lock.yaml package.json ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM node:20-slim AS run

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=build /usr/src/app/src/infra/db/migrations ./dist/migrations

RUN pnpm install --prod --frozen-lockfile

EXPOSE 3333

CMD ["node", "dist/server.js"]