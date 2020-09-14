#!/bin/bash

xz -c -v -d < "$1" | docker load
