#!/bin/bash

set -e

export DEBIAN_FRONTEND=noninteractive
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

PACKAGES_NEEDED="live-build xz-utils pixz procps psmisc cpio pv"
PACKAGES_NEEDED+=" curl ca-certificates git"
PACKAGES_NEEDED+=" gnupg gnupg-agent software-properties-common"

PACKAGES_DEBUG="mc less"
PACKAGES_DEBUG+=" aptitude"
PACKAGES_DEBUG+=" screen"
PACKAGES_DEBUG+=" live-boot live-boot-doc live-config live-config-doc"

_DEBUG=false

apt-get update && apt-get install -y --no-install-recommends $PACKAGES_NEEDED
[[ "$DEBUG" == TRUE ]] && :; apt-get install -y --no-install-recommends $PACKAGES_DEBUG
[[ "$DEBUG" == TRUE ]] && _DEBUG=true

# Monkeypatching because Bug
# https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=919659#25
sed -i '1161s%umount%#umount%' /usr/share/debootstrap/functions

mkdir -p ${WORKDIR}
mkdir -p ${OUTPUT}

# Docker Repo
#echo "deb [arch=amd64] https://download.docker.com/linux/debian buster stable" > /etc/apt/sources.list.d/docker.list
curl -fsSL https://download.docker.com/linux/debian/gpg > $WORKDIR/live-build/config/archives/docker.key.chroot
#cat $WORKDIR/live-build/config/archives/docker.key.chroot | apt-key add -

# Skopeo Repo
echo 'deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/Debian_10/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
curl -L 'https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/Debian_10/Release.key' | apt-key add -


#apt-get update && apt-get install -y --no-install-recommends docker-ce docker-ce-cli containerd.io skopeo
apt-get update && apt-get install -y --no-install-recommends skopeo

wget https://dl.min.io/client/mc/release/linux-amd64/mc -O /usr/local/bin/mcli
chmod +x /usr/local/bin/mcli
