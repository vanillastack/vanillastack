#!/bin/bash

set -e

export DEBIAN_FRONTEND=noninteractive
#export DEBIAN_CHROOT=docker
export LANG=C.UTF-8
export LANGUAGE=C.UTF-8
export LC_CTYPE=C.UTF-8
export LC_NUMERIC=C.UTF-8
export LC_TIME=C.UTF-8
export LC_COLLATE=C.UTF-8
export LC_MONETARY=C.UTF-8
export LC_MESSAGES=C
export LC_PAPER=C.UTF-8
export LC_NAME=C.UTF-8
export LC_ADDRESS=C.UTF-8
export LC_TELEPHONE=C.UTF-8
export LC_MEASUREMENT=C.UTF-8
export LC_IDENTIFICATION=C.UTF-8

PACKAGES_NEEDED="live-build xz-utils"
PACKAGES_NEEDED+=" curl ca-certificates"
PACKAGES_NEEDED+=" "

PACKAGES_DEBUG="mc less"
PACKAGES_DEBUG+=" aptitude"
PACKAGES_DEBUG+=" screen"
PACKAGES_DEBUG+=" live-boot live-boot-doc live-config live-config-doc"
PACKAGES_DEBUG+=" "
PACKAGES_DEBUG+=" "
PACKAGES_DEBUG+=" "
PACKAGES_DEBUG+=" "
PACKAGES_DEBUG+=" "

apt-get update && apt-get install -y --no-install-recommends $PACKAGES_NEEDED $PACKAGES_DEBUG


# Monkeypatching because Bug
# https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=919659#25
sed -i '1161s%umount%#umount%' /usr/share/debootstrap/functions

mkdir -p ${WORKDIR}
mkdir -p ${OUTPUT}

ls -l $WORKDIR

curl -fsSL https://download.docker.com/linux/debian/gpg > $WORKDIR/live-build/config/archives/docker.key.chroot


