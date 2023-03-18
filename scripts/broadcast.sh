ffmpeg -i rtmp://localhost:1935/live/tommy-123 -c copy -f tee -map 0:v -map 0:a \
    "[f=flv:onfail=ignore]rtmp://a.rtmp.youtube.com/live2/p1yv-a52j-92r0-xv90-3yw5|[f=flv:onfail=ignore]rtmp://dfw.contribute.live-video.net/app/live_73510364_K9Dm0HjghYY7CF75BdHbKtZGNtfWcW"

