#!/usr/bin/env bash
#sudo apt-get install -y python-software-properties
apt-get update
apt-get install -y gcc make build-essential
add-apt-repository ppa:chris-lea/node.js 
apt-get update
apt-get install -y nodejs
npm install -g node-gyp