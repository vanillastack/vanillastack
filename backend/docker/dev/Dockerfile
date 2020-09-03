FROM node:lts-buster-slim
MAINTAINER maintainer_name "jeff.chousterman@cloudical.io"

## Install node, npm, Ansible
#RUN echo "deb http://ppa.launchpad.net/ansible/ansible/ubuntu bionic main" | tee -a /etc/apt/sources.list && \
#apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 93C4A3FD7BB9C367
RUN apt update && apt upgrade
RUN apt install -y build-essential curl openssh-client python3-pip
RUN pip3 install ansible

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
