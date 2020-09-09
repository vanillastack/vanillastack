FROM debian:buster as Builder
MAINTAINER maintainer_name "jan.walzer@cloudical.io"

ENV \
  DEBIAN_FRONTEND=noninteractive \
  DEBIAN_CHROOT=docker \
  LANG=C.UTF-8 \
  LANGUAGE=C.UTF-8 \
  LC_CTYPE=C.UTF-8 \
  LC_NUMERIC=C.UTF-8 \
  LC_TIME=C.UTF-8 \
  LC_COLLATE=C.UTF-8 \
  LC_MONETARY=C.UTF-8 \
  LC_MESSAGES=C \
  LC_PAPER=C.UTF-8 \
  LC_NAME=C.UTF-8 \
  LC_ADDRESS=C.UTF-8 \
  LC_TELEPHONE=C.UTF-8 \
  LC_MEASUREMENT=C.UTF-8 \
  LC_IDENTIFICATION=C.UTF-8


RUN apt-get update && apt-get install -y --no-install-recommends \
    debootstrap \
    squashfs-tools \
    xorriso \
    isolinux \
    syslinux-efi \
    grub-pc-bin \
    grub-efi-amd64-bin \
    mtools


RUN mkdir -p /LIVE_BOOT

FROM Builder as Installer

RUN debootstrap \
    --arch=amd64 \
    --variant=minbase \
    buster \
    /LIVE_BOOT/chroot \
    http://ftp.us.debian.org/debian/

COPY install_chroot.bash /LIVE_BOOT/chroot/root/

RUN chroot /LIVE_BOOT/chroot root/install_chroot.bash

FROM Installer as LiveImage

RUN mkdir -p /LIVE_BOOT/tmp
RUN mkdir -p /LIVE_BOOT/staging/EFI/boot
RUN mkdir -p /LIVE_BOOT/staging/boot/grub/x86_64-efi
RUN mkdir -p /LIVE_BOOT/staging/isolinux
RUN mkdir -p /LIVE_BOOT/staging/live

RUN ls -l /LIVE_BOOT

RUN mksquashfs \
    /LIVE_BOOT/chroot \
    /LIVE_BOOT/staging/live/filesystem.squashfs \
    -e boot

RUN cp /LIVE_BOOT/chroot/boot/vmlinuz-*  /LIVE_BOOT/staging/live/vmlinuz && \
    cp /LIVE_BOOT/chroot/boot/initrd.img-* /LIVE_BOOT/staging/live/initrd

COPY isolinux.cfg /
COPY grub.cfg /
COPY grub-standalone.cfg /

RUN touch /LIVE_BOOT/staging/DEBIAN_CUSTOM

RUN apt-get install -y --no-install-recommends \
    syslinux \
    syslinux-efi \
    grub-pc-bin \
    grub-efi-amd64-bin \
    dosfstools


RUN dpkg -L isolinux
RUN dpkg -L syslinux
RUN dpkg -L syslinux-efi

RUN ls -l /usr/lib/SYSLINUX.EFI
RUN ls -l /usr/lib/SYSLINUX
RUN ls -l /usr/lib/ISOLINUX



RUN cp /usr/lib/ISOLINUX/isolinux.bin "/LIVE_BOOT/staging/isolinux/"
RUN cp /usr/lib/SYSLINUX.EFI/efi64/* "/LIVE_BOOT/staging/isolinux/"
RUN cp /usr/lib/SYSLINUX/* "/LIVE_BOOT/staging/isolinux/"

RUN grub-mkstandalone \
    --format=x86_64-efi \
    --output=/LIVE_BOOT/tmp/bootx64.efi \
    --locales="" \
    --fonts="" \
    "boot/grub/grub.cfg=/LIVE_BOOT/tmp/grub-standalone.cfg"


RUN cd /LIVE_BOOT/staging/EFI/boot && \
    dd if=/dev/zero of=efiboot.img bs=1M count=20 && \
    mkfs.vfat efiboot.img && \
    mmd -i efiboot.img efi efi/boot && \
    mcopy -vi efiboot.img /LIVE_BOOT/tmp/bootx64.efi ::efi/boot/

RUN xorriso \
    -as mkisofs \
    -iso-level 3 \
    -o "/LIVE_BOOT/debian-custom.iso" \
    -full-iso9660-filenames \
    -volid "DEBIAN_CUSTOM" \
    -isohybrid-mbr /usr/lib/ISOLINUX/isohdpfx.bin \
    -eltorito-boot \
        isolinux/isolinux.bin \
        -no-emul-boot \
        -boot-load-size 4 \
        -boot-info-table \
        --eltorito-catalog isolinux/isolinux.cat \
    -eltorito-alt-boot \
        -e /EFI/boot/efiboot.img \
        -no-emul-boot \
        -isohybrid-gpt-basdat \
    -append_partition 2 0xef /LIVE_BOOT/staging/EFI/boot/efiboot.img \
    "/LIVE_BOOT/staging"

