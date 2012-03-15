#!/bin/sh
find "$1" -name '*.jpg' -exec ./thumbify.sh {} \;