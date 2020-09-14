#!/bin/bash -x

set -e

pwd | tee $OUTPUT/build.log

mkdir -p ${WORKDIR}/build
cd ${WORKDIR}/build

lb clean | tee -a $OUTPUT/build.log

cp -a $WORKDIR/live-build/auto .
cp -a $WORKDIR/live-build/config .


#
#. The lazy way of making sure all necessary modules are loaded, by simply starting docker
#. and killing it again
#
/usr/bin/containerd &
sleep 2
/usr/bin/dockerd -p /run/dockerd.pid --containerd=/run/containerd/containerd.sock -D -b none --iptables=False &sleep 2
sleep 2

docker pull harbor.cloudical.net/vanillastack/vsinstaller  | tee -a $OUTPUT/build.log
mkdir -p config/includes.chroot/vanilla | tee -a $OUTPUT/build.log
docker save harbor.cloudical.net/vanillastack/vsinstaller | pixz -p 8 -9 > config/includes.chroot/vanilla/vanilla-installer.tar.xz

kill "$(cat /run/dockerd.pid)"
killall containerd


lb config --version | tee -a $OUTPUT/build.log

lb config noauto \
        --apt apt \
        --architecture amd64 \
        --apt-recommends false \
        --apt-source-archives false \
        --archive-areas "main contrib non-free" \
        --bootappend-live "boot=live components hostname=vanilla-installa username=vanilla locales=de_DE.UTF-8 keyboard-layouts=de" \
        --clean \
        --cache false \
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

#pwd
# if this works, it is one of the uggliest hacks ever.
# dockerd in the chroot will need its / as a dedicated mountpoint, which it
# wouldn't be, if we wouldn't bind-mount it
#mkdir chroot
#mount -o bind chroot chroot
#
# ensure to umount chroot before binary-stage
#echo "echo 'Hotpatch: trying to umount bindmount of chroot'" >> config/binary
#echo "umount ${WORKDIR}/build/chroot || true" >> config/binary

lb build 2>&1 | tee -a $OUTPUT/build.log

cp vanillastack-installer* $OUTPUT
