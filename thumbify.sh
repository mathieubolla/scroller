#!/bin/sh
filename=$1
gm convert $filename -thumbnail 25600@ ${filename/.jpg/.png}