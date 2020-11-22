FROM node:14.10.1-alpine AS BUILD_IMAGE

WORKDIR /src/app

COPY ./packages/@foodbudget/backend/api/dist/ /src/app/dist/
COPY ./packages/@foodbudget/backend/api/prisma/ /src/app/prisma/
COPY ./packages/@foodbudget/backend/api/package.json /src/app/package.json
COPY ./packages/@foodbudget/backend/api/yarn.lock /src/app/yarn.lock
COPY .env /src/app/.env

RUN yarn --production
RUN yarn generate

FROM node:14.10.1-alpine

COPY --from=BUILD_IMAGE /src/app/prisma/ ./prisma/
COPY --from=BUILD_IMAGE /src/app/dist/ ./dist/
COPY --from=BUILD_IMAGE /src/app/node_modules/ ./node_modules/
COPY --from=BUILD_IMAGE /src/app/.env ./.env

CMD node ./dist/src/app.js
