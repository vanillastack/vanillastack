FROM node:lts-alpine

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
EXPOSE ${PORT}

## Start App
CMD [ "npm", "run", "dockerdev" ]
