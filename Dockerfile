FROM node:14.10.1

WORKDIR /src/app

# COPY package.json /src/app/package.json
# COPY tsconfig.json /src/app/tsconfig.json
# COPY yarn.lock /src/app/yarn.lock
# COPY lerna.json /src/app/lerna.json

# COPY packages/@foodbudget/api /src/app/packages/@foodbudget/api
# COPY packages/@foodbudget/logger /src/app/packages/@foodbudget/logger
# COPY .env /src/app/.env
# RUN yarn

ADD https://github.com/palfrey/wait-for-db/releases/download/v1.0.0/wait-for-db-linux-x86 /src/app/wait-for-db
RUN chmod +x /src/app/wait-for-db

COPY init.sh /src/app/init.sh
RUN chmod +x /src/app/init.sh
CMD /src/app/init.sh
