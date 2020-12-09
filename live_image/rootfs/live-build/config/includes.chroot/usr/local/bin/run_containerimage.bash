#!/bin/bash
tag_file="${1%/*}/tag"
tag=""
[[ -r "$tag_file" ]] && tag="$(cat "$tag_file")" && echo "tag found: $tag"

image_file="${1%/*}/image"
image=""
[[ -r "$image_file" ]] && image="$(cat "$image_file")" && echo "image found: $image"

if [[ -n "$image" ]]
  then
    echo "decompressing container image"
    xz -c -v -d < "$1" | docker load
    echo "starting container"
    /usr/bin/docker run --rm --name vanilla-installa -p 8080:8080 "harbor.vanillastack.io/vanillastack/installer:$tag"
  else
    echo "Error: image unknown"
    exit 2
  fi
