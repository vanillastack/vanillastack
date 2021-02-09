FROM node:alpine3.12
LABEL maintainer="jeff.chousterman@cloudical.io"

## Setting up Env
ENV PORT=8080
ENV IP=localhost
ENV NODE_ENV=development
ENV MODE=installer
ENV DEBUG=false
ENV KEYCLOAK_REALM='vsmanager'
ENV KEYCLOAK_CLIENT_ID='vsmanager-backend'
ENV KEYCLOAK_URL='http://keycloak.local:8080/auth'
ARG ANSIBLE_PATH='/tmp/ansible'
ENV ANSIBLE_PATH ${ANSIBLE_PATH}
EXPOSE ${PORT}
WORKDIR /usr/workdir

## Copy package files
COPY ./backend/package.json ./
COPY ./ansible/requirements.txt ./

## Install nginx, Ansible and pre-req
RUN apk update && \
    apk upgrade --available && \
    sync && apk add --update --no-cache \
    openssh-client curl musl-dev libffi-dev openssl-dev ca-certificates \
    python3 py3-pip python3-dev \
    gcc make --virtual build-dependencies build-base && \
    pip3 install cffi && \
    pip3 install ansible && \
    pip3 install -r requirements.txt && \
    npm install && npm audit fix && \
    rm -rf /var/cache/apk*

## copy app files
#COPY ./backend/vue.config.js ./
COPY ./backend/src ./src/
# COPY --from=build  /usr/workdir/dist ./public
COPY ./ansible ${ANSIBLE_PATH}
COPY ./version ./

RUN echo -e '\n\
    #!/bin/sh\n\
    filename=$1\n\
    while read line; do\n\
    echo "$line"\n\
    sleep 0.2\n\
    done <$filename\n\
    \n'\
    > /usr/workdir/src/templates/dry-run_setup.sh && \
    chmod +x /usr/workdir/src/templates/dry-run_setup.sh

## Run nginx and backend
CMD ["npm", "run", "dockerdebug"]