FROM alpine/git:v2.26.2 AS submodules

COPY ./.git /usr/workdir/.git
COPY ./ansible /usr/workdir/ansible
COPY ./.gitmodules /usr/workdir/
WORKDIR /usr/workdir

RUN git submodule update --init --recursive


FROM node:alpine3.12 AS build
LABEL maintainer="jeff.chousterman@cloudical.io"

COPY ./frontend/package.json /usr/workdir/
COPY ./frontend/vue.config.js /usr/workdir/
COPY ./frontend/public /usr/workdir/public
COPY ./frontend/src /usr/workdir/src

WORKDIR /usr/workdir
RUN npm install && npm audit fix

## Build Vue App
RUN npm run build


FROM node:alpine3.12
LABEL maintainer="jeff.chousterman@cloudical.io"

## Setting up Env
ENV PORT=8080
ENV IP=localhost
ENV NODE_ENV=development
ENV MODE=installer
ENV DEBUG=false
ARG ANSIBLEPATH='/tmp/ansible'
ENV ANSIBLEPATH ${ANSIBLEPATH}
EXPOSE ${PORT}
WORKDIR /usr/workdir

## Copy package files
COPY ./backend/package.json ./
COPY ./ansible/requirements.txt ./
COPY --from=submodules  /usr/workdir/ansible/collections/ansible_collections/community ${ANSIBLEPATH}/collections/ansible_collections/community

## Install nginx, Ansible and pre-req
RUN apk update && \
    apk upgrade --available && \
    sync && apk add --update --no-cache \
    openssh-client musl-dev libffi-dev openssl-dev ca-certificates \
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
COPY --from=build  /usr/workdir/dist ./public
COPY ./ansible ${ANSIBLEPATH}
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
