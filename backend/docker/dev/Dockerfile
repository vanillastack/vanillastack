FROM node:lts-buster-slim
MAINTAINER maintainer_name "jeff.chousterman@cloudical.io"

## Install node, npm, Ansible
RUN apt update && apt upgrade
RUN apt install -y build-essential curl openssh-client ansible

## Install Environment
COPY ./package.json /usr/workdir/
WORKDIR /usr/workdir
RUN npm install

## Copy App Files
# COPY ../../app /usr/workdir/app

## Setting up Env
ENV PORT=3000
ENV IP=localhost
ENV NODE_ENV=development
ENV MODE=installer
EXPOSE ${PORT}

## Start App
CMD [ "npm", "run", "dockerdev" ]
