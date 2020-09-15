#!/bin/bash -x
#set -e

#
#  Initialize build
#

pwd | tee $OUTPUT/build.log

mkdir -p ${WORKDIR}/build
cd ${WORKDIR}/build

lb clean | tee -a $OUTPUT/build.log

cp -a $WORKDIR/live-build/auto .
cp -a $WORKDIR/live-build/config .

#
# Preload installer image by starting docker and pulling it
#

/usr/bin/containerd &
sleep 2
/usr/bin/dockerd -p /run/dockerd.pid --containerd=/run/containerd/containerd.sock -D -b none --iptables=False &sleep 2
sleep 2

docker pull harbor.cloudical.net/vanillastack/installer  | tee -a $OUTPUT/build.log
mkdir -p config/includes.chroot/vanilla | tee -a $OUTPUT/build.log
docker save harbor.cloudical.net/vanillastack/installer | pixz -p 8 -9 > config/includes.chroot/vanilla/vanilla-installer.tar.xz

kill "$(cat /run/dockerd.pid)"
killall containerd

#
# Config live-build
#
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


#
# build the ISO
#

lb build 2>&1 | tee -a $OUTPUT/build.log

#
# upload and export
#

cp vanillastack-installer* $OUTPUT

if [[ -n "$AWS_SECRET_ACCESS_KEY" ]]
  then
    branch="pure_testing/"
    [[ -n "$CI_COMMIT_REF_NAME" ]] && branch="$CI_COMMIT_REF_NAME/"
    [[ "$branch" == "master/" ]] && branch=""

    mcli config host add vanilla https://s3.cloudical.net \
      $(echo $AWS_ACCESS_KEY_ID | base64 -d) \
      $(echo $AWS_SECRET_ACCESS_KEY | base64 -d) \
      && for I in $OUTPUT/vanillastack-installer*;
          do
            mcli cp $I vanilla/vanillastack-downloads-bkt-3d791dcf-fb62-49c7-a4cf-b153203e3ff2/iso/$branch || :
          done
  fi
#
# Content will be available via https://s3.cloudical.net/vanillastack-downloads-bkt-3d791dcf-fb62-49c7-a4cf-b153203e3ff2


