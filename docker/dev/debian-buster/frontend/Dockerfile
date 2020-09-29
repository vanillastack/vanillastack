FROM node:lts-buster-slim
LABEL maintainer_name="jeff.chousterman@cloudical.io"

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
    ansible-galaxy collection install community.general && \
    rm -rf /var/lib/apt/lists/* 

## copy app files
COPY ./backend/package.json /usr/workdir/
COPY ./backend/src /usr/workdir/src/
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

## Run nginx and backend
CMD ["npm", "run", "start"]
