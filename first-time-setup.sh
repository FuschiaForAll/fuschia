#!/bin/bash
# This is not meant to be a final setup script, just a quick initial setup script to help setup a local dev environment on WSL2 / Ubuntu
HORIZONTALLINE="-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-"
clear
echo -e "\n$HORIZONTALLINE\n"
echo -e "\nUpdating Apt..."
sudo apt update
echo -e "\n\nChecking if MongoDB installed..."
if [ ! -f /usr/bin/mongod ]; then
  sudo apt-get install -y mongodb
  sudo mkdir -p /data/db
  sudo chown -R $USER /data/db
  sudo chmod -R go+w /data/db
else
  echo "MongoDB already installed. Skipping..."
fi

echo -e "\n$HORIZONTALLINE\n"

echo -e "\n\nChecking if Docker installed..."
if [ ! -f /usr/bin/docker]; then
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
else
  echo -e "\nDocker already installed. Skipping..."
fi
echo -e "\nStarting Docker Service..."
sudo service docker start

echo -e "\nInstalling Redis Docker Image"
docker pull redis
docker run --name fuchsia-redis -p 6379:6379 -d redis

echo -e "\n$HORIZONTALLINE\n"

echo -e "\nChecking if OpenSSL is installed..."
if [ ! -f /usr/bin/openssl ]; then
  sudo apt-get install openssl
else
  echo -e "OpenSSL already installed. Skipping..."
fi

echo -e "\nGenerating Dev SSL Certificate..."
mkdir -p ./backend-builder/src/cert
openssl req -x509 -newkey rsa:2048 -keyout ./backend-builder/src/cert/keytmp.pem -out ./backend-builder/src/cert/cert.pem -days 365 -passout pass:localclient -subj "/C=PE/ST=Lima/L=Lima/O=Acme Inc. /OU=IT Department/CN=acme.com"
openssl rsa -in ./backend-builder/src/cert/keytmp.pem -out ./backend-builder/src/cert/key.pem -passin pass:localclient

echo -e "\n$HORIZONTALLINE\n"

echo -e "Checking Yarn Installed..."
which yarn || npm install -g yarn

echo -e "\nRunning \"yarn install\" -> prepping node modules..."
yarn install

echo -e "\n$HORIZONTALLINE"

echo -e "\nGenerating Server .env File..."
cd backend-builder && yarn generate-env env=live interactive
exit
