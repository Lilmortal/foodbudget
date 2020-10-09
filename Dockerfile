FROM node:14.10.1

WORKDIR /src/app

COPY package.json /src/app/package.json
COPY tsconfig.json /src/app/tsconfig.json
COPY yarn.lock /src/app/yarn.lock
COPY lerna.json /src/app/lerna.json

COPY packages/@foodbudget/api/package.json /src/app/packages/@foodbudget/api/package.json

COPY packages/@foodbudget/api /src/app/packages/@foodbudget/api

RUN yarn

ADD https://github.com/palfrey/wait-for-db/releases/download/v1.0.0/wait-for-db-linux-x86 /src/app/wait-for-db
RUN chmod +x /src/app/wait-for-db
# RUN ./wait-for-db -m postgres -c postgresql://user:pass@foodbudget-db:5432 -t 1000000

# RUN yarn setup
# CMD ["yarn", "start"]
EXPOSE 8080