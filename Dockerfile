FROM postgres:12.4

COPY setup.sql /docker-entrypoint-initdb.d/10-init.sql