FROM node:lts-buster-slim
MAINTAINER maintainer_name "jeff.chousterman@cloudical.io"

## Install nginx, Ansible and pre-req
RUN apt update && apt install -y build-essential curl openssh-client python3-pip nginx && \
pip3 install ansible && \
rm -rf /var/lib/apt/lists/*

## copy app files
COPY ./package.json /usr/workdir/
COPY ./vue.config.js /usr/workdir/
COPY ./src /usr/workdir/src/
COPY ./public /usr/workdir/public/

## Setting up Env
ENV PORT=3000
ENV IP=localhost
ENV NODE_ENV=development
ENV MODE=installer
EXPOSE ${PORT}
WORKDIR /usr/workdir

## Install npm Modules
RUN npm install

## Build Frontend
RUN npm run build

## Prep nginx & Start/Restart nginx
COPY ./docker/dev/nginx.conf /etc/nginx/conf.d/
RUN mkdir -p /var/www/vsfrontend && cp -r ./dist/* /var/www/vsfrontend && /etc/init.d/nginx restart

#CMD ["nginx", "-g", "daemon off;"]
CMD ["npm", "run", "dockerdev"]
