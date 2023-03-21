# Front-end

## Users
- Update user password, Update user permissions as an array of strings
- For a user who does not have the "users" permission, they should still be able to access Users page, to view only their account, and update their account's password.

## Loading/Error handling

- There is no error handling, or notifications anywhere. Not sorry.
- On empty an empty panel, have some simple directions to navigate to Add an item, or inform of there are no items to be loaded.
- Loader animations? Not entirely important. Tailwindcss has animation classes, and heroicons is installed.

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

## Feed mixer
Mixing two feeds, one camera feed, and one OBS overlay feed with a key color (green screen), maybe at a lower fps, to be encoded in ffmpeg.

Keying is the process of separating and isolating elements of an image by their color or brightness. It's often done for visual effects (such as to remove green screens), or in color correction (to add warmth just to skin tones).

##