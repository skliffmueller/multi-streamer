ln -sf /etc/nginx/nginx-letsencrypt.conf /etc/nginx/nginx.conf
nginx
ps -aux
acme-nginx -d live.cppthink.org
nginx -s stop
sleep 5
ln -sf /etc/nginx/nginx-default.conf /etc/nginx/nginx.conf
cat /etc/nginx/nginx.conf
ps -aux
nginx -g 'daemon off;'