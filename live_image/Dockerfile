FROM debian:buster as Builder
MAINTAINER maintainer_name "jan.walzer@cloudical.io"

RUN mkdir -p /LIVE_BOOT

COPY rootfs /

RUN bash -x prepare-installer.bash

# Monkeypatching because Bug
# https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=919659#25
RUN sed -i '1161s%umount%#umount%' /usr/share/debootstrap/functions

WORKDIR /LIVE_BOOT

VOLUME /data