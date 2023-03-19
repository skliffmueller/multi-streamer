FROM ubuntu:bionic

# Building in the docker image increases the size because all the deps are installed
# if these are done in separate RUN commands they get put into diff. layers and removing later has no effect apparently
# as a result, all build/remove commands are pushed into one RUN command, the docker image goes from 808 MB to 300 by doing so
RUN apt-get -y update && \
    apt-get -y install software-properties-common && \
    add-apt-repository ppa:deadsnakes/ppa && \
    apt-get -y install software-properties-common dpkg-dev git ffmpeg cron \
    zlib1g-dev python3.7 python3-pip python3-setuptools && \
    python3 -m pip install --upgrade pip
RUN apt-get install -y debhelper/bionic-backports dwz/bionic-backports
RUN add-apt-repository -y ppa:nginx/stable && \
    sed -i '/^#.* deb-src /s/^#//' /etc/apt/sources.list.d/nginx-ubuntu-stable-bionic.list && \
    apt-get -y update && \
    apt-get -y source nginx && \
    apt-get -y install nginx-core && \
    cd $(find . -maxdepth 1 -type d -name "nginx*") && \
    ls -ahl && \
    git clone https://github.com/arut/nginx-rtmp-module.git && \
    sed -i "s|common_configure_flags := \\\|common_configure_flags := --add-dynamic-module=$(cd  nginx-rtmp-module && pwd) \\\|" debian/rules && \
    cat debian/rules && echo "^^" && \
    apt-get -y build-dep nginx && \
    dpkg-buildpackage -b && \
    cd .. && ls -ahl && \
    dpkg --install $(find . -maxdepth 1 -type f -name "nginx-common*") && \
    dpkg --install $(find . -maxdepth 1 -type f -name "libnginx*") && \
    dpkg --install $(find . -maxdepth 1 -type f -name "nginx-full*") && \
    apt-get -y remove software-properties-common dpkg-dev git && \
    apt-get -y install aptitude && \
    aptitude -y markauto $(apt-cache showsrc nginx | sed -e '/Build-Depends/!d;s/Build-Depends: \|,\|([^)]*),*\|\[[^]]*\]//g') && \
    apt-get -y autoremove && \
    apt-get -y remove aptitude && \
    apt-get -y autoremove && \
    rm -rf ./*nginx* && \
    pip install acme-nginx

RUN apt-get update && \
    apt-get -y install curl gnupg && \
    curl -sL https://deb.nodesource.com/setup_16.x  | bash - && \
    apt-get -y install nodejs

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

RUN crontab -l | { cat; echo "0 12 * * * /usr/local/bin/acme-nginx -d live.cppthink.org"; } | crontab -

EXPOSE 80 443 1935 3000

RUN mkdir /var/www/html/videos && \
    chown -R nobody:root /var/www/html/videos && \
    chmod -R 755 /var/www/html/videos && \
    mkdir /var/www/html/thumbs && \
    chown -R nobody:root /var/www/html/thumbs && \
    chmod -R 755 /var/www/html/thumbs && \
    mkdir /var/app && \
    chmod -R 755 /var/app && \
    mkdir /var/scripts && \
    chown -R nobody:root /var/scripts && \
    chmod -R 755 /var/scripts && \
    mkdir /tmp/hls && \
    chown -R nobody:root /tmp/hls && \
    chmod -R 755 /tmp/hls


COPY ./server /var/app

RUN cd /var/app && npm install

COPY ./dist /var/www/html
COPY ./etc/nginx /etc/nginx
COPY ./scripts /var/scripts
COPY start.sh /

RUN chmod 755 /start.sh && chmod -R 755 /var/scripts

VOLUME ["/etc/ssl", "/var/www/html/thumbs", "/var/www/html/videos", "/var/app/data", "/tmp/hls"]

ENTRYPOINT ["/bin/sh", "/start.sh"]