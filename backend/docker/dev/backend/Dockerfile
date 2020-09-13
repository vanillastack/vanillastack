FROM node:lts-buster-slim
MAINTAINER maintainer_name "jeff.chousterman@cloudical.io"

## Setting up Env
ENV PORT=8080
ENV IP=localhost
ENV NODE_ENV=development
ENV MODE=installer
#ENV ANSIBLE_HOST_KEY_CHECKING=false
#ENV ANSIBLE_LOAD_CALLBACK_PLUGINS=true
#ENV ANSIBLE_STDOUT_CALLBACK=json

EXPOSE ${PORT}
WORKDIR /usr/workdir

## Install nginx, Ansible and pre-req
RUN apt update && apt install -y \
    openssh-client python3-pip && \
    pip3 install ansible && \
    ansible-galaxy collection install community.kubernetes && \
    rm -rf /var/lib/apt/lists/*

## copy app files
COPY ./package.json /usr/workdir/
COPY ./src /usr/workdir/src/

## Install npm Modules
RUN npm install && npm audit fix

## Run nginx and backend
CMD ["npm", "run", "dockerdev"]
