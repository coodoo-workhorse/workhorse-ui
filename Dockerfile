FROM nginx:1.21-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY /dist/workhorse-ui /usr/share/nginx/html
