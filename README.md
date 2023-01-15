## Install

Built using node v18
```
npm install
```

## Run development

```
npm run dev
```
Will be accessable at http://localhost:8080/

## Build Production

```
npm run build
```
Files will be bundled in `./dist` folder at the root of the project directory. This needs to be built and pushed to the git repo cause I'm lazy about having docker run the client build process.

## Running docker image

```
docker build -t nginx_rtmp:latest .
docker run -p 1935:1935 -p 80:80 -v ./dist:/var/www nginx_rtmp:latest
```

## Connecting streams

This url will work in OBS and for pushing video streams from device to server.

```
rtmp://serverhostname.net:1935/live/<whatevername>
```

## Multi-stream push

You can push a stream to `rtmp://serverhostname.net:1935/stream` and it will broadcast to multiple streams that are configured in the `nginx.conf`. See `application stream` in `nginx.conf`
