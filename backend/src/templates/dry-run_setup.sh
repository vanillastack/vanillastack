#!/bin/sh
filename=$1
while read line; do
  # reading each line
  echo "$line"
  sleep 0.2
done <$filename
