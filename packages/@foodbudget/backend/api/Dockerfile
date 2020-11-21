FROM node:14.10.1

WORKDIR /src/app

# ADD https://github.com/palfrey/wait-for-db/releases/download/v1.0.0/wait-for-db-linux-x86 /src/app/wait-for-db
# RUN chmod +x /src/app/wait-for-db

# COPY init.sh /src/app/init.sh
# RUN chmod +x /src/app/init.sh

# COPY package.json lerna.json yarn.lock ./
COPY ./packages/@foodbudget/backend/api/dist/ /src/app/
COPY ./packages/@foodbudget/backend/api/prisma/ /src/app/prisma/
COPY ./packages/@foodbudget/backend/api/package.json /src/app/package.json
COPY .env /src/app/.env

RUN yarn --production
RUN yarn generate
CMD node ./src/app.js
# RUN yarn
# CMD yarn workspace @foodbudget/api start
# CMD /src/app/init.sh
