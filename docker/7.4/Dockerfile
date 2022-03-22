FROM ubuntu:20.04

LABEL maintainer="Alex Mayer"

ARG NODE_VERSION=16
ARG WWWGROUP

WORKDIR /srv/http

ENV DEBIAN_FRONTEND noninteractive
ENV TZ UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update \
    && apt-get install -y gnupg gosu curl ca-certificates zip unzip git supervisor sqlite3 \
    && mkdir -pm 700 ~/.gnupg \
    && echo "disable-ipv6" >> ~/.gnupg/dirmngr.conf \
    && apt-key adv --homedir ~/.gnupg --keyserver hkps://keyserver.ubuntu.com --recv-keys 14AA40EC0831756756D7F66C4F4EA0AAE5267A6C \
    && echo "deb https://ppa.launchpadcontent.net/ondrej/php/ubuntu focal main" > /etc/apt/sources.list.d/ppa_ondrej_php.list \
    && apt-get update \
    && apt-get install -y nginx php7.4-fpm php7.4-cli \
       php7.4-pgsql php7.4-sqlite3 php7.4-gd \
       php7.4-curl php7.4-memcached \
       php7.4-imap php7.4-mysql php7.4-mbstring \
       php7.4-xml php7.4-zip php7.4-bcmath php7.4-soap \
       php7.4-intl php7.4-readline php7.4-xdebug php7.4-pcov \
       php7.4-msgpack php7.4-igbinary php7.4-ldap \
       php7.4-redis \
       mysql-client \
       fontconfig libxrender1 xfonts-base xfonts-75dpi \
    && php -r "readfile('http://getcomposer.org/installer');" | php -- --install-dir=/usr/bin/ --filename=composer \
    && curl -sL "https://deb.nodesource.com/setup_$NODE_VERSION.x" | bash - \
    && apt-get install -y nodejs \
    && curl -Lo /tmp/wkhtmltox_0.12.6-1.focal_$(dpkg --print-architecture).deb https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6-1/wkhtmltox_0.12.6-1.focal_$(dpkg --print-architecture).deb \
    && dpkg -i /tmp/wkhtmltox_0.12.6-1.focal_$(dpkg --print-architecture).deb \
    && apt-get -y autoremove \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
    && printf '[mysqldump]\ncolumn-statistics=0\n' > /etc/my.cnf \
    && sed -i "s/pm\.max_children = .*/pm.max_children = 20/" /etc/php/7.4/fpm/pool.d/www.conf \
    && sed -i "s/pm\.start_servers = .*/pm.start_servers = 10/" /etc/php/7.4/fpm/pool.d/www.conf \
    && sed -i "s/pm\.min_spare_servers = .*/pm.min_spare_servers = 5/" /etc/php/7.4/fpm/pool.d/www.conf \
    && sed -i "s/pm\.max_spare_servers = .*/pm.max_spare_servers = 10/" /etc/php/7.4/fpm/pool.d/www.conf \
    && echo "daemon off;" >> /etc/nginx/nginx.conf \
    && ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log \
    && sed -i 's/^;daemonize.*$/daemonize = no/g' /etc/php/7.4/fpm/php-fpm.conf \
    && sed -i 's@^error_log.*$@error_log = /proc/self/fd/2@g' /etc/php/7.4/fpm/php-fpm.conf \
    && echo "\n; Allow Galley to set env vars for local dev\nclear_env=false" >> /etc/php/7.4/fpm/php-fpm.conf

RUN groupadd --force -g $WWWGROUP galley
RUN useradd -ms /bin/bash --no-user-group -g $WWWGROUP -u 1337 galley

COPY default /etc/nginx/sites-available/default
COPY xdebug.ini /etc/php/7.4/mods-available/xdebug.ini
COPY php.ini /etc/php/7.4/fpm/conf.d/99-galley.ini
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY start-container /usr/local/bin/start-container
RUN chmod +x /usr/local/bin/start-container

EXPOSE 80

ENTRYPOINT ["start-container"]
