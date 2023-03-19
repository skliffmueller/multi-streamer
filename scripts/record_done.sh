#!/bin/bash

duration=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $1 | cut -f1 -d".")
seek=$(($duration / 3))
duration=$(printf %06d $duration)

ffmpeg -i $1 -c copy $2-$duration.mp4
if [ $? -eq 0 ] ; then
  ffmpeg -ss $seek -i $2-$duration.mp4 -s 320x180 -frames:v 1 $2-$duration.jpg
  if [ $? -eq 0 ] ; then
    rf -f $1
  fi
fi
