#!/bin/bash
tag_file="${1%/*}/tag"
tag=""
[[ -r "$tag_file" ]] && tag="$(cat "$tag_file")" && echo "tag found: $tag"

echo "decompressing container image"
xz -c -v -d < "$1" | docker load
echo "starting container"
/usr/bin/docker run --rm --name vanilla-installa -p 8080:8080 "harbor.cloudical.net/vanillastack/installer:$tag"