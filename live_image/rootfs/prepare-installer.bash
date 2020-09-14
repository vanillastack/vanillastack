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

PACKAGES_NEEDED="live-build xz-utils pixz procps psmisc"
PACKAGES_NEEDED+=" curl ca-certificates"
PACKAGES_NEEDED+=" gnupg gnupg-agent software-properties-common"

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


# try to avoid caching
sed -i '40s%lb bootstrap_cache save%#lb bootstrap_cache save%' /usr/lib/live/build/bootstrap



mkdir -p ${WORKDIR}
mkdir -p ${OUTPUT}

ls -l $WORKDIR

echo "deb [arch=amd64] https://download.docker.com/linux/debian buster stable" > /etc/apt/sources.list.d/docker.list

curl -fsSL https://download.docker.com/linux/debian/gpg > $WORKDIR/live-build/config/archives/docker.key.chroot
cat $WORKDIR/live-build/config/archives/docker.key.chroot | apt-key add -

apt-get update && apt-get install -y --no-install-recommends docker-ce docker-ce-cli containerd.io
