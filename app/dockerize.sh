#!/bin/bash

# prepare and build
# since docker build does not follow symlinks,
# this script copies frontend dist into a temporary folder
# before building the image

mv ./public/frontend/dist ./_dist
mkdir ./public/frontend/dist
cp -r _dist/* ./public/frontend/dist/.

docker build . --build-arg USER=$DOCKER_USER_ID -t "${DOCKER_USER_ID}/minipcp-hs:latest"
docker push "${DOCKER_USER_ID}/minipcp-hs:latest"

rm -rf ./public/frontend/dist
mv ./_dist ./dist
mv ./dist ./public/frontend/.
