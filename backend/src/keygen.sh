#!/bin/bash
rm -f temp.key*
ssh-keygen -f 'temp.key' -t rsa -b 2048 -N '' -C 'k8s@cloudical.io'
echo ';_;'
cat temp.key
echo ';_;'
cat temp.key.pub
rm temp.key*
