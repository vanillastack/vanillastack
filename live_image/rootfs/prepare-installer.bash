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

apt-get update && apt-get install -y --no-install-recommends \
    debootstrap \
    squashfs-tools \
    xorriso \
    isolinux \
    syslinux-efi \
    grub-pc-bin \
    grub-efi-amd64-bin \
    mtools \
    live-build

apt-get install -y --no-install-recommends mc aptitude screen curl openssl apt-transport-https ca-certificates gnupg-agent software-properties-common less

mkdir -p /LIVE_BOOT

curl -fsSL https://download.docker.com/linux/debian/gpg > /live-build/config/archives/docker.key.chroot


