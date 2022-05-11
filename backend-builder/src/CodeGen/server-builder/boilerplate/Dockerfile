FROM node:lts-alpine3.13 AS install_stage
WORKDIR /app
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install

FROM node:lts-alpine3.13 AS build_stage
WORKDIR /app
ADD . .
COPY package.json package.json
COPY --from=install_stage /app/node_modules node_modules
RUN yarn build

FROM node:lts-alpine3.13
EXPOSE 4000/tcp
WORKDIR /app
COPY package.json package.json
COPY --from=build_stage /app/node_modules node_modules
COPY --from=build_stage /app/dist dist
ENTRYPOINT [ "node", "/app/dist/index.js" ]