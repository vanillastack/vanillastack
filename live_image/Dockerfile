FROM debian:buster as Builder
MAINTAINER maintainer_name "jan.walzer@cloudical.io"

ARG WORKDIR
ENV WORKDIR "${WORKDIR:-/}"

ARG OUTPUT
ENV OUTPUT="${OUTPUT:-/data}"

ARG DEBUG
ENV DEBUG="${DEBUG}"

RUN mkdir -p $WORKDIR


COPY rootfs /
RUN bash prepare-installer.bash

# once again because of our fixes
COPY rootfs /

VOLUME $OUTPUT

CMD /build-installer.bash