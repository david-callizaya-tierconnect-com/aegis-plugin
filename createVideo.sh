#!/bin/sh
gource -640x480 -o - | ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i - -vcodec libvpx -b 50000K aegisPlugin.webm

