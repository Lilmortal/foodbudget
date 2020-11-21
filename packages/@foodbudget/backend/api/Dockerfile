FROM node:14.10.1-alpine

WORKDIR /src/app

COPY ./packages/@foodbudget/backend/api/dist/ /src/app/
COPY ./packages/@foodbudget/backend/api/prisma/ /src/app/prisma/
COPY ./packages/@foodbudget/backend/api/package.json /src/app/package.json
COPY .env /src/app/.env

RUN yarn --production
RUN yarn generate
CMD node ./src/app.js
