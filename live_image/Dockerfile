FROM debian:buster as Builder
MAINTAINER maintainer_name "jan.walzer@cloudical.io"

ARG WORKDIR
ENV WORKDIR "${WORKDIR:-/}"

ARG OUTPUT
ENV OUTPUT="${OUTPUT:-/data}"

ARG DEBUG
ENV DEBUG="${DEBUG}"

ARG CI_COMMIT_SHA
ENV CI_COMMIT_SHA="${CI_COMMIT_SHA:-}"
ARG CI_COMMIT_BRANCH
ENV CI_COMMIT_BRANCH="${CI_COMMIT_BRANCH:-}"

RUN mkdir -p $WORKDIR


COPY rootfs /
RUN bash prepare-installer.bash

# once again because of our fixes
COPY rootfs /

VOLUME $OUTPUT

CMD /build-installer.bash