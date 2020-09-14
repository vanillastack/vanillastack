#!/bin/bash

"$1" < xz -d | docker load
