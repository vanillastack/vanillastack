FROM debian:buster as Builder
MAINTAINER maintainer_name "jan.walzer@cloudical.io"

ARG WORKDIR
ENV WORKDIR ${WORKDIR:-/}

ARG OUTPUT
ENV OUTPUT=${OUTPUT:-/data}

RUN mkdir -p $WORKDIR

COPY rootfs /

#COPY ../ $WORKDIR/config/includes.chroot/home/vanilla/vanilla-src

RUN bash -x prepare-installer.bash

VOLUME $OUTPUT

CMD /build-installer.bash