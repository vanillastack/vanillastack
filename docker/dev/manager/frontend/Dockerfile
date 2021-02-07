FROM node:alpine3.12 AS build
LABEL maintainer="jeff.chousterman@cloudical.io"

COPY ./frontend/package.json /usr/workdir/
COPY ./frontend/package-lock.json /usr/workdir/
COPY ./frontend/vue.config.js /usr/workdir/
COPY ./frontend/public /usr/workdir/public
COPY ./frontend/src /usr/workdir/src

WORKDIR /usr/workdir
RUN npm install && npm audit fix

## Build Vue App
RUN npm run build

FROM nginx:1.19.6-alpine

ENV PORT=8080
ENV BACKEND_URL="8080"
ENV BACKEND_PORT="http://backend"
ENV KEYCLOAK_URL="http://keycloak.local:8080"
EXPOSE ${PORT}
WORKDIR /usr/share/nginx/html

COPY ./docker/dev/manager/frontend/vsnginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build  /usr/workdir/dist /usr/share/nginx/html

CMD ["nginx-debug", "-g", "daemon off;"]