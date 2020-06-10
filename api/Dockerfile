FROM node:12.14.1-alpine
WORKDIR /usr/src/app

RUN apk add --no-cache --virtual --update \
    git \
    g++ \
    curl \
    python \
    make \
    openssl \
  && rm -rf /var/cache/apk/*

RUN npm install -g nodemon
