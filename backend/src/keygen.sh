#!/bin/bash

if [ "$1" != "" ]; then
  COMMENT="$1"
else
  COMMENT="root@localhost"
fi

rm -f temp.key*
ssh-keygen -f 'temp.key' -t rsa -b 2048 -N '' -C "$COMMENT"
echo ';_;'
cat temp.key
echo ';_;'
cat temp.key.pub
rm temp.key*
