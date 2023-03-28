# Front-end

## Users
- Update user password, Update user permissions as an array of strings
- For a user who does not have the "users" permission, they should still be able to access Users page, to view only their account, and update their account's password.

## Loading/Error handling

- There is no error handling, or notifications anywhere. Not sorry.
- On empty an empty panel, have some simple directions to navigate to Add an item, or inform of there are no items to be loaded.
- Loader animations? Not entirely important. Tailwindcss has animation classes, and heroicons is installed.

## Feeds Bitrate monitoring

- Feeds UI needs to show current bitrate of stream, this might need to be calculated on the Node.js API

# Node.js API

??? Honestly I got nothing right now.

# Nginx + FFmpeg

## Recordings

Limitations is really lack of testing resources. I cannot confidently say how well recording will work as the number of feed connections increase. It might work fine, and solutions if needed, are simple fixes, but the cost is linear to our write bandwidth requirements. To enable, in the `./server/lib/broadcaster.js` file, uncomment the `record` instructions in the `nginxConfigTemplate` function.

## RTMPS SSL protocol support

Amazon IVS is exclusively `rtmps` for broadcasting to their streaming servers. Places like kick.com uses Amazon IVS, and more people soon to follow.

In `./server/lib/broadcaster.js` the function `nginxConfigTemplate(platforms)` generates the nginx config for handling `rtmp` streams. There is a section that replicates a config for the platforms, in the format of `rtmp://localhost/${name}` --> `rtmp://<platform url like twitch or youtube>`.

The new flow for rtmps streams would be `rtmp://localhost/${name}` --> `rtmp://localhost:4430/${name}` (SSL Proxy Pass) --> `rtmps://<platform url like twitch or youtube>`.

There is an example config in `./etc/nginx/nginx-default.conf` how to proxy pass a non-secure `rtmp` stream to a secure `rtmps` stream.
  
# Future

## Green screen overlay

### Phase 1 (ffmpeg cli)

Will need a command to accept a main camera input (rtmp stream) and an overlay input (rtmp stream or mp4). The man camera input will be the layer existing behind the overlay. There will be no processing done directly to the main camera input. The overlay input will exist infront of the main camera input. The overlay input will need some processing.

Using a colorkey filter, we need to remove a selected color from the overlay feed. The selection of this color, will be a hex color code parameter that might need to be changed later. We will also need to change the sensitivity, whatever that may resemble. The output result needs to be a combination of the background main camera input, and the foreground processed overlay input.

There are codec parameters involved in properly decoding h264 input codec (might also be called libx264), and re-encoding the h264 output codec. You can find a lot of presets and configurations (here)[https://trac.ffmpeg.org/wiki/Encode/H.264]

## SRT + HEVC(H265)

[Nginx SRT](https://github.com/kaltura/nginx-srt-module) should be installed as part of the Dockerfile.

FFmpeg should decode H265 from the nginx SRT connection, and forward it to the RTMP relay as H264.