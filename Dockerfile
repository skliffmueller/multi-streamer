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

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

RUN crontab -l | { cat; echo "0 12 * * * /usr/local/bin/acme-nginx -d live.cppthink.org"; } | crontab -

EXPOSE 80 443 1935

COPY ./dist /var/www/html
COPY ./etc/nginx /etc/nginx
COPY start.sh /

RUN chmod 755 /start.sh

VOLUME ["/etc/nginx", "/var/cache/nginx", "/etc/ssl", "/var/www"]

ENTRYPOINT ["/bin/sh", "/start.sh"]