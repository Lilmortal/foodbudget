FROM node:14.10.1

WORKDIR /src/app

ADD https://github.com/palfrey/wait-for-db/releases/download/v1.0.0/wait-for-db-linux-x86 /src/app/wait-for-db
RUN chmod +x /src/app/wait-for-db

COPY init.sh /src/app/init.sh
RUN chmod +x /src/app/init.sh
CMD /src/app/init.sh
