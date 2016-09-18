FROM node:slim

MAINTAINER Maximilian Friedmann
RUN apt-get update && \
    apt-get install -y \
        xvfb \
        x11-xkb-utils \
        xfonts-100dpi \
        xfonts-75dpi \ 
        xfonts-scalable \
        xfonts-cyrillic \
        x11-apps \
        clang \
        libdbus-1-dev \
        libgtk2.0-dev \
        libnotify-dev \
        libgnome-keyring-dev \
        libgconf2-dev \
        libasound2-dev \
        libcap-dev \
        libcups2-dev \
        libxtst-dev \
        libxss1 \
        libnss3-dev \
        gcc-multilib \
        g++-multilib \
        xauth \
        git \
        sudo \
        --no-install-recommends \
    && apt-get autoclean \
    && apt-get clean \
    && rm -rf /var/lib/api/lists/*

RUN useradd -ms /bin/bash node -G sudo
RUN chown -R node:node /home/node
RUN echo %sudo ALL=NOPASSWD: ALL >> /etc/sudoers
WORKDIR /home/node
ENV HOME /home/node
USER node

# Create app directory
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# Install app dependencies
COPY package.json /home/node/app/
RUN npm install

# Bundle app source
COPY . /home/node/app

EXPOSE 80
CMD DEBUG=nightmare* xvfb-run --server-args="-screen 0 1024x768x24" npm start -s hn -m create -p 11878025