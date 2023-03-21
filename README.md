# Development Environment setup

You will need docker and node v16. v18 is broken cause of varying reasons, don't do it. You can use nvm to switch node versions. [Linux nvm](https://github.com/nvm-sh/nvm) or [Windows nvm](https://github.com/coreybutler/nvm-windows)

## Docker setup

Docker and docker-compose is required. Since nginx is a critical part to the functionality of rtmp streaming, and ffmpeg process handling, it is required to have the container running, and volumes conveniently mounted via `docker-compose.yml` to run the full product.

You should only need to run these two commands:

```
docker-compose build
docker-compose up
```
The server will run on http://localhost/, the node.js api takes a moment to boot, so login might not work immediately. You will know the difference by looking at the docker logs, or inspect the network traffic. The API requests will produce a 502 error code when the Node.js API is offline. And 502 will go away when the Node.js API is online.

When updating an nginx config in `./etc/nginx` You will need to reset the container to take effect, or add/edit/remove a platform to force an nginx server reset.

There might be a bug from the docker container unable to start the node.js API due to missing modules. To fix this, on your local machine's shell prompt, navigate into `./server` folder, and run `npm install`.

## Node.js API

The Node.js API server (`./server`) Is ran within the nginx container, and does not have `nodaemon` setup (TODO), so you will have to reset the container, or shell into the container `docker exec -it <id> bash`, then `ps -aux` for the node process, and `kill <node id>`. Then run the node.js application `cd /var/app` then `node ./index.js` to run the application.

## Front-end React App

The front end application IS NOT bundled, watched, or hot reloaded on the container. The container mounts `./dist` directory as a volume, and the nginx server, serves the files in that folder. At this point, on your local machine shell prompt, not the docker container, you may navigate into `./client` folder, `npm install` and `npm run dev` to start the webpack watch and reload module. NOTE: Hot reload is not working, it is on the TODO list. You will need to refresh the browser after every code change. You should NOT have to reset the `npm run dev` instance.


# Docker Volume Mapping

| Local Directory     | Container Directory       | Description         |
| ------------------- | ------------------------- | ------------------- |
| ./etc/nginx         | /etc/nginx                | Nginx Configs       |
| ./server            | /var/app                  | Node API server     |
| ./server/data       | /var/app/data             | JSON File Database  |
| ./dist              | /var/www/html             | Fontend App         |
| ./dist/thumbs       | /var/www/html/thumbs      | Temp Thumbnails     |
| ./dist/videos       | /var/www/html/videos      | Recorded Videos     |

# Production Build and Start

```
docker build -t <some-image-name> .
docker run -d -p 80:80 -p 443:443 -p 1935:1935 \
    -v "/some/directory/videos:/var/www/html/videos" -v "/some/directory/data:/var/app/data" <some-image-name>
```
