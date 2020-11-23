FROM node:14.10.1-alpine AS BUILD_DIST

WORKDIR /src/app

COPY package.json /src/app/package.json
# COPY yarn.lock /src/app/yarn.lock
COPY lerna.json /src/app/lerna.json
COPY tsconfig.json /src/app/tsconfig.json
COPY ./packages/@foodbudget/ /src/app/packages/@foodbudget/
COPY .env /src/app/.env

RUN yarn install
RUN yarn build

RUN ls ./node_modules/@foodbudget/logger/
RUN yarn generate

RUN ls ./node_modules/@foodbudget/logger/

FROM node:14.10.1-alpine AS BUILD_IMAGE

WORKDIR /src/app

COPY --from=BUILD_DIST /src/app/packages/@foodbudget/backend/api/ /src/app/
COPY --from=BUILD_DIST /src/app/.env /src/app/.env

RUN yarn install --production

RUN ls ./node_modules/@foodbudget/logger/

COPY --from=BUILD_DIST /src/app/node_modules/@foodbudget/ /src/app/node_modules/@foodbudget/

RUN ls ./node_modules/@foodbudget/logger/
FROM node:14.10.1-alpine

COPY --from=BUILD_IMAGE /src/app/prisma/ ./prisma/
COPY --from=BUILD_IMAGE /src/app/dist/ ./dist/
COPY --from=BUILD_IMAGE /src/app/node_modules/ ./node_modules/
COPY --from=BUILD_IMAGE /src/app/.env ./.env

CMD node ./dist/src/app.js
