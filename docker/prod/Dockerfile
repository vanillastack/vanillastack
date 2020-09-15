FROM node:lts-buster-slim
LABEL maintainer_name="jeff.chousterman@cloudical.io"

## Setting up Env
ENV PORT=8080
ENV IP=localhost
ENV NODE_ENV=development
ENV MODE=installer
EXPOSE ${PORT}
WORKDIR /usr/workdir

## Install nginx, Ansible and pre-req
RUN apt update && apt upgrade -y && apt install -y \
    openssh-client python3-pip && \
    rm -rf /var/lib/apt/lists/* && \
    pip3 install ansible && \
    ansible-galaxy collection install community.kubernetes

## copy app files
COPY ./backend/package.json ./
COPY ./backend/vue.config.js ./
COPY ./backend/src ./src/
COPY ./backend/public ./public/
COPY ./ansible /usr/workdir/ansible/

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
RUN npm install && npm audit fix

## Build and prep Frontend
RUN rm -rf ./dist/* && npm run build
RUN rm -rf ./src/public/* && cp -r ./dist/* ./src/public

## Run nginx and backend
CMD ["npm", "run", "start"]
