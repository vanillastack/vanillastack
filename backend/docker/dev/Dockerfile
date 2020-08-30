FROM node:lts-alpine

## Install Ansible
RUN apk update && \
apk add --no-cache ansible && \
rm -rf /tmp/* && \
rm -rf /var/cache/apk/*

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
