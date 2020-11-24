FROM node:14.10.1-alpine AS BUILD_IMAGE

WORKDIR /src/app

COPY package.json /src/app/package.json
COPY lerna.json /src/app/lerna.json
COPY ./packages/@foodbudget/ /src/app/packages/@foodbudget/
RUN yarn

COPY tsconfig.json /src/app/tsconfig.json
COPY .env /src/app/.env

RUN yarn setup

RUN yarn generate

FROM node:14.10.1-alpine AS BUILD_API_IMAGE

WORKDIR /src/app

COPY --from=BUILD_IMAGE /src/app/packages/@foodbudget/backend/api/ /src/app/
COPY --from=BUILD_IMAGE /src/app/.env /src/app/.env
RUN yarn --production

COPY --from=BUILD_IMAGE /src/app/packages/@foodbudget/backend/logger/node_modules/ /src/app/node_modules/@foodbudget/logger/node_modules/
COPY --from=BUILD_IMAGE /src/app/packages/@foodbudget/backend/logger/dist/ /src/app/node_modules/@foodbudget/logger/dist/
COPY --from=BUILD_IMAGE /src/app/packages/@foodbudget/backend/logger/package.json /src/app/node_modules/@foodbudget/logger/package.json

COPY --from=BUILD_IMAGE /src/app/packages/@foodbudget/backend/errors/node_modules/ /src/app/node_modules/@foodbudget/errors/node_modules/
COPY --from=BUILD_IMAGE /src/app/packages/@foodbudget/backend/errors/dist/ /src/app/node_modules/@foodbudget/errors/dist/
COPY --from=BUILD_IMAGE /src/app/packages/@foodbudget/backend/errors/package.json /src/app/node_modules/@foodbudget/errors/package.json

FROM node:14.10.1-alpine

COPY --from=BUILD_API_IMAGE /src/app/prisma/ ./prisma/
COPY --from=BUILD_API_IMAGE /src/app/dist/ ./dist/
COPY --from=BUILD_API_IMAGE /src/app/node_modules/ ./node_modules/
COPY --from=BUILD_API_IMAGE /src/app/.env ./.env

CMD node ./dist/src/app.js
