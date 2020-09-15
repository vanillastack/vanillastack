#!/bin/bash

echo "decompressing container image"
xz -c -v -d < "$1" | docker load
echo "starting container"
/usr/bin/docker run --rm --name vanilla-installa -p 8080:8080 harbor.cloudical.net/vanillastack/installer