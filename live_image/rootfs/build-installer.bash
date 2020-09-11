#!/bin/bash -x

set -e

mkdir -p ${WORKDIR}/build
cd ${WORKDIR}/build

pwd | tee $OUTPUT/build.log

lb clean | tee -a $OUTPUT/build.log

cp -a $WORKDIR/live-build/auto .
cp -a $WORKDIR/live-build/config .


lb config --version | tee -a $OUTPUT/build.log

lb config noauto \
        --apt apt \
        --architecture amd64 \
        --apt-recommends false \
        --apt-source-archives false \
        --archive-areas "main contrib non-free" \
        --bootappend-live "boot=live components hostname=vanilla-installa username=vanilla locales=de_DE.UTF-8 keyboard-layouts=de toram" \
        --clean \
        --mode debian \
        --compression xz \
        --debconf-frontend noninteractive \
        --debug \
        --debootstrap-options "--include=apt-transport-https,ca-certificates,openssl" \
        --distribution buster \
        --firmware-binary true \
        --firmware-chroot true \
        --image-name vanillastack-installer \
        --iso-application "VanillaStack Installer" \
        --iso-publisher "Cloudical: https://cloudical.io <vanilla@cloudical.io>" \
        --iso-volume "vanilla prerelase" \
        --memtest none \
        --source false \
        --verbose | tee -a $OUTPUT/build.log

lb build 2>&1 | tee -a $OUTPUT/build.log

cp vanillastack-installer* $OUTPUT
