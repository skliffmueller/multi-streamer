FROM alpine:3.13.4 as builder
RUN apk add --update build-base git bash gcc make g++ zlib-dev linux-headers pcre-dev openssl-dev
RUN git clone https://github.com/arut/nginx-rtmp-module.git && \
    git clone https://github.com/nginx/nginx.git
RUN cd nginx && ./auto/configure --add-module=../nginx-rtmp-module && make && make install

FROM alpine:3.13.4 as nginx
RUN apk add --update pcre ffmpeg
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/local/nginx /usr/local/nginx

EXPOSE 80 443 1935


ENTRYPOINT ["/usr/local/nginx/sbin/nginx"]
CMD ["-g", "daemon off;"]