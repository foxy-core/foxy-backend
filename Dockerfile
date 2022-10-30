FROM node:16.17.0-buster-slim

WORKDIR /usr/src/app

## Install make
#RUN apk add --no-cache make
#
## Install GCC
#RUN apk add build-base

# Install python/pip
ENV PYTHONUNBUFFERED=1
#RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
#RUN python3 -m ensurepip
#RUN pip3 install --no-cache --upgrade pip setuptools

RUN apt update
RUN apt install -y python3 python3-pip && ln -sf python3 /usr/bin/python
#RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools
#
#RUN apk add openssl
#RUN apk add libc6-compat

# Setup project
COPY package*.json ./

RUN npm ci

COPY ./ ./

RUN npm run build:docker

RUN npm prune --production

CMD ["node", "./dist/index.mjs"]