#!/bin/bash

if [ -z ${NO_SSL+x} ]
then
  ln -sf /etc/nginx/nginx-letsencrypt.conf /etc/nginx/nginx.conf
  nginx
  acme-nginx -d streambox.rasterized.net
  nginx -s stop
  sleep 5
  ln -sf /etc/nginx/nginx-default.conf /etc/nginx/nginx.conf
else
  ln -sf /etc/nginx/nginx-nossl.conf /etc/nginx/nginx.conf
fi

mkdir /tmp/thumbs
chmod -R nobody:nogroup /tmp/thumbs
cd /var/app
node ./index.js &

while true
do
  nginx -g 'daemon off;'
  sleep 1
done