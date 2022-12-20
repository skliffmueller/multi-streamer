FROM alpine:3.13.4 as builder
RUN apk add --update build-base git bash gcc make g++ zlib-dev linux-headers pcre-dev openssl-dev
RUN git clone https://github.com/arut/nginx-rtmp-module.git && \
    git clone https://github.com/nginx/nginx.git
RUN cd nginx && ./auto/configure --add-module=../nginx-rtmp-module && make && make install

FROM nginx:alpine as nginx
RUN apk add --update pcre ffmpeg

COPY ./etc/nginx /etc/nginx
COPY --from=builder /usr/local/nginx /usr/local/nginx

EXPOSE 80 443 1935
