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

COPY --from=BUILD_IMAGE /src/app/packages/@foodbudget/backend/jobs/ /src/app/
COPY --from=BUILD_IMAGE /src/app/.env /src/app/.env
RUN yarn --production

COPY --from=BUILD_IMAGE /src/app/node_modules/.prisma/client/ /src/app/node_modules/.prisma/client/
COPY --from=BUILD_IMAGE /src/app/packages/@foodbudget/backend/api/prisma/ /src/app/node_modules/@foodbudget/api/prisma/
COPY --from=BUILD_IMAGE /src/app/packages/@foodbudget/backend/api/node_modules/ /src/app/node_modules/@foodbudget/api/node_modules/
COPY --from=BUILD_IMAGE /src/app/packages/@foodbudget/backend/api/dist/ /src/app/node_modules/@foodbudget/api/dist/
COPY --from=BUILD_IMAGE /src/app/packages/@foodbudget/backend/api/package.json /src/app/node_modules/@foodbudget/api/package.json

COPY --from=BUILD_IMAGE /src/app/packages/@foodbudget/backend/email/node_modules/ /src/app/node_modules/@foodbudget/email/node_modules/
COPY --from=BUILD_IMAGE /src/app/packages/@foodbudget/backend/email/dist/ /src/app/node_modules/@foodbudget/email/dist/
COPY --from=BUILD_IMAGE /src/app/packages/@foodbudget/backend/email/package.json /src/app/node_modules/@foodbudget/email/package.json

COPY --from=BUILD_IMAGE /src/app/packages/@foodbudget/backend/logger/node_modules/ /src/app/node_modules/@foodbudget/logger/node_modules/
COPY --from=BUILD_IMAGE /src/app/packages/@foodbudget/backend/logger/dist/ /src/app/node_modules/@foodbudget/logger/dist/
COPY --from=BUILD_IMAGE /src/app/packages/@foodbudget/backend/logger/package.json /src/app/node_modules/@foodbudget/logger/package.json

COPY --from=BUILD_IMAGE /src/app/packages/@foodbudget/backend/errors/node_modules/ /src/app/node_modules/@foodbudget/errors/node_modules/
COPY --from=BUILD_IMAGE /src/app/packages/@foodbudget/backend/errors/dist/ /src/app/node_modules/@foodbudget/errors/dist/
COPY --from=BUILD_IMAGE /src/app/packages/@foodbudget/backend/errors/package.json /src/app/node_modules/@foodbudget/errors/package.json

FROM node:14.10.1-alpine

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY --from=BUILD_API_IMAGE /src/app/dist/ ./dist/
COPY --from=BUILD_API_IMAGE /src/app/node_modules/ ./node_modules/
COPY --from=BUILD_API_IMAGE /src/app/.env ./.env

CMD node ./dist/src/index.js
