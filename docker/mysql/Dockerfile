FROM mysql:5.7

COPY *.sql /docker-entrypoint-initdb.d/

CMD ["mysqld", "--sql-mode", "NO_ENGINE_SUBSTITUTION", "--max-allowed-packet", "32M"]
