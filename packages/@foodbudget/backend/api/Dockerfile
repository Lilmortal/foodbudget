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

# TODO: At the moment, it is picking up @foodbudget from npm repository instead of locally.
# RUN ls ./node_modules/@foodbudget/logger/

# COPY --from=BUILD_DIST /src/app/node_modules/@foodbudget/ /src/app/node_modules/@foodbudget/

# RUN ls ./node_modules/@foodbudget/logger/

FROM node:14.10.1-alpine

COPY --from=BUILD_API_IMAGE /src/app/prisma/ ./prisma/
COPY --from=BUILD_API_IMAGE /src/app/dist/ ./dist/
COPY --from=BUILD_API_IMAGE /src/app/node_modules/ ./node_modules/
COPY --from=BUILD_API_IMAGE /src/app/.env ./.env

CMD node ./dist/src/app.js
