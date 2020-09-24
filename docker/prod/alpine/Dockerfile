FROM node:alpine3.12 as base
MAINTAINER maintainer_name "jurlind.budurushi@cloudical.io"

## Setting up Env
ENV PORT=8080
ENV IP=localhost
ENV NODE_ENV=development
ENV MODE=installer
ENV DEBUG=false
ENV TESTING=false
ARG ANSIBLEPATH='/tmp/ansible'
ENV ANSIBLEPATH ${ANSIBLEPATH}
EXPOSE ${PORT}
WORKDIR /usr/workdir

## Copy package files
COPY ./backend/package.json ./
COPY ./ansible/requirements.txt ./

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
    ansible-galaxy collection install community.kubernetes && \
    npm install && npm audit fix && \
    rm -rf /var/cache/apk*

FROM base

## copy app files
COPY ./backend/vue.config.js ./
COPY ./backend/src ./src/
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

## Install npm Modules
## Build and prep Frontend
RUN  rm -rf ./dist/* && npm run build \
    && rm -rf ./src/public/* && cp -r ./dist/* ./src/public

## Run nginx and backend
CMD ["npm", "run", "start"]
