ln -sf /etc/nginx/nginx-letsencrypt.conf /etc/nginx/nginx.conf
nginx
# acme-nginx -d live.cppthink.org
nginx -s stop
sleep 5
ln -sf /etc/nginx/nginx-default.conf /etc/nginx/nginx.conf
mkdir /tmp/thumbs
chmod -R nobody:nogroup /tmp/thumbs
cd /var/app
node ./index.js &
nginx -g 'daemon off;'