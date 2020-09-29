FROM node:lts-buster-slim
LABEL maintainer_name="jeff.chousterman@cloudical.io"

## Setting up Env
ENV PORT=8080
ENV IP=localhost
ENV NODE_ENV=development
ENV MODE=installer
ENV DOCKER=true
ENV DEBUG=true
ARG ANSIBLEPATH='/tmp/ansible'
ENV ANSIBLEPATH ${ANSIBLEPATH}
EXPOSE ${PORT}
WORKDIR /usr/workdir

## Copy package files
COPY ./backend/package.json ./
COPY ./ansible/requirements.txt ./

## Install Packages, Ansible and pre-req
RUN apt-get update && apt-get dist-upgrade -y && apt-get install -y \
    openssh-client python3-pip && \
    rm -rf /var/lib/apt/lists/* && \
    pip3 install ansible && \
    pip3 install -r requirements.txt && \
    ansible-galaxy collection install community.kubernetes && \
    ansible-galaxy collection install community.general && \
    npm install && npm audit fix

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

## Run nginx and backend
CMD ["npm", "run", "dockerdev"]
