FROM node:lts-buster-slim as base
LABEL maintainer_name="jeff.chousterman@cloudical.io"

## Setting up Env
ENV PORT=8080
ENV IP=localhost
ENV NODE_ENV=development
ENV MODE=installer
ENV DEBUG=false
ARG ANSIBLEPATH='/tmp/ansible'
ENV ANSIBLEPATH ${ANSIBLEPATH}
ENV TESTING=false
EXPOSE ${PORT}
WORKDIR /usr/workdir

ENV \
  DEBIAN_FRONTEND=noninteractive \
  DEBIAN_CHROOT=docker \
  LANG=C.UTF-8 \
  LANGUAGE=C.UTF-8 \
  LC_CTYPE=C.UTF-8 \
  LC_NUMERIC=C.UTF-8 \
  LC_TIME=C.UTF-8 \
  LC_COLLATE=C.UTF-8 \
  LC_MONETARY=C.UTF-8 \
  LC_MESSAGES=C \
  LC_PAPER=C.UTF-8 \
  LC_NAME=C.UTF-8 \
  LC_ADDRESS=C.UTF-8 \
  LC_TELEPHONE=C.UTF-8 \
  LC_MEASUREMENT=C.UTF-8 \
  LC_IDENTIFICATION=C.UTF-8

## Copy package files
COPY ./backend/package.json ./
COPY ./ansible/requirements.txt ./

## Install Ansible and pre-req
RUN apt-get update && apt-get dist-upgrade -y && apt-get install -y \
    openssh-client python3-pip && \
    rm -rf /var/lib/apt/lists/* && \
    pip3 install ansible && \
    pip3 install -r requirements.txt && \
    ansible-galaxy collection install community.kubernetes && \
    ansible-galaxy collection install community.general && \
    npm install && npm audit fix

FROM base

## copy app files
COPY ./backend/vue.config.js ./
COPY ./backend/src ./src/
COPY ./ansible ${ANSIBLEPATH}
COPY ./version ./

RUN echo  '\n\
    #!/bin/bash\n\
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
