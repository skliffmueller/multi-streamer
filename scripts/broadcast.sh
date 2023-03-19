#!/bin/bash
ffmpeg -rw_timeout 5000000 -i $1 -rtmp_live live  -c copy -f tee -map 0:v -map 0:a "$2"
