FROM node:lts-buster-slim
MAINTAINER maintainer_name "jeff.chousterman@cloudical.io"

## Setting up Env
ENV PORT=8080
ENV IP=localhost
ENV NODE_ENV=development
ENV MODE=installer
EXPOSE ${PORT}
WORKDIR /usr/workdir

## Install nginx, Ansible and pre-req
RUN apt update && apt install -y \
    build-essential curl gnupg2 ca-certificates lsb-release \
    openssh-client python3-pip procps dos2unix gettext-base && \
    pip3 install ansible && \
    echo "deb http://nginx.org/packages/debian `lsb_release -cs` nginx" \
        | tee /etc/apt/sources.list.d/nginx.list && \
    curl -fsSL https://nginx.org/keys/nginx_signing.key | apt-key add - && \
    apt install nginx -y && \
    ansible-galaxy collection install community.kubernetes

## Copy entrypoint.sh
COPY ./docker/prod/entrypoint.sh /usr/workdir/entrypoint.sh
RUN dos2unix /usr/workdir/entrypoint.sh && apt --purge remove -y dos2unix && rm -rf /var/lib/apt/lists/*

## copy app files
COPY ./package.json /usr/workdir/
COPY ./vue.config.js /usr/workdir/
COPY ./src /usr/workdir/src/
COPY ./public /usr/workdir/public/

## Install npm Modules
RUN npm install && npm audit fix

## Build Frontend
RUN npm run build

## Prep nginx
COPY ./docker/prod/vsnginx.conf /etc/nginx/templates/vsnginx.conf.template
RUN mkdir -p /var/www/vsfrontend && cp -r ./dist/* /var/www/vsfrontend

## Run nginx and backend
CMD ./entrypoint.sh
